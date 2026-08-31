export type HotspotGesture = 'highlight' | 'open';

/**
 * Touch needs two steps: first tap arms a hotspot, the second opens it.
 * A fine pointer (mouse / trackpad) still opens on the first click.
 */
export const resolveHotspotGesture = (
  specIndex: number,
  armedIndex: number,
  immediateOpen: boolean,
): HotspotGesture => {
  if (immediateOpen || armedIndex === specIndex) return 'open';
  return 'highlight';
};
