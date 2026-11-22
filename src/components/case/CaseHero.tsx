import React, { useEffect, useRef } from 'react';
import { motion, transform, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { ShowcaseProduct } from '../../showcase/products';
import type { CaseStudy } from '../../showcase/caseStudies';
import { Device } from '../showcase/Device';
import { screenStatus, setAnchor, usePhoneState } from '../showcase/phoneStore';
import { scrollToTarget } from '../../lib/scroll';
import { mediaScreen } from './media';
import { transitionStatus } from '../PageTransition';

const EASE = [0.16, 1, 0.3, 1] as const;

/** The phone's entrance (seconds; offsets in fractions of its box's height, angles in radians). */
const INTRO = {
  /** Fading in, over the start of the rise. */
  fadeFor: 0.7,
  rise: 1.9,
  /** Starts this far below its place, and this far back (world units). */
  drop: 0.14,
  back: 0.9,
  tip: 0.24,
  turn: 0.14,
  glint: 0.6,
  glintFor: 1.1,
  power: 0.45,
  powerFor: 0.8
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
/** Moving at once and settling softly: under a fade-in, an arrival with no visible start. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

function Rise({ delay = 0, children, className = '' }: { delay?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * The case study's opening: the real 3D iPhone on the product's hero screen, standing in front of its
 * name set huge in its colour, with the pitch, facts and proof beside it. Pinned while you read; as you
 * scroll on, the phone turns (at the same even rate as the home page) and flies into the walkthrough.
 */
export default function CaseHero({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const ref = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const webgl = usePhoneState((s) => s.webgl);
  const pointer = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Opacity through functions, so motion keeps it off its scroll timeline (it misreads sticky ranges).
  const fade = (input: number[], output: number[]) => (v: number) => transform(v, input, output);
  const copyOpacity = useTransform(scrollYProgress, fade([0, 0.45], [1, 0]));
  const copyY = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const boxScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce]);

  useEffect(() => {
    if (!box.current || !ref.current) return;
    // The entrance, timed from the first frame the phone shows this product's screen (the model or the
    // screen may still be loading when the page opens; until then the phone stays out of sight): it
    // fades in as it rises from a little below and behind, tipped back and turned slightly, and eases to
    // a stop facing you; the screen powers on and a glint crosses the glass.
    const screen = mediaScreen(product, 'hero', study.heroScreen);
    let start: number | null = null;
    let waiting: number | null = null;
    let since = 0;
    const clock = (t: number) => {
      if (reduce) { since = 99; return; }
      waiting ??= t;
      // Waits for its screen, and for the page curtain to lift (it plays as the curtain leaves) — but is
      // never hidden for long, whatever happens.
      if (start === null && (screenStatus.key !== screen.key || transitionStatus.covered) && t - waiting < 5) { since = 0; return; }
      start ??= t;
      since = t - start;
    };
    const rise = () => (start === null && !reduce ? 0 : easeOut(clamp01(since / INTRO.rise)));
    setAnchor('hero', {
      box: box.current,
      section: ref.current,
      accent: product.accent,
      screen,
      fade: () => (start === null && !reduce ? 0 : smoother(clamp01(since / INTRO.fadeFor))),
      // No spin (that's the home page's move): the phone stands facing you, leaning only toward the
      // cursor, then glides into the walkthrough the short way.
      flightTurn: false,
      glow: true,
      pose: (t) => {
        clock(t);
        const away = 1 - rise();
        return {
          y: pointer.current.x * 0.3 + INTRO.turn * away,
          x: pointer.current.y * 0.12 + INTRO.tip * away,
          z: 0
        };
      },
      shot: () => ({ x: 0, y: -INTRO.drop * (1 - rise()), zoom: 1 }),
      depth: () => -INTRO.back * (1 - rise()),
      sheen: () => {
        if (start === null) return -1;
        const s = (since - INTRO.glint) / INTRO.glintFor;
        return s > 0 && s < 1 ? s : -1;
      },
      dim: () => {
        if (reduce) return 1;
        const q = start === null ? 0 : clamp01((since - INTRO.power) / INTRO.powerFor);
        return 0.04 + 0.96 * smoother(q) + 0.12 * Math.sin(Math.PI * q);
      }
    });
    return () => setAnchor('hero', null);
  }, [product, study, reduce, scrollYProgress]);

  const proof = product.specs;

  return (
    <section ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Light and name, behind everything */}
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 55% at 68% 48%, color-mix(in srgb, ${product.accentDeep} 45%, transparent) 0%, rgba(7,7,9,0) 72%)` }} />
        <motion.div aria-hidden style={{ y: nameY, opacity: copyOpacity }} className="absolute inset-x-0 top-[14%] pointer-events-none select-none overflow-hidden">
          <motion.p
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="whitespace-nowrap font-display italic leading-none text-[24vw] md:text-[17vw] pl-[30vw] tracking-[-0.03em]"
            style={{ color: `color-mix(in srgb, ${product.accent} 22%, transparent)` }}
          >
            {product.name.replace('®', '')}
          </motion.p>
        </motion.div>

        <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-10 grid md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-center gap-6 pt-20 pb-8">
          {/* Copy */}
          <motion.div style={{ opacity: copyOpacity, y: copyY }} className="relative z-10 order-2 md:order-1">
            <Rise>
              <p className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/45">
                <span style={{ color: product.accent }}>{product.category}</span>
                <span className="w-6 h-px bg-white/20" />
                {study.eyebrow}
              </p>
            </Rise>
            <Rise delay={0.08}>
              <h1 className="mt-5 font-display text-[52px] sm:text-7xl lg:text-[104px] leading-[0.88] tracking-[-0.025em] text-white">{product.name}</h1>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-5 font-display italic text-xl sm:text-2xl lg:text-[28px] leading-snug text-white/75 max-w-xl">“{study.pitch}”</p>
            </Rise>
            <Rise delay={0.24}>
              <p className="hidden sm:block mt-5 text-white/55 leading-relaxed max-w-lg">{study.intro}</p>
              {study.hook && (
                <p className="hidden sm:block mt-4 text-white/85 leading-relaxed max-w-lg pl-4 border-l-2" style={{ borderColor: `${product.accent}80` }}>
                  {study.hook}
                </p>
              )}
            </Rise>
            <Rise delay={0.32} className="mt-7 flex flex-wrap items-center gap-3">
              {study.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: product.accent }}
                >
                  {l.label}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
              <button
                onClick={() => {
                  const el = document.getElementById('walkthrough');
                  if (el) scrollToTarget(el);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm text-white/85 border border-white/15 hover:border-white/40 hover:text-white transition-colors"
              >
                Walk through it <ArrowDown className="w-4 h-4" />
              </button>
            </Rise>

            {/* Facts and proof */}
            <Rise delay={0.42} className="hidden sm:grid mt-9 grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 max-w-2xl">
              {study.facts.map((f) => (
                <div key={f.label} className="border-t border-white/10 pt-3">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/35">{f.label}</div>
                  <div className="mt-1 text-[13px] leading-snug text-white/75">{f.value}</div>
                </div>
              ))}
            </Rise>
            <Rise delay={0.5} className="hidden md:flex mt-6 gap-8">
              {proof.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl" style={{ color: product.accent }}>{s.value}</div>
                  <div className="text-[11px] text-white/40">{s.label}</div>
                </div>
              ))}
            </Rise>
          </motion.div>

          {/* The phone's box: the page-wide 3D stage draws the iPhone here */}
          <div className="relative order-1 md:order-2 h-[38svh] md:h-[74svh] flex items-center justify-center">
            <motion.div ref={box} style={{ scale: boxScale }} className="relative h-full aspect-[0.484]">
              {!webgl && (
                <Device
                  className="h-full"
                  image={study.heroScreen.image ?? product.screens[0].image}
                  video={study.heroScreen.video}
                  playing
                  monogram={product.monogram}
                  accent={product.accent}
                  accentDeep={product.accentDeep}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
