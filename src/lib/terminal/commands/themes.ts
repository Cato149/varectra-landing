import { isThemeName, themeLabels, themes } from '../../themes';
import type { TerminalCommand } from '../types';

export const themesCommand: TerminalCommand = {
  name: 'themes',
  description: 'List or activate an interface theme',
  usage: 'themes [default|dracula|gruvbox|github|nordic]',
  execute: (context, args) => {
    const requested = args[0]?.toLowerCase();
    if (!requested) {
      context.output(`available themes:\n${themes
        .map((theme) => `  ${theme.padEnd(9)} ${themeLabels[theme]}`)
        .join('\n')}`);
      return;
    }

    if (!isThemeName(requested)) {
      context.output(`theme not found: ${requested}\nusage: ${themesCommand.usage}`);
      return;
    }

    context.setTheme(requested);
    context.output(`theme activated: ${themeLabels[requested]}`);
  },
};
