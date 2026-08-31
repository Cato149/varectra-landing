import { describe, expect, it } from 'vitest';
import { CHECKER_PHASES, checkerPhaseAt, nextCheckerPhase } from '../src/lib/media/checker';

describe('checkerboard reveal', () => {
  it('walks empty → odd tiles → full image', () => {
    expect(CHECKER_PHASES).toEqual(['empty', 'odd', 'full']);
    expect(nextCheckerPhase('empty')).toBe('odd');
    expect(nextCheckerPhase('odd')).toBe('full');
    expect(nextCheckerPhase('full')).toBe('full');
  });

  it('maps step index onto the same pass', () => {
    expect(checkerPhaseAt(0)).toBe('empty');
    expect(checkerPhaseAt(1)).toBe('odd');
    expect(checkerPhaseAt(2)).toBe('full');
    expect(checkerPhaseAt(9)).toBe('full');
  });
});
