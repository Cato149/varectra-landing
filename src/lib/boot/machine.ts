export type BootState =
  | 'initial'
  | 'logs'
  | 'activation'
  | 'blink'
  | 'greeting'
  | 'await-start'
  | 'terminal-enter'
  | 'complete';

const sequence: BootState[] = [
  'initial',
  'logs',
  'activation',
  'blink',
  'greeting',
  'await-start',
  'terminal-enter',
  'complete',
];

export interface BootPreferences {
  reducedMotion: boolean;
  returningVisitor: boolean;
  deepLink: boolean;
}

export const nextBootState = (state: BootState): BootState => {
  const index = sequence.indexOf(state);
  return sequence[index + 1] ?? 'complete';
};

export const shouldAwaitStart = (preferences: BootPreferences): boolean =>
  !preferences.returningVisitor && !preferences.deepLink;

export const getBootTimings = (
  preferences: BootPreferences,
): Record<BootState, number> => {
  if (preferences.deepLink) {
    return {
      initial: 0,
      logs: 0,
      activation: 0,
      blink: 0,
      greeting: 0,
      'await-start': 0,
      'terminal-enter': 0,
      complete: 0,
    };
  }

  if (preferences.reducedMotion) {
    return {
      initial: 30,
      logs: 120,
      activation: 80,
      blink: 40,
      greeting: 120,
      'await-start': 0,
      'terminal-enter': 80,
      complete: 0,
    };
  }

  const speed = preferences.returningVisitor ? 0.35 : 1;
  return {
    initial: 300 * speed,
    logs: 3200 * speed,
    activation: 650 * speed,
    blink: 900 * speed,
    greeting: 1250 * speed,
    'await-start': 0,
    'terminal-enter': 500 * speed,
    complete: 0,
  };
};
