import React, { useRef, useState } from 'react';
import { TransitionLink } from '../PageTransition';
import { caseStudyDest, workDest } from '../destinations';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Download, Maximize2, Plus, X } from 'lucide-react';
import type { ShowcaseProduct } from '../../showcase/products';
import type { CaseStudy } from '../../showcase/caseStudies';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Every section sits on one grid: the same left and right edges, the same rhythm and divider. */
const SECTION = 'relative py-24 md:py-32 border-t border-white/[0.05]';
const WRAP = 'max-w-[1400px] mx-auto px-6 sm:px-10';
/** The two-column split, shared so the right-hand columns of different sections line up. */
const SPLIT = 'grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]';

/** A section's heading: a mono eyebrow in the product's colour, a serif title, an optional line. */
function Heading({ product, eyebrow, title, sub }: { product: ShowcaseProduct; eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: EASE }}
      className="max-w-3xl"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.35em]" style={{ color: product.accent }}>{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-white">{title}</h2>
      {sub && <p className="mt-4 text-white/50 text-base md:text-lg leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The end-to-end workflow as a timeline: the line fills and each step lights as you scroll past. */
export function Workflow({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 45%'] });
  const fill = useTransform(scrollYProgress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);
  const steps = study.workflow.steps;
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Heading product={product} eyebrow="How it works" title={study.workflow.title} sub={study.workflow.sub} />
        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* The line: across on wide screens, down on narrow ones */}
          <div aria-hidden className="absolute md:left-0 md:right-0 md:top-[7px] md:h-px max-md:left-[7px] max-md:top-0 max-md:bottom-0 max-md:w-px bg-white/10">
            <motion.div className="absolute md:inset-y-0 md:left-0 max-md:inset-x-0 max-md:top-0 md:!h-full max-md:!w-full" style={{ background: product.accent, width: fill, height: fill }} />
          </div>
          <ol className="relative grid gap-8 md:gap-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((s, i) => (
              <Step key={s.name} index={i} count={steps.length} progress={scrollYProgress} product={product} name={s.name} desc={s.desc} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ index, count, progress, product, name, desc }: {
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  product: ShowcaseProduct;
  name: string;
  desc?: string;
}) {
  // Lit once the line reaches it.
  const at = count > 1 ? index / (count - 1) : 0;
  const lit = useTransform(progress, (v) => (v >= at - 0.02 ? 1 : 0.35));
  const dot = useTransform(progress, (v) => (v >= at - 0.02 ? product.accent : 'rgba(255,255,255,0.18)'));
  return (
    <motion.li style={{ opacity: lit }} className="relative max-md:pl-8 max-md:col-span-full md:pr-2 transition-opacity duration-500">
      <motion.span aria-hidden className="absolute max-md:left-0 md:left-0 top-0 w-[15px] h-[15px] rounded-full border-2 border-[#070709]" style={{ background: dot }} />
      <div className="md:pt-8">
        <span className="font-mono text-[10px] text-white/35 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="mt-2 font-display text-2xl text-white leading-tight">{name}</h3>
        {desc && <p className="mt-2 text-[13px] leading-relaxed text-white/50">{desc}</p>}
      </div>
    </motion.li>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The system's layers, top to bottom, joined by a line a pulse travels down. */
export function Architecture({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const layers = study.architecture?.layers;
  if (!layers?.length) return null;
  return (
    <div className="relative">
      <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-px bg-white/10 overflow-hidden">
        <motion.span
          className="absolute left-0 w-px h-24"
          style={{ background: `linear-gradient(to bottom, transparent, ${product.accent}, transparent)` }}
          animate={{ top: ['-15%', '110%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <ol className="relative flex flex-col items-center gap-5">
        {layers.map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            className="w-full text-center rounded-2xl px-6 py-4 border bg-[#0b0b0e]"
            style={{ borderColor: l.accent ? `${product.accent}55` : 'rgba(255,255,255,0.08)', boxShadow: l.accent ? `0 0 60px -20px ${product.accent}55` : undefined }}
          >
            <div className="text-white text-[15px]" style={l.accent ? { color: product.accent } : undefined}>{l.name}</div>
            {l.note && <div className="mt-1 text-[12px] text-white/45">{l.note}</div>}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** Engineering, with an optional "How I solved it" on each card. */
export function Engineering({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const [open, setOpen] = useState<number | null>(null);
  const eng = study.engineering;
  const heading = <Heading product={product} eyebrow="Under the hood" title={eng?.title ?? 'The system'} sub={eng?.sub} />;
  const stack = study.architecture && (
    <div className={eng ? 'lg:sticky lg:top-24' : undefined}>
      <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/35">Architecture</p>
      <Architecture product={product} study={study} />
    </div>
  );
  // Nothing but the stack: heading beside it, rather than half a screen left empty.
  if (!eng) {
    return (
      <section className={SECTION}>
        <div className={`${WRAP} ${SPLIT} items-start`}>
          {heading}
          {stack}
        </div>
      </section>
    );
  }
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        {heading}
        <div className={`mt-14 md:mt-20 ${study.architecture ? SPLIT : ''} items-start`}>
          {stack}
          <div>
            {study.architecture && <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/35">The challenges</p>}
            <div className="grid sm:grid-cols-2 gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
              {eng.items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}
                    className="flex flex-col items-start p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-white/[0.02]"
                    style={item.badge ? { borderColor: `${product.accent}40` } : undefined}
                  >
                    {item.badge && (
                      <span className="inline-block mb-4 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider" style={{ color: product.accent, background: `${product.accent}14`, border: `1px solid ${product.accent}33` }}>
                        {item.badge}
                      </span>
                    )}
                    <h3 className="font-display text-2xl text-white leading-tight">{item.title}</h3>
                    <p className="mt-3 text-sm text-white/60 leading-relaxed">{item.plain}</p>
                    {item.how && (
                      <>
                        <button
                          onClick={() => setOpen(isOpen ? null : i)}
                          className="mt-auto pt-5 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors"
                          style={{ color: product.accent }}
                          aria-expanded={isOpen}
                        >
                          <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                          {eng.howLabel ?? 'How I solved it'}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.45, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <span className="block mt-4 pl-3 border-l-2 text-sm text-white/55 leading-relaxed" style={{ borderColor: `${product.accent}55` }}>{item.how}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The hardest problem: what went wrong, the three things I did, and the result. */
export function Story({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const s = study.story;
  if (!s) return null;
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] border p-8 sm:p-12 lg:p-16"
          style={{ borderColor: `${product.accent}26`, background: `linear-gradient(135deg, ${product.accentDeep}99, rgba(10,10,12,0.6) 55%)` }}
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em]" style={{ color: product.accent }}>{s.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-white max-w-4xl">{s.title}</h2>
          <p className="mt-6 text-white/65 text-base md:text-lg leading-relaxed max-w-3xl">{s.body}</p>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {s.steps.map((st, i) => (
              <div key={st.title} className="p-6 rounded-2xl bg-black/25 border border-white/[0.06]">
                <span className="font-mono text-[11px]" style={{ color: product.accent }}>0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl text-white">{st.title}</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{st.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 pt-6 border-t border-white/[0.07] text-white/85 text-base md:text-lg leading-relaxed">
            <span style={{ color: product.accent }}>Result:</span> {s.result}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The published paper: its cover beside what it covers, to read in the browser or download. */
export function Whitepaper({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const w = study.whitepaper;
  if (!w) return null;
  return (
    <section id="whitepaper" className={SECTION}>
      <div className={`${WRAP} ${SPLIT} items-center`}>
        <motion.a
          href={w.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${w.title}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="group relative block w-full max-w-sm aspect-[1/1.414] overflow-hidden rounded-md border border-white/10 p-8 transition-transform duration-500 hover:-translate-y-2"
          style={{ background: `linear-gradient(160deg, ${product.accentDeep}, #09090c 75%)`, boxShadow: `0 40px 90px -30px ${product.accent}55` }}
        >
          <div className="h-full flex flex-col justify-between">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">Whitepaper · 2026</p>
            <div>
              <h3 className="font-display text-[40px] sm:text-5xl leading-[0.98] tracking-[-0.02em] text-white">{w.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{w.subtitle}</p>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed" style={{ color: product.accent }}>{w.series}</p>
          </div>
        </motion.a>
        <div>
          <Heading product={product} eyebrow="The whitepaper" title={w.title} sub={w.note} />
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {w.facts.map((f) => (
              <div key={f.label}>
                <div className="font-display text-5xl" style={{ color: product.accent }}>{f.value}</div>
                <div className="mt-1 text-[12px] text-white/45">{f.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={w.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full text-sm font-medium text-black transition-transform hover:scale-[1.03]" style={{ background: product.accent }}>
              Read the whitepaper <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href={w.href} download className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm text-white/85 border border-white/15 hover:border-white/40 hover:text-white transition-colors">
              Download PDF <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The admin portal, as a gallery; any card opens full screen. */
export function Portal({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const [view, setView] = useState<string | null>(null);
  const p = study.portal;
  if (!p) return null;
  // Two rows of wide + narrow, mirrored, then the last one across.
  const spans = ['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3'];
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Heading product={product} eyebrow="The admin portal" title={p.title} sub={p.sub} />
        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-[300px] lg:auto-rows-[360px]">
          {p.cards.map((c, i) => (
            <motion.button
              key={c.title}
              type="button"
              onClick={() => setView(c.image)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: EASE }}
              className={`group relative text-left overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0e] ${spans[i] ?? 'lg:col-span-1'}`}
            >
              <img src={c.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-left-top opacity-60 transition-all duration-700 group-hover:opacity-80 group-hover:scale-[1.03]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/75 to-transparent" />
              <div className="absolute right-5 top-5 p-2 rounded-full bg-black/50 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-display text-2xl text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-md">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.chips.map((ch) => (
                    <span key={ch} className="px-2.5 py-1 rounded-md text-[10px] font-mono text-white/55 bg-white/[0.05] border border-white/10">{ch}</span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {view && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-10"
            onClick={() => setView(null)}
          >
            <button aria-label="Close" className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={() => setView(null)}>
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={view}
              alt=""
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="max-w-6xl w-full max-h-[88vh] object-contain rounded-xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The store screenshots: tall mockups in a row that scrolls sideways on small screens; any one opens full screen. */
export function Gallery({ product, study }: { product: ShowcaseProduct; study: CaseStudy }) {
  const [view, setView] = useState<string | null>(null);
  const g = study.gallery;
  if (!g) return null;
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Heading product={product} eyebrow={g.eyebrow} title={g.title} sub={g.sub} />
      </div>
      <div className="mt-14 md:mt-20 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-lenis-prevent-wheel>
        <div className="flex gap-4 sm:gap-5 w-max px-6 sm:px-10 xl:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))] pb-2">
          {g.images.map((im, i) => (
            <motion.button
              key={im.src}
              type="button"
              onClick={() => setView(im.src)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: Math.min(i, 5) * 0.06, ease: EASE }}
              className="group relative shrink-0 w-[62vw] sm:w-[260px] lg:w-[280px] overflow-hidden rounded-[1.6rem] border border-white/[0.07] bg-[#0b0b0e]"
              aria-label={im.alt}
            >
              <img src={im.src} alt={im.alt} loading="lazy" className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute right-4 top-4 p-2 rounded-full bg-black/50 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      {study.links && study.links.length > 0 && (
        <div className={`${WRAP} mt-10 flex flex-wrap gap-3`}>
          {study.links.map((l) => (
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
        </div>
      )}

      <AnimatePresence>
        {view && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-10"
            onClick={() => setView(null)}
          >
            <button aria-label="Close" className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={() => setView(null)}>
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={view}
              alt=""
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="max-h-[88vh] w-auto max-w-full object-contain rounded-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */

/** The closing line, then the next project: its name in its colour, one click away. */
export function Closing({ product, study, next }: { product: ShowcaseProduct; study: CaseStudy; next: ShowcaseProduct }) {
  return (
    <>
      <section className={SECTION}>
        <div className={WRAP}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            className="max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em] text-white"
          >
            {study.closing}
          </motion.h2>
          <div className="mt-10">
            <TransitionLink dest={workDest(product)} className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> All work
            </TransitionLink>
          </div>
        </div>
      </section>

      <section className={`relative pb-6 ${WRAP}`}>
        <TransitionLink
          dest={caseStudyDest(next)}
          className="group relative block overflow-hidden rounded-[2rem] min-h-[60svh] border border-white/[0.07]"
          style={{ background: `radial-gradient(ellipse 70% 80% at 70% 60%, ${next.accentDeep}, #070709 70%)` }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.35em] text-white/45">
              <span>Next project</span>
              <span style={{ color: next.accent }}>{next.category}</span>
            </div>
            <div>
              <h2 className="font-display text-[64px] sm:text-8xl lg:text-[160px] leading-[0.85] tracking-[-0.03em] text-white transition-transform duration-700 group-hover:translate-x-3">
                {next.name}
              </h2>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <p className="font-display italic text-xl sm:text-2xl text-white/70 max-w-xl">“{next.line}”</p>
                <span className="inline-flex items-center gap-3 pl-6 pr-5 py-4 rounded-full text-sm font-medium text-black transition-transform group-hover:scale-[1.04]" style={{ background: next.accent }}>
                  Open case study <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </TransitionLink>
        <div className="flex justify-between pt-5 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/35">
          <span>Gaurav Vedi®</span>
          <span>{product.name} · Case study</span>
        </div>
      </section>
    </>
  );
}
