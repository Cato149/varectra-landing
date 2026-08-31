import type { TerminalCommand } from '../types';

interface NavigationDefinition {
  name: string;
  section: string;
  description: string;
  aliases?: string[];
}

export const createNavigationCommand = (
  definition: NavigationDefinition,
): TerminalCommand => ({
  name: definition.name,
  ...(definition.aliases ? { aliases: definition.aliases } : {}),
  description: definition.description,
  execute: (context) => context.navigate(definition.section),
});
