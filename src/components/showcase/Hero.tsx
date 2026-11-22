import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
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
import { ArrowDown } from 'lucide-react';
import { Device } from './Device';
import { PRODUCTS } from '../../showcase/products';
import { scrollToTarget } from '../../lib/scroll';
import { FINISHES, heroScreenFor, jumpToProduct, setAnchor, setAnchorScreen, setPhoneState, usePhoneState } from './phoneStore';
import { setBackdropSource } from './backdrop';
/** How long each product holds the screen before the next one comes round. */
const HOLD_MS = 7000;
/** The phone's resting angle in the hero, radians: square on, facing you. */
const REST_Y = 0;

/** The film-credit index of every product. The active one fills its rule as its time runs. */
function LineupIndex({ active, onPick, progress, onHover }: {
  active: number;
  onPick: (i: number) => void;
  progress: MotionValue<number>;
  onHover: (h: boolean) => void;
}) {
  const width = useTransform(progress, (v) => `${v * 100}%`);
  return (
    <ol className="space-y-0.5" onPointerEnter={() => onHover(true)} onPointerLeave={() => onHover(false)}>
      {PRODUCTS.map((p, i) => {
        const on = i === active;
        return (
          <li key={p.id}>
            <button
              onClick={() => onPick(i)}
              aria-current={on}
              className="group relative w-full grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-2.5 text-left"
            >
              <span className="font-mono text-[10px] tabular-nums transition-colors duration-500" style={{ color: on ? p.accent : 'rgba(255,255,255,0.25)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`font-display text-xl leading-none transition-colors duration-500 ${on ? 'text-white' : 'text-white/35 group-hover:text-white/70'}`}>{p.name}</span>
              <span className={`text-[10px] font-mono uppercase tracking-[0.18em] whitespace-nowrap transition-opacity duration-500 ${on ? 'text-white/45 opacity-100' : 'opacity-0'}`}>
                {p.category.split(' · ')[0]}
              </span>
              {/* One rule per row, full width; the active one fills as its time runs */}
              <span className="absolute left-0 right-0 bottom-0 h-px bg-white/[0.07] overflow-hidden">
                {on && <motion.span className="absolute inset-y-0 left-0" style={{ width, background: p.accent }} />}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function FinishPicker() {
  const finish = usePhoneState((s) => s.finish);
  const current = FINISHES.find((f) => f.id === finish)!;
  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 whitespace-nowrap min-w-[9.5rem]">
        Finish — <span className="text-white/70">{current.name}</span>
      </span>
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Phone finish">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            role="radio"
            aria-checked={f.id === finish}
            aria-label={f.name}
            onClick={() => setPhoneState({ finish: f.id })}
            className={`w-4 h-4 rounded-full transition-transform duration-300 hover:scale-110 ring-offset-2 ring-offset-[#070709] ${f.id === finish ? 'ring-1 ring-white/70 scale-110' : 'ring-0'}`}
            style={{ background: `radial-gradient(circle at 35% 30%, ${f.swatch}, ${f.swatch} 45%, #000 140%)` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const webgl = usePhoneState((s) => s.webgl);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [pastIntro, setPastIntro] = useState(false);
  const holdProgress = useMotionValue(0);
  const holdWidth = useTransform(holdProgress, (v) => `${v * 100}%`);
  const pointer = useRef({ x: 0, y: 0 });
  // `active` is the product you've picked; `shown` is the one on stage. They part for half a turn:
  // the phone spins, and everything swaps while its back is to you.
  const [shown, setShown] = useState(0);
  const turn = useMotionValue(0);
  const product = PRODUCTS[shown];

  // The page's silk takes the colours of the product on the phone, while the hero is on screen.
  const shownRef = useRef(shown);
  shownRef.current = shown;
  useEffect(() => {
    setBackdropSource('hero', () => ((ref.current?.getBoundingClientRect().bottom ?? 0) > 0 ? shownRef.current : undefined));
    return () => setBackdropSource('hero', null);
  }, []);

  // Playing with the phone: hover leans it toward the cursor, dragging spins it (radians, with
  // momentum), and a click without a drag glides to that product in the line-up.
  const [onPhone, setOnPhone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const spin = useMotionValue(0);
  const tilt = useMotionValue(0);
  /** Cursor across the phone, -1…1 each way (clamped at the edges, so it keeps meaning outside too). */
  const lean = useRef({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; spin: number; tilt: number; moved: boolean } | null>(null);
  const lift = useSpring(1, { stiffness: 220, damping: 22 });
  /** 0 = following the window loosely, 1 = held by the cursor on the phone. Sprung, so modes blend. */
  const hold = useSpring(0, { stiffness: 140, damping: 22 });
  const insideRef = useRef(false);
  const lastClient = useRef<{ x: number; y: number } | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPastIntro(v > 0.2));

  // Opacity goes through a function so motion keeps it on the JS path: its hardware-accelerated
  // scroll timeline misreads this sticky section's range and leaves the copy half-visible.
  const fade = (input: number[], output: number[]) => (v: number) => transform(v, input, output);
  const copyY = useTransform(scrollYProgress, [0, 0.45], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, fade([0, 0.3], [1, 0]));
  const boxY = useTransform(scrollYProgress, [0, 1], ['0%', '-4%']);
  // The phone's box shrinks a little as the hero scrolls away, and lifts while you're on it.
  const boxScale = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const boxScaleWithLift = useTransform([boxScale, lift], ([a, b]: number[]) => a * b);
  const outroOpacity = useTransform(scrollYProgress, fade([0.45, 0.6, 0.85, 0.98], [0, 1, 1, 0]));
  const outroY = useTransform(scrollYProgress, [0.45, 0.6], [30, 0]);

  /**
   * Is the cursor on the phone, and where? Decided from geometry on every move and scroll, never
   * from enter/leave events: those go missing when the page glides away under a still mouse or a
   * drag's pointer capture ends, which left the phone frozen mid-lean.
   */
  const track = (x: number | null, y: number | null) => {
    const el = box.current;
    let inside = false;
    if (el && x !== null && y !== null) {
      const r = el.getBoundingClientRect();
      lean.current = {
        x: Math.max(-1, Math.min(1, ((x - r.left) / r.width) * 2 - 1)),
        y: Math.max(-1, Math.min(1, ((y - r.top) / r.height) * 2 - 1))
      };
      inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }
    if (drag.current) inside = true; // a drag holds the phone wherever the cursor wanders
    if (inside === insideRef.current) return;
    insideRef.current = inside;
    setOnPhone(inside);
    lift.set(inside ? 1.045 : 1);
    hold.set(inside ? 1 : 0);
  };

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      lastClient.current = { x: e.clientX, y: e.clientY };
      track(e.clientX, e.clientY);
    };
    const onScroll = () => track(lastClient.current?.x ?? null, lastClient.current?.y ?? null);
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return; // still inside the page
      lastClient.current = null;
      track(null, null);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerout', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerout', onOut);
    };
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  // Register where the phone lives in the hero, and the pose it holds there.
  useEffect(() => {
    if (!box.current || !ref.current) return;
    setAnchor('hero', {
      box: box.current,
      section: ref.current,
      accent: PRODUCTS[0].accent,
      screen: heroScreenFor(PRODUCTS[0]),
      pose: (t) => {
        const p = scrollYProgress.get();
        // The scroll turns the phone exactly once between the top of the page and its landing in the
        // line-up, at a constant rate. The hero covers its share of that journey (its scroll range
        // out of range + the one-screen flight); the flight turns the rest at the same rate.
        const section = ref.current;
        const share = section ? Math.max(0, section.offsetHeight - window.innerHeight) / section.offsetHeight : 0.6;
        const k = hold.get();
        const idle = reduce ? 0 : Math.sin(t * 0.6) * 0.07 * (1 - k);
        // Held, it turns to face the cursor across the phone; free, it follows the window gently.
        // One blend between the two, so moving on or off the phone never snaps.
        const lx = lean.current.x * 0.6 * k + pointer.current.x * 0.4 * (1 - k);
        const ly = lean.current.y * 0.4 * k + pointer.current.y * 0.18 * (1 - k);
        return {
          // Dragged spin, one full turn per product change, and the hero's linear share of the scroll turn.
          // The whole journey runs from the resting three-quarter angle to facing you in the line-up
          // (a full turn plus REST); the hero covers exactly its share, so the flight carries on at
          // the very same rate.
          y: REST_Y + idle + lx + spin.get() + turn.get() * Math.PI * 2 + p * share * (Math.PI * 2 - REST_Y),
          x: ly + tilt.get() - p * 0.22,
          // Upright: no roll at rest (the flight banks it on its own, mid-air only).
          z: 0
        };
      }
    });
    return () => setAnchor('hero', null);
  }, [reduce, scrollYProgress, turn, spin, tilt, hold]);

  const FULL = Math.PI * 2;
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, spin: spin.get(), tilt: tilt.get(), moved: false };
    spin.stop();
    tilt.stop();
    track(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) {
      spin.set(d.spin + dx * 0.012);
      tilt.set(Math.max(-0.5, Math.min(0.5, d.tilt + dy * 0.004)));
    }
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!d) return;
    if (!d.moved && e.type === 'pointerup') {
      track(null, null); // the page is about to glide away from under the cursor
      jumpToProduct(shown);
      return;
    }
    setDragging(false);
    // Carry the throw, then always come to rest facing you: a spring to the nearest whole turn,
    // started at the flick's velocity, so it can never stop part-way round. The tilt levels out.
    const velocity = spin.getVelocity();
    const rest = Math.round((spin.get() + velocity * 0.35) / FULL) * FULL;
    animate(spin, rest, { type: 'spring', velocity, stiffness: 60, damping: 16 });
    animate(tilt, 0, { type: 'spring', stiffness: 90, damping: 14 });
    // A mouse may still be over the phone; a finger lifting off never is.
    if (e.pointerType === 'mouse') track(e.clientX, e.clientY);
    else track(null, null);
  };

  // A new pick turns the phone once. `turn` only ever counts up, so the phone never spins back.
  useEffect(() => {
    if (active === shown) return;
    if (reduce) { setShown(active); return; }
    let swapped = false;
    const from = turn.get();
    // Unhurried: a soft start, a long glide through the back, a slow settle on the new screen.
    const controls = animate(turn, Math.floor(from) + 1, {
      duration: 2.4,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => {
        if (!swapped && v % 1 >= 0.5) {
          swapped = true;
          setShown(active);
        }
      },
      onComplete: () => { if (!swapped) setShown(active); }
    });
    return () => controls.stop();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // The product on stage takes the screen and the light.
  useEffect(() => {
    setAnchorScreen('hero', heroScreenFor(product), product.accent);
  }, [product]);

  // Hold each product, then bring the next one round. Paused while you read the index or scroll on.
  const paused = hovering || onPhone || dragging || pastIntro || reduce;
  const heldFor = useRef(active);
  useEffect(() => {
    // A new product always gets its full hold. (Resetting in `pick` alone isn't enough: the previous
    // countdown runs one more frame before this effect stops it, and writes its progress back.)
    if (heldFor.current !== active) {
      heldFor.current = active;
      holdProgress.set(0);
    }
    if (paused) return;
    const controls = animate(holdProgress, 1, {
      duration: (HOLD_MS * (1 - holdProgress.get())) / 1000,
      ease: 'linear',
      onComplete: () => {
        holdProgress.set(0);
        setActive((a) => (a + 1) % PRODUCTS.length);
      }
    });
    return () => controls.stop();
  }, [paused, active, holdProgress]);

  const pick = (i: number) => {
    holdProgress.set(0);
    setActive(i);
  };

  return (
    <section ref={ref} id="home" className="relative h-[210vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* The light is the page's silk backdrop (HomeBackdrop), in the product's colours; here, just a
            horizon line for the phone to stand on */}
        <div aria-hidden className="absolute inset-x-0 top-[78%] h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent max-md:hidden" />

        {/* Masthead: the product's name set huge behind the phone, like a magazine cover */}
        <motion.div style={{ opacity: copyOpacity }} aria-hidden className="absolute inset-x-0 top-[30%] md:top-[34%] -translate-y-1/2 flex justify-center pointer-events-none select-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={product.id} className="flex whitespace-nowrap overflow-hidden pb-[0.06em]">
              {Array.from(product.name.replace('®', '')).map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '105%' }}
                  animate={{ y: '0%', transition: { duration: 0.9, delay: 0.02 * i, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ y: '-105%', transition: { duration: 0.45, delay: 0.012 * i, ease: [0.7, 0, 0.84, 0] } }}
                  className="inline-block font-display italic leading-[0.9] tracking-[-0.03em] text-[19vw] md:text-[14.5vw]"
                  style={{ color: `color-mix(in srgb, ${product.accent} 30%, transparent)` }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* The phone's box: the 3D iPhone is drawn here by the page-wide stage */}
        <motion.div
          ref={box}
          role="button"
          tabIndex={0}
          aria-label={`${product.name} — open in the line-up. Drag to spin.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToProduct(shown); } }}
          style={{ scale: boxScaleWithLift, y: boxY }}
          className="absolute z-10 left-1/2 -translate-x-1/2 aspect-[0.484] top-[9%] h-[44svh] md:top-[11%] md:h-[66svh] touch-pan-y select-none rounded-[3rem] focus-visible:outline-offset-8"
        >
          {!webgl && (
            <Device
              className="h-full [transform:rotateY(-12deg)]"
              monogram={product.monogram}
              accent={product.accent}
              accentDeep={product.accentDeep}
              image={product.hero.image}
              video={product.hero.video}
              playing
            />
          )}
        </motion.div>

        {/* Copy */}
        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-7 sm:pb-12 max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10"
        >
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/45 mb-4"
            >
              Gaurav Vedi — Mobile app developer · Solutions engineer
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              // Sized by width and height both, so on short laptop screens it still clears the phone
              className="font-display text-[42px] md:text-[clamp(44px,min(5.4vw,9svh),84px)] leading-[0.95] tracking-[-0.02em] text-white"
            >
              Five apps. <br />
              <span className="italic text-white/55">One pair of hands.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="hidden md:block mt-6 text-white/50 leading-relaxed max-w-md"
            >
              Designed, engineered and shipped end to end in React Native — from real-time 3D and AR to AI voice agents, payments and live data.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[22rem]"
          >
            <p className="hidden md:block text-[10px] font-mono uppercase tracking-[0.3em] text-white/35 mb-2">Now on screen</p>
            {/* Wide: the full index. Narrow: one line per product, the active one named. */}
            <div className="hidden md:block">
              <LineupIndex active={active} onPick={pick} progress={holdProgress} onHover={setHovering} />
            </div>
            <div className="md:hidden">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-xl text-white">{product.name}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{String(active + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}</span>
              </div>
              <div className="flex gap-1.5">
                {PRODUCTS.map((p, i) => (
                  <button key={p.id} aria-label={p.name} onClick={() => pick(i)} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/10">
                    {i === active && <motion.span className="block h-full" style={{ width: holdWidth, background: p.accent }} />}
                    {i < active && <span className="block h-full w-full bg-white/30" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 md:mt-8 flex items-center justify-between gap-4">
              <FinishPicker />
              <button
                onClick={() => {
                  const work = document.getElementById('work');
                  if (work) scrollToTarget(work);
                }}
                aria-label="See the line-up"
                className="hidden md:flex w-10 h-10 shrink-0 rounded-full border border-white/15 items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Hand-off into the showcase, split either side of the phone as it comes back round */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY }}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-end md:justify-between pb-[12%] md:pb-0 px-6 md:px-[7vw] text-center md:text-left pointer-events-none"
        >
          <div>
            <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white">The line-up.</p>
            <p className="hidden md:block mt-4 text-[10px] font-mono uppercase tracking-[0.35em] text-white/40">Each one from first brief to store</p>
          </div>
          <p className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-white/55 md:text-right">Up close.</p>
          <p className="md:hidden mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Each one from first brief to store</p>
        </motion.div>
      </div>
    </section>
  );
}
