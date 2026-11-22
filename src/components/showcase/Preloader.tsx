import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from 'motion/react';
import { getLenis } from '../../lib/scroll';
import { usePhoneState } from './phoneStore';

const HELLOS = ['Hello', 'नमस्ते', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', 'Hallo', 'Olá', 'Привет', 'Hello'];
/** The model the hero needs before it can be seen. The 3D stage loads the same URL from cache. */
const MODEL_URL = '/models/iphone-18-pro-max.glb';
/** Never hold the visitor longer than this, loaded or not. */
const MAX_MS = 7000;

let shown = false;

/** Streams the model to report real progress (0…1). Resolves at 1 even if it fails, so nothing waits forever. */
function useModelProgress(enabled: boolean) {
  const [progress, setProgress] = useState(enabled ? 0 : 1);
  useEffect(() => {
    if (!enabled) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(MODEL_URL, { signal: ctrl.signal });
        const total = Number(res.headers.get('content-length')) || 0;
        const reader = res.body?.getReader();
        if (!reader || !total) { await res.arrayBuffer(); setProgress(1); return; }
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          got += value.length;
          setProgress(Math.min(1, got / total));
        }
        setProgress(1);
      } catch {
        if (!ctrl.signal.aborted) setProgress(1);
      }
    })();
    return () => ctrl.abort();
  }, [enabled]);
  return progress;
}

/**
 * Opens the home page: "hello" in the languages I work around, a counter that tracks the 3D model
 * actually downloading, then a curtain that lifts with a curved edge. Shown once per page load.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(!shown);
  const webgl = usePhoneState((s) => s.webgl);
  const modelReady = usePhoneState((s) => s.modelReady);
  const progress = useModelProgress(visible && webgl);
  const [word, setWord] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'));

  useEffect(() => {
    if (!visible) return;
    shown = true;
    getLenis()?.stop();
    const t = window.setTimeout(() => setTimedOut(true), MAX_MS);
    return () => { window.clearTimeout(t); getLenis()?.start(); };
  }, [visible]);

  // Words step quickly at first, then settle on the last one.
  useEffect(() => {
    if (!visible || word >= HELLOS.length - 1) return;
    const t = window.setTimeout(() => setWord((w) => w + 1), word === 0 ? 700 : 170);
    return () => window.clearTimeout(t);
  }, [visible, word]);

  // The counter eases toward real progress (held at 90 until the model is parsed, not just downloaded).
  const target = (modelReady || !webgl ? 1 : Math.min(progress, 0.9)) * 100;
  useEffect(() => {
    const c = animate(count, target, { duration: 0.6, ease: 'easeOut' });
    return () => c.stop();
  }, [target, count]);

  const done = word >= HELLOS.length - 1 && (target >= 100 || timedOut);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-[#050506] text-white"
        >
          {/* The curved trailing edge of the curtain */}
          <motion.svg
            aria-hidden
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            className="absolute top-full left-0 w-full h-[12vh] fill-[#050506]"
            exit={{ height: '0vh' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <path d="M0 0 H100 Q50 20 0 0 Z" />
          </motion.svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={word}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 font-display text-5xl sm:text-7xl"
              >
                <span className="w-2 h-2 rounded-full bg-white/80" />
                {HELLOS[word]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 sm:bottom-10 inset-x-6 sm:inset-x-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            <span>Gaurav Vedi — Portfolio {new Date().getFullYear()}</span>
            <motion.span className="font-display text-4xl sm:text-5xl tracking-normal normal-case text-white/80 tabular-nums">{label}</motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
