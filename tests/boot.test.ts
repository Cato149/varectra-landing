import { describe, expect, it } from 'vitest';
import { asciiMetrics, protogenArt, protogenAscii } from '../src/lib/boot/ascii';
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

describe('protogen ascii', () => {
  it('keeps a single identity raster for every viewport', () => {
    expect(asciiMetrics.desktop).toEqual(asciiMetrics.tablet);
    expect(asciiMetrics.desktop).toEqual(asciiMetrics.mobile);
    expect(protogenArt.split('\n')).toHaveLength(asciiMetrics.desktop.rows);
    expect(asciiMetrics.desktop.cols).toBe(125);
  });

  it('uses the plus-based source portrait', () => {
    expect(protogenAscii.desktop).toBe(protogenArt);
    expect(protogenArt).toContain('++++++');
    expect(protogenArt).toContain('++++++++++++');
  });
});
