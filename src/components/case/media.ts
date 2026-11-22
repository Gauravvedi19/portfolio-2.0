import type { ShowcaseProduct } from '../../showcase/products';
import type { Media } from '../../showcase/caseStudies';
import { posterFor, type ScreenSpec } from '../showcase/phoneStore';

/** A case study's media as a screen for the 3D phone (poster first, then the recording, or a live scene). */
export function mediaScreen(product: ShowcaseProduct, key: string, media: Media): ScreenSpec {
  return {
    key: `${product.id}:${key}`,
    scene: media.scene,
    video: media.video,
    barCleaned: media.barCleaned,
    barInset: media.barInset,
    // A screenshot stands in until the recording plays; without one, the recording's own poster frame.
    poster: media.image ?? posterFor(media.video),
    monogram: product.monogram,
    accent: product.accent,
    accentDeep: product.accentDeep
  };
}
