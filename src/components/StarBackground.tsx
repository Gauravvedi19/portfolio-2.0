import React, { useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

function generateStars(count: number) {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substring(7),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    twinkleDuration: Math.random() * 3 + 2,
    twinkleDelay: Math.random() * 2,
  }));
}

export default function StarBackground() {
  const layer1 = useMemo(() => generateStars(80), []);
  const layer2 = useMemo(() => generateStars(40), []);
  const layer3 = useMemo(() => generateStars(20), []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 450]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
      <div className="absolute inset-x-0 -top-[50%] h-[200%] w-full">
        <StarLayer stars={layer1} y={y1} />
        <StarLayer stars={layer2} y={y2} />
        <StarLayer stars={layer3} y={y3} />
      </div>
    </div>
  );
}

function StarLayer({ stars, y }: { stars: any[], y: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            '--twinkle-opacity': star.opacity,
            animation: `twinkle ${star.twinkleDuration}s infinite alternate ease-in-out ${star.twinkleDelay}s`
          } as React.CSSProperties}
        />
      ))}
    </motion.div>
  );
}
