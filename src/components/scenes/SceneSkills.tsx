import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const CAPABILITIES = [
  {
    title: 'Product Thinking',
    desc: 'Connecting human needs with functional logic.',
    skills: ['Figma', 'System Design', 'UX Thinking', 'User Flows', 'Research']
  },
  {
    title: 'Frontend & Mobile',
    desc: 'Crafting responsive, high-fidelity interfaces.',
    skills: ['React', 'React Native', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS']
  },
  {
    title: 'Backend & Infrastructure',
    desc: 'Architecting scalable, secure foundations.',
    skills: ['Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Appwrite', 'Authentication']
  },
  {
    title: 'Realtime Systems',
    desc: 'Building synchronous, live experiences.',
    skills: ['WebSockets', 'Realtime Sync', 'Notifications', 'Cron Jobs', 'State Management']
  },
  {
    title: 'AI & Intelligence',
    desc: 'Integrating cognitive models.',
    skills: ['Gemini API', 'Vertex AI', 'Machine Learning', 'TensorFlow Foundations']
  },
  {
    title: 'Integrations',
    desc: 'Connecting external services and systems.',
    skills: ['Mapbox', 'Razorpay', 'Push Notifications', 'QR Systems']
  }
];

export default function SceneSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative w-full border-t border-white/[0.03] py-32 md:py-48 z-10 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
          {CAPABILITIES.map((cap, idx) => (
            <CapabilityCard key={idx} capability={cap} index={idx} />
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
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="max-w-3xl text-center sm:text-left mx-auto sm:mx-0">
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
        Capabilities
      </p>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-balance leading-[1.1] tracking-tight mb-8">
        Building products requires <br className="hidden sm:block"/>
        <span className="italic text-white/60">more than code.</span>
      </h2>
      <p className="font-body text-base md:text-lg text-white/50 leading-relaxed max-w-2xl mx-auto sm:mx-0">
        True product quality demands owning the entire lifecycle—bridging human-centric design with rigorous engineering. 
        Here is the technical foundation I use to bring ambitious ideas to life.
      </p>
    </motion.div>
  );
}

function CapabilityCard({ capability, index }: { capability: any, index: number, key?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 10%"]
  });

  // Staggered entrance based on index
  const start = 0 + (index % 3) * 0.05;
  const end = start + 0.2;
  
  const opacity = useTransform(scrollYProgress, [start, end, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, end, 0.8, 1], [40, 0, 0, -40]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className="group relative flex flex-col p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-[40px] group-hover:bg-white/[0.06] transition-colors duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex-1">
        <h3 className="font-display text-2xl text-white/90 mb-3 tracking-tight">
          {capability.title}
        </h3>
        <p className="font-body text-sm text-white/40 mb-8 leading-relaxed max-w-[90%]">
          {capability.desc}
        </p>
      </div>
      
      <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
        {capability.skills.map((skill: string, i: number) => (
          <span 
            key={i} 
            className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[11px] font-mono tracking-wide text-white/60 group-hover:text-white/80 group-hover:bg-white/[0.05] transition-all duration-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
