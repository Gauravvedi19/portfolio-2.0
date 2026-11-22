import * as THREE from 'three';

/**
 * Screen recordings carry the recording phone's status bar: its own time, the red "recording" pill,
 * notification and network icons. On the 3D phone we hide it as the video plays, rather than
 * re-encoding: the row of pixels just under the bar is stretched up over it (so the app's own top
 * colour simply continues), and a clean bar is drawn on top — 9:41, full signal, full battery, either
 * side of the Dynamic Island, as on Ariane's screen — in dark glyphs over a light app, light over dark.
 */

/** How much of a recording's height its status bar takes (Android at 1080p: ~72px of 1594 at 720p). */
export const RECORDING_BAR = 0.046;

/** The screen, in points (as arianeWelcome). */
const W = 390;
const H = 847;
const SCALE = 3;

let glyphs: THREE.Texture | null = null;

/** The clean bar's glyphs, white on clear, over the whole screen (only the top strip is drawn). */
function glyphTexture() {
  if (glyphs) return glyphs;
  const c = document.createElement('canvas');
  c.width = W * SCALE;
  c.height = 48 * SCALE;
  const g = c.getContext('2d')!;
  g.scale(SCALE, SCALE);
  g.fillStyle = '#fff';
  g.font = '600 15px -apple-system, "SF Pro Text", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('9:41', 62, 31);
  // Signal: four rising bars.
  for (let i = 0; i < 4; i++) g.fillRect(W - 84 + i * 5, 29 - (i + 1) * 2.4, 3, (i + 1) * 2.4);
  // Battery: outline, full charge, cap.
  g.fillRect(W - 50, 20, 22, 10.5);
  g.clearRect(W - 48.6, 21.4, 19.2, 7.7);
  g.fillRect(W - 47.6, 22.4, 17.2, 5.7);
  g.fillRect(W - 27.3, 23.5, 1.6, 3.5);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.flipY = false;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  glyphs = t;
  return t;
}

/**
 * Light catching the glass: a soft diagonal band, top right to bottom left, added over the screen
 * whatever its brightness (so it shows on a screen that is still dark, as on real glass).
 */
const SHEEN = /* glsl */ `
vec3 glint(vec2 uv) {
  if (sheen < 0.0) return vec3(0.0);
  float d = (uv.y + (1.0 - uv.x) * 0.5) / 1.5;
  float band = exp(-pow((d - mix(-0.15, 1.15, sheen)) / 0.07, 2.0));
  return vec3(band * 0.32);
}
`;

/**
 * Where a screen pixel reads the recording, given its bar (`bar`, a fraction of the height) and how it's
 * treated (`mode`: 0 clean, 1 raw — the row beneath carried up, 2 inset — the file has no bar, so the app
 * is moved down beneath one, squeezed by the bar's height so none of its bottom is lost, and the bar
 * takes the app's top row; carrying a row up over an app header that starts at the very top smeared it
 * into streaks).
 */
const BAR_SOURCE = /* glsl */ `
vec2 barSource(vec2 v, float bar, float mode) {
  bool inBar = bar > 0.0 && v.y < bar;
  if (mode > 1.5) return vec2(v.x, inBar ? 0.002 : (v.y - bar) / (1.0 - bar));
  return inBar && mode > 0.5 ? vec2(v.x, bar + 0.003) : v;
}
`;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D glyphs;
uniform vec2 uRepeat;
uniform vec2 uOffset;
uniform float bar;     // the recording's bar, as a fraction of its height (0 = leave it)
uniform float smear;   // 1: carry the row beneath up over it; 0: the file's bar is already clean;
                       // 2: the file has no bar (cropped off): the app moves down to make room for one
uniform float glyphV;  // the glyph strip's height, as a fraction of the screen's
uniform float dim;     // screen brightness: 1 in front, lower for a side phone
uniform float sheen;   // a glint crossing the glass, 0 → 1 (below 0: none)
${SHEEN}
${BAR_SOURCE}

void main() {
  // The video, cropped like object-fit: cover (its v runs top to bottom, as the screen's).
  vec2 v = vUv * uRepeat + uOffset;
  bool inBar = bar > 0.0 && v.y < bar;
  // Over the bar: the row just beneath it, carried up (unless the file was cleaned already).
  vec4 col = texture2D(map, barSource(v, bar, smear));
  #ifdef DECODE_VIDEO_TEXTURE
  // three.js can't hardware-decode a video's sRGB, so (as its own materials do) decode it here.
  col = sRGBTransferEOTF(col);
  #endif
  // Sampled outside the branch, so the GPU can pick the glyphs' mipmap (inside, it can't, and they alias).
  vec4 glyph = texture2D(glyphs, vec2(vUv.x, min(vUv.y / glyphV, 1.0)));
  if (inBar) {
    // Dark glyphs over a light app, light over a dark one (luminance of the colour beneath).
    float lum = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 ink = lum > 0.5 ? vec3(0.04) : vec3(1.0);
    col.rgb = mix(col.rgb, ink, glyph.a * (vUv.y < glyphV ? 1.0 : 0.0));
  }
  gl_FragColor = vec4(col.rgb * dim + glint(vUv), 1.0);
  #include <colorspace_fragment>
}
`;

const pushFragment = /* glsl */ `
varying vec2 vUv;
uniform sampler2D mapA;
uniform sampler2D mapB;
uniform sampler2D glyphs;
uniform vec2 repA;
uniform vec2 offA;
uniform vec2 repB;
uniform vec2 offB;
uniform vec4 fmtA;     // bar, smear, decode (video sRGB), flip (render target)
uniform vec4 fmtB;
uniform float p;       // 0: A fills the screen … 1: B does
uniform float glyphV;
uniform float dim;
uniform float sheen;
${SHEEN}
${BAR_SOURCE}

vec4 screenAt(sampler2D m, vec2 rep, vec2 off, vec4 fmt, vec2 uv) {
  if (fmt.w > 0.5) uv.y = 1.0 - uv.y;
  vec2 v = uv * rep + off;
  vec4 c = texture2D(m, barSource(v, fmt.x, fmt.y));
  if (fmt.z > 0.5) c = sRGBTransferEOTF(c);
  return c;
}

void main() {
  // The app scrolling: B pushes A up and off the top (screen v runs top to bottom).
  float seam = 1.0 - p;
  vec4 a = screenAt(mapA, repA, offA, fmtA, vec2(vUv.x, clamp(vUv.y + p, 0.0, 1.0)));
  vec4 b = screenAt(mapB, repB, offB, fmtB, vec2(vUv.x, clamp(vUv.y - seam, 0.0, 1.0)));
  bool onB = vUv.y >= seam;
  vec4 col = onB ? b : a;
  // Depth: the outgoing screen dims as it leaves; a soft shadow falls from the incoming one's edge.
  if (!onB) col.rgb *= 1.0 - 0.4 * p;
  else col.rgb *= mix(0.55, 1.0, smoothstep(0.0, 0.05, vUv.y - seam));
  // The phone's own status bar stays put while the app moves beneath it.
  vec4 glyph = texture2D(glyphs, vec2(vUv.x, min(vUv.y / glyphV, 1.0)));
  float lum = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 ink = lum > 0.5 ? vec3(0.04) : vec3(1.0);
  col.rgb = mix(col.rgb, ink, glyph.a * (vUv.y < glyphV ? 1.0 : 0.0));
  gl_FragColor = vec4(col.rgb * dim + glint(vUv), 1.0);
  #include <colorspace_fragment>
}
`;

/** How a texture is to be read in the push: its status bar, whether it's video, whether it's flipped. */
export function pushFormat(tex: THREE.Texture, mode: BarMode, flipped = false) {
  const video = (tex as THREE.VideoTexture).isVideoTexture && tex.colorSpace === THREE.SRGBColorSpace;
  return new THREE.Vector4(mode === 'none' ? 0 : RECORDING_BAR, smearOf(mode), video ? 1 : 0, flipped ? 1 : 0);
}

/**
 * A screen that scrolls from one app screen to the next: B pushes A up off the top as `p` runs 0 → 1,
 * the status bar holding still above both. Set mapA/mapB, their repeat/offset and format each frame.
 */
export function pushMaterial() {
  const blank = new THREE.Texture();
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: pushFragment,
    toneMapped: false,
    uniforms: {
      mapA: { value: blank },
      mapB: { value: blank },
      glyphs: { value: glyphTexture() },
      repA: { value: new THREE.Vector2(1, 1) },
      offA: { value: new THREE.Vector2() },
      repB: { value: new THREE.Vector2(1, 1) },
      offB: { value: new THREE.Vector2() },
      fmtA: { value: new THREE.Vector4() },
      fmtB: { value: new THREE.Vector4() },
      p: { value: 0 },
      dim: { value: 1 },
      sheen: { value: -1 },
      glyphV: { value: 48 / H }
    }
  });
}

/**
 * How a screen's status bar is treated: `raw` — a recording with the recording phone's bar, hidden here;
 * `cleaned` — a recording whose file already had its bar cleaned out, which only needs the clean glyphs;
 * `inset` — a recording whose bar was cropped off, so the app starts at the very top: it is moved down
 * beneath the clean glyphs; `none` — a designed screen, left as it is.
 */
export type BarMode = 'raw' | 'cleaned' | 'inset' | 'none';

const smearOf = (mode: BarMode) => (mode === 'raw' ? 1 : mode === 'inset' ? 2 : 0);

/** The phone's screen material for a poster or recording. */
export function screenMaterial(map: THREE.Texture, mode: BarMode) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    defines: (map as THREE.VideoTexture).isVideoTexture && map.colorSpace === THREE.SRGBColorSpace ? { DECODE_VIDEO_TEXTURE: '' } : {},
    toneMapped: false,
    uniforms: {
      map: { value: map },
      glyphs: { value: glyphTexture() },
      uRepeat: { value: map.repeat },
      uOffset: { value: map.offset },
      bar: { value: mode === 'none' ? 0 : RECORDING_BAR },
      smear: { value: smearOf(mode) },
      dim: { value: 1 },
      sheen: { value: -1 },
      glyphV: { value: 48 / H }
    }
  });
}
