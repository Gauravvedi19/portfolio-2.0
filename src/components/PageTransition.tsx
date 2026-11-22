import React, { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react';

/**
 * Moving between the home page and a case study, zooming through a mask: from the point you clicked, a
 * circle in the destination's colours grows to fill the screen, its name settling in at the centre; the
 * page changes beneath it, out of sight; and once the new page is ready — its phone's screen loaded, or
 * its scroll in place — an opening grows from the centre with a soft edge, widening past the corners,
 * while the name swells and fades as you pass through it. (The page itself isn't scaled: transforming
 * it would carry off the fixed 3D phone and backdrops with it.) It replaced the browser's view
 * transition, which snapshotted the page and flickered with the 3D canvas, and let the home page show a
 * frame at the wrong scroll on the way back.
 */

export interface Destination {
  to: string;
  state?: unknown;
  /** Shown on the mask as it passes; none, for a plain iris of colour. */
  label?: string;
  /**
   * Instead of a label, an index of names (the line-up's), gliding until `active` — where you're going
   * back to — settles in the middle, lit in its colour, the rest dim around it.
   */
  index?: { items: { label: string; accent: string }[]; active: number };
  sub?: string;
  accent?: string;
  deep?: string;
  /** The new page is ready to be seen (checked each frame, after a short minimum hold). */
  ready?: () => boolean;
}

type Phase = 'idle' | 'cover' | 'hold' | 'reveal';
interface State { phase: Phase; dest: Destination | null; origin: { x: number; y: number } }
let current: State = { phase: 'idle', dest: null, origin: { x: 0, y: 0 } };
const listeners = new Set<() => void>();
const set = (next: typeof current) => {
  current = next;
  listeners.forEach((l) => l());
};

/** True while the curtain hides the page: an entrance beneath it waits to play until it lifts. */
export const transitionStatus = { covered: false };

/** `origin`: where the mask grows from (the click); the middle of the screen if not given. */
export function startTransition(dest: Destination, origin?: { x: number; y: number }) {
  if (current.phase !== 'idle') return;
  set({ phase: 'cover', dest, origin: origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
}

const MIN_HOLD = 380;
const MAX_HOLD = 2200;
/** Slow out of the click, fast through the middle, soft onto the edges. */
const GROW = [0.76, 0, 0.24, 1] as const;
const OPEN = [0.65, 0, 0.35, 1] as const;
/** The soft edge of the opening, px. */
const FEATHER = 140;

/** The curtain itself; mounted once, inside the router. */
export function PageTransition() {
  const { phase, dest, origin } = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => current
  );
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const held = useRef(0);

  // The growing circle (from the click) and the opening (from the centre), in px. Both edges are
  // feathered, and a band of blur runs with each edge over the page beneath — motion blur at the
  // wavefront — so the mask reads as moving light, not a cut-out.
  const radius = useMotionValue(-FEATHER);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const hole = useMotionValue(-FEATHER);
  const fade = useMotionValue(1);
  // The blur band sits squarely on the mask's feathered edge, from the very same values, so the two
  // move as one (offset ahead/behind it, and faded on a timer of its own, it led and then lagged).
  const coverMask = useMotionTemplate`radial-gradient(circle at ${ox}px ${oy}px, black calc(${radius}px - ${FEATHER / 2}px), transparent calc(${radius}px + ${FEATHER / 2}px))`;
  const coverBlur = useMotionTemplate`radial-gradient(circle at ${ox}px ${oy}px, transparent calc(${radius}px - ${FEATHER * 1.5}px), black calc(${radius}px - ${FEATHER / 2}px), black calc(${radius}px + ${FEATHER / 2}px), transparent calc(${radius}px + ${FEATHER * 1.5}px))`;
  const revealMask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${hole}px, black calc(${hole}px + ${FEATHER}px))`;
  const revealBlur = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent calc(${hole}px - ${FEATHER}px), black ${hole}px, black calc(${hole}px + ${FEATHER}px), transparent calc(${hole}px + ${FEATHER * 2}px))`;

  // Before paint, so a new transition never shows a frame of the last one's mask.
  useLayoutEffect(() => {
    const far = Math.hypot(window.innerWidth, window.innerHeight);
    if (phase === 'cover') {
      ox.set(origin.x);
      oy.set(origin.y);
      hole.set(-FEATHER);
      fade.set(reduce ? 0 : 1);
      // Out past the farthest corner from the click, feather and all.
      const r = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y)) + FEATHER;
      radius.set(reduce ? r : -FEATHER);
      const done = () => set({ ...current, phase: 'hold' });
      if (reduce) { animate(fade, 1, { duration: 0.25 }).then(done); return; }
      const a = animate(radius, r, { duration: 0.8, ease: GROW });
      a.then(done);
      return () => a.stop();
    }
    if (phase === 'reveal') {
      const done = () => set({ ...current, phase: 'idle', dest: null });
      if (reduce) { animate(fade, 0, { duration: 0.3 }).then(done); return; }
      // Out until the blur band, too, has passed the corners.
      const a = animate(hole, far / 2 + FEATHER * 2, { duration: 1.05, ease: OPEN });
      a.then(done);
      return () => a.stop();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Covered: change the page beneath, then wait until it's ready to be seen.
  useEffect(() => {
    if (phase !== 'hold' || !dest) return;
    transitionStatus.covered = true;
    navigate(dest.to, { state: dest.state });
    held.current = performance.now();
    let raf = 0;
    const check = () => {
      const t = performance.now() - held.current;
      if ((t >= MIN_HOLD && (dest.ready?.() ?? true)) || t >= MAX_HOLD) {
        transitionStatus.covered = false;
        set({ ...current, phase: 'reveal' });
        return;
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [phase, dest, navigate]);

  if (phase === 'idle' || !dest) return null;
  const deep = dest.deep ?? '#0b0b0e';
  const accent = dest.accent ?? '#ffffff';
  const revealing = phase === 'reveal';
  // While covering, the circle's mask; once covered and revealing, the opening's.
  const mask = revealing ? revealMask : coverMask;
  const band = revealing ? revealBlur : coverBlur;

  return (
    <>
      {/* Motion blur: the page beneath, blurred in a band that travels with the mask's edge */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[149] pointer-events-none"
          style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', WebkitMaskImage: band, maskImage: band }}
        />
      )}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[150]"
        style={{ WebkitMaskImage: mask, maskImage: mask, opacity: fade }}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 52%, ${deep}, #070709 72%)` }} />
        {/* The name (where there is one): settles in, sharpening, as the circle fills; then swells, blurs
            and fades as you pass through it */}
        {dest.label && <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
          animate={revealing ? { opacity: 0, scale: 1.7, filter: 'blur(14px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={revealing ? { duration: 0.8, ease: [0.5, 0, 0.75, 0] } : { duration: 0.8, delay: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {dest.sub && <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/45">{dest.sub}</span>}
          <span className="font-display italic leading-none text-6xl sm:text-8xl" style={{ color: accent }}>{dest.label}</span>
        </motion.div>}
        {dest.index && <IndexReel index={dest.index} revealing={revealing} reduce={reduce} />}
      </motion.div>
    </>
  );
}

/** Each name's line, in em of the names' size. */
const ROW = 1.18;

/**
 * Going back to the line-up: its index of names, like the film credits on the home page. The reel
 * glides up from a row below and settles with the product you're returning to in the middle — lit in
 * its colour, its number beside it — the others dimming with distance; then, as the mask opens, it
 * swells, blurs and fades like the label does.
 */
function IndexReel({ index, revealing, reduce }: { index: NonNullable<Destination['index']>; revealing: boolean; reduce: boolean }) {
  const { items, active } = index;
  // Moves the reel so `active` sits on the centre line.
  const centre = (active - (items.length - 1) / 2) * ROW;
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
      animate={revealing ? { opacity: 0, scale: 1.7, filter: 'blur(14px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={revealing ? { duration: 0.8, ease: [0.5, 0, 0.75, 0] } : { duration: 0.6, delay: reduce ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="font-display italic leading-none text-5xl sm:text-7xl"
        initial={{ y: `${-centre + (reduce ? 0 : ROW)}em` }}
        animate={{ y: `${-centre}em` }}
        transition={{ duration: 1.1, delay: reduce ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {items.map((item, i) => {
          const away = Math.abs(i - active);
          return (
            <motion.div
              key={item.label}
              className="flex items-baseline justify-center gap-[0.35em]"
              style={{ height: `${ROW}em` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === active ? 1 : Math.max(0.08, 0.28 - away * 0.08) }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.15 + away * 0.06 }}
            >
              <span className="font-mono not-italic text-[0.16em] tracking-[0.2em] text-white/50 -translate-y-[1.6em]">{String(i + 1).padStart(2, '0')}</span>
              <span style={{ color: i === active ? item.accent : 'rgba(255,255,255,0.9)' }}>{item.label}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/**
 * A link that goes through the curtain. A plain link still (its href works for opening in a new tab,
 * and with modifier keys or a middle click it behaves as one).
 */
export function TransitionLink({ dest, className, style, children }: {
  dest: Destination;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={dest.to}
      className={className}
      style={style}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        // From where you clicked (a keyboard "click" has no position: from the link's middle).
        const r = e.currentTarget.getBoundingClientRect();
        startTransition(dest, e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      {children}
    </a>
  );
}
