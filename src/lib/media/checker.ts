export type CheckerPhase = 'empty' | 'odd' | 'full';

/** Two-pass checkerboard reveal: empty board → odd tiles → full image. */
export const CHECKER_PHASES: readonly CheckerPhase[] = ['empty', 'odd', 'full'];

export const CHECKER_STEP_MS = 160;

export const nextCheckerPhase = (phase: CheckerPhase): CheckerPhase => {
  switch (phase) {
    case 'empty':
      return 'odd';
    case 'odd':
      return 'full';
    case 'full':
      return 'full';
    default: {
      const _never: never = phase;
      return _never;
    }
  }
};

export const checkerPhaseAt = (step: number): CheckerPhase => {
  if (step <= 0) return 'empty';
  if (step === 1) return 'odd';
  return 'full';
};
