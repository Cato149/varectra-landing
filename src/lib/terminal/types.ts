import type { LocaleId } from '../i18n/locales';
import type { ThemeName } from '../themes';

export interface TerminalContext {
  navigate: (section: string) => void;
  setTheme: (theme: ThemeName) => void;
  setLocale: (locale: LocaleId) => void;
  locale: LocaleId;
  output: (message: string) => void;
  clear: () => void;
  launchLeg: () => void;
}

export interface TerminalCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  /** When true, the command stays executable but is omitted from the prompt overlay. */
  hiddenFromSuggestions?: boolean;
  execute: (
    context: TerminalContext,
    args: string[],
  ) => void | Promise<void>;
}

export interface ParsedCommand {
  command: string;
  args: string[];
}
