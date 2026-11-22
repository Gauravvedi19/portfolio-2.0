/**
 * What colour the home page's silk backdrop should be: a place among the products, 0…n-1, fractional
 * while one blends into the next. Sections report it (the hero: the product on its phone; the line-up:
 * where its scroll is, turning with the phone) — a source returns `undefined` while it isn't the one on
 * screen, and `null` for the neutral, colourless silk (past the line-up).
 */
type Source = () => number | null | undefined;
const sources = new Map<string, Source>();
/** Asked in this order: the first that answers decides. */
const ORDER = ['lineup', 'hero'];

export function setBackdropSource(id: string, source: Source | null) {
  if (source) sources.set(id, source);
  else sources.delete(id);
}

/** The colour wanted now, and which section says so; undefined while no section is on screen. */
export function backdropTarget(): { value: number | null; id: string } | undefined {
  for (const id of ORDER) {
    const value = sources.get(id)?.();
    if (value !== undefined) return { value, id };
  }
  return undefined;
}
