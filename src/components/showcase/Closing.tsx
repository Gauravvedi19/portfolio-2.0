import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ContactModal } from '../ContactModal';

const PRINCIPLES = [
  { k: 'Observe', v: 'Find what the user is actually trying to do, and why it hurts today.' },
  { k: 'Simplify', v: 'Cut until only the core value is left.' },
  { k: 'Structure', v: 'Turn it into flows, schemas and components that scale.' },
  { k: 'Ship', v: 'Production code on a real phone, polished until it feels inevitable.' }
];

const OPEN_TO = ['Mobile engineering', 'React Native roles', 'Solutions engineering', 'AI products', 'Freelance apps'];

export default function Closing() {
  const [contactOpen, setContactOpen] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ctaRef, offset: ['start end', 'end end'] });
  const ctaScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const ctaRadius = useTransform(scrollYProgress, [0, 1], [64, 28]);

  return (
    <>
      {/* About */}
      <section id="about" className="relative py-28 md:py-40 border-t border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 lg:gap-24">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/40 mb-6">The builder</p>
            <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] text-white">
              I’m Gaurav. <br /><span className="italic text-white/55">I ship whole products.</span>
            </h2>
            <p className="mt-8 text-white/55 text-base md:text-lg leading-relaxed max-w-md">
              A CSE graduate specialising in AI/ML, a core engineer of CRAVE (every AI agent flow, the backend and the mobile app), the founder of Postcard, and the only developer behind Ariane Studio. I own the whole thing: the first conversation with the client, the interface, the 3D, the backend and the release.
            </p>
          </div>
          <ol className="grid sm:grid-cols-2 gap-px bg-white/[0.06] rounded-3xl overflow-hidden border border-white/[0.06] self-start">
            {PRINCIPLES.map((p, i) => (
              <motion.li
                key={p.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#070709] p-7 sm:p-9 group hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-mono text-[11px] text-white/30">0{i + 1}</span>
                <h3 className="mt-6 font-display text-3xl text-white group-hover:italic transition-all">{p.k}</h3>
                <p className="mt-2 text-sm text-white/45 leading-relaxed">{p.v}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Call to action */}
      <section id="contact" className="relative px-3 sm:px-6 pb-6">
        <motion.div
          ref={ctaRef}
          style={{ scale: ctaScale, borderRadius: ctaRadius }}
          className="relative overflow-hidden min-h-[88svh] flex flex-col items-center justify-center text-center px-6 py-24 bg-[#f4f1ea] text-[#0b0b0d]"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-black/45 border border-black/15 px-4 py-1.5 rounded-full">Open for opportunities</span>
          <h2 className="mt-10 font-display text-[52px] sm:text-8xl lg:text-[128px] leading-[0.88] tracking-[-0.03em] max-w-5xl">
            Let’s build your <span className="italic">next app.</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-2xl">
            {OPEN_TO.map((o) => (
              <span key={o} className="px-4 py-2 rounded-full text-xs font-medium border border-black/10 bg-black/[0.03]">{o}</span>
            ))}
          </div>
          <button
            onClick={() => setContactOpen(true)}
            className="group mt-12 inline-flex items-center gap-3 bg-[#0b0b0d] text-white pl-8 pr-6 py-5 rounded-full text-sm font-medium transition-transform hover:scale-[1.04] active:scale-[0.98]"
          >
            Start a conversation
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>

          <div className="absolute bottom-6 inset-x-6 sm:inset-x-10 flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
            <span>Gaurav Vedi®</span>
            <span>Mobile app developer · Software solutions engineer · {new Date().getFullYear()}</span>
          </div>
        </motion.div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
