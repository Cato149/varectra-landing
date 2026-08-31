import type { ParsedCommand } from './types';

export const parseCommand = (input: string): ParsedCommand | null => {
  const normalized = input.trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  const [rawCommand = '', ...rawArgs] = normalized.split(' ');

  const stripSlash = (value: string) => value.replace(/^\/+/, '').toLowerCase();

  if (rawCommand === 'cd' && rawArgs[0]) {
    return {
      command: stripSlash(rawArgs[0]),
      args: rawArgs.slice(1),
    };
  }

  const command = stripSlash(rawCommand);

  return { command, args: rawArgs };
};
