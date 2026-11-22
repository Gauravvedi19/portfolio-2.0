import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  anchors,
  FINISHES,
  getPhoneState,
  setPhoneState,
  usePhoneState,
  PRODUCTS,
  screenStatus,
  type Anchor,
  type ScreenSpec
} from './phoneStore';
import { createArianeWelcome, type ArianeWelcome } from './scenes/arianeWelcome';
import { pushFormat, pushMaterial, screenMaterial, type BarMode } from './scenes/cleanStatusBar';

/**
 * iPhone 18 Pro Max (Burgundy), in metres: origin at the bottom edge, screen facing +z.
 * Source: apple-iphone-18-pro-max-burgundy-2026/source, meshopt-compressed into public/models.
 */
export const MODEL_URL = '/models/iphone-18-pro-max.glb';
const MODEL = { height: 0.1633, zMin: -0.0092, zMax: 0.0043 };
/** The `Front_Screen` mesh's size; its UVs span it 0…1 with v running top to bottom. */
const SCREEN_ASPECT = 0.073 / 0.1585;
/** Scene units the phone is modelled at before an anchor scales it. */
const PHONE_HEIGHT = 2.2;
const SCALE = PHONE_HEIGHT / MODEL.height;
const CAMERA = { z: 5.4, fov: 30 };
/** World units per screen pixel at the phone's depth, as a fraction of the viewport height. */
const WORLD_HEIGHT = 2 * CAMERA.z * Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2));

/* ----------------------------------------------------------------------------------------------
 * Textures
 * -------------------------------------------------------------------------------------------- */

/** Crop a texture like CSS object-fit: cover onto `aspect` (width / height). */
function coverFit(texture: THREE.Texture, mediaW: number, mediaH: number, aspect: number) {
  const media = mediaW / mediaH;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);
  if (media > aspect) {
    texture.repeat.x = aspect / media;
    texture.offset.x = (1 - texture.repeat.x) / 2;
  } else {
    texture.repeat.y = media / aspect;
    texture.offset.y = (1 - texture.repeat.y) / 2;
  }
  texture.needsUpdate = true;
}

/** The branded card an app shows until its screens exist: accent glow, hairline ring, italic monogram. */
function placeholderTexture(spec: Pick<ScreenSpec, 'monogram' | 'accent' | 'accentDeep'>, flipY: boolean) {
  const w = 460, h = 1000;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const bg = g.createRadialGradient(w / 2, h * 0.32, 0, w / 2, h * 0.32, h * 0.75);
  bg.addColorStop(0, spec.accentDeep);
  bg.addColorStop(0.65, '#0b0a0d');
  bg.addColorStop(1, '#050506');
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = spec.accent + '88';
  g.lineWidth = 2;
  g.beginPath();
  g.arc(w / 2, h * 0.46, 62, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = spec.accent;
  g.font = 'italic 64px "Instrument Serif", Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(spec.monogram, w / 2, h * 0.465);
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.font = '500 15px ui-monospace, monospace';
  g.fillText('C O M I N G   S O O N', w / 2, h * 0.56);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.flipY = flipY;
  return t;
}

/* ----------------------------------------------------------------------------------------------
 * Screenshots, decoded and on the GPU before they're needed
 * -------------------------------------------------------------------------------------------- */

/**
 * Every line-up screenshot, loaded once, cropped for the phone's screen and uploaded to the GPU when the
 * stage starts, then kept. A change of project only points the phones at textures already there: loading
 * and uploading them at the hand-over stalled the turn and blanked the phones while they decoded.
 */
const screenshots = new Map<string, THREE.Texture>();
const shared = new WeakSet<THREE.Texture>();
/** Which screen each loaded texture belongs to, so a slot never shows a screen it has moved on from. */
const textureKey = new WeakMap<THREE.Texture, string>();

function preloadScreenshots(gl: THREE.WebGLRenderer) {
  const urls = new Set<string>();
  PRODUCTS.forEach((p) => p.screens.forEach((s) => { if (!s.scene) urls.add(s.image); }));
  const loader = new THREE.TextureLoader();
  urls.forEach((url) => {
    if (screenshots.has(url)) return;
    loader.load(url, (t) => {
      t.flipY = false;
      t.colorSpace = THREE.SRGBColorSpace;
      coverFit(t, t.image.width, t.image.height, SCREEN_ASPECT);
      t.anisotropy = 8;
      gl.initTexture(t);
      shared.add(t);
      screenshots.set(url, t);
    }, undefined, () => { /* missing: the phone shows its placeholder */ });
  });
}

/** A still screen (no recording, no live scene) whose screenshot is already on the GPU. */
function readyScreenshot(spec: ScreenSpec | null, aspect: number, flipY: boolean) {
  if (!spec || spec.video || spec.scene || !spec.poster || flipY || aspect !== SCREEN_ASPECT) return null;
  return screenshots.get(spec.poster) ?? null;
}

/**
 * What a screen shows: the poster at once, the recording once it can play, the placeholder if neither
 * exists. `flipY` is false for the model's screen (glTF UVs) and true for flat cards. A screenshot that
 * was preloaded is returned straight away, the same frame the screen changes.
 */
function useScreenTexture(spec: ScreenSpec | null, playing: boolean, aspect: number, flipY: boolean) {
  const ready = readyScreenshot(spec, aspect, flipY);
  const [loaded, setTexture] = useState<THREE.Texture | null>(null);
  const texture = ready ?? loaded;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /**
   * The texture on screen right now. It is never freed while shown: the outgoing one goes only once its
   * replacement has been drawn (freeing it on the change of screen, before the next had loaded, left the
   * screen blank for a frame or two — a flicker on every switch).
   */
  const shown = useRef<THREE.Texture | null>(null);

  useEffect(() => () => {
    if (shown.current && !shared.has(shown.current)) shown.current.dispose();
    shown.current = null;
  }, []);

  useEffect(() => {
    // Already on the GPU: nothing to load.
    if (!spec || readyScreenshot(spec, aspect, flipY)) return;
    let disposed = false;
    let current: THREE.Texture | null = null;
    const made: THREE.Texture[] = [];
    let hasVideo = false;
    const swap = (next: THREE.Texture) => {
      if (disposed) return next.dispose();
      textureKey.set(next, spec.key);
      const previous = shown.current;
      current = next;
      shown.current = next;
      setTexture(next);
      // Freed after two frames, by when the screen is drawing with its replacement.
      if (previous && previous !== next && !shared.has(previous)) requestAnimationFrame(() => requestAnimationFrame(() => previous.dispose()));
    };
    const keep = <T extends THREE.Texture>(t: T) => { made.push(t); return t; };
    const fit = (t: THREE.Texture, w: number, h: number) => {
      t.flipY = flipY;
      t.colorSpace = THREE.SRGBColorSpace;
      coverFit(t, w, h, aspect);
    };

    const fallback = () => { if (!current) swap(keep(placeholderTexture(spec, flipY))); };
    if (spec.poster) {
      new THREE.TextureLoader().load(
        spec.poster,
        (t) => {
          if (hasVideo || disposed) return t.dispose();
          fit(t, t.image.width, t.image.height);
          swap(keep(t));
        },
        undefined,
        fallback
      );
    } else fallback();

    let el: HTMLVideoElement | null = null;
    if (spec.video) {
      el = document.createElement('video');
      Object.assign(el, { src: spec.video, muted: true, loop: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
      el.setAttribute('playsinline', '');
      el.addEventListener('loadeddata', () => {
        if (disposed || !el) return;
        hasVideo = true;
        const t = keep(new THREE.VideoTexture(el));
        fit(t, el.videoWidth, el.videoHeight);
        swap(t);
      }, { once: true });
      el.addEventListener('error', fallback, { once: true });
      videoRef.current = el;
    }

    return () => {
      disposed = true;
      // An outgoing video stops, holding its last frame on screen until the next screen is in.
      if (el) {
        el.pause();
        el.removeAttribute('src');
        el.load();
      }
      videoRef.current = null;
      // Free what this screen made, except whatever is still on the phone (freed when replaced).
      made.forEach((t) => { if (t !== shown.current) t.dispose(); });
    };
  }, [spec?.key, aspect, flipY]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing, texture]);

  return texture;
}

/* ----------------------------------------------------------------------------------------------
 * Where the phone is: blended from every visible anchor, each frame
 * -------------------------------------------------------------------------------------------- */

interface Placement {
  visible: boolean;
  x: number; y: number; z: number; scale: number;
  rx: number; ry: number; rz: number;
  /** The anchor pulling hardest; its screen is the one shown. */
  dominant: string | null;
  /** 0…1…0 across the hero → line-up flight, peaking mid-air (drives the light sweep). */
  arc: number;
  /**
   * The hero's angle, followed continuously while in flight. The turn is measured from here; measuring
   * it against the phone's own (moving) angle let it jump a whole turn near landing.
   */
  heroY: number | null;
  /** The line-up box the travelling phone is drawn in, last frame (a new one means a new fan). */
  stageBox: HTMLElement | null;
  /**
   * Jump straight to the target this frame, no gliding: a new fan took over at a hand-over's half-turn,
   * and its front phone must stand exactly where the one it replaces stood.
   */
  snap: boolean;
}

const TURN = Math.PI * 2;
/** An angle difference brought into -π…π: the shortest way round. */
const shortest = (a: number) => a - TURN * Math.round(a / TURN);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Ken Perlin's smootherstep: zero velocity and zero acceleration at both ends, so take-off and landing never jolt. */
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** How the flight from the hero to the line-up is shaped (world units / radians). */
const FLIGHT = {
  /** How high the arc rises above the straight line between the two boxes. */
  lift: 0.12,
  /** How far it swoops toward the camera at the top of the arc. */
  toward: 0.55,
  /** Extra size at the top of the arc, on top of coming closer. */
  swell: 0.06,
  /** Leaning into the curve, like a plane banking. */
  bank: 0.42,
  /** Nose dips slightly as it banks. */
  pitch: -0.14
};

interface Seen {
  id: string;
  w: number;
  x: number; y: number; scale: number;
  /** Where the box would be if its section were still pinned (world y): the flight's end points. */
  pinnedY: number;
  pose: { x: number; y: number; z: number };
  depth: number;
}

/** A satellite phone's place on screen this frame, or null while it isn't to be drawn. */
function placeSatellite(a: Anchor, t: number, width: number, height: number) {
  if (a.hidden?.()) return null;
  const sec = a.section.getBoundingClientRect();
  if (sec.bottom <= 0 || sec.top >= height) return null;
  const box = a.box.getBoundingClientRect();
  if (box.height < 1) return null;
  const perPx = WORLD_HEIGHT / height;
  return {
    x: (box.left + box.width / 2 - width / 2) * perPx,
    y: -(box.top + box.height / 2 - height / 2) * perPx,
    z: a.depth?.() ?? 0,
    scale: (box.height * perPx) / PHONE_HEIGHT,
    pose: a.pose(t)
  };
}

function place(t: number, width: number, height: number, out: Placement) {
  const perPx = WORLD_HEIGHT / height;
  // Anchors keep their own running angles: the hero counts up a turn per product, while the line-up
  // sits near zero. Each angle is taken relative to last frame's target, the shortest way round:
  // a spin moves far less than half a turn per frame, so it stays continuous, and a hand-off never
  // unwinds turns in a rush.
  const fresh = !out.visible;
  const ref = { x: out.rx, y: out.ry, z: out.rz };
  const near = (a: number, r: number) => (fresh ? a : r + shortest(a - r));

  const seen: Seen[] = [];
  for (const [id, a] of anchors) {
    if (a.satellite) continue;
    const sec = a.section.getBoundingClientRect();
    const w = Math.max(0, Math.min(sec.bottom, height) - Math.max(sec.top, 0)) / height;
    if (w <= 0.001) continue;
    const box = a.box.getBoundingClientRect();
    if (box.height < 1) continue;
    // The anchor's framing, moving the phone within (and beyond) its box like a camera would.
    const shot = a.shot?.() ?? { x: 0, y: 0, zoom: 1 };
    const cx = box.left + box.width / 2 + shot.x * box.height;
    const cy = box.top + box.height / 2 - shot.y * box.height;
    // Both sections pin their content while in view. Arriving, it sits `sec.top` too low; leaving,
    // it has risen by however far the section's bottom is above the viewport's.
    const unpin = sec.top > 0 ? -sec.top : sec.bottom < height ? height - sec.bottom : 0;
    seen.push({
      id,
      w,
      x: (cx - width / 2) * perPx,
      y: -(cy - height / 2) * perPx,
      pinnedY: -(cy + unpin - height / 2) * perPx,
      scale: ((box.height * perPx) / PHONE_HEIGHT) * shot.zoom,
      pose: a.pose(t),
      depth: a.depth?.() ?? 0
    });
  }

  out.visible = seen.length > 0;
  out.arc = 0;
  // A different stage box than last frame, with the hero out of sight: the fan was replaced.
  const stageBox = anchors.get('stage')?.box ?? null;
  out.snap = !!stageBox && !!out.stageBox && stageBox !== out.stageBox && !seen.some((s) => s.id === 'hero');
  out.stageBox = stageBox;
  if (!seen.length) { out.dominant = null; out.heroY = null; return out; }
  out.dominant = seen.reduce((a, b) => (b.w > a.w ? b : a)).id;

  const hero = seen.find((s) => s.id === 'hero');
  const stage = seen.find((s) => s.id === 'stage');

  if (hero && stage) {
    // The flight. `f` runs 0 → 1 linearly as the line-up scrolls in. Position is eased by it, so it
    // lifts off and lands softly; rotation is not (below), so the turn stays proportional to scroll.
    // It flies between the two pinned spots, the hero's and the line-up's front slot, on its own arc
    // while the page slides beneath it; at either end those spots are exactly where the boxes are.
    const f = stage.w / (hero.w + stage.w);
    const e = smoother(f);
    const arc = Math.sin(Math.PI * e);
    out.arc = arc;
    out.x = lerp(hero.x, stage.x, e);
    out.y = lerp(hero.pinnedY, stage.pinnedY, e) + arc * FLIGHT.lift * hero.scale;
    out.z = arc * FLIGHT.toward + hero.depth * (1 - e) + stage.depth * e;
    out.scale = lerp(hero.scale, stage.scale, e) * (1 + arc * FLIGHT.swell);
    // Finish the turn the hero started, forward and at the same constant rate: the hero hands over
    // with ~220° done (past its back), so the remaining ~140° is never near the ambiguous half-turn.
    // The origin follows the hero's own angle (continuous frame to frame), never the phone's, so it
    // can't slip a turn.
    const from = out.heroY === null ? near(hero.pose.y, ref.y) : out.heroY + shortest(hero.pose.y - out.heroY);
    out.heroY = from;
    let ahead = shortest(stage.pose.y - from);
    // The home page completes its turn forward; a case study just takes the short way (no spin).
    const turning = anchors.get('hero')?.flightTurn !== false;
    if (turning && ahead < 0) ahead += TURN;
    out.ry = from + ahead * (turning ? f : e);
    // A case study's phone glides rather than banking through a turn.
    const banking = turning ? 1 : 0.35;
    out.rx = lerp(hero.pose.x, stage.pose.x, e) + arc * FLIGHT.pitch * banking;
    out.rz = lerp(hero.pose.z, stage.pose.z, e) + arc * FLIGHT.bank * banking;
    return out;
  }

  // Anywhere else, a plain weighted blend (in practice, a single anchor).
  out.heroY = null;
  let total = 0, x = 0, y = 0, z = 0, scale = 0, rx = 0, ry = 0, rz = 0;
  for (const s of seen) {
    x += s.w * s.x; y += s.w * s.y; z += s.w * s.depth; scale += s.w * s.scale;
    rx += s.w * near(s.pose.x, ref.x); ry += s.w * near(s.pose.y, ref.y); rz += s.w * near(s.pose.z, ref.z);
    total += s.w;
  }
  out.x = x / total; out.y = y / total; out.z = z / total; out.scale = scale / total;
  out.rx = rx / total; out.ry = ry / total; out.rz = rz / total;
  return out;
}

/* ----------------------------------------------------------------------------------------------
 * Live app screens
 * -------------------------------------------------------------------------------------------- */

/** The app's TILT_RAD: about this much lean gives three quarters of the screen's parallax swing. */
const LIVE_TILT_RAD = 0.45;
const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let welcomeScene: Promise<ArianeWelcome> | null = null;

/** Ariane's Welcome, built once (its images, fonts and shader) the first time it's wanted, then kept. */
function useLiveScene(wanted: boolean) {
  const [scene, setScene] = useState<ArianeWelcome | null>(null);
  useEffect(() => {
    if (!wanted || scene) return;
    let alive = true;
    welcomeScene ??= createArianeWelcome();
    welcomeScene.then((s) => { if (alive) setScene(s); }).catch(() => { welcomeScene = null; });
    return () => { alive = false; };
  }, [wanted, scene]);
  return scene;
}

/* ----------------------------------------------------------------------------------------------
 * The phone
 * -------------------------------------------------------------------------------------------- */

/** A clone of the model with its own tinted materials, following the chosen finish. */
function useTintedModel() {
  const { scene } = useGLTF(MODEL_URL);
  const finish = usePhoneState((s) => s.finish);

  // A clone with its own copies of the tinted materials, so finishes never touch the cached model.
  const built = useMemo(() => {
    const model = scene.clone(true);
    const tinted: { mat: THREE.MeshStandardMaterial; original: THREE.Color; lum: number }[] = [];
    const lumOf = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    let reference = 1;
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat?.name?.startsWith('COLOUR_') || mat.name.includes('Screen')) return;
      const copy = mat.clone();
      mesh.material = copy;
      tinted.push({ mat: copy, original: copy.color.clone(), lum: lumOf(copy.color) });
      if (mesh.name === 'Side_Panel') reference = lumOf(copy.color);
    });
    tinted.forEach((t) => { t.lum = t.lum / reference; });
    return { model, screenMesh: model.getObjectByName('Front_Screen') as THREE.Mesh | undefined, tinted };
  }, [scene]);

  // Re-tint every coloured part: the side frame takes the finish, the rest keep their brightness relative to it.
  useEffect(() => {
    const target = FINISHES.find((f) => f.id === finish)?.color;
    for (const t of built.tinted) {
      if (!target) t.mat.color.copy(t.original);
      else t.mat.color.set(target).convertSRGBToLinear().multiplyScalar(Math.min(t.lum, 2.5));
    }
  }, [finish, built]);

  return built;
}

/** Sets a screen material's brightness, where it has the uniform for it. */
function setDim(mesh: THREE.Mesh | undefined, dim: number) {
  const u = (mesh?.material as THREE.ShaderMaterial | undefined)?.uniforms?.dim;
  if (u) u.value = dim;
}

/** How a screen's status bar is treated (see BarMode). */
const barOf = (spec: ScreenSpec): BarMode =>
  !spec.video ? 'none' : spec.barCleaned ? 'cleaned' : spec.barInset ? 'inset' : 'raw';

/** Sets the glint crossing a screen material, where it has the uniform for it. */
function setSheen(mesh: THREE.Mesh | undefined, sheen: number) {
  const u = (mesh?.material as THREE.ShaderMaterial | undefined)?.uniforms?.sheen;
  if (u) u.value = sheen;
}

/**
 * The colour the main phone's screen is showing, sampled a few times a second (a recording changes as it
 * plays). `known` is false for a live scene or a screen still loading: the glow then takes the accent.
 */
const screenSample = { color: new THREE.Color(), known: false };
let sampler: CanvasRenderingContext2D | null = null;

function sampleScreen(tex: THREE.Texture | null) {
  const img = tex?.image as (CanvasImageSource & { width?: number; videoWidth?: number; readyState?: number }) | undefined;
  const ready = !!img && (img instanceof HTMLVideoElement ? img.readyState >= 2 : (img.width ?? 0) > 0);
  if (!ready) { screenSample.known = false; return; }
  if (!sampler) {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 16;
    sampler = c.getContext('2d', { willReadFrequently: true });
  }
  if (!sampler) return;
  try {
    sampler.drawImage(img!, 0, 0, 8, 16);
    const d = sampler.getImageData(0, 0, 8, 16).data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    const n = (d.length / 4) * 255;
    screenSample.color.setRGB(r / n, g / n, b / n, THREE.SRGBColorSpace);
    screenSample.known = true;
  } catch {
    screenSample.known = false;
  }
}

const glowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const glowFragment = /* glsl */ `
varying vec2 vUv;
uniform vec3 color;
uniform float strength;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = strength * pow(1.0 - smoothstep(0.0, 1.0, r), 2.2);
  gl_FragColor = vec4(color, a);
  #include <colorspace_fragment>
}
`;

function glowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: glowVertex,
    fragmentShader: glowFragment,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: { color: { value: new THREE.Color() }, strength: { value: 0 } }
  });
}

/**
 * The screen lighting its surroundings (case studies): a halo behind the phone and a pool of light
 * beneath it, in the colours the screen is showing — leaning to the product's accent when the screen is
 * grey or unknown, so a white app doesn't fog the page.
 */
function ScreenGlow({ placement }: { placement: React.MutableRefObject<Placement> }) {
  const halo = useRef<THREE.Mesh>(null);
  const pool = useRef<THREE.Mesh>(null);
  const haloMat = useMemo(glowMaterial, []);
  const poolMat = useMemo(glowMaterial, []);
  useEffect(() => () => { haloMat.dispose(); poolMat.dispose(); }, [haloMat, poolMat]);
  const tint = useRef(new THREE.Color());
  const target = useMemo(() => new THREE.Color(), []);
  const accent = useMemo(() => new THREE.Color(), []);
  const hsl = useMemo(() => ({ h: 0, s: 0, l: 0 }), []);
  const level = useRef(0);

  useFrame((_, delta) => {
    const p = placement.current;
    const a = p.dominant ? anchors.get(p.dominant) : undefined;
    const { damp } = THREE.MathUtils;
    // Follows the screen's own brightness (dark while it powers on).
    const want = p.visible && a?.glow ? Math.min(1, a.dim?.() ?? 1) : 0;
    level.current = damp(level.current, want, 4, delta);
    const on = level.current > 0.005;
    if (halo.current) halo.current.visible = on;
    if (pool.current) pool.current.visible = on;
    if (!on || !halo.current || !pool.current) return;

    if (a) accent.set(a.accent);
    if (screenSample.known) {
      screenSample.color.getHSL(hsl);
      const grey = 1 - THREE.MathUtils.smoothstep(hsl.s, 0.08, 0.3);
      target.setHSL(hsl.h, Math.min(1, hsl.s * 1.4 + 0.1), THREE.MathUtils.clamp(hsl.l, 0.35, 0.6)).lerp(accent, 0.3 + 0.7 * grey);
    } else target.copy(accent);
    tint.current.lerp(target, Math.min(1, delta * 2.5));
    haloMat.uniforms.color.value.copy(tint.current);
    poolMat.uniforms.color.value.copy(tint.current);
    haloMat.uniforms.strength.value = 0.34 * level.current;
    poolMat.uniforms.strength.value = 0.42 * level.current;

    const h = PHONE_HEIGHT * p.scale;
    halo.current.position.set(p.x, p.y, p.z - 0.6);
    halo.current.scale.set(h * 1.6, h * 1.35, 1);
    pool.current.position.set(p.x, p.y - h * 0.55, p.z - 0.15);
    pool.current.scale.set(h * 1.25, h * 0.22, 1);
  });

  return (
    <>
      <mesh ref={halo} material={haloMat} visible={false} renderOrder={-1}>
        <planeGeometry />
      </mesh>
      <mesh ref={pool} material={poolMat} visible={false} renderOrder={-1}>
        <planeGeometry />
      </mesh>
    </>
  );
}

/** The model, centred on its own middle so it spins in place. */
function ModelPrimitive({ model }: { model: THREE.Object3D }) {
  return (
    <primitive
      object={model}
      scale={SCALE}
      position={[0, -(MODEL.height / 2) * SCALE, -((MODEL.zMin + MODEL.zMax) / 2) * SCALE]}
    />
  );
}

/**
 * A side phone in the line-up: a real iPhone too, drawn in its anchor's box. All three phones of a fan
 * share one 3D scene, so when they turn as a carousel they pass in front of and behind one another in
 * true depth — nothing flat ever has to hand over to the 3D phone.
 */
function Satellite({ id }: { id: string }) {
  const group = useRef<THREE.Group>(null);
  const { model, screenMesh } = useTintedModel();
  const size = useThree((s) => s.size);
  // A screen that wasn't preloaded (a placeholder for a screenshot that doesn't exist yet) loads here.
  const [spec, setSpec] = useState<ScreenSpec | null>(() => anchors.get(id)?.screen ?? null);
  const loading = useScreenTexture(spec, false, SCREEN_ASPECT, false);
  /** Which screen `loading` belongs to (it arrives a moment after the screen changes). */
  const loadingKey = useRef<string | null>(null);
  useEffect(() => { if (loading) loadingKey.current = spec?.key ?? null; }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastBox = useRef<HTMLElement | null>(null);
  // One material for the phone's life; its texture is swapped in place, in the frame the screen changes.
  const material = useMemo(() => screenMaterial(new THREE.Texture(), 'none'), []);
  useEffect(() => {
    if (!screenMesh) return;
    const original = screenMesh.material;
    screenMesh.material = material;
    return () => {
      screenMesh.material = original;
      material.dispose();
    };
  }, [screenMesh, material]);

  useFrame((state, delta) => {
    const g = group.current;
    const a = anchors.get(id);
    if (!g) return;
    if (a && a.screen.key !== spec?.key) setSpec(a.screen);
    // The screen this frame: preloaded (instant), or the one loaded for it — never the last project's.
    const tex = (a && readyScreenshot(a.screen, SCREEN_ASPECT, false)) ?? (loadingKey.current === a?.screen.key ? loading : null);
    if (tex && material.uniforms.map.value !== tex) {
      material.uniforms.map.value = tex;
      material.uniforms.uRepeat.value = tex.repeat;
      material.uniforms.uOffset.value = tex.offset;
    }
    const p = a ? placeSatellite(a, state.clock.elapsedTime, size.width, size.height) : null;
    const wasVisible = g.visible;
    g.visible = !!p && !!tex;
    // A new box means a new fan took over (a hand-over's half-turn): jump to it, don't glide.
    const box = a?.box ?? null;
    const snap = !!box && !!lastBox.current && box !== lastBox.current;
    lastBox.current = box;
    if (!p || !g.visible) return;
    setDim(screenMesh, a?.dim?.() ?? 1);
    const { damp } = THREE.MathUtils;
    if (!wasVisible || snap) {
      g.position.set(p.x, p.y, p.z);
      g.scale.setScalar(p.scale);
      g.rotation.set(p.pose.x, p.pose.y, p.pose.z);
      return;
    }
    // The same follow rate as the front phone, so all three move as one.
    const k = a?.follow ?? 12;
    g.position.set(damp(g.position.x, p.x, k, delta), damp(g.position.y, p.y, k, delta), damp(g.position.z, p.z, k, delta));
    g.scale.setScalar(damp(g.scale.x, p.scale, k, delta));
    g.rotation.x = damp(g.rotation.x, p.pose.x, k, delta);
    g.rotation.y = damp(g.rotation.y, p.pose.y, k, delta);
    g.rotation.z = damp(g.rotation.z, p.pose.z, k, delta);
  });

  return (
    <group ref={group} visible={false}>
      <ModelPrimitive model={model} />
    </group>
  );
}

function Phone({ placement, screen, slots, playing }: {
  placement: React.MutableRefObject<Placement>;
  screen: ScreenSpec | null;
  /** Push mode's two slots (see Anchor.push), or null for a plain screen. */
  slots: [ScreenSpec | null, ScreenSpec | null] | null;
  playing: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { model, screenMesh } = useTintedModel();

  useEffect(() => { setPhoneState({ modelReady: true }); }, [model]);
  // A dark screen, not the model's own wallpaper, until the first real screen replaces it.
  const blank = useMemo(() => new THREE.MeshBasicMaterial({ color: '#000000' }), []);
  useEffect(() => {
    screenStatus.key = null;
    if (screenMesh) screenMesh.material = blank;
    return () => { screenStatus.key = null; blank.dispose(); };
  }, [screenMesh, blank]);

  // A live app screen (Ariane's Welcome) runs its own material; anything else is a poster/video texture.
  const live = useLiveScene(screen?.scene === 'ariane-welcome' || !!slots?.some((s) => s?.scene === 'ariane-welcome'));
  const pushing = !!slots;
  const showLive = !!live && screen?.scene === 'ariane-welcome' && !pushing;
  const texture = useScreenTexture(screen?.scene || pushing ? null : screen, playing, SCREEN_ASPECT, false);
  const cam = useRef({ x: 0, y: 0 });
  const sampleAge = useRef(1);

  // Push mode (a case study's walkthrough): two slots, alternate screens in alternate slots, so the next
  // screen is loaded while this one shows and the app can scroll from one to the other.
  const slot0 = useScreenTexture(slots?.[0] && !slots[0].scene ? slots[0] : null, playing, SCREEN_ASPECT, false);
  const slot1 = useScreenTexture(slots?.[1] && !slots[1].scene ? slots[1] : null, playing, SCREEN_ASPECT, false);
  const pushMat = useMemo(() => pushMaterial(), []);
  const pushHasScene = !!live && !!slots?.some((s) => s?.scene === 'ariane-welcome');
  useEffect(() => {
    if (!screenMesh || !pushing) return;
    screenMesh.material = pushMat;
  }, [screenMesh, pushing, pushMat]);
  useEffect(() => () => pushMat.dispose(), [pushMat]);
  /** A slot's texture, if it holds `spec` right now (never a screen it has moved on from). */
  const slotTexture = (slot: number, spec: ScreenSpec | null) => {
    if (!spec) return null;
    if (spec.scene) return live?.texture ?? null;
    const t = slot === 0 ? slot0 : slot1;
    if (!t) return null;
    return textureKey.get(t) === spec.key || readyScreenshot(spec, SCREEN_ASPECT, false) === t ? t : null;
  };

  useEffect(() => {
    if (!screenMesh || !showLive || !live) return;
    // The welcome is rendered flat into its own frame each tick; the phone shows that frame. Leaving it,
    // nothing is restored here: the welcome's last frame stays until the next screen's texture takes
    // over (restoring the model's own wallpaper in between flashed it for a frame).
    screenMesh.material = live.screen;
  }, [screenMesh, showLive, live]);
  // Each time it comes on screen, the page opens again from the dark, as the app does.
  useEffect(() => { if (showLive) live?.replay(); }, [showLive, live, screen?.key]);

  useEffect(() => {
    if (!screenMesh || !texture || showLive || pushing) return;
    const original = screenMesh.material;
    // Recordings (and their posters) carry the recording phone's status bar: hide it as it plays.
    const material = screenMaterial(texture, screen ? barOf(screen) : 'none');
    screenMesh.material = material;
    return () => {
      screenMesh.material = original;
      material.dispose();
    };
  }, [screenMesh, texture, showLive, pushing, screen?.video, screen?.barCleaned, screen?.barInset]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    const g = group.current;
    const p = placement.current;
    if (!g) return;
    // Which screen is really on the glass (checked even while hidden: an entrance may be waiting on it).
    // A texture still showing the last screen, while this one loads, doesn't count.
    const onGlass = !screenMesh || screenMesh.material === blank || !screen ? null
      : showLive ? screen.key
      : pushing ? (slots?.find(Boolean)?.key ?? null)
      : texture && (textureKey.get(texture) === screen.key || readyScreenshot(screen, SCREEN_ASPECT, false) === texture) ? screen.key
      : null;
    screenStatus.key = onGlass;
    const wasVisible = g.visible;
    g.visible = p.visible;
    if (!p.visible) return;
    const { damp } = THREE.MathUtils;
    if (!wasVisible || p.snap) {
      // Arriving, or a new fan taking over: exactly in place rather than easing in from where it was.
      g.position.set(p.x, p.y, p.z);
      g.scale.setScalar(p.scale);
      g.rotation.set(p.rx, p.ry, p.rz);
      return;
    }
    // Position trails the page by a few frames, which irons out scroll steps; rotation glides slower.
    // In the line-up it follows tightly instead: the scroll is smoothed already, and smoothing it twice
    // made the turn lag behind a fast scroll and then catch up.
    const follow = (p.dominant ? anchors.get(p.dominant)?.follow : undefined);
    const move = follow ?? 12;
    const turnRate = follow ?? 7;
    g.position.set(damp(g.position.x, p.x, move, delta), damp(g.position.y, p.y, move, delta), damp(g.position.z, p.z, follow ?? 8, delta));
    g.scale.setScalar(damp(g.scale.x, p.scale, move, delta));
    g.rotation.x = damp(g.rotation.x, p.rx, turnRate, delta);
    g.rotation.y = damp(g.rotation.y, p.ry, turnRate, delta);
    g.rotation.z = damp(g.rotation.z, p.rz, turnRate, delta);
    const anchor = p.dominant ? anchors.get(p.dominant) : undefined;
    setDim(screenMesh, anchor?.dim?.() ?? 1);
    setSheen(screenMesh, anchor?.sheen?.() ?? -1);

    // The push: whichever slot holds the lower screen is pushed up and off by the higher one.
    const push = pushing ? anchor?.push?.() : undefined;
    if (push) {
      const loSlot = push.loIndex % 2;
      const lo = slotTexture(loSlot, push.lo);
      const hi = slotTexture(1 - loSlot, push.hi);
      const a = lo ?? hi;
      const b = hi ?? lo;
      if (a && b) {
        const u = pushMat.uniforms;
        const aSpec = lo ? push.lo : push.hi!;
        const bSpec = hi ? push.hi! : push.lo;
        u.mapA.value = a; u.repA.value.copy(a.repeat); u.offA.value.copy(a.offset);
        u.mapB.value = b; u.repB.value.copy(b.repeat); u.offB.value.copy(b.offset);
        u.fmtA.value.copy(pushFormat(a, barOf(aSpec), !!aSpec.scene));
        u.fmtB.value.copy(pushFormat(b, barOf(bSpec), !!bSpec.scene));
        // With only one of the two loaded, it fills the screen until the other arrives.
        u.p.value = lo && hi ? push.p : lo ? 0 : 1;
      }
    }

    // What the screen is showing, for the glow around it (only where an anchor asks for one).
    sampleAge.current += delta;
    if (anchor?.glow && sampleAge.current > 0.2) {
      sampleAge.current = 0;
      const u = pushMat.uniforms;
      sampleScreen(pushing ? (u.p.value < 0.5 ? u.mapA.value : u.mapB.value) : showLive ? null : texture);
    }

    // The live screen's camera is the phone's own lean — on the real phone it is the gyro. Turned
    // toward you it reads 0; leaning about 25° gives three quarters of the swing, easing off toward
    // the ends (tanh, as the app does), and it glides rather than snapping.
    if ((showLive || pushHasScene) && live) {
      const tx = Math.tanh(shortest(g.rotation.y) / LIVE_TILT_RAD);
      const ty = Math.tanh(shortest(g.rotation.x) / LIVE_TILT_RAD);
      cam.current.x = damp(cam.current.x, tx, 10, delta);
      cam.current.y = damp(cam.current.y, ty, 10, delta);
      live.update(cam.current, delta, REDUCED_MOTION, state.gl);
    }
  });

  return (
    <group ref={group}>
      <ModelPrimitive model={model} />
    </group>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Scene
 * -------------------------------------------------------------------------------------------- */

function Director({ active }: { active: boolean }) {
  const placement = useRef<Placement>({ visible: false, x: 0, y: 0, z: 0, scale: 1, rx: 0, ry: 0, rz: 0, dominant: null, arc: 0, heroY: null, stageBox: null, snap: false });
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const [dominant, setDominant] = useState<string | null>(null);
  const [screenKey, setScreenKey] = useState<string | null>(null);
  const [slots, setSlots] = useState<[ScreenSpec | null, ScreenSpec | null] | null>(null);
  const slotsKey = useRef('');
  // Every line-up screenshot onto the GPU now, so no change of project ever waits for one.
  useEffect(() => { preloadScreenshots(gl); }, [gl]);
  // The side phones registered right now (their anchor ids), re-read each frame.
  const [satellites, setSatellites] = useState<string[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const sweep = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const sats = [...anchors].filter(([, a]) => a.satellite).map(([id]) => id).sort();
    if (sats.join() !== satellites.join()) setSatellites(sats);
    const p = place(state.clock.elapsedTime, size.width, size.height, placement.current);    const a = p.dominant ? anchors.get(p.dominant) : undefined;
    if (p.dominant !== dominant) setDominant(p.dominant);
    if (a && a.screen.key !== screenKey) setScreenKey(a.screen.key);
    // Push mode: which screen each of the two slots holds (re-rendered only when that changes).
    const push = a?.push?.();
    let next: [ScreenSpec | null, ScreenSpec | null] | null = null;
    if (push) {
      next = [null, null];
      next[push.loIndex % 2] = push.lo;
      next[1 - (push.loIndex % 2)] = push.hi;
    }
    const nextKey = next ? next.map((s) => s?.key ?? '-').join('|') : '';
    if (nextKey !== slotsKey.current) {
      slotsKey.current = nextKey;
      setSlots(next);
    }
    if (a && light.current) light.current.color.lerp(new THREE.Color(a.accent), Math.min(1, delta * 3));
    // An entrance fading the stage in (the canvas holds only the phone and its light).
    const fade = String(Math.round((a?.fade?.() ?? 1) * 1000) / 1000);
    if (gl.domElement.style.opacity !== fade) gl.domElement.style.opacity = fade;
    // In flight, a warm light rises with the phone and runs across its frame, brightest at the top of the arc.
    // A glint crossing the glass brings the same light across the frame with it.
    const glint = a?.sheen?.() ?? -1;
    if (sweep.current) {
      if (glint > 0 && glint < 1 && p.arc < 0.05) {
        sweep.current.intensity = Math.sin(Math.PI * glint) * 12;
        sweep.current.position.set(p.x + 2.2 - glint * 4.4, p.y + 1.4, 2.4);
      } else {
        sweep.current.intensity = p.arc * 16;
        sweep.current.position.set(p.x + 2.2 - p.arc * 3.2, p.y + 1.6, 2.4);
      }
    }
  });

  // Anchors change their screen by mutation; `screenKey` is the state that re-renders us when they do.
  const screen = dominant && screenKey ? anchors.get(dominant)?.screen ?? null : null;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <pointLight ref={light} position={[-3, -1, 2]} intensity={7} distance={9} color="#ffffff" />
      <pointLight ref={sweep} intensity={0} distance={7} color="#fff3e0" />
      <ScreenGlow placement={placement} />
      <Phone placement={placement} screen={screen} slots={slots} playing={active && (!!screen || !!slots)} />
      {satellites.map((id) => <Satellite key={id} id={id} />)}
      {/* Neutral studio light boxes for the metal and glass to reflect — built locally, nothing downloaded */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 2, 4]} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[0, -3, -3]} scale={3} />
      </Environment>
    </>
  );
}

useGLTF.preload(MODEL_URL);

/**
 * The one iPhone on the home page. A transparent canvas fixed over the viewport (it never takes
 * pointer events): the phone is drawn wherever the visible anchors say, and the canvas sleeps when
 * no anchor's section is on screen.
 */
export default function PhoneStage() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = window.innerHeight;
      let any = false;
      anchors.forEach((a) => {
        const r = a.section.getBoundingClientRect();
        if (r.bottom > 0 && r.top < h) any = true;
      });
      setActive(any);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const id = window.setInterval(check, 1000); // anchors register after mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearInterval(id);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!getPhoneState().webgl) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-[5] pointer-events-none">
      <Canvas
        // R3F's wrappers default back to pointer-events: auto; the page beneath handles every gesture.
        style={{ pointerEvents: 'none' }}
        frameloop={active ? 'always' : 'never'}
        // Full Retina resolution: the phone's screen carries fine text.
        dpr={[1, 2]}
        camera={{ position: [0, 0, CAMERA.z], fov: CAMERA.fov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Director active={active} />
        </Suspense>
      </Canvas>
    </div>
  );
}
