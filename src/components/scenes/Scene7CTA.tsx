import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ContactModal } from '../ContactModal';

export default function Scene7CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 50%"]
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const yMove = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-32 w-full flex flex-col items-center justify-center border-t border-white/[0.05]">
      {/* Background premium glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <motion.div 
        style={{ opacity: sectionOpacity, y: yMove }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] border border-white/10 px-4 py-1.5 rounded-full mb-8 inline-block">
          Open For Opportunities
        </span>
        
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl text-white mb-8 text-balance leading-[0.9]">
          Let's build the <span className="italic text-white/70">next chapter.</span>
        </h2>

        <p className="font-body text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          I am actively looking for a fast-paced environment where I can contribute to ambitious products. I'm open to:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 max-w-2xl mx-auto">
          <span className="glass-btn px-5 py-2.5 rounded-full text-xs font-medium text-white/90 shadow-sm shadow-white/5">Internships</span>
          <span className="glass-btn px-5 py-2.5 rounded-full text-xs font-medium text-white/90 shadow-sm shadow-white/5">Product Roles</span>
          <span className="glass-btn px-5 py-2.5 rounded-full text-xs font-medium text-white/90 shadow-sm shadow-white/5">Frontend Engineering</span>
          <span className="glass-btn px-5 py-2.5 rounded-full text-xs font-medium text-white/90 shadow-sm shadow-white/5">Product Design</span>
          <span className="glass-btn px-5 py-2.5 rounded-full text-xs font-medium text-white/90 shadow-sm shadow-white/5">Freelance</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={() => setIsContactModalOpen(true)} className="bg-white text-black px-12 py-5 rounded-full text-sm font-medium hover:scale-[1.03] transition-transform shadow-2xl shadow-white/10 cursor-pointer inline-block">
            Start a conversation
          </button>
        </div>
      </motion.div>

      {/* Footer minimal info */}
      <motion.div 
        style={{ opacity: sectionOpacity }}
        className="absolute bottom-6 sm:bottom-12 left-0 right-0 px-8 sm:px-12 flex justify-between items-end text-[10px] uppercase tracking-widest text-white/30 font-mono"
      >
        <div>
          <span className="block mb-1">Status</span>
          <span className="text-white/60">Actively seeking roles</span>
        </div>
        <div className="text-right">
          <span className="block mb-1">Gaurav Vedi®</span>
          <span className="text-white/60">Portfolio {new Date().getFullYear()}</span>
        </div>
      </motion.div>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </section>
  );
}
