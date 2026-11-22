import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, transform, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import type { ShowcaseProduct } from '../../showcase/products';
import type { CaseStudy, Flow } from '../../showcase/caseStudies';
import { Device } from '../showcase/Device';
import { VideoPlayer } from '../VideoPlayer';
import { usePointer } from '../showcase/usePointer';
import { anchors, setAnchor, usePhoneState } from '../showcase/phoneStore';
import { mediaScreen } from './media';

const EASE = [0.16, 1, 0.3, 1] as const;
/** Each flow's share of the scroll that is hand-over, either side of the boundary (as the line-up's). */
const HANDOVER = 0.32;

type Stage = 'phone' | 'both' | 'desktop';
const stageOf = (f: Flow): Stage => (f.desktop ? (f.mobile ? 'both' : 'desktop') : 'phone');

/**
 * Where the phone and the browser stand for each kind of flow, positioned within the stage (its centre
 * point and size). The phone's box is what the 3D iPhone fills, so moving it moves the phone — centre
 * stage on its own, in front and to the right beside the portal, and stepping back to the corner when
 * the flow is the dashboard alone.
 */
const LAYOUT: Record<Stage, { phone: { left: string; top: string; height: string }; browser: { width: string; top: string; opacity: number; scale: number } }> = {
  phone: { phone: { left: '50%', top: '50%', height: '70svh' }, browser: { width: '74%', top: '54%', opacity: 0, scale: 0.92 } },
  both: { phone: { left: '80%', top: '55%', height: '54svh' }, browser: { width: '78%', top: '46%', opacity: 1, scale: 1 } },
  desktop: { phone: { left: '90%', top: '74%', height: '30svh' }, browser: { width: '94%', top: '46%', opacity: 1, scale: 1 } }
};

/**
 * How the phone is framed for each phone-only flow, in turn — like a camera choosing a new shot per
 * scene, eased across the hand-over: straight on, closer in, a gentle
 * three-quarter turned toward the story, a low angle. Offsets are fractions of the box's height (y up),
 * angles radians; every shot keeps the screen readable. The first flow is always straight on.
 */
interface Shot { x: number; y: number; zoom: number; rx: number; ry: number; rz: number }
const STRAIGHT: Shot = { x: 0, y: 0, zoom: 1, rx: 0, ry: 0, rz: 0 };
const SHOTS: Shot[] = [
  STRAIGHT,
  // Closer, but the whole phone stays in frame (more zoom, or moving it down, cut off its bottom).
  { x: 0, y: 0, zoom: 1.14, rx: 0, ry: 0, rz: 0 },
  { x: 0.03, y: 0, zoom: 0.97, rx: -0.05, ry: -0.18, rz: -0.02 },
  { x: -0.02, y: 0.02, zoom: 1.08, rx: -0.12, ry: 0.06, rz: 0.03 }
];
const shotOf = (f: Flow, i: number) => (stageOf(f) === 'phone' ? SHOTS[i % SHOTS.length] : STRAIGHT);
const mixShot = (a: Shot, b: Shot, t: number): Shot => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  zoom: a.zoom + (b.zoom - a.zoom) * t,
  rx: a.rx + (b.rx - a.rx) * t,
  ry: a.ry + (b.ry - a.ry) * t,
  rz: a.rz + (b.rz - a.rz) * t
});

/** On a phone-width screen the stage is short and narrow: the phone sits smaller, inside the edges. */
const LAYOUT_NARROW: typeof LAYOUT = {
  phone: { phone: { left: '50%', top: '50%', height: '40svh' }, browser: { width: '90%', top: '50%', opacity: 0, scale: 0.92 } },
  both: { phone: { left: '76%', top: '58%', height: '30svh' }, browser: { width: '84%', top: '40%', opacity: 1, scale: 1 } },
  desktop: { phone: { left: '84%', top: '72%', height: '20svh' }, browser: { width: '100%', top: '44%', opacity: 1, scale: 1 } }
};

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useLayoutEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatches(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return matches;
}

const useNarrow = () => useMedia('(max-width: 767px)');

/** Where each callout stands beside the phone: its side and height. */
const CALLOUTS = [
  { side: 'right', top: '22%' },
  { side: 'left', top: '47%' },
  { side: 'right', top: '71%' }
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * One of the flow's highlights, beside the phone: it slides out from the phone's edge, turning flat to
 * you as it comes, and tucks back in at the hand-over. Nothing points into the screen. `settled` drives
 * it (0 tucked in, 1 out); `zoom` is the shot's, undone on the card so its text stays the same size
 * whatever the framing.
 */
function Callout({ product, text, i, settled, zoom }: { product: ShowcaseProduct; text: string; i: number; settled: MotionValue<number>; zoom: MotionValue<number> }) {
  const { side, top } = CALLOUTS[i];
  const dir = side === 'right' ? 1 : -1;
  const c = useTransform(settled, (v) => clamp01((v - i * 0.12) / 0.76));
  const e = useTransform(c, (v) => 1 - Math.pow(1 - v, 3));
  const x = useTransform(e, (v) => `${-dir * (1 - v) * 40}%`);
  const rotateY = useTransform(e, (v) => -dir * (1 - v) * 38);
  const scale = useTransform([e, zoom], ([v, z]: number[]) => (0.8 + 0.2 * v) / z);
  const opacity = useTransform(c, (v) => clamp01((v - 0.15) * 1.8));
  const edge = side === 'right' ? { left: 'calc(100% + 18px)' } : { right: 'calc(100% + 18px)' };

  return (
    <>
      <motion.div
        className="absolute w-max max-w-[168px] flex items-start gap-2 px-3 py-2 rounded-xl bg-[#0c0c10]/70 backdrop-blur-md border border-white/10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)] text-[12px] leading-snug text-white/85"
        style={{ top, ...edge, y: '-50%', x, rotateY, scale, opacity, transformPerspective: 700, originX: side === 'right' ? 0 : 1 }}
      >
        <Check className="w-3.5 h-3.5 mt-px shrink-0" style={{ color: product.accent }} />
        {text}
      </motion.div>
    </>
  );
}

/** "Coming soon" for a recording that hasn't been added yet, in the product's colours. */
function Soon({ product, label }: { product: ShowcaseProduct; label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: `radial-gradient(ellipse at 50% 35%, ${product.accentDeep}, #0a0a0c 70%)` }}>
      <span className="font-display italic text-3xl" style={{ color: product.accent }}>{product.monogram}</span>
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/35">{label}</span>
    </div>
  );
}

/** The admin portal's recording, in a browser window. */
function BrowserWindow({ product, flow }: { product: ShowcaseProduct; flow: Flow }) {
  const src = flow.desktop?.video;
  const still = flow.desktop?.image;
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0f] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 px-4 h-9 border-b border-white/[0.07] bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[10px] font-mono text-white/35 truncate">{product.name.replace('®', '')} · Admin portal</span>
      </div>
      <div className="relative aspect-[16/10] bg-black">
        {src ? (
          <VideoPlayer
            key={src}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            fallback={<Soon product={product} label="Recording coming soon" />}
          />
        ) : still ? (
          <img src={still} alt="" className="absolute inset-0 w-full h-full object-cover object-left-top" />
        ) : (
          <Soon product={product} label="Admin portal" />
        )}
      </div>
    </div>
  );
}

/**
 * The callouts' own layer, over the 3D phone: the pinned stage sits beneath the page-wide canvas (a
 * sticky element is a layer of its own), so they'd slide out from behind the phone rather than lift off
 * its glass. This one stands above the canvas — which lives inside <main> (z-10), so the layer must be
 * above 10 — and follows the phone's box each frame.
 */
function OverPhone({ box, children }: { box: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let raf = 0;
    const follow = () => {
      const b = box.current, l = layer.current;
      if (b && l) {
        const r = b.getBoundingClientRect();
        l.style.transform = `translate(${r.left}px, ${r.top}px)`;
        l.style.width = `${r.width}px`;
        l.style.height = `${r.height}px`;
      }
      raf = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(raf);
  }, [box]);
  return createPortal(
    <div ref={layer} className="fixed left-0 top-0 z-[11] pointer-events-none">{children}</div>,
    document.body
  );
}

/** The flow's story: what it is, its steps, what stands out, and why it matters. */
function FlowStory({ product, flow, index, count, highlights }: { product: ShowcaseProduct; flow: Flow; index: number; count: number; highlights: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em]">
        <span className="tabular-nums text-white/40">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <span style={{ color: product.accent }}>{flow.tag}</span>
      </div>
      <h3 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.02em] text-white">{flow.title}</h3>
      <p className="mt-3 font-display italic text-lg sm:text-xl text-white/65">{flow.summary}</p>
      <p className="hidden sm:block mt-5 text-white/55 leading-relaxed max-w-lg">{flow.desc}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] text-white/70 max-w-lg">
        {flow.steps.map((s, i) => (
          <React.Fragment key={s}>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">{s}</span>
            {i < flow.steps.length - 1 && <ArrowRight className="w-3 h-3 text-white/25" />}
          </React.Fragment>
        ))}
      </div>

      {/* Beside the phone instead, where there's room: they lift off its screen */}
      {highlights && <ul className="hidden md:grid mt-6 grid-cols-2 gap-x-6 gap-y-2 max-w-lg">
        {flow.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-[13px] text-white/60">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: product.accent }} />
            {h}
          </li>
        ))}
      </ul>}

      {flow.why && (
        <p className="hidden lg:block mt-6 text-sm text-white/75 leading-relaxed max-w-lg pl-4 border-l-2" style={{ borderColor: `${product.accent}70` }}>
          {flow.why}
        </p>
      )}
    </div>
  );
}

/**
 * The walkthrough: every flow of the product in turn, pinned, on the same choreography as the home
 * page's line-up — a calm stretch for each flow, then one full turn of the 3D phone tied to the scroll,
 * its screen changing at the half-turn while the story hands over.
 */
export default function CaseWalkthrough({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const ref = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const webgl = usePhoneState((s) => s.webgl);
  const flows = study.flows;
  const n = flows.length;
  const [index, setIndex] = useState(0);
  const flow = flows[index];
  const stage = stageOf(flow);
  const { x: px, y: py } = usePointer();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    if (next !== index) setIndex(next);
  });

  /** 0 → 1 across each hand-over (0 elsewhere): one turn of the phone, linear in the scroll. */
  const turn = useTransform(scrollYProgress, (v) => {
    if (reduce) return 0;
    const s = v * n;
    const k = Math.round(s);
    if (k <= 0 || k >= n || Math.abs(s - k) >= HANDOVER) return 0;
    return (s - k + HANDOVER) / (2 * HANDOVER);
  });
  /** 1 settled, 0 at the half-turn. */
  const open = useTransform(turn, (t) => {
    if (t === 0) return 1;
    const x = Math.abs(1 - 2 * t);
    return x * x * (3 - 2 * x);
  });
  const shift = useTransform(turn, (t) => (t === 0 ? 0 : t < 0.5 ? -t * 50 : (1 - t) * 50));
  const storyOpacity = useTransform([entry, open], ([e, o]: number[]) => transform(e, [0.45, 0.95], [0, 1]) * o);
  const storyY = useTransform([entry, shift], ([e, s]: number[]) => transform(e, [0.45, 1], [50, 0]) + s);
  const progress = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const narrow = useNarrow();
  /** The phone's framing: each flow's shot, eased from one to the next across the hand-over. */
  const shot = useTransform(scrollYProgress, (v): Shot => {
    if (narrow) return STRAIGHT;
    const s = v * n;
    const k = Math.round(s);
    if (!reduce && k > 0 && k < n && Math.abs(s - k) < HANDOVER) {
      const t = (s - k + HANDOVER) / (2 * HANDOVER);
      return mixShot(shotOf(flows[k - 1], k - 1), shotOf(flows[k], k), t * t * (3 - 2 * t));
    }
    const i = Math.min(n - 1, Math.max(0, Math.floor(s)));
    return shotOf(flows[i], i);
  });
  // The callouts ride with the framing, so they keep their place beside the phone.
  const calloutTransform = useTransform(shot, (s) => `translate(${(s.x * 100) / 0.484}%, ${-s.y * 100}%) scale(${s.zoom})`);
  // Only where there's room for them either side of the phone.
  const wide = useMedia('(min-width: 1280px)');
  const callouts = webgl && wide && stage === 'phone';
  const zoom = useTransform(shot, (s) => s.zoom);
  /** 0 → 1 as the phone settles after arriving (the callouts wait for it). */
  const settled = useTransform([entry, open], ([e, o]: number[]) => transform(e, [0.8, 1], [0, 1]) * o);

  // The 3D phone's place: the box and its lean. No spin here (the home page has those): between flows
  // the phone stays facing you and its screen scrolls — the next flow's screen pushes the current one
  // up and off, tied to the scroll, as if swiping through the app — while the phone lifts toward you a
  // little and tips back, like a hand bringing it up to look.
  const screenMedia = flow.mobile ?? study.heroScreen;
  const flowScreen = (i: number) => mediaScreen(product, `flow${i}`, flows[i].mobile ?? study.heroScreen);
  useLayoutEffect(() => {
    const el = box.current;
    const section = ref.current ?? el?.closest('section') ?? null;
    if (!webgl || !el || !section) return;
    const specs = flows.map((_, i) => flowScreen(i));
    setAnchor('stage', {
      box: el,
      section,
      accent: product.accent,
      screen: specs[index],
      follow: 16,
      glow: true,
      pose: () => {
        const lift = Math.sin(Math.PI * turn.get());
        const s = shot.get();
        return { x: s.rx - py.get() * 0.12 + lift * 0.14, y: s.ry + px.get() * 0.18, z: s.rz };
      },
      shot: () => shot.get(),
      depth: () => Math.sin(Math.PI * turn.get()) * 0.35,
      // Light catches the glass as the phone lifts between flows.
      sheen: () => {
        const t = turn.get();
        return t > 0 && t < 1 ? t : -1;
      },
      push: () => {
        const s = scrollYProgress.get() * n;
        const k = Math.round(s);
        if (!reduce && k > 0 && k < n && Math.abs(s - k) < HANDOVER) {
          const t = (s - k + HANDOVER) / (2 * HANDOVER);
          return { lo: specs[k - 1], hi: specs[k], loIndex: k - 1, p: t * t * (3 - 2 * t) };
        }
        const i = Math.min(n - 1, Math.max(0, Math.floor(s)));
        return { lo: specs[i], hi: specs[i + 1] ?? null, loIndex: i, p: 0 };
      }
    });
    return () => { if (anchors.get('stage')?.box === el) setAnchor('stage', null); };
  }, [webgl, product, study, index, turn, shot, px, py, scrollYProgress, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const layout = (narrow ? LAYOUT_NARROW : LAYOUT)[stage];

  return (
    // 1.5 screens of scroll per flow; a long product (Ariane's eleven) gets a tighter rhythm.
    <section ref={ref} id="walkthrough" className="relative" style={{ height: `${n * (n > 8 ? 125 : 150)}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 66% 52%, color-mix(in srgb, ${product.accentDeep} 40%, transparent) 0%, rgba(7,7,9,0) 70%)` }} />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-10 pt-24 pb-10 grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-6 md:gap-10">
          {/* The flow's story, handing over with the phone */}
          <motion.div style={{ opacity: storyOpacity, y: storyY }} className="relative z-10">
            <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.35em] text-white/35">Product walkthrough</p>
            <div key={index}>
              <FlowStory product={product} flow={flow} index={index} count={n} highlights={!callouts} />
            </div>
          </motion.div>

          {/* The stage: the admin portal's window and the 3D phone, arranged for the flow */}
          <div className="relative h-full min-h-0 md:h-[82svh] flex items-center justify-center">
            {/* The admin portal: anchored at the stage's left edge, never reaching into the story */}
            <motion.div
              className="absolute left-0 -translate-y-1/2 origin-left"
              initial={false}
              animate={{ width: layout.browser.width, top: layout.browser.top, opacity: layout.browser.opacity, scale: layout.browser.scale }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <motion.div style={{ opacity: open }}>
                {flow.desktop && <BrowserWindow product={product} flow={flow} />}
              </motion.div>
            </motion.div>
            <motion.div
              ref={box}
              className="absolute z-10 aspect-[0.484] -translate-x-1/2 -translate-y-1/2"
              initial={false}
              animate={layout.phone}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {!webgl && (
                <motion.div style={{ opacity: open }} className="h-full">
                  <Device
                    className="h-full"
                    image={screenMedia.image ?? product.screens[0].image}
                    video={screenMedia.video}
                    playing
                    monogram={product.monogram}
                    accent={product.accent}
                    accentDeep={product.accentDeep}
                  />
                </motion.div>
              )}
              {callouts && (
                <OverPhone box={box}>
                  <motion.div key={index} className="absolute inset-0" style={{ transform: calloutTransform }}>
                    {flow.highlights.slice(0, CALLOUTS.length).map((h, i) => (
                      <Callout key={h} product={product} text={h} i={i} settled={settled} zoom={zoom} />
                    ))}
                  </motion.div>
                </OverPhone>
              )}
            </motion.div>
          </div>
        </div>

        {/* Progress through the flows */}
        <div className="absolute bottom-6 inset-x-6 sm:inset-x-10 max-w-[1400px] mx-auto flex items-center gap-4">
          <span className="text-[10px] font-mono text-white/35 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <div className="relative flex-1 h-px bg-white/10">
            <motion.div className="absolute inset-y-0 left-0" style={{ width: progress, background: product.accent }} />
          </div>
          <span className="text-[10px] font-mono text-white/35 tabular-nums">{String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
