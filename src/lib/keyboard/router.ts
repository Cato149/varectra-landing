export type KeyboardLayer = 'input' | 'dialog' | 'section' | 'global';
export type ShortcutAction =
  | 'next'
  | 'previous'
  | 'focus-next'
  | 'focus-previous'
  | 'activate'
  | 'order'
  | 'next-file'
  | 'previous-file'
  | 'close'
  | 'download'
  | 'open-terminal'
  | 'none';

export interface KeyboardContext {
  target: EventTarget | null;
  dialogOpen: boolean;
  sectionActive: boolean;
}

const isTextInput = (target: EventTarget | null): boolean => {
  if (!target || typeof target !== 'object') return false;
  const candidate = target as EventTarget & {
    matches?: (selector: string) => boolean;
    isContentEditable?: boolean;
  };
  return Boolean(
    (candidate.matches?.('input, textarea, select') ?? false) ||
    candidate.isContentEditable,
  );
};

export const getKeyboardLayer = (context: KeyboardContext): KeyboardLayer => {
  if (isTextInput(context.target)) return 'input';
  if (context.dialogOpen) return 'dialog';
  if (context.sectionActive) return 'section';
  return 'global';
};

export const routeShortcut = (
  key: string,
  context: KeyboardContext,
): ShortcutAction => {
  if (getKeyboardLayer(context) === 'input') return 'none';

  const normalized = key.toLowerCase();

  switch (normalized) {
    case 'n':
      return 'next';
    case 'p':
      return 'previous';
    case 'arrowdown':
    case 'arrowright':
      return 'focus-next';
    case 'arrowup':
    case 'arrowleft':
      return 'focus-previous';
    case 'enter':
      return 'activate';
    case 'o':
      return 'order';
    case ']':
      return context.dialogOpen ? 'none' : 'next-file';
    case '[':
      return context.dialogOpen ? 'none' : 'previous-file';
    case 'q':
    case 'escape':
      return 'close';
    case 'd':
      return context.dialogOpen ? 'download' : 'none';
    case '/':
      return 'open-terminal';
    default:
      return 'none';
  }
};

export const cycleIndex = (current: number, length: number, direction: 1 | -1): number => {
  if (length <= 0) return 0;
  return (current + direction + length) % length;
};
