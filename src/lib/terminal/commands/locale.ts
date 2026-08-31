import { localeIds, localeLabels, parseLocale } from '../../i18n/locales';
import { getMessages } from '../../i18n/messages';
import type { TerminalCommand } from '../types';

export const localeCommand: TerminalCommand = {
  name: 'locale',
  aliases: [],
  description: 'List or activate an interface locale',
  usage: 'locale [ru|en|by]',
  execute: (context, args) => {
    const copy = getMessages(context.locale);
    const requested = args[0];
    if (!requested) {
      const listing = localeIds
        .map((id) => `  ${id.padEnd(4)} ${localeLabels[id]}`)
        .join('\n');
      context.output(
        `${copy.terminal.localeCurrent}: ${localeLabels[context.locale]}\n${listing}\nusage: ${copy.terminal.localeUsage}`,
      );
      return;
    }

    const parsed = parseLocale(requested);
    if (!parsed) {
      context.output(
        `${copy.terminal.localeUnknown}: ${requested}\nusage: ${copy.terminal.localeUsage}`,
      );
      return;
    }

    context.setLocale(parsed);
    context.output(`${copy.terminal.localeActivated}: ${localeLabels[parsed]}`);
  },
};
