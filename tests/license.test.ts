import { describe, expect, it } from 'vitest';
import { licenseArt, licenseArtMetrics } from '../src/lib/license/art';

describe('license art', () => {
  it('keeps the author portrait dimensions', () => {
    const lines = licenseArt.split('\n');
    expect(lines).toHaveLength(licenseArtMetrics.rows);
    expect(Math.max(...lines.map((line) => line.length))).toBe(licenseArtMetrics.cols);
  });
});
