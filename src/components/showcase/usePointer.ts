import { useEffect } from 'react';
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'motion/react';

/**
 * The pointer's position across the window, -1…1 on each axis and sprung so anything driven by it
 * glides. Touch devices and reduced-motion users get a still 0, so nothing drifts on its own.
 */
export function usePointer(spring = { stiffness: 60, damping: 18, mass: 0.6 }): { x: MotionValue<number>; y: MotionValue<number> } {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, rawX, rawY]);

  return { x, y };
}
