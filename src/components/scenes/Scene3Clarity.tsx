import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const steps = [
  { 
    id: '01', 
    label: 'OBSERVE', 
    title: 'Understanding the friction.',
    desc: 'Before designing interfaces or writing architecture, the problem must be isolated. What is the user actually trying to accomplish, and why is it currently painful? True clarity starts with observation.'
  },
  { 
    id: '02', 
    label: 'SIMPLIFY', 
    title: 'Removing what doesn\'t matter.',
    desc: 'Complexity is easy; simplicity requires rigorous editing. This phase strips away unessential features and edge-case distractions until only the core value proposition remains.'
  },
  { 
    id: '03', 
    label: 'STRUCTURE', 
    title: 'Designing the system.',
    desc: 'Translating the simplified concept into robust data schemas, intuitive user flows, and scalable component architectures. Chaos is replaced by intentional order.'
  },
  { 
    id: '04', 
    label: 'EXECUTE', 
    title: 'Bringing it to life.',
    desc: 'Writing production-ready code. Rigorous frontend implementation meeting robust backend logic. Shipping a cohesive product that feels inevitable.'
  }
];

export default function Scene3Clarity() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-45, 0]);

  return (
    <section ref={containerRef} className="relative w-full border-t border-white/[0.02] py-32 md:py-48 z-10 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent z-10" />
        
        <motion.div
           style={{ y: y3 }}
           className="absolute inset-0 w-full h-[150%] -top-[25%] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"
        />

        <motion.div 
          style={{ y: y1, rotate: rotate1 }} 
          className="absolute w-[80vw] max-w-[800px] aspect-square rounded-full border border-white/[0.03]"
        />
        <motion.div 
          style={{ y: y2, rotate: rotate2 }} 
          className="absolute w-[60vw] max-w-[600px] aspect-square rounded-[10vw] md:rounded-[100px] border border-white/[0.04]"
        />
        
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 right-[10%] w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-white/20 to-transparent"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 left-[10%] w-[30vw] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <Header />

        <div className="mt-32 md:mt-48 space-y-32 md:space-y-64">
          {steps.map((step, idx) => (
            <StepItem key={step.id} step={step} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}

function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
        The Mindset
      </p>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-balance tracking-tight leading-[1.1]">
        Bringing order to <br className="hidden sm:block"/>
        <span className="italic text-white/60">ambitious ideas.</span>
      </h2>
    </motion.div>
  );
}

interface Step {
  id: string;
  label: string;
  title: string;
  desc: string;
}

function StepItem({ step, index }: { step: Step, index: number, key?: any }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 75%", "end 25%"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

  return (
    <motion.div 
      ref={itemRef}
      style={{ opacity, y }}
      className="relative flex flex-col md:flex-row items-start md:gap-24 w-full"
    >
      <div className="md:w-1/3 mb-8 md:mb-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
            {step.id} /
          </span>
          <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest">
            {step.label}
          </span>
        </div>
      </div>

      <div className="md:w-2/3">
        <h3 className="font-display text-4xl sm:text-5xl md:text-6xl text-white/90 mb-8 max-w-2xl leading-[1.1] tracking-tight">
          {step.title}
        </h3>

        <p className="font-body text-base md:text-lg text-white/50 leading-relaxed max-w-xl">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}
