import { describe, expect, it } from 'vitest';
import screen from '../src/content/boot/en/screen.json';
import { measureAsciiArt } from '../src/lib/boot/ascii';
import {
  getBootTimings,
  nextBootState,
  shouldAwaitStart,
} from '../src/lib/boot/machine';

describe('boot state machine', () => {
  it('progresses through explicit states', () => {
    expect(nextBootState('initial')).toBe('logs');
    expect(nextBootState('blink')).toBe('greeting');
    expect(nextBootState('greeting')).toBe('await-start');
    expect(nextBootState('await-start')).toBe('terminal-enter');
    expect(nextBootState('terminal-enter')).toBe('complete');
  });

  it('waits for a key only on the first visit', () => {
    expect(shouldAwaitStart({
      reducedMotion: false,
      returningVisitor: false,
      deepLink: false,
    })).toBe(true);
    expect(shouldAwaitStart({
      reducedMotion: true,
      returningVisitor: false,
      deepLink: false,
    })).toBe(true);
    expect(shouldAwaitStart({
      reducedMotion: false,
      returningVisitor: true,
      deepLink: false,
    })).toBe(false);
    expect(shouldAwaitStart({
      reducedMotion: false,
      returningVisitor: false,
      deepLink: true,
    })).toBe(false);
  });

  it('shortens reduced-motion and returning-visitor boots', () => {
    const normal = getBootTimings({
      reducedMotion: false,
      returningVisitor: false,
      deepLink: false,
    });
    const returning = getBootTimings({
      reducedMotion: false,
      returningVisitor: true,
      deepLink: false,
    });
    const reduced = getBootTimings({
      reducedMotion: true,
      returningVisitor: false,
      deepLink: false,
    });

    expect(returning.logs).toBeLessThan(normal.logs);
    expect(reduced.logs).toBeLessThan(returning.logs);
  });

  it('skips all animation for deep links', () => {
    expect(getBootTimings({
      reducedMotion: false,
      returningVisitor: false,
      deepLink: true,
    }).logs).toBe(0);
  });
});

describe('boot ascii art', () => {
  it('measures columns from the longest line and ignores a trailing newline', () => {
    expect(measureAsciiArt('')).toEqual({ cols: 0, rows: 0 });
    expect(measureAsciiArt('ab\nabcd\na\n')).toEqual({ cols: 4, rows: 3 });
  });

  it('keeps the CMS portrait aligned to its own raster', () => {
    const metrics = measureAsciiArt(screen.ascii);
    const lines = screen.ascii.replace(/\n$/, '').split('\n');

    expect(metrics.rows).toBe(lines.length);
    expect(metrics.cols).toBe(Math.max(...lines.map((line) => line.length)));
    expect(screen.ascii).toContain('++++++');
    expect(screen.ascii).toContain('++++++++++++');
  });
});
