import React, { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ContactModal } from '../ContactModal';
import { scrollToTarget } from '../../lib/scroll';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'about', label: 'About' }
];

/** My local time, so a visitor knows when a reply is likely. */
function LocalTime() {
  const format = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums text-white/70">{time} IST</span>;
}

/** A floating glass bar that tucks away while you scroll down and returns when you scroll up. */
export default function TopBar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
  });

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) scrollToTarget(el);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 pl-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          <button onClick={() => go('home')} className="font-display text-lg text-white mr-2 sm:mr-4">
            Gaurav Vedi<span className="text-[9px] align-top opacity-50">®</span>
          </button>
          <span className="hidden lg:inline-flex items-center gap-2 pr-3 mr-1 border-r border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open to work · <LocalTime />
          </span>
          <nav className="hidden sm:flex items-center">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="px-3 py-2 text-xs text-white/60 hover:text-white transition-colors rounded-full">
                {l.label}
              </button>
            ))}
          </nav>
          <button onClick={() => setContactOpen(true)} className="ml-1 px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:scale-[1.04] active:scale-[0.97] transition-transform">
            Build with me
          </button>
        </div>
      </motion.header>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
