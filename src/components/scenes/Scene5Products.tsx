import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const PRODUCT_CARDS = [
  {
    id: 'postcard',
    title: 'Postcard®',
    type: 'Social Platform',
    desc: 'Helping people discover hidden gems through community.',
    path: '/postcard',
    color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30 text-blue-400'
  },
  {
    id: 'washadmin',
    title: 'WashAdmin',
    type: 'B2B Analytics',
    desc: 'A full-stack mobile + operations platform for managing bookings.',
    path: '/washadmin',
    color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'cliniko',
    title: 'Cliniko',
    type: 'Healthcare Ops',
    desc: 'B2B SaaS unifying multi-clinic waitlists and AI prescriptions.',
    path: '/cliniko',
    color: 'from-purple-500/10 to-pink-500/10 hover:border-purple-500/30 text-purple-400'
  },
  {
    id: 'projectcivic',
    title: 'Project Civic',
    type: 'Urban Tech',
    desc: 'Local government citizen-reporting resolution platform.',
    path: '/projectcivic',
    color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/30 text-amber-400'
  }
];

export default function Scene5Products() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section ref={containerRef} id="products" className="relative w-full pb-32 overflow-hidden z-10">
      {/* Background Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-white/[0.02]" />

        <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle cx="15%" cy="25%" r="1.5" fill="rgba(255,255,255,0.8)"
              animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle cx="85%" cy="35%" r="2" fill="rgba(255,255,255,0.6)"
              animate={{ y: [0, 40, 0], x: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.circle cx="50%" cy="75%" r="2.5" fill="rgba(255,255,255,0.7)"
              animate={{ y: [0, -50, 0], x: [0, 40, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
        </svg>

        <motion.div style={{ y: y1 }} className="absolute left-[5%] md:left-[10%] top-[-20%] bottom-[-20%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <motion.div style={{ y: y2 }} className="absolute right-[5%] md:right-[10%] top-[-20%] bottom-[-20%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        
        <motion.div 
          style={{ rotate: rotate1 }} 
          className="absolute w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] border border-white/[0.02] rounded-full" 
        />
        <motion.div 
          style={{ rotate: rotate2, scale: 0.8 }} 
          className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-white/[0.03] rounded-full border-dashed" 
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <motion.div 
          className="mb-24 text-center"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.1], [50, 0])
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
            The Payoff
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-6">
            Products come alive.
          </h2>
          <p className="max-w-2xl mx-auto text-white/50 text-lg">
            A selection of core platforms engineered with uncompromising attention to telemetry, interaction responsiveness, and layout systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCT_CARDS.map((card) => (
            <Link 
              key={card.id}
              to={card.path}
              className={`group relative block w-full p-10 rounded-3xl border border-white/[0.08] bg-gradient-to-b ${card.color} overflow-hidden hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className={`text-[10px] uppercase tracking-[0.3em] font-medium font-mono px-3 py-1 bg-white/5 rounded-full border border-white/5 ${card.color.split(' ').pop()}`}>
                    {card.type}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05] group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-4xl sm:text-5xl font-display text-white tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                  {card.title}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed max-w-sm mt-auto">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
