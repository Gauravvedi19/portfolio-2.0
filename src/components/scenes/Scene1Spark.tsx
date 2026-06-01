import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import StarBackground from '../StarBackground';

export default function Scene1Spark() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero (Immediate)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => v > 0.3 ? "none" : "auto");
  const heroVisibility = useTransform(scrollYProgress, (v) => v > 0.3 ? "hidden" : "visible");

  // Philosophy (After Hero)
  const phiOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.9], [0, 1, 1, 0]);
  const phiY = useTransform(scrollYProgress, [0.3, 0.9], [40, -40]);
  const phiScale = useTransform(scrollYProgress, [0.3, 0.9], [0.95, 1.05]);
  const phiPointerEvents = useTransform(scrollYProgress, (v) => v > 0.3 && v < 0.9 ? "auto" : "none");
  const phiVisibility = useTransform(scrollYProgress, (v) => v > 0.3 && v < 0.9 ? "visible" : "hidden");

  // Subtle fragments for philosophy
  const frag1Y = useTransform(scrollYProgress, [0.3, 0.9], [80, -80]);
  const frag2Y = useTransform(scrollYProgress, [0.3, 0.9], [120, -120]);
  const frag3Y = useTransform(scrollYProgress, [0.3, 0.9], [20, -150]);

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full">
      <StarBackground />
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Navigation - Always visible but fades out at end of scene */}
        <motion.nav 
          style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [1, 0]) }}
          className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 sm:px-12 py-8 max-w-7xl mx-auto w-full"
        >
          <div className="font-display text-2xl sm:text-3xl tracking-tight text-white flex items-baseline">
            Gaurav Vedi<span className="text-[10px] align-top ml-0.5 opacity-60">®</span>
          </div>
          <a href="mailto:gaurav.vedi2003@gmail.com" className="glass-btn px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium text-white transition-colors cursor-pointer hidden sm:block">
            Build With Me
          </a>
        </motion.nav>

        {/* Part 1: Hero (Immediate) */}
        <motion.div 
          style={{ 
            opacity: heroOpacity, 
            y: heroY, 
            scale: heroScale,
            pointerEvents: heroPointerEvents as any,
            visibility: heroVisibility as any
          }}
          className="absolute inset-0 flex flex-col items-center justify-center max-w-5xl mx-auto text-center px-6"
        >
          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 font-medium"
          >
            CSE Student • Product Designer • Builder
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] leading-[0.92] tracking-[-0.03em] font-normal text-white text-balance"
          >
            Designing and building products from <br/>
            <span className="italic text-white/60 block mt-2">chaos to clarity.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mt-14 flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-widest font-mono text-white/20 mb-4 animate-pulse">Scroll to explore</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
          </motion.div>
        </motion.div>

        {/* Part 2: Philosophy */}
        <motion.div 
          style={{ 
            opacity: phiOpacity, 
            y: phiY, 
            scale: phiScale,
            pointerEvents: phiPointerEvents as any,
            visibility: phiVisibility as any
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Subtle problem fragments */}
          <motion.div style={{ y: frag1Y }} className="absolute left-[15%] top-[30%] opacity-20 font-mono text-[10px] uppercase tracking-widest text-white transform-gpu">
            user_retention &lt; 30%
          </motion.div>
          <motion.div style={{ y: frag2Y }} className="absolute right-[15%] bottom-[25%] opacity-20 font-display text-3xl text-white italic transform-gpu">
            too much friction...
          </motion.div>
          <motion.div style={{ y: frag3Y }} className="absolute left-[25%] bottom-[20%] opacity-10 font-mono text-[11px] text-white transform-gpu">
            // edge case not handled
          </motion.div>
          
          <p className="font-body text-2xl md:text-4xl text-white/80 tracking-tight font-medium text-balance text-center max-w-3xl px-6">
            Every product starts with a <br className="sm:hidden" /><span className="italic text-white/50">problem.</span>
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
