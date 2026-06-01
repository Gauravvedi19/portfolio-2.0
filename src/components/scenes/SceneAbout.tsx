import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function SceneAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sectionOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0]);
  
  const y1 = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);
  const o1 = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const y2 = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);
  const o2 = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const y3 = useTransform(scrollYProgress, [0.5, 0.7], [50, 0]);
  const o3 = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full border-t border-white/[0.03]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <motion.div 
        style={{ opacity: sectionOpacity }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 max-w-4xl mx-auto"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-16 text-center font-medium w-full">
          The Builder
        </p>

        <div className="space-y-16 text-left w-full pl-0 sm:pl-10 border-l border-white/[0.05]">
          <motion.div style={{ opacity: o1, y: y1 }} className="relative">
            <div className="absolute -left-[45px] top-4 w-2 h-2 rounded-full bg-white/20 hidden sm:block" />
            <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">I'm Gaurav.</h3>
            <p className="font-body text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
              A CSE student specializing in AI/ML, and the founder of Postcard. I'm obsessed with the invisible details—from the friction of a chaotic idea trying to find form, to the crisp architecture of a scalable system.
            </p>
          </motion.div>

          <motion.div style={{ opacity: o2, y: y2 }} className="relative">
            <div className="absolute -left-[45px] top-4 w-2 h-2 rounded-full bg-white/20 hidden sm:block" />
            <h3 className="font-display text-3xl sm:text-4xl text-white/90 mb-4 italic">Why I build.</h3>
            <p className="font-body text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
              I love turning complexity into clarity. I don't just design screens, and I don't just write backend logic. I build end-to-end because true product quality demands owning the entire lifecycle—bridging human-centric design with rigorous frontend engineering.
            </p>
          </motion.div>

          <motion.div style={{ opacity: o3, y: y3 }} className="relative">
             <div className="absolute -left-[45px] top-4 w-2 h-2 rounded-full bg-white/20 hidden sm:block" />
            <h3 className="font-display text-3xl sm:text-4xl text-white/90 mb-4">A student with a founder's mindset.</h3>
            <p className="font-body text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
              I operate with intense curiosity and a bias for execution. Whether I'm building my own ventures or contributing to a team, my goal is always the same: to ship meaningful, robust, and beautifully crafted platforms.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
