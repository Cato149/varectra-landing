import { createNavigationCommand } from './commands/navigation';
import { localeCommand } from './commands/locale';
import { themesCommand } from './commands/themes';
import { getMessages } from '../i18n/messages';
import { parseCommand } from './parser';
import type { TerminalCommand, TerminalContext } from './types';

const navigationCommands: TerminalCommand[] = [
  createNavigationCommand({
    name: 'about',
    section: 'whoami',
    aliases: ['whoami', 'about'],
    description: 'Open identity records',
  }),
  createNavigationCommand({
    name: 'tech-docs',
    section: 'tech-docs',
    aliases: ['tech-docs', 'specs'],
    description: 'Inspect Varectra technical specifications',
  }),
  createNavigationCommand({
    name: 'exec',
    section: 'exec',
    aliases: ['exec', 'work'],
    description: 'Browse projects and services',
  }),
  createNavigationCommand({
    name: 'router',
    section: 'router',
    aliases: ['router', 'events'],
    description: 'Read event routing logs',
  }),
  createNavigationCommand({
    name: 'static',
    section: 'static',
    aliases: ['static', 'gallery'],
    description: 'Browse the media filesystem',
  }),
  createNavigationCommand({
    name: 'protocols',
    section: 'protocols',
    aliases: ['protocols', 'socials'],
    description: 'List communication protocols',
  }),
  createNavigationCommand({
    name: 'license',
    section: 'license',
    aliases: ['license', 'credits', 'author', '/LICENSE', 'LICENSE'],
    description: 'Read author license and credits',
  }),
];

export const commandRegistry: TerminalCommand[] = [
  {
    name: 'help',
    aliases: [],
    description: 'Show available commands',
    execute: (context) => {
      const copy = getMessages(context.locale);
      context.output(commandRegistry
        .map((command) => `${command.name.padEnd(13)} ${copy.commands[command.name] ?? command.description}`)
        .join('\n'));
    },
  },
  ...navigationCommands,
  themesCommand,
  localeCommand,
  {
    name: 'leg',
    aliases: [],
    description: 'Extend the local canid beyond its specified length',
    hiddenFromSuggestions: true,
    execute: (context) => {
      context.output('executing leg …');
      context.launchLeg();
    },
  },
];

const commandLookup = new Map<string, TerminalCommand>();
for (const command of commandRegistry) {
  commandLookup.set(command.name, command);
  for (const alias of command.aliases ?? []) {
    commandLookup.set(alias, command);
  }
}

export const executeCommand = async (
  input: string,
  context: TerminalContext,
): Promise<boolean> => {
  const parsed = parseCommand(input);
  if (!parsed) return false;

  const command = commandLookup.get(parsed.command);
  if (!command) {
    const copy = getMessages(context.locale);
    context.output(`${copy.terminal.notFound}: ${parsed.command}\n${copy.terminal.tryHelp}`);
    return false;
  }

  await command.execute(context, parsed.args);
  return true;
};

export const getCommandSuggestions = (input: string): TerminalCommand[] => {
  const query = input.trim().toLowerCase().replace(/^\/+/, '');
  const listed = commandRegistry.filter((command) => !command.hiddenFromSuggestions);
  if (!query) return listed;
  return listed.filter((command) =>
    [command.name, ...(command.aliases ?? [])].some((name) =>
      name.startsWith(query)),
  );
};
