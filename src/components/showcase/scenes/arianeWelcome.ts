import * as THREE from 'three';

/**
 * Ariane Studio's real Welcome screen, running on the 3D iPhone's screen.
 *
 * A port of the app's own code (ar-prototype: components/onboarding/AmbientBackdrop.tsx and
 * screens/OnboardingScreen/WelcomeOnboarding.tsx), not a picture of it. The welcome is a "3D photo":
 * the table set with Ariane plates, drawn through a depth map (Depth Anything V2) by a ray-marching
 * shader, so as the phone tilts the plates lift off the table and the table off the floor; a soft copy
 * of the photo gives depth of field, golden dust drifts in front, and the logo floats nearest of all.
 * On the phone the camera is the gyro; here it is the 3D iPhone's own lean, so tilting the model looks
 * into the room exactly as tilting the real phone does.
 *
 * Everything is laid out in the app's points on a 390 × 847 screen (an iPhone Pro's width, at the
 * model's screen aspect), with the constants copied from the app — TUNE values there, tune them here.
 */

const BASE = '/showcase/ariane';

/** The screen, in points. */
export const W = 390;
export const H = 847;

/* ---------------------------------------------------------------------------------------------
 * The app's constants (AmbientBackdrop / WelcomeOnboarding / onboarding theme)
 * ------------------------------------------------------------------------------------------- */

const PHOTO_W = 941;
const PHOTO_H = 1672;
const PHOTO_SCREEN_HEIGHT = 0.86;
const TABLE_V = 0.45;
const TABLE_ON_SCREEN = 0.49;
const OVERSCAN = 52;
const SHIFT_X = 95;
const SHIFT_Y = 45;
const TURN_PERSPECTIVE = 900;
const TURN_Y = Math.tan((3 * Math.PI) / 180) / TURN_PERSPECTIVE;
const TURN_X = Math.tan((2 * Math.PI) / 180) / TURN_PERSPECTIVE;
const DOF_START = 0.12;
const DOF_RANGE = 0.3;
const FOCUS_DEPTH = 0.62;
const BRAND_SCRIM = 0.9;
const BRAND_POOL = 0.6;
const FADE_AT = 0.58;
const BRAND_FLOAT_X = 26;
const BRAND_FLOAT_Y = 14;
const MOTE_COUNT = 18;
const DUST_SHIFT_X = 64;
const DUST_SHIFT_Y = 34;
const DUST_PEAK = 0.75;
const DUST_FOOT_GLOW = 0.12;
const DUST_FULL_FROM = 0.5;
const DUST_TOP_FADE = 0.1;
/** The opening (WelcomeOnboarding): the night lifting, the logo, then the copy's cascade. */
const FADE_IN_MS = 1400;
const BRAND_AT = 200;
const BRAND_MS = 1000;
const COPY_AT = 450;
const STAGGER_MS = 70;
const ENTER_MS = 560;
const ENTER_RISE = 28;

const O = {
  night: '#0E0907',
  espresso: '#1A110B',
  gold: '#D8B67A',
  goldLight: '#EBD3A2',
  ivory: '#F6EEE2',
  ivorySoft: 'rgba(246,238,226,0.78)',
  ivoryMuted: 'rgba(246,238,226,0.56)',
  hairline: 'rgba(216,182,122,0.28)',
  ink: '#24170C'
};

/* ---------------------------------------------------------------------------------------------
 * Layout: where the app puts things on this screen
 * ------------------------------------------------------------------------------------------- */

/** headerTop(22, 60) on a Dynamic Island iPhone: its 59pt inset plus the 22pt gap. */
const BRAND_TOP = 81;
const MARK = 58;
const BRAND = { top: BRAND_TOP, bottom: BRAND_TOP + MARK - 1 + 31.5 - 2 + 16 };
const BRAND_CENTER_Y = (BRAND.top + BRAND.bottom) / 2;
const GUTTER = 24;
const HEADLINE = Math.min(34, (W - GUTTER * 2) / 9.4);
/** The copy, bottom-up from the page's padding (the home indicator's 34 + 12). */
const FEATURES = { top: H - 46 - 55, h: 55 };
const GUEST = { top: FEATURES.top - 12 - 46, h: 46 };
const BUTTON = { top: GUEST.top - 6 - 46, h: 46 };
const LINE2 = { top: BUTTON.top - 20 - HEADLINE * 1.1, h: HEADLINE * 1.1 };
const LINE1 = { top: LINE2.top - HEADLINE * 1.05, h: HEADLINE * 1.05 };
const EYEBROW = { top: LINE1.top - 8 - 14, h: 14 };
/** Vertical bands of the copy's six entrance items, top to bottom (eyebrow … features). */
const BANDS = [EYEBROW.top - 6, LINE1.top, LINE2.top, BUTTON.top - 10, GUEST.top + 2, FEATURES.top - 4, H];

/** The photo's box on this screen (AmbientBackdrop's photoFrame). */
const FRAME = (() => {
  const h = Math.max(H * PHOTO_SCREEN_HEIGHT, ((W + OVERSCAN * 2) * PHOTO_H) / PHOTO_W);
  const w = (h * PHOTO_W) / PHOTO_H;
  return { left: (W - w) / 2, top: H * TABLE_ON_SCREEN - h * TABLE_V, width: w, height: h };
})();

/** The night's gradient stops (AmbientBackdrop), worked out for this layout. */
const NIGHT = (() => {
  const b = Math.min(0.32, Math.max(0.1, BRAND.bottom / H));
  const fade = Math.max(FADE_AT, b + 0.16);
  const photoBottom = Math.min(1, (FRAME.top + FRAME.height) / H);
  const stops = [0, b * 0.7, b + 0.06, b + 0.13, fade, fade + 0.1, Math.max(fade + 0.11, Math.min(fade + 0.19, photoBottom - 0.05)), Math.max(fade + 0.12, Math.min(0.99, photoBottom))];
  const colors: [number, number, number, number][] = [
    [14, 9, 7, BRAND_SCRIM], [14, 9, 7, BRAND_SCRIM - 0.08], [14, 9, 7, 0.3], [14, 9, 7, 0.03],
    [14, 9, 7, 0.03], [20, 13, 9, 0.68], [20, 13, 9, 0.94], [26, 17, 11, 1]
  ];
  return { stops, colors };
})();

/* ---------------------------------------------------------------------------------------------
 * The shader
 * ------------------------------------------------------------------------------------------- */

const f = (n: number) => n.toFixed(6);
const rgba = (c: [number, number, number, number]) => `vec4(${f(c[0] / 255)}, ${f(c[1] / 255)}, ${f(c[2] / 255)}, ${f(c[3])})`;

/** Seeded so the motes match the app's (AmbientBackdrop's `seeded`). */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const MOTES = Array.from({ length: MOTE_COUNT }, (_, i) => ({
  x: seeded(i) * W,
  base: H + DUST_SHIFT_Y + seeded(i + 80) * H * 0.06,
  span: H + DUST_SHIFT_Y * 2 + seeded(i + 80) * H * 0.06 + 12,
  r: 0.8 + seeded(i + 120) * 1.8,
  period: 22 + seeded(i + 160) * 20,
  offset: seeded(i + 200),
  sway: 6 + seeded(i + 240) * 14
}));

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D photo;
uniform sampler2D depthMap;
uniform sampler2D soft;
uniform sampler2D brandUi;
uniform sampler2D copyUi;
uniform vec2 cam;        // the camera, -1..1 each way
uniform float time;      // seconds, for the dust
uniform float intro;     // ms into the opening
uniform float dust;      // 0 under reduced motion
uniform vec4 motesA[${MOTE_COUNT}]; // x, base, span, r
uniform vec4 motesB[${MOTE_COUNT}]; // period, offset, sway, -

const vec2 SCREEN = vec2(${f(W)}, ${f(H)});
const vec2 FRAME_POS = vec2(${f(FRAME.left)}, ${f(FRAME.top)});
const vec2 FRAME_SIZE = vec2(${f(FRAME.width)}, ${f(FRAME.height)});
const float FOCUS = ${f(FOCUS_DEPTH)};
const float DOF_START = ${f(DOF_START)};
const float DOF_RANGE = ${f(DOF_RANGE)};

vec2 shiftV;
// How fast the screen's UVs change per pixel, worked out once in main() where every pixel is in step.
// Samples taken inside branches and loops get these explicitly (textureGrad): there the GPU can't
// work them out, so it skipped the mipmaps — the text and photo aliased and shimmered as they moved.
vec2 gradX;
vec2 gradY;

vec2 source(vec2 xy, float t) { return xy - shiftV * (t - FOCUS); }
// The depth map is read for exact heights, at full resolution (no mipmaps).
float depthAt(vec2 p) { return textureLod(depthMap, clamp(p / FRAME_SIZE, 0.0, 1.0), 0.0).r; }
// A screen-space layer (UI), sampled at uv, filtered for the screen's own size on the phone.
vec4 layer(sampler2D tex, vec2 uv) { return textureGrad(tex, clamp(uv, 0.0, 1.0), gradX, gradY); }

// The 3D photo (AmbientBackdrop's PARALLAX), in the photo's own points.
vec3 photo3d(vec2 local) {
  vec2 center = vec2(FRAME_SIZE.x * 0.5, FRAME_SIZE.y * ${f(TABLE_V)});
  vec2 turn = vec2(cam.x * ${f(TURN_Y)}, cam.y * ${f(TURN_X)});
  vec2 rel = local - center;
  vec2 xy = center + rel * (1.0 + dot(rel, turn));
  float hit = 0.0;
  float found = 0.0;
  for (int i = 0; i <= 14; i++) {
    float t = 1.0 - float(i) / 14.0;
    if (found < 0.5 && depthAt(source(xy, t)) >= t) { hit = t; found = 1.0; }
  }
  float lo = hit;
  float hi = min(hit + 1.0 / 14.0, 1.0);
  for (int j = 0; j < 4; j++) {
    float mid = (lo + hi) * 0.5;
    if (depthAt(source(xy, mid)) >= mid) lo = mid; else hi = mid;
  }
  vec2 s = clamp(source(xy, lo) / FRAME_SIZE, 0.0, 1.0);
  float blur = smoothstep(0.0, 1.0, clamp((FOCUS - DOF_START - lo) / DOF_RANGE, 0.0, 1.0));
  // Filtered by the photo's smooth footprint on screen, not by that of s itself, which jumps at depth edges.
  vec2 px = gradX * SCREEN / FRAME_SIZE;
  vec2 py = gradY * SCREEN / FRAME_SIZE;
  return mix(textureGrad(photo, s, px, py).rgb, textureGrad(soft, s, px, py).rgb, blur);
}

vec3 over(vec3 base, vec4 c) { return mix(base, c.rgb, c.a); }

// The night: the vertical wash from the logo's dark, clear over the table, down into espresso.
vec4 night(float y) {
  float s[8]; vec4 c[8];
  ${NIGHT.stops.map((s, i) => `s[${i}] = ${f(s)}; c[${i}] = ${rgba(NIGHT.colors[i])};`).join('\n  ')}
  vec4 col = c[0];
  for (int i = 0; i < 7; i++) {
    if (y >= s[i]) col = mix(c[i], c[i + 1], clamp((y - s[i]) / max(s[i + 1] - s[i], 1e-4), 0.0, 1.0));
  }
  if (y >= s[7]) col = c[7];
  return col;
}

float easeOut(float x) { return 1.0 - pow(1.0 - x, 5.0); }
float smooth01(float x) { return x * x * (3.0 - 2.0 * x); }
float progress(float at, float dur) { return clamp((intro - at) / dur, 0.0, 1.0); }

void main() {
  // The model's screen UVs run top to bottom; work in the app's points.
  vec2 pt = vec2(vUv.x, vUv.y) * SCREEN;
  shiftV = cam * vec2(${f(SHIFT_X)}, ${f(SHIFT_Y)});
  gradX = dFdx(vUv);
  gradY = dFdy(vUv);

  // The page's ground, then the 3D photo in its box (worked out everywhere, then kept inside the box).
  vec2 local = pt - FRAME_POS;
  vec3 ground = vec3(${f(26 / 255)}, ${f(17 / 255)}, ${f(11 / 255)});
  vec3 room = photo3d(local);
  bool inFrame = local.x >= 0.0 && local.y >= 0.0 && local.x <= FRAME_SIZE.x && local.y <= FRAME_SIZE.y;
  vec3 col = inFrame ? room : ground;

  // The night over it: a warm wash, the vertical gradient, the pool behind the logo, the vignette.
  col = over(col, vec4(${f(46 / 255)}, ${f(22 / 255)}, ${f(8 / 255)}, 0.14));
  col = over(col, night(pt.y / SCREEN.y));
  float pool = clamp(distance(pt, vec2(SCREEN.x * 0.5, ${f(BRAND_CENTER_Y)})) / ${f(Math.max(130, (BRAND.bottom - BRAND.top) * 1.15))}, 0.0, 1.0);
  col = over(col, vec4(${f(10 / 255)}, ${f(6 / 255)}, ${f(4 / 255)}, ${f(BRAND_POOL)} * mix(mix(1.0, 0.6, clamp(pool / 0.5, 0.0, 1.0)), 0.0, clamp((pool - 0.5) / 0.5, 0.0, 1.0))));
  float vig = clamp(distance(pt, vec2(SCREEN.x * 0.5, SCREEN.y * 0.36)) / ${f(Math.max(W, H) * 0.75)}, 0.0, 1.0);
  col = over(col, vec4(${f(8 / 255)}, ${f(5 / 255)}, ${f(3 / 255)}, 0.55 * clamp((vig - 0.45) / 0.55, 0.0, 1.0)));

  // Golden dust, drifting up through the light — the nearest thing in the room.
  if (dust > 0.5) {
    vec2 d = pt - cam * vec2(${f(DUST_SHIFT_X)}, ${f(DUST_SHIFT_Y)});
    for (int i = 0; i < ${MOTE_COUNT}; i++) {
      vec4 a = motesA[i];
      vec4 b = motesB[i];
      float life = mod(time / b.x + b.y, 1.0);
      vec2 m = vec2(a.x + sin(life * 6.2831853 + b.y * 6.0) * b.z, a.y - life * a.z);
      float up = clamp((SCREEN.y - m.y) / (SCREEN.y * ${f(DUST_FULL_FROM)}), 0.0, 1.0);
      float rise = ${f(DUST_FOOT_GLOW)} + ${f(1 - DUST_FOOT_GLOW)} * up * up * (3.0 - 2.0 * up);
      float leave = clamp((m.y + ${f(DUST_SHIFT_Y)}) / (SCREEN.y * ${f(DUST_TOP_FADE)}), 0.0, 1.0);
      float alpha = rise * leave * ${f(DUST_PEAK)};
      float disc = 1.0 - smoothstep(a.w - 0.8, a.w + 1.2, distance(d, m));
      col = mix(col, vec3(${f(0xeb / 255)}, ${f(0xd3 / 255)}, ${f(0xa2 / 255)}), alpha * disc);
    }
  }

  // The night lifting off the room as the page opens.
  col = mix(col, vec3(${f(14 / 255)}, ${f(9 / 255)}, ${f(7 / 255)}), 1.0 - easeOut(clamp(intro / ${f(FADE_IN_MS)}, 0.0, 1.0)));

  // The logo: on its own plane in front of the room, swinging with the camera; it rises in first.
  float bx = progress(${f(BRAND_AT)}, ${f(BRAND_MS)});
  vec2 bp = pt - cam * vec2(${f(BRAND_FLOAT_X)}, ${f(BRAND_FLOAT_Y)}) - vec2(0.0, (1.0 - easeOut(bx)) * ${f(ENTER_RISE)});
  vec4 brand = layer(brandUi, bp / SCREEN);
  col = mix(col, brand.rgb, brand.a * smooth01(bx));

  // The status bar: fixed, there as soon as the night lifts (it's the phone's, not the page's).
  vec4 sb = layer(copyUi, pt / SCREEN);
  col = mix(col, sb.rgb, sb.a * (pt.y < ${f(BRAND_TOP - 10)} ? 1.0 : 0.0));

  // The copy, held still in front, each of its six items rising in on the cascade: find which item
  // this pixel shows (and how far it has risen), then sample the copy once.
  float bands[7];
  ${BANDS.map((b, i) => `bands[${i}] = ${f(b)};`).join(' ')}
  vec2 cp = pt;
  float shown = 0.0;
  for (int i = 0; i < 6; i++) {
    float x = progress(${f(COPY_AT)} + float(i) * ${f(STAGGER_MS)}, ${f(ENTER_MS)});
    vec2 p = pt - vec2(0.0, (1.0 - easeOut(x)) * ${f(ENTER_RISE)});
    if (p.y >= bands[i] && p.y < bands[i + 1]) { cp = p; shown = smooth01(x); }
  }
  vec4 c = layer(copyUi, cp / SCREEN);
  col = mix(col, c.rgb, c.a * shown);

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---------------------------------------------------------------------------------------------
 * The page's UI, drawn from the app's layout, sizes, fonts and icon paths
 * ------------------------------------------------------------------------------------------- */

const SCALE = 3; // canvas pixels per point

const serif = (weight: number, size: number, italic = false) => `${italic ? 'italic ' : ''}${weight} ${size}px "Cormorant Garamond", Georgia, serif`;
const sans = (weight: number, size: number) => `${weight} ${size}px "Jost", system-ui, sans-serif`;

/** The app's round-capped line icons (onboarding/icons.tsx), drawn at (x, y) `size` points square. */
function icon(g: CanvasRenderingContext2D, name: string, x: number, y: number, size: number, color: string, width: number, vb: [number, number] = [24, 24]) {
  const s = Math.min(size / vb[0], size / vb[1]);
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const path = (d: string) => g.stroke(new Path2D(d));
  const circle = (cx: number, cy: number, r: number) => { g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke(); };
  const rr = (rx: number, ry: number, rw: number, rh: number, r: number) => { g.beginPath(); g.roundRect(rx, ry, rw, rh, r); g.stroke(); };
  switch (name) {
    case 'user':
      circle(12, 8, 3.8);
      path('M4.5 20.5c.9-3.8 3.9-5.9 7.5-5.9s6.6 2.1 7.5 5.9');
      break;
    case 'guest':
      path('M3.5 11h17');
      path('M6.8 11l1.5-5.1c.2-.7.9-1 1.5-.8l2.2.8 2.2-.8c.6-.2 1.3.1 1.5.8l1.5 5.1');
      circle(8, 16.2, 2.7);
      circle(16, 16.2, 2.7);
      path('M10.7 16c.9-.6 1.7-.6 2.6 0');
      break;
    case 'arrow':
      path('M1 6h21M17 1.2 22 6l-5 4.8');
      break;
    case 'plates':
      path('M4 6.5c0-1.5 3.6-2.7 8-2.7s8 1.2 8 2.7-3.6 2.7-8 2.7-8-1.2-8-2.7Z');
      path('M4 6.5v2.8c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7V6.5');
      path('M4 9.3v2.8c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7V9.3');
      path('M4 12.1v2.8c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7v-2.8');
      path('M4 14.9v2.8c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7v-2.8');
      break;
    case 'sun': {
      circle(12, 12, 4);
      for (const deg of [0, 45, 90, 135, 180, 225, 270, 315]) {
        const a = (deg * Math.PI) / 180;
        path(`M${12 + Math.cos(a) * 6.6} ${12 + Math.sin(a) * 6.6}L${12 + Math.cos(a) * 9.4} ${12 + Math.sin(a) * 9.4}`);
      }
      break;
    }
    case 'cube':
      path('M12 2.8 20 7.3v9.4L12 21.2l-8-4.5V7.3l8-4.5Z');
      path('M4 7.3 12 11.8l8-4.5M12 11.8v9.4');
      break;
    case 'tiles':
      rr(3.5, 3.5, 7, 7, 1.6); rr(13.5, 3.5, 7, 7, 1.6); rr(3.5, 13.5, 7, 7, 1.6); rr(13.5, 13.5, 7, 7, 1.6);
      break;
  }
  g.restore();
}

function canvas() {
  const c = document.createElement('canvas');
  c.width = W * SCALE;
  c.height = H * SCALE;
  const g = c.getContext('2d')!;
  g.scale(SCALE, SCALE);
  return { c, g };
}

/** Text with the app's letter spacing (canvas letterSpacing where supported, else drawn by hand). */
function spaced(g: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: 'left' | 'center' = 'left') {
  const anyG = g as CanvasRenderingContext2D & { letterSpacing?: string };
  if (typeof anyG.letterSpacing === 'string') {
    anyG.letterSpacing = `${spacing}px`;
    g.textAlign = align;
    // Canvas adds the spacing after the last letter too; centre on the letters alone.
    g.fillText(text, align === 'center' ? x + spacing / 2 : x, y);
    // Measured with the spacing on (less the trailing gap), so whatever follows lands after the last letter.
    const width = g.measureText(text).width - spacing;
    anyG.letterSpacing = '0px';
    return width;
  }
  const widths = Array.from(text).map((ch) => g.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let cx = align === 'center' ? x - total / 2 : x;
  g.textAlign = 'left';
  Array.from(text).forEach((ch, i) => { g.fillText(ch, cx, y); cx += widths[i] + spacing; });
  return total;
}

function drawBrand(mark: HTMLImageElement) {
  const { c, g } = canvas();
  // The roundel as line art, tinted champagne.
  const tint = document.createElement('canvas');
  tint.width = tint.height = MARK * SCALE;
  const t = tint.getContext('2d')!;
  t.drawImage(mark, 0, 0, tint.width, tint.height);
  t.globalCompositeOperation = 'source-in';
  t.fillStyle = O.gold;
  t.fillRect(0, 0, tint.width, tint.height);
  g.drawImage(tint, (W - MARK) / 2, BRAND_TOP, MARK, MARK);

  g.fillStyle = O.ivory;
  g.font = serif(500, 28);
  g.textBaseline = 'alphabetic';
  spaced(g, 'Ariane Studio', W / 2, BRAND_TOP + MARK - 1 + 24, 0.35, 'center');

  const subY = BRAND_TOP + MARK - 1 + 31.5 - 2 + 8;
  g.font = serif(400, 12.5, true);
  g.fillStyle = O.ivorySoft;
  const tw = spaced(g, 'fine porcelain', W / 2, subY + 4.2, 0.3, 'center');
  g.fillStyle = O.ivoryMuted;
  g.fillRect(W / 2 - tw / 2 - 3 - 7 - 23, subY - 0.5, 23, 1);
  g.fillRect(W / 2 + tw / 2 + 3 + 7, subY - 0.5, 23, 1);
  return c;
}

function drawCopy() {
  const { c, g } = canvas();
  g.textBaseline = 'alphabetic';

  // Status bar.
  g.fillStyle = O.ivory;
  g.font = '600 16px -apple-system, "SF Pro Text", system-ui, sans-serif';
  g.textAlign = 'center';
  g.fillText('9:41', 64, 37);
  g.fillRect(W - 50, 26, 22, 11);
  g.fillStyle = O.night;
  g.fillRect(W - 48.5, 27.5, 19, 8);
  g.fillStyle = O.ivory;
  g.fillRect(W - 47.5, 28.5, 15, 6);
  for (let i = 0; i < 4; i++) g.fillRect(W - 84 + i * 5, 34 - (i + 1) * 2.5, 3, (i + 1) * 2.5);

  // Eyebrow and its gold rule.
  g.font = sans(400, 10);
  g.fillStyle = O.gold;
  const ew = spaced(g, 'WELCOME TO ARIANE STUDIO', GUTTER, EYEBROW.top + 11, 3);
  g.globalAlpha = 0.8;
  g.fillRect(GUTTER + ew + 12, EYEBROW.top + 7, 36, 1);
  g.globalAlpha = 1;

  // The headline.
  g.font = serif(500, HEADLINE);
  g.fillStyle = O.ivory;
  spaced(g, 'Create your table.', GUTTER, LINE1.top + HEADLINE * 0.8, -0.2);
  g.font = serif(400, HEADLINE, true);
  g.fillStyle = O.goldLight;
  spaced(g, 'Make it extraordinary.', GUTTER, LINE2.top + HEADLINE * 0.84, -0.2);

  // The gold pill, with its gilt glow.
  const bx = GUTTER, bw = W - GUTTER * 2, by = BUTTON.top, bh = BUTTON.h;
  g.save();
  g.shadowColor = 'rgba(224,180,110,0.35)';
  g.shadowBlur = 16;
  g.shadowOffsetY = 6;
  g.fillStyle = '#C79E5E';
  g.beginPath();
  g.roundRect(bx, by, bw, bh, bh / 2);
  g.fill();
  g.restore();
  icon(g, 'user', bx + 20 + 2, by + (bh - 20) / 2, 20, O.ink, 1.3);
  g.font = serif(600, 18);
  g.fillStyle = O.ink;
  spaced(g, 'Login / Register', W / 2, by + bh / 2 + 6, 0.2, 'center');
  icon(g, 'arrow', bx + bw - 22 - 24, by + (bh - 12) / 2, 24, O.ink, 1.3, [24, 12]);

  // The guest way in, as a quiet link.
  g.font = serif(500, 17);
  const label = 'Continue as a guest';
  const lw = g.measureText(label).width + 0.2 * label.length;
  const rowW = 17 + 9 + lw + 9 + 18;
  let gx = W / 2 - rowW / 2;
  const gy = GUEST.top + GUEST.h / 2;
  icon(g, 'guest', gx, gy - 8.5, 17, O.gold, 1.3);
  gx += 17 + 9;
  g.fillStyle = O.ivory;
  spaced(g, label, gx, gy + 5.5, 0.2);
  gx += lw + 9;
  icon(g, 'arrow', gx, gy - 5, 18, O.gold, 1.3, [24, 12]);

  // The four offerings, on a strip of smoked glass.
  const fx = GUTTER, fw = W - GUTTER * 2, fy = FEATURES.top, fh = FEATURES.h;
  g.fillStyle = 'rgba(30,20,13,0.66)';
  g.beginPath();
  g.roundRect(fx, fy, fw, fh, 16);
  g.fill();
  const rim = g.createLinearGradient(fx, fy, fx + fw, fy + fh);
  [[0, 'rgba(240,214,166,0.62)'], [0.45, 'rgba(240,214,166,0.14)'], [0.65, 'rgba(240,214,166,0.10)'], [1, 'rgba(240,214,166,0.34)']].forEach(([s, col]) => rim.addColorStop(s as number, col as string));
  g.strokeStyle = rim;
  g.lineWidth = 1;
  g.beginPath();
  g.roundRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1, 15.5);
  g.stroke();
  const cells: [string, string][] = [['plates', 'EXPLORE'], ['sun', 'VISUALISE'], ['cube', '3D & AR'], ['tiles', 'CREATE']];
  const cw = fw / cells.length;
  cells.forEach(([name, text], i) => {
    const cx = fx + cw * i + cw / 2;
    if (i > 0) {
      g.fillStyle = O.hairline;
      g.fillRect(fx + cw * i, fy + 10 + 4, 1, fh - 20 - 8);
    }
    icon(g, name, cx - 9.5, fy + 10, 19, O.gold, 1.1);
    g.font = sans(400, 8.5);
    g.fillStyle = O.ivorySoft;
    spaced(g, text, cx, fy + 10 + 19 + 5 + 8.5, 1.4, 'center');
  });
  return c;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function texture(source: TexImageSource | HTMLCanvasElement) {
  const t = new THREE.Texture(source as HTMLImageElement);
  // Everything here is mixed in sRGB, as Skia does on the phone, and written out as is.
  t.colorSpace = THREE.NoColorSpace;
  t.flipY = false;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  // Trilinear, and anisotropic for when the phone turns the screen away at a steep angle.
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/**
 * The welcome is drawn flat, square-on, into its own image at twice the app's points — the screen the
 * real phone would show — and the 3D phone then displays that image like a video, downscaled through
 * its mipmaps. Run directly on the tilted, moving 3D screen, the scene was being worked out on a pixel
 * grid that never lined up with it: thin type, the plates' edges and the icons crawled and shimmered.
 * (The app does the same: it draws its 3D photo into a smaller canvas and scales it.)
 */
const RT_SCALE = 2;

const screenVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** Shows the rendered welcome on the phone. The model's screen UVs run top to bottom; images bottom up. */
const screenFragment = /* glsl */ `
varying vec2 vUv;
uniform sampler2D frame;
uniform float dim;
void main() {
  // The welcome was written in sRGB, as Skia mixes it; passed through as is.
  gl_FragColor = vec4(texture2D(frame, vec2(vUv.x, 1.0 - vUv.y)).rgb * dim, 1.0);
}
`;

export interface ArianeWelcome {
  /** The scene itself, for drawing the welcome flat (its UVs run top to bottom). */
  material: THREE.ShaderMaterial;
  /** For the 3D phone's screen: the welcome as last rendered. */
  screen: THREE.ShaderMaterial;
  /** The welcome's rendered frame itself (bottom-up, as render targets are), for a screen push. */
  texture: THREE.Texture;
  /**
   * Call each frame: the camera (-1…1), seconds since the last frame, whether motion is reduced, and the
   * renderer to draw the welcome's frame with (before the main render).
   */
  update(cam: { x: number; y: number }, dt: number, reduce: boolean, renderer?: THREE.WebGLRenderer): void;
  /** Play the page's opening again from the dark. */
  replay(): void;
  dispose(): void;
}

let fontsReady: Promise<unknown> | null = null;
function loadFonts() {
  fontsReady ??= Promise.all([
    document.fonts.load(serif(500, 28)),
    document.fonts.load(serif(400, 12, true)),
    document.fonts.load(serif(600, 18)),
    document.fonts.load(sans(400, 10))
  ]).catch(() => undefined);
  return fontsReady;
}

/** Loads the welcome's images and fonts and builds its screen material. */
export async function createArianeWelcome(): Promise<ArianeWelcome> {
  const [photo, depth, soft, mark] = await Promise.all([
    loadImage(`${BASE}/hero-table.webp`),
    loadImage(`${BASE}/hero-table-depth.png`),
    loadImage(`${BASE}/hero-table-soft.webp`),
    loadImage(`${BASE}/ariane-mark-line.png`),
    loadFonts()
  ]);
  const textures = [texture(photo), texture(depth), texture(soft), texture(drawBrand(mark)), texture(drawCopy())];
  const [photoT, depthT, softT, brandT, copyT] = textures;
  // The depth map is read for exact heights; mipmaps would blur the silhouettes.
  depthT.minFilter = THREE.LinearFilter;
  depthT.generateMipmaps = false;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    toneMapped: false,
    uniforms: {
      photo: { value: photoT },
      depthMap: { value: depthT },
      soft: { value: softT },
      brandUi: { value: brandT },
      copyUi: { value: copyT },
      cam: { value: new THREE.Vector2() },
      time: { value: 0 },
      intro: { value: 0 },
      dust: { value: 1 },
      motesA: { value: MOTES.map((m) => new THREE.Vector4(m.x, m.base, m.span, m.r)) },
      motesB: { value: MOTES.map((m) => new THREE.Vector4(m.period, m.offset, m.sway, 0)) }
    }
  });

  // The welcome's own frame: drawn square-on at 2× points, with mipmaps so the phone downsamples it cleanly.
  const target = new THREE.WebGLRenderTarget(W * RT_SCALE, H * RT_SCALE, {
    depthBuffer: false,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter
  });
  target.texture.anisotropy = 8;
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  // The scene reads glTF-style UVs (v from the top); a plane's run from the bottom.
  const quadUv = quadGeometry.attributes.uv;
  for (let i = 0; i < quadUv.count; i++) quadUv.setY(i, 1 - quadUv.getY(i));
  const quad = new THREE.Mesh(quadGeometry, material);
  quad.frustumCulled = false;
  const frameScene = new THREE.Scene();
  frameScene.add(quad);
  const frameCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  frameCamera.position.z = 0.5;

  const screen = new THREE.ShaderMaterial({
    vertexShader: screenVertex,
    fragmentShader: screenFragment,
    toneMapped: false,
    uniforms: { frame: { value: target.texture }, dim: { value: 1 } }
  });

  return {
    material,
    screen,
    texture: target.texture,
    update(cam, dt, reduce, renderer) {
      const u = material.uniforms;
      u.cam.value.set(reduce ? 0 : cam.x, reduce ? 0 : cam.y);
      u.dust.value = reduce ? 0 : 1;
      if (!reduce) u.time.value += Math.min(dt, 0.05);
      // The opening keeps to real time, so a slow frame or two can't hold the page in the dark.
      u.intro.value = reduce ? 1e6 : u.intro.value + Math.min(dt, 0.25) * 1000;
      if (!renderer) return;
      const previous = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      renderer.render(frameScene, frameCamera);
      renderer.setRenderTarget(previous);
    },
    replay() {
      material.uniforms.intro.value = 0;
    },
    dispose() {
      textures.forEach((t) => t.dispose());
      material.dispose();
      screen.dispose();
      target.dispose();
      quadGeometry.dispose();
    }
  };
}
