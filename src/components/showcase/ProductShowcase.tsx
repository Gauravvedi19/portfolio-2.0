import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  transform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from 'motion/react';
import { ArrowUpRight, Hand } from 'lucide-react';
import { Device } from './Device';
import { usePointer } from './usePointer';
import { PRODUCTS, type ShowcaseProduct } from '../../showcase/products';
import { getLenis, scrollToTarget } from '../../lib/scroll';
import { anchors, screenFor, setAnchor, setJumpHandler, usePhoneState } from './phoneStore';
import { setBackdropSource } from './backdrop';
import { TransitionLink } from '../PageTransition';
import { caseStudyDest } from '../destinations';

/** Slow out of rest, slow into arrival: a glide rather than a jump. */
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The line-up's pacing, in screens of scroll. Each product's stretch is PER_PRODUCT screens; the turn
 * into the next takes HANDOVER of it either side of the boundary (2 × 0.345 × 1.45 ≈ 1 screen), leaving
 * a still moment of ≈ 0.45 screens between turns — enough that two turns never run together.
 * TRIM (in products) is cut from the very start and end, where there's no turn to come or go to: the
 * first and last products otherwise sat still for nearly a screen.
 */
const PER_PRODUCT = 1.45;
const HANDOVER = 0.345;
const TRIM = 0.3;


function StatusPill({ status, accent, href }: { status: ShowcaseProduct['status']; accent: string; href?: string }) {
  const className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] border';
  const style = { color: accent, borderColor: `${accent}40`, background: `${accent}12` };
  const inner = (
    <>
      <span className={`w-1.5 h-1.5 rounded-full ${status.tone !== 'building' ? 'animate-pulse' : ''}`} style={{ background: accent }} />
      {status.label}
      {href && <ArrowUpRight className="w-3 h-3" />}
    </>
  );
  // A store, TestFlight or the live site: the pill itself is the way in.
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} transition-colors hover:brightness-125`} style={style}>{inner}</a>
  ) : (
    <span className={className} style={style}>{inner}</span>
  );
}

/** The carousel: three phones on a ring, 120° apart, seen from the front. */
const RING = {
  /** How far out a side phone stands, as a share of a phone's width (it sits at ±120°). */
  radius: 0.81,
  /** Each phone faces a little outward, this many degrees per 120° round the ring. */
  face: 22,
  /** World units toward the camera at the front (and away, at the back). */
  depth: 0.45,
  /** A phone's size at the back of the ring, relative to the front. */
  backScale: 0.74
};

/**
 * The deck: where the side phones gather behind the front one at a hand-over between products, like
 * cards under the top card. Set far enough back that the front phone's full turn sweeps clear of them,
 * with just their edges peeking out either side.
 */
const DECK = {
  /** How much of a side phone's ring offset it keeps in the stack (its edge peeking out). */
  peek: 0.14,
  /** Its size in the stack, relative to the front phone. */
  scale: 0.9,
  /** How far behind the front phone it sits (world units); the second one a step further back. */
  depth: 0.95,
  step: 0.22,
  /** How much of its outward angle it keeps in the stack. */
  face: 0.3,
  /** Screen brightness in the stack: near-black, so the cards' screens change unseen at the hand-over. */
  dim: 0.12,
  /** The second side phone follows the first by this much of the reveal: follow-through. */
  lag: 0.2,
  /** Overshoot as a phone deals out of the deck (back-out easing). */
  overshoot: 1.25
};
/** A tap's turn of the ring. */
const SHIFT_S = 1.05;

/** Where screen `i` stands on the ring when the ring is turned to `pos` (in screens). */
function ringAt(i: number, pos: number) {
  let rel = (i - pos) % 3;
  if (rel > 1.5) rel -= 3;
  if (rel < -1.5) rel += 3;
  const theta = (rel * 2 * Math.PI) / 3;
  const front = (Math.cos(theta) + 1) / 2; // 1 at the front, 0 at the back
  return {
    x: -Math.sin(theta) * RING.radius,
    rotateY: (rel * RING.face),
    front,
    scale: RING.backScale + (1 - RING.backScale) * front
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Back-out easing: runs a little past 1 and settles — the deal's overshoot. */
const backOut = (t: number, s = DECK.overshoot) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;

/**
 * Where screen `i` stands: on the ring turned to `pos`, blended toward the deck behind the front phone
 * as the fan's reveal `r` falls (1 out, 0 gathered). The front phone stays put; the side phones gather
 * in, the one on the right a beat after the one on the left (and dealing out, a beat after it too).
 */
function deckAt(i: number, pos: number, r: number) {
  const at = ringAt(i, pos);
  // How much of a side phone this is (0 the front phone, 1 a side one; mid-turn of the ring, between).
  const side = Math.min(1, (1 - at.front) * 1.6);
  const second = at.x > 0 ? 1 : 0;
  const lag = DECK.lag * second;
  const ri = clamp01((r - lag) / (1 - lag));
  // Out of the deck with a touch of overshoot sideways; everything else settles without it.
  const outX = 1 - side * (1 - backOut(ri));
  const out = 1 - side * (1 - smooth(ri));
  const ringDepth = (at.front - 0.5) * 2 * RING.depth;
  return {
    front: at.front,
    x: at.x * lerp(DECK.peek, 1, outX),
    rotateY: at.rotateY * lerp(DECK.face, 1, out),
    scale: lerp(DECK.scale, at.scale, out),
    depth: lerp(-(DECK.depth + DECK.step * second), ringDepth, out),
    dim: lerp(DECK.dim, 0.4 + 0.6 * at.front, out)
  };
}

/**
 * The side phones deal out of the deck as the line-up lands (`entry`) and gather back into it for each
 * change of product (`open`: 1 → 0 at the hand-over → 1). 0 gathered, 1 out.
 */
function useReveal(entry: MotionValue<number>, open: MotionValue<number>) {
  return useTransform([entry, open], ([v, o]: number[]) =>
    // They deal out only once the travelling phone is down, not while it's still in flight.
    Math.min(transform(v, [0.9, 1], [0, 1]), o));
}

/** One phone of the fan: an invisible tap target the 3D phone is drawn into (or, without WebGL, a flat phone). */
/**
 * 0 → 1 as the travelling phone lands in the line-up: the other two phones rise out of the dark behind
 * it — from deep and small and black, forward into the deck — rather than appearing from nowhere.
 */
function usePresence(entry: MotionValue<number>) {
  // While the travelling phone makes its final approach, so they rise behind the spot it lands on.
  return useTransform(entry, (v) => smooth(clamp01((v - 0.8) / 0.14)));
}
const EMERGE = { scale: 0.35, depth: 1.6 };

function FanPhone({ index, screenIndex, pos, reveal, presence, product, isFront, webgl, onTap, setBox }: {
  /** Which phone of the fan (fixed for the line-up). */
  index: number;
  /** How far the side phones have emerged as the line-up arrives (phone 0 is always present). */
  presence: MotionValue<number>;
  /** Which of the product's screenshots it shows. */
  screenIndex: number;
  pos: MotionValue<number>;
  reveal: MotionValue<number>;
  product: ShowcaseProduct;
  isFront: boolean;
  webgl: boolean;
  onTap: () => void;
  setBox: (el: HTMLDivElement | null) => void;
}) {
  const screen = product.screens[screenIndex];
  // Where it stands this frame: on the ring, or gathered into the deck behind the front phone.
  const x = useTransform([pos, reveal], ([p, r]: number[]) => `${deckAt(index, p, r).x * 100}%`);
  const rotateY = useTransform([pos, reveal], ([p, r]: number[]) => deckAt(index, p, r).rotateY);
  const scale = useTransform([pos, reveal, presence], ([p, r, e]: number[]) =>
    deckAt(index, p, r).scale * (index === 0 ? 1 : lerp(EMERGE.scale, 1, e)));
  const zIndex = useTransform([pos, reveal], ([p, r]: number[]) => Math.round((deckAt(index, p, r).depth + 2) * 10));
  const brightness = useTransform([pos, reveal], ([p, r]: number[]) => `brightness(${deckAt(index, p, r).dim})`);
  const flatOpacity = useTransform(reveal, () => 1);
  return (
    <motion.button
      type="button"
      aria-label={isFront ? `${product.name} screen` : `Bring ${product.name} screen ${screenIndex + 1} forward`}
      onClick={onTap}
      style={{ x, rotateY, scale, zIndex, pointerEvents: isFront ? 'none' : 'auto' }}
      className="absolute h-[min(62svh,640px)] max-md:h-[40svh] aspect-[1/2.16] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-[2rem]"
    >
      {/* The 3D phone is drawn over this box by the page-wide stage; flat only without WebGL */}
      <div ref={setBox} className="h-full w-full">
        {!webgl && (
          <motion.div style={{ opacity: flatOpacity, filter: brightness }} className="h-full">
            <Device
              className="h-full"
              active={isFront}
              glow={product.accent}
              image={screen.image}
              monogram={product.monogram}
              accent={product.accent}
              accentDeep={product.accentDeep}
            />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/**
 * The three-phone fan: three real iPhones on a carousel ring. Tap a side phone and the ring turns it to
 * the front — the others swing round, the far one passing behind — all of them 3D, in true depth, so
 * nothing flat ever hands over to a 3D phone. Drag sideways to swing the whole fan.
 *
 * One fan for the whole line-up: the same three phones stay on stage from product to product, and at
 * each hand-over's half-turn they only take on the next product's screenshots — its first on whichever
 * phone is in front, the others round the ring. So the phone in front turns in one unbroken motion.
 * Phone 0 is the page's travelling iPhone (it flies in from the hero); the other two are satellites.
 */
const mod3 = (v: number) => ((v % 3) + 3) % 3;
function PhoneFan({ product, sway, section, entry, turn, open }: {
  product: ShowcaseProduct;
  sway: MotionValue<number>;
  section: React.RefObject<HTMLElement | null>;
  entry: MotionValue<number>;
  /** 0 → 1 across a hand-over between products (0 away from one): one full turn of the 3D phone. */
  turn: MotionValue<number>;
  /** How far out the side phones are: 1 settled, 0 tucked behind the phone at the hand-over. */
  open: MotionValue<number>;
}) {
  const [focus, setFocus] = useState(0);
  const webgl = usePhoneState((s) => s.webgl);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const { x: px, y: py } = usePointer();
  const drag = useMotionValue(0);
  const dragSpring = useSpring(drag, { stiffness: 120, damping: 20 });
  const start = useRef<{ x: number; base: number } | null>(null);
  const moved = useRef(false);
  /** The ring's turn, in screens: screen `pos` stands at the front. */
  const pos = useMotionValue(0);
  const reveal = useReveal(entry, open);
  const presence = usePresence(entry);

  /**
   * Which phone shows the product's first screenshot: the one in front when the product arrived. Worked
   * out in the render where the product changes, so the screens and the ring never disagree for a frame.
   */
  const arrived = useRef<{ id: string; base: number } | null>(null);
  if (arrived.current?.id !== product.id) {
    const base = mod3(Math.round(pos.get()));
    arrived.current = { id: product.id, base };
  }
  const base = arrived.current.base;
  const screenOf = (i: number) => mod3(i - base);

  /** Turn the ring the short way round to bring phone `i` to the front. */
  const focusRef = useRef(0);
  const bringForward = (i: number, duration = SHIFT_S) => {
    if (i === focusRef.current) return;
    focusRef.current = i;
    setFocus(i);
    const from = pos.get();
    let delta = (i - from) % 3;
    if (delta > 1.5) delta -= 3;
    if (delta < -1.5) delta += 3;
    animate(pos, from + delta, { duration, ease: [0.45, 0, 0.2, 1] });
  };

  // Heading back up into the hero, the travelling phone (phone 0) returns to the front to fly there.
  useMotionValueEvent(entry, 'change', (v) => {
    if (v < 0.97 && focusRef.current !== 0) bringForward(0, 0.6);
  });

  const rotateY = useTransform([px, sway, dragSpring], ([p, s, d]: number[]) => p * 10 + s + d);
  const rotateX = useTransform(py, (v) => 6 - v * 7);
  // The hand-over swells the fan a touch toward you, peaking as the phone's back is turned.
  const swell = useTransform(turn, (t) => 1 + Math.sin(Math.PI * t) * 0.05);

  // Register the three phones with the 3D stage, before the browser paints the fan (as a passive effect
  // it ran after the paint, and for that frame the phone had no slot on screen — it vanished mid-switch).
  useLayoutEffect(() => {
    if (!webgl) return;
    const first = boxes.current[0];
    // On first mount the section's ref isn't attached yet, so find the section from the box itself.
    const sectionEl = section.current ?? first?.closest('section') ?? null;
    if (!sectionEl) return;
    const rad = Math.PI / 180;
    const ids: string[] = [];
    product.screens.forEach((_, i) => {
      const box = boxes.current[i];
      if (!box) return;
      const id = i === 0 ? 'stage' : `stage:${i}`;
      ids.push(id);
      const at = () => deckAt(i, pos.get(), reveal.get());
      setAnchor(id, {
        box,
        section: sectionEl,
        accent: product.accent,
        screen: screenFor(product, screenOf(i)),
        satellite: i !== 0,
        // Follows the scroll closely: the scroll is smoothed already, and more smoothing here lagged.
        follow: 18,
        // The fan's lean plus the phone's own angle on the ring; the travelling phone also makes one full
        // turn across each hand-over between products, banking into it like the flight from the hero.
        // Whichever phone stands in front makes the hand-over turn (the ones in the deck don't). At the
        // half-turn its back is to you, and the next product's fan takes over in that frame, its own
        // front phone already turned the same way: the backs look alike, so the change can't be seen.
        pose: () => {
          const a = at();
          const t = turn.get() * clamp01((a.front - 0.5) * 2);
          return {
            x: -rotateX.get() * rad,
            y: (rotateY.get() + a.rotateY) * rad + t * Math.PI * 2,
            z: Math.sin(Math.PI * t) * 0.28
          };
        },
        // On the ring, or in the deck behind the front phone; as the line-up arrives, the side phones
        // come forward out of the dark behind the landing phone.
        depth: () => at().depth - (i === 0 ? 0 : (1 - presence.get()) * EMERGE.depth),
        dim: () => at().dim * (i === 0 ? 1 : presence.get()),
        hidden: i === 0 ? undefined : () => presence.get() < 0.01
      });
    });
    // An outgoing fan must not unregister the one that replaced it.
    const mine = ids.map((id) => [id, anchors.get(id)?.box] as const);
    return () => mine.forEach(([id, box]) => { if (anchors.get(id)?.box === box) setAnchor(id, null); });
  }, [webgl, product, base, section, rotateX, rotateY, turn, pos, reveal, entry, presence]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, base: drag.get() };
    moved.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) moved.current = true;
    drag.set(Math.max(-55, Math.min(55, start.current.base + dx * 0.25)));
  };
  const release = () => {
    if (!start.current) return;
    start.current = null;
    animate(drag, 0, { type: 'spring', stiffness: 90, damping: 14 });
  };

  return (
    <div
      className="relative w-full h-full [perspective:1600px] touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {/* Passes taps through to the phones (this plane sits in front of them in 3D) */}
      <motion.div style={{ rotateY, rotateX, scale: swell }} className="absolute inset-0 [transform-style:preserve-3d] flex items-center justify-center pointer-events-none">
        {product.screens.map((_, i) => (
          <FanPhone
            key={i}
            index={i}
            screenIndex={screenOf(i)}
            pos={pos}
            reveal={reveal}
            presence={presence}
            product={product}
            isFront={i === focus}
            webgl={webgl}
            onTap={() => { if (!moved.current) bringForward(i); }}
            setBox={(el) => { boxes.current[i] = el; }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function ProductShowcase() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const n = PRODUCTS.length;
  /** Scroll progress (0…1) → place in products (0…n), with TRIM cut from each end. And back. */
  const toS = (v: number) => TRIM + v * (n - 2 * TRIM);
  const fromS = (s: number) => (s - TRIM) / (n - 2 * TRIM);
  const product = PRODUCTS[index];

  // While gliding to a product, the stage holds that product instead of flicking through the ones it passes.
  const gliding = useRef(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // 0 → 1 as the line-up scrolls in from below: the same stretch the 3D phone flies across.
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  // Opacity through a function, so motion keeps it off its scroll timeline (see Hero).
  const storyOpacity = useTransform(entry, (v) => transform(v, [0.45, 0.95], [0, 1]));
  const storyY = useTransform(entry, [0.45, 1], [60, 0]);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (gliding.current) return;
    const next = Math.min(n - 1, Math.max(0, Math.floor(toS(v))));
    if (next !== index) setIndex(next);
  });

  /**
   * The hand-over between two products, tied to the scroll like the flight from the hero: 0 → 1 across
   * the last HANDOVER of one product's stretch and the first of the next's (0 anywhere else). The 3D
   * phone turns once across it, linearly with the scroll; the product changes at the half-turn, with its
   * back to you. Skipped while gliding, so a long glide isn't a string of spins.
   */
  const turn = useTransform(scrollYProgress, (v) => {
    if (gliding.current || reduce) return 0;
    const s = toS(v);
    const k = Math.round(s);
    if (k <= 0 || k >= n || Math.abs(s - k) >= HANDOVER) return 0;
    return (s - k + HANDOVER) / (2 * HANDOVER);
  });
  /** 1 settled, 0 at the half-turn: the side phones tuck in, and the story and name fade, around it. */
  const open = useTransform(turn, (t) => {
    if (t === 0) return 1;
    const x = Math.abs(1 - 2 * t);
    return x * x * (3 - 2 * x);
  });
  /** The outgoing product leaves upward, the next one rises in from below. */
  const handoverY = useTransform(turn, (t) => (t === 0 ? 0 : t < 0.5 ? -t * 56 : (1 - t) * 56));
  const storyFade = useTransform([storyOpacity, open], ([a, b]: number[]) => a * b);
  const storyShift = useTransform([storyY, handoverY], ([a, b]: number[]) => a + b);
  const nameShift = useTransform(handoverY, (y) => y * 1.6);

  // Within each product's stretch of scroll, the fan swings slowly from one side to the other.
  // Zero at both ends of the stretch: it used to run from +12° to −12° and jump back at every hand-over,
  // and its spring swung that 24° back in the middle of the turn — an extra rotation on top of it.
  const swayRaw = useTransform(scrollYProgress, (v) => (reduce ? 0 : Math.sin((((toS(v) % 1) + 1) % 1) * Math.PI * 2) * -7));
  const sway = useSpring(swayRaw, { stiffness: 50, damping: 20 });
  const wordX = useTransform(scrollYProgress, (v) => `${(toS(v) % 1) * -14}%`);
  // The page's silk takes each product's colours, melting into the next across the hand-over in step
  // with the phone's turn; from halfway in, until halfway out (then it settles to neutral).
  useEffect(() => {
    const ease = (x: number) => x * x * (3 - 2 * x);
    setBackdropSource('lineup', () => {
      const r = ref.current?.getBoundingClientRect();
      const h = window.innerHeight;
      if (!r || r.top > h * 0.5) return undefined;
      if (r.bottom < h * 0.5) return null;
      const s = toS(scrollYProgress.get());
      const k = Math.round(s);
      if (k > 0 && k < n && Math.abs(s - k) < HANDOVER) return k - 1 + ease((s - k + HANDOVER) / (2 * HANDOVER));
      return Math.min(n - 1, Math.max(0, Math.floor(s)));
    });
    return () => setBackdropSource('lineup', null);
  }, [scrollYProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /**
   * One unbroken glide to product `i`: ease in, cruise, ease out, taking longer the further it goes,
   * with the wheel locked so it can't stutter. The 3D phone rides along, from wherever it was.
   * `immediate` puts the page there at once (arriving back from that product's case study).
   */
  const goTo = (i: number, opts?: { immediate?: boolean }) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    // The middle of the product's calm stretch, between hand-overs: the phone settled, facing you.
    const target = top + range * fromS(i + 0.5);
    const screens = Math.abs(target - window.scrollY) / window.innerHeight;
    const lenis = getLenis();
    setIndex(i);
    if (opts?.immediate) {
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else window.scrollTo(0, target);
      return;
    }
    gliding.current = true;
    const land = () => { gliding.current = false; };
    if (lenis && !reduce) {
      lenis.scrollTo(target, {
        duration: Math.min(2.6, 1.2 + screens * 0.16),
        easing: easeInOutQuart,
        lock: true,
        force: true,
        onComplete: land
      });
    } else {
      scrollToTarget(target, { immediate: !!reduce });
      window.setTimeout(land, reduce ? 50 : 1500);
    }
  };

  useEffect(() => {
    setJumpHandler(goTo);
    return () => setJumpHandler(null);
  });

  return (
    <section ref={ref} id="work" className="relative" style={{ height: `${(n - 2 * TRIM) * PER_PRODUCT * 100 + 100}vh` }}>
      {/* PER_PRODUCT screens of scroll per product: a still moment, and the full-length turn to the next */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The stage light is the page's silk backdrop (HomeBackdrop), turning to each product's colours */}

        {/* Giant name in the back, drifting as you scroll and handing over with the phone */}
        <motion.div
          key={product.id}
          aria-hidden
          style={{ opacity: open, y: nameShift }}
          className="absolute inset-x-0 bottom-[4%] pointer-events-none select-none"
        >
          <motion.div
            style={{ x: wordX, WebkitTextStroke: `1px ${product.accent}22` }}
            className="whitespace-nowrap font-display italic leading-none text-transparent text-[26vw] md:text-[19vw] pl-[4vw]"
          >
            {product.name.replace('®', '')}
          </motion.div>
        </motion.div>

        <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-10 pt-24 pb-10 md:py-0 grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-4 md:gap-10">
          {/* Story: rises in as the phone lands, and hands over with it from one product to the next */}
          <motion.div style={{ opacity: storyFade, y: storyShift }}>
            <div key={product.id} className="relative z-10">
              {[
                <div key="meta" className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                  <span className="font-mono text-[11px] text-white/40 tabular-nums">{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45">{product.category}</span>
                </div>,
                <h2 key="name" className="font-display text-5xl sm:text-6xl lg:text-[88px] leading-[0.9] tracking-[-0.02em] text-white">{product.name}</h2>,
                <p key="line" className="mt-4 md:mt-6 font-display italic text-xl sm:text-2xl lg:text-3xl text-white/75 leading-snug max-w-lg">“{product.line}”</p>,
                <p key="summary" className="hidden md:block mt-5 text-white/50 leading-relaxed max-w-md">{product.summary}</p>,
                <div key="specs" className="mt-5 md:mt-8 grid grid-cols-3 gap-3 max-w-md">
                  {product.specs.map((s) => (
                    <div key={s.label} className="border-t border-white/10 pt-3">
                      <div className="font-display text-2xl sm:text-3xl" style={{ color: product.accent }}>{s.value}</div>
                      <div className="mt-1 text-[11px] leading-snug text-white/45">{s.label}</div>
                    </div>
                  ))}
                </div>,
                <div key="stack" className="hidden md:flex flex-wrap gap-2 mt-6">
                  {product.stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-[11px] font-mono text-white/50 bg-white/[0.03] border border-white/[0.08]">{t}</span>
                  ))}
                </div>,
                <div key="cta" className="mt-5 md:mt-8 flex flex-wrap items-center gap-4">
                  <TransitionLink
                    dest={caseStudyDest(product)}
                    className="group inline-flex items-center gap-2 pl-5 pr-4 py-2.5 md:py-3 rounded-full text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
                    style={{ background: product.accent }}
                  >
                    Open case study
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </TransitionLink>
                  <StatusPill status={product.status} accent={product.accent} href={product.statusHref} />
                </div>
              ]}
            </div>
          </motion.div>

          {/* Devices: a new fan per product, mounted at the half-turn with its side phones tucked in */}
          <div className="relative h-full min-h-0 md:h-[80svh]">
            <div className="absolute inset-0">
              <PhoneFan product={product} sway={sway} section={ref} entry={entry} turn={turn} open={open} />
            </div>
            <p className="absolute bottom-0 md:bottom-6 inset-x-0 hidden sm:flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 pointer-events-none">
              <Hand className="w-3.5 h-3.5" /> Drag to turn · tap a phone to bring it forward
            </p>
          </div>
        </div>

        {/* Product rail */}
        <nav aria-label="Products" className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-3 z-20">
          {PRODUCTS.map((p, i) => (
            <button key={p.id} onClick={() => goTo(i)} className="group flex items-center gap-3">
              <span className={`text-[11px] font-mono transition-all duration-500 ${i === index ? 'text-white opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'}`}>{p.name}</span>
              <span className="h-px transition-all duration-500" style={{ width: i === index ? 36 : 14, background: i === index ? p.accent : 'rgba(255,255,255,0.3)' }} />
            </button>
          ))}
        </nav>
        <div className="absolute lg:hidden bottom-4 inset-x-6 flex gap-1.5 z-20">
          {PRODUCTS.map((p, i) => (
            <button key={p.id} aria-label={p.name} onClick={() => goTo(i)} className="flex-1 h-1 rounded-full transition-colors duration-500" style={{ background: i === index ? p.accent : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <motion.div aria-hidden className="absolute top-0 left-0 h-px hidden lg:block" style={{ width: progressWidth, background: product.accent }} />
      </div>
    </section>
  );
}
