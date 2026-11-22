import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Smartphone, Box, Server, Radio, Sparkles, Plug } from 'lucide-react';

const SPECS = [
  {
    icon: Smartphone,
    title: 'Mobile',
    desc: 'iOS and Android from one codebase, with native code where it counts.',
    skills: ['React Native', 'Expo', 'TypeScript', 'Kotlin + Swift modules', 'UI-thread animation']
  },
  {
    icon: Box,
    title: '3D & AR',
    desc: 'Real-time scenes and augmented reality that run on a mid-range phone.',
    skills: ['three.js', 'AR surface detection', 'Model pipelines', 'Adaptive quality']
  },
  {
    icon: Server,
    title: 'Backend',
    desc: 'The data, auth and payments behind every screen.',
    skills: ['Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Appwrite']
  },
  {
    icon: Radio,
    title: 'Realtime',
    desc: 'Queues, bays and maps that update the moment something changes.',
    skills: ['WebSockets', 'Live sync', 'Push notifications', 'Cron jobs']
  },
  {
    icon: Sparkles,
    title: 'AI',
    desc: 'Models put to work inside the product, not bolted on.',
    skills: ['Gemini API', 'Vertex AI', 'Prescription OCR', 'Generated visuals']
  },
  {
    icon: Plug,
    title: 'Integrations',
    desc: 'The services real businesses run on.',
    skills: ['Google Maps', 'Mapbox', 'Razorpay', 'QR systems']
  }
];

const MARQUEE = ['React Native', 'Expo', 'TypeScript', 'three.js', 'Augmented Reality', 'Supabase', 'Firebase', 'Appwrite', 'PostgreSQL', 'Gemini', 'Mapbox', 'Razorpay', 'Kotlin', 'Swift'];

/** A card that leans toward the pointer and lights where it's touched. */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 });
  const lx = useTransform(mx, (v) => `${v * 100}%`);
  const ly = useTransform(my, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lx} ${ly}, rgba(255,255,255,0.09), transparent 45%)`;

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
        style={{ rotateX, rotateY }}
        className={`group relative h-full rounded-3xl border border-white/[0.08] bg-white/[0.02] overflow-hidden [transform-style:preserve-3d] ${className}`}
      >
        <motion.div aria-hidden style={{ background: light }} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {children}
      </motion.div>
    </div>
  );
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-28 md:py-40 overflow-hidden">
      {/* Moving stack line */}
      <div className="relative border-y border-white/[0.06] py-5 mb-24 md:mb-32 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <motion.div
          className="flex gap-12 whitespace-nowrap w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="font-display italic text-2xl md:text-3xl text-white/30">{t}<span className="ml-12 text-white/15 not-italic">✦</span></span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-white"
          >
            The spec sheet.
          </motion.h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg">
            Everything an app needs between the idea and the store listing, from the interface down to the database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured: the performance story from Ariane Studio */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <TiltCard className="p-8 sm:p-10 flex flex-col bg-gradient-to-br from-[#3b2a17]/60 via-white/[0.02] to-transparent border-[#e9c98f]/20">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#e9c98f]/80 [transform:translateZ(30px)]">Performance</span>
              <div className="mt-8 flex items-end gap-4 [transform:translateZ(50px)]">
                <div>
                  <div className="font-display text-6xl sm:text-7xl text-white/40">73</div>
                  <div className="text-[11px] text-white/40 mt-1">frames/s sent</div>
                </div>
                <div className="font-display text-4xl text-[#e9c98f]/70 pb-6">≠</div>
                <div>
                  <div className="font-display text-6xl sm:text-7xl text-white/40">35–51</div>
                  <div className="text-[11px] text-white/40 mt-1">frames/s shown</div>
                </div>
              </div>
              <p className="mt-8 text-white/65 leading-relaxed [transform:translateZ(20px)]">
                In Ariane Studio, JavaScript sent more frames than the phone could draw, and the backlog became lag. I replaced the 3D render loop with one synced to the display that draws only when something changes.
              </p>
              <p className="mt-4 text-white/85 leading-relaxed [transform:translateZ(20px)]">
                <span className="text-[#e9c98f]">Result:</span> a full 3D restaurant that stays fluid on a mid-range phone.
              </p>
              <p className="mt-auto pt-8 text-[11px] font-mono uppercase tracking-[0.2em] text-white/35">Expo · no custom native code</p>
            </TiltCard>
          </motion.div>

          {SPECS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="p-7 sm:p-8 flex flex-col">
                <div className="flex items-center justify-between [transform:translateZ(40px)]">
                  <s.icon className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] text-white/25">0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-3xl text-white [transform:translateZ(30px)]">{s.title}</h3>
                <p className="mt-2 text-sm text-white/45 leading-relaxed">{s.desc}</p>
                <div className="mt-6 flex flex-wrap gap-1.5 [transform:translateZ(20px)]">
                  {s.skills.map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-md text-[11px] font-mono text-white/55 bg-white/[0.03] border border-white/[0.06] group-hover:text-white/75 transition-colors">{k}</span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
