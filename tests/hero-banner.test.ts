import { describe, expect, it } from 'vitest';
import {
  HERO_BANNER_MQ,
  revealBannerLines,
  varectraBannerLines,
  varectraBannerSource,
} from '../src/lib/hero/banner';

describe('varectra banner', () => {
  it('keeps five equal-width rows', () => {
    expect(varectraBannerSource).toHaveLength(5);
    expect(varectraBannerLines).toHaveLength(5);
    const width = varectraBannerLines[0]?.length ?? 0;
    expect(width).toBeGreaterThan(40);
    expect(new Set(varectraBannerLines.map((line) => line.length))).toEqual(new Set([width]));
  });

  it('reveals rows in order without trimming columns', () => {
    expect(revealBannerLines(0)).toEqual([]);
    expect(revealBannerLines(2)).toEqual(varectraBannerLines.slice(0, 2));
    expect(revealBannerLines(99)).toEqual(varectraBannerLines);
    expect(revealBannerLines(1)[0]?.endsWith(' ')).toBe(true);
  });

  it('uses the same desktop cutoff as compact chrome', () => {
    expect(HERO_BANNER_MQ).toBe('(min-width: 761px)');
  });
});
