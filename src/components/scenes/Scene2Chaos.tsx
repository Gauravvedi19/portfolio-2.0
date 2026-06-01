import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const fragments = [
  { text: "What if discovery felt social?", type: "product", x: -30, y: 10, speed: -1.5, scale: 1.2 },
  { text: "Too many onboarding steps", type: "ux", x: 20, y: -20, speed: 2, scale: 0.9 },
  { text: "Users dropping here", type: "ux", x: -40, y: -40, speed: -2.5, scale: 0.8 },
  { text: "Need better retention", type: "product", x: 30, y: 30, speed: 1.8, scale: 1.1 },
  { text: "Feature overload", type: "ux", x: 10, y: 50, speed: -1.2, scale: 1 },
  { text: "Make it simpler", type: "product", x: -10, y: -60, speed: 3, scale: 1.3 },
  { text: "Websocket reconnect", type: "tech", x: -50, y: 20, speed: -3.5, scale: 0.7 },
  { text: "API timeout", type: "tech", x: 45, y: -10, speed: 2.2, scale: 0.85 },
  { text: "Mapbox performance", type: "tech", x: 50, y: 45, speed: -2.8, scale: 0.9 },
  { text: "Realtime sync", type: "tech", x: -20, y: -80, speed: 1.5, scale: 1.15 },
  { text: "boolean === false", type: "tech", x: -60, y: -10, speed: 4, scale: 0.75 },
  { text: "Edge cases", type: "tech", x: 60, y: 15, speed: -1.9, scale: 0.8 },
];

export default function Scene2Chaos() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full">
      <motion.div 
        style={{ opacity: sectionOpacity }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none"
      >
        {/* Background chaos node graph (abstract) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          {fragments.map((fragment, index) => {
             // Create individual transform based on exact scroll
             // Fragment starts at its base pos and moves based on speed
             // `speed` determines how much Y transformation happens
             const yTrans = useTransform(scrollYProgress, [0, 1], [600 * fragment.speed, -600 * fragment.speed]);
             
             // Base style variations depending on type
             let colorClass = "text-white/40";
             let fontClass = "font-body text-xs md:text-sm";
             
             if (fragment.type === "product") {
               colorClass = "text-white/70";
               fontClass = "font-display text-2xl md:text-4xl italic";
             } else if (fragment.type === "tech") {
               colorClass = "text-blue-200/30";
               fontClass = "font-mono text-xs uppercase tracking-widest";
             }

             return (
               <motion.div
                 key={index}
                 className={`absolute ${colorClass} ${fontClass} whitespace-nowrap`}
                 style={{
                   left: `calc(50% + ${fragment.x}vw)`,
                   top: `calc(50% + ${fragment.y}vh)`,
                   transform: `translate(-50%, -50%) scale(${fragment.scale})`,
                   y: yTrans,
                 }}
               >
                 {fragment.text}
               </motion.div>
             );
          })}
          
          <motion.h2 
            className="font-display text-4xl md:text-6xl text-white text-center z-10 transform-gpu will-change-transform shadow-2xl"
            style={{
              opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]),
              scale: useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1.2])
            }}
          >
            Chaos.
          </motion.h2>
        </div>
      </motion.div>
    </section>
  );
}
