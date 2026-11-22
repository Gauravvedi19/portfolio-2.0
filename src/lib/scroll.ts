import type Lenis from 'lenis';

/** The one Lenis instance App creates, shared so any section can scroll smoothly with it. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Scroll to a page offset (px) or an element, through Lenis when it's running. */
export function scrollToTarget(target: number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.4 });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + (opts.offset ?? 0), behavior: opts.immediate ? 'auto' : 'smooth' });
}
