import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PRODUCTS, type ShowcaseProduct } from '../../showcase/products';
import { TransitionLink } from '../PageTransition';
import { caseStudyDest, workDest } from '../destinations';
import { caseStudyFor } from '../../showcase/caseStudies';
import CaseHero from './CaseHero';
import CaseWalkthrough from './CaseWalkthrough';
import CaseBackdrop from './CaseBackdrop';
import { Closing, Engineering, Gallery, Portal, Story, Whitepaper, Workflow } from './CaseSections';


/** A slim bar: back to all work, where you are, and the next project. Tucks away while scrolling down. */
function CaseBar({ product, next }: { product: ShowcaseProduct; next: ShowcaseProduct }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setHidden(y > (scrollY.getPrevious() ?? 0) && y > 200));
  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        {/* Back to this project's own place in the line-up */}
        <TransitionLink dest={workDest(product)} className="inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-xs text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All work
        </TransitionLink>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs text-white border-x border-white/10">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.accent }} />
          {product.name}
        </span>
        <TransitionLink dest={caseStudyDest(next)} className="inline-flex items-center gap-2 pl-4 pr-3 py-2 rounded-full text-xs text-white/70 hover:text-white transition-colors">
          <span className="hidden sm:inline text-white/40">Next</span> {next.name} <ArrowRight className="w-3.5 h-3.5" />
        </TransitionLink>
      </div>
    </motion.header>
  );
}

/**
 * A product's case study, in the home page's language: the 3D iPhone opening on the product, a pinned
 * walkthrough of every flow, how it works, what's under the hood, and the next project.
 */
export default function CaseStudyPage({ id }: { id: string }) {
  const i = PRODUCTS.findIndex((p) => p.id === id);
  const product = PRODUCTS[i];
  const study = caseStudyFor(id);
  if (!product || !study) return <Navigate to="/" replace />;
  const next = PRODUCTS[(i + 1) % PRODUCTS.length];

  return (
    // Keyed, so moving to the next project starts the page (and its phone) fresh.
    <div key={id} className="relative">
      <CaseBackdrop product={product} />
      <CaseBar product={product} next={next} />
      <CaseHero product={product} study={study} />
      <CaseWalkthrough product={product} study={study} />
      <Workflow product={product} study={study} />
      <Story product={product} study={study} />
      {(study.engineering || study.architecture) && <Engineering product={product} study={study} />}
      <Whitepaper product={product} study={study} />
      <Portal product={product} study={study} />
      <Gallery product={product} study={study} />
      <Closing product={product} study={study} next={next} />
    </div>
  );
}
