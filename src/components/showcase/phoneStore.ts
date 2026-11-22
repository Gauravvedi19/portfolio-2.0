import { useSyncExternalStore } from 'react';
import { PRODUCTS, type ShowcaseProduct } from '../../showcase/products';

/**
 * Shared state between the page and the one 3D iPhone that travels across it.
 *
 * Sections register an *anchor*: a DOM box the phone should fill, the section whose visibility
 * decides how strongly the phone is pulled there, and the pose (rotation) it should hold.
 * Each frame the canvas blends between visible anchors, so scrolling from the hero to the product
 * stage flies the phone from one box to the other.
 */

export interface Pose {
  /** Radians, three.js axes. */
  x: number;
  y: number;
  z: number;
}

export interface Anchor {
  box: HTMLElement;
  section: HTMLElement;
  /** Called every frame with the scene clock (seconds). */
  pose: (t: number) => Pose;
  /**
   * An extra phone drawn in its own box (the line-up's side phones), not the travelling one: it never
   * takes part in the hero → line-up flight and never chooses the screen of the main phone.
   */
  satellite?: boolean;
  /** Toward the camera (world units), so phones in a fan overlap in true depth. */
  depth?: () => number;
  /** Screen brightness, 0…1 (side phones sit dimmer than the front one). */
  dim?: () => number;
  /** True while this phone shouldn't be drawn (a side phone tucked away). */
  hidden?: () => boolean;
  /**
   * How tightly the 3D phone follows its target (a damping rate: higher is tighter). Unset, it glides
   * (the hero's cursor lean); scroll-driven motion, already smoothed by the scroll, follows closely.
   */
  follow?: number;
  /**
   * The screen scrolls from one app screen to the next instead of changing at once (the case-study
   * walkthrough): `lo` is pushed up and off by `hi` as `p` runs 0 → 1. `loIndex` is lo's place in the
   * sequence; the phone keeps alternate screens in alternate slots by it, so the next screen is always
   * loaded before it's needed.
   */
  push?: () => { lo: ScreenSpec; hi: ScreenSpec | null; loIndex: number; p: number };
  /**
   * The hero → line-up flight completes the hero's turn, always forward (the home page). False: the
   * flight just takes the short way to the landing pose (a case study, whose opening doesn't turn).
   */
  flightTurn?: boolean;
  /**
   * Framing on top of the box, like a camera move: an offset (fractions of the box's height, y up) and a
   * zoom. The case study's walkthrough frames each flow differently; the entrance rises in with it.
   */
  shot?: () => { x: number; y: number; zoom: number };
  /** A glint running across the glass, 0 → 1 (below 0: none). */
  sheen?: () => number;
  /** A halo and a pool of light around the phone, tinted by what its screen shows (the case studies). */
  glow?: boolean;
  /** How visible the whole stage is, 0…1, while this anchor leads (an entrance fading in). */
  fade?: () => number;
  screen: ScreenSpec;
  accent: string;
}

export interface ScreenSpec {
  key: string;
  poster?: string;
  video?: string;
  /** A live screen from the app itself, drawn on the 3D phone instead of the poster/video. */
  scene?: 'ariane-welcome';
  /** The recording's status bar was already cleaned out of the file; only the clean glyphs are drawn. */
  barCleaned?: boolean;
  /** The recording's bar was cropped off (the app starts at the very top): it's moved down beneath a clean one. */
  barInset?: boolean;
  monogram: string;
  accent: string;
  accentDeep: string;
}

export const anchors = new Map<string, Anchor>();

/**
 * Which screen the main phone is actually showing right now (its key), or null while it shows none of
 * its own. The stage stays mounted from page to page, so after a change of page the phone still shows
 * the last page's screen until the new one has loaded: an entrance waits for its own key.
 */
export const screenStatus: { key: string | null } = { key: null };

export function setAnchor(id: string, anchor: Anchor | null) {
  if (anchor) anchors.set(id, anchor);
  else anchors.delete(id);
}

/** Update what an anchor's phone shows without re-registering it. */
export function setAnchorScreen(id: string, screen: ScreenSpec, accent: string) {
  const a = anchors.get(id);
  if (a) {
    a.screen = screen;
    a.accent = accent;
  }
}

/** Each video's first-frame poster, written next to it by the compression script. */
export function posterFor(video?: string) {
  const m = video?.match(/^\/videos\/(.+)\.mp4$/);
  return m ? `/videos/posters/${m[1]}.jpg` : undefined;
}

/** The hero's screen for a product: its looping clip (or live scene). */
export function heroScreenFor(product: ShowcaseProduct): ScreenSpec {
  return specFor(product, `${product.id}:hero`, product.hero);
}

/** A line-up phone's screen: the product's screenshot `index` (or live scene). */
export function screenFor(product: ShowcaseProduct, index = 0): ScreenSpec {
  return specFor(product, `${product.id}:${index}`, product.screens[index]);
}

function specFor(product: ShowcaseProduct, key: string, s: ShowcaseProduct['hero']): ScreenSpec {
  return {
    key,
    scene: s.scene,
    barCleaned: s.barCleaned,
    video: s.video,
    poster: s.video ? posterFor(s.video) ?? s.image : s.image,
    monogram: product.monogram,
    accent: product.accent,
    accentDeep: product.accentDeep
  };
}

/** Frame finishes. `color` is the side frame; every other tinted part keeps its brightness relative to it. */
export const FINISHES = [
  { id: 'burgundy', name: 'Burgundy', color: null as string | null, swatch: '#5a1f2c' },
  { id: 'midnight', name: 'Midnight', color: '#1d2435', swatch: '#222a3d' },
  { id: 'silver', name: 'Silver', color: '#b9bcc2', swatch: '#cfd2d7' },
  { id: 'sage', name: 'Sage', color: '#6f7d68', swatch: '#7c8a74' },
  { id: 'desert', name: 'Desert', color: '#a08268', swatch: '#b39479' }
] as const;

export type FinishId = (typeof FINISHES)[number]['id'];

// Small reactive values the DOM needs to read (finish swatches, preloader).
type State = { finish: FinishId; modelReady: boolean; webgl: boolean };
function detectWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

let state: State = { finish: 'burgundy', modelReady: false, webgl: detectWebGL() };
const listeners = new Set<() => void>();

export function setPhoneState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function usePhoneState<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => select(state)
  );
}

export function getPhoneState() {
  return state;
}

/**
 * Glide the page to a product's place in the line-up. The showcase installs the handler, since it
 * knows where each product sits; the hero (clicking the phone) and the rail call it.
 */
type Jump = (index: number, opts?: { immediate?: boolean }) => void;
let jumpHandler: Jump | null = null;

export function setJumpHandler(fn: Jump | null) {
  jumpHandler = fn;
}

/** False if the line-up isn't there (yet) to jump in. `immediate`: be there at once, no glide. */
export function jumpToProduct(index: number, opts?: { immediate?: boolean }) {
  if (!jumpHandler) return false;
  jumpHandler(index, opts);
  return true;
}

export { PRODUCTS };
