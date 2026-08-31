import { describe, expect, it } from 'vitest';
import {
  LEG_FRAME_HEIGHT,
  LEG_FRAME_WIDTH,
  legFrames,
  parseLegFrames,
} from '../src/lib/terminal/leg-animation';

describe('leg ASCII animation', () => {
  it('splits a stacked dump into padded frames and drops a leading blank', () => {
    const blank = `${' '.repeat(LEG_FRAME_WIDTH)}\n`.repeat(LEG_FRAME_HEIGHT);
    const frame = Array.from({ length: LEG_FRAME_HEIGHT }, (_, index) =>
      `${index === 0 ? '@' : ' '}`.padEnd(LEG_FRAME_WIDTH),
    ).join('\n');

    const parsed = parseLegFrames(`${blank}${frame}`);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.split('\n')).toHaveLength(LEG_FRAME_HEIGHT);
    expect(parsed[0]?.startsWith('@')).toBe(true);
  });

  it('loads the bundled animation as 90 by 91 frames', () => {
    expect(legFrames.length).toBeGreaterThan(40);
    for (const frame of legFrames) {
      const rows = frame.split('\n');
      expect(rows).toHaveLength(LEG_FRAME_HEIGHT);
      expect(Math.max(...rows.map((row) => row.length))).toBeLessThanOrEqual(LEG_FRAME_WIDTH);
    }
    expect(legFrames[0]?.trim()).not.toBe('');
  });
});
