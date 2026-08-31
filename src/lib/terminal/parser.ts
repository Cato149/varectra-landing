import type { ParsedCommand } from './types';

export const parseCommand = (input: string): ParsedCommand | null => {
  const normalized = input.trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  const [rawCommand = '', ...rawArgs] = normalized.split(' ');

  if (rawCommand === 'cd' && rawArgs[0]) {
    return {
      command: `/${rawArgs[0].replace(/^\/+/, '')}`,
      args: rawArgs.slice(1),
    };
  }

  const command = rawCommand.startsWith('/')
    ? `/${rawCommand.slice(1).toLowerCase()}`
    : rawCommand.toLowerCase();

  return { command, args: rawArgs };
};
