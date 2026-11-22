import { PRODUCTS, type ShowcaseProduct } from '../showcase/products';
import { getPhoneState, screenStatus } from './showcase/phoneStore';
import type { Destination } from './PageTransition';

/** Into a product's case study: ready once its phone shows the case study's own opening screen. */
export function caseStudyDest(p: ShowcaseProduct): Destination {
  return {
    to: p.route,
    label: p.name.replace('®', ''),
    sub: `Case study · ${p.category}`,
    accent: p.accent,
    deep: p.accentDeep,
    // The key CaseHero's screen has (media.ts: `${id}:hero`).
    ready: () => !getPhoneState().webgl || screenStatus.key === `${p.id}:hero`
  };
}

/**
 * Back to the work, landing on this product's own place in the line-up. The mask carries the line-up's
 * index of names, settling on this one: you're shown where you're going back to.
 */
export function workDest(p: ShowcaseProduct): Destination {
  return {
    to: '/#work',
    state: { product: p.id },
    deep: p.accentDeep,
    index: {
      items: PRODUCTS.map((q) => ({ label: q.name.replace('®', ''), accent: q.accent })),
      active: PRODUCTS.findIndex((q) => q.id === p.id)
    }
  };
}
