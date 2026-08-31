import { describe, expect, it } from 'vitest';
import { resolveHotspotGesture } from '../src/lib/sections/hotspots';
import { desktopSectionHint, getSectionFile, promptPlaceholder } from '../src/lib/sections/files';

describe('tech-docs hotspot gestures', () => {
  it('opens immediately for a fine pointer', () => {
    expect(resolveHotspotGesture(2, -1, true)).toBe('open');
  });

  it('highlights the first tap and opens the second on the same hotspot', () => {
    expect(resolveHotspotGesture(1, -1, false)).toBe('highlight');
    expect(resolveHotspotGesture(1, 1, false)).toBe('open');
  });

  it('re-arms when another hotspot is tapped', () => {
    expect(resolveHotspotGesture(3, 1, false)).toBe('highlight');
  });

  it('keeps the tap tip on the tech-docs file', () => {
    expect(getSectionFile('tech-docs').hint).toBe(
      'tip: one tap = highlight, two = info',
    );
  });

  it('shows the tap tip only on a compact prompt', () => {
    expect(promptPlaceholder('tech-docs', true)).toBe(
      'tip: one tap = highlight, two = info',
    );
    expect(promptPlaceholder('home', true)).toBe('help');
  });

  it('shows the arrow tip on desktop for pages that support it', () => {
    const hints = { arrows: 'tip: arrows move · enter open', exec: 'tip: arrows move · enter open · o order' };
    expect(desktopSectionHint('tech-docs', hints)).toBe(hints.arrows);
    expect(desktopSectionHint('exec', hints)).toBe(hints.exec);
    expect(desktopSectionHint('home', hints)).toBeUndefined();
    expect(promptPlaceholder('tech-docs', false, hints.arrows)).toBe(hints.arrows);
    expect(promptPlaceholder('home', false)).toBe('help');
  });
});
