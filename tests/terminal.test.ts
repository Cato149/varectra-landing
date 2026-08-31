import { describe, expect, it, vi } from 'vitest';
import { parseCommand } from '../src/lib/terminal/parser';
import { executeCommand, getCommandSuggestions } from '../src/lib/terminal/registry';
import type { TerminalContext } from '../src/lib/terminal/types';

const createContext = (): TerminalContext => ({
  navigate: vi.fn(),
  setTheme: vi.fn(),
  setLocale: vi.fn(),
  locale: 'en',
  output: vi.fn(),
  clear: vi.fn(),
  launchLeg: vi.fn(),
});

describe('terminal parser and registry', () => {
  it('parses canonical commands and arguments', () => {
    expect(parseCommand('/themes nordic')).toEqual({
      command: '/themes',
      args: ['nordic'],
    });
  });

  it('normalizes cd navigation aliases', () => {
    expect(parseCommand('cd whoami')).toEqual({
      command: '/whoami',
      args: [],
    });
  });

  it('executes navigation aliases', async () => {
    const context = createContext();
    await executeCommand('about', context);
    expect(context.navigate).toHaveBeenCalledWith('whoami');
    await executeCommand('/license', context);
    expect(context.navigate).toHaveBeenCalledWith('license');
    await executeCommand('credits', context);
    expect(context.navigate).toHaveBeenCalledWith('license');
  });

  it('prints help and reports unknown commands', async () => {
    const context = createContext();
    expect(await executeCommand('/help', context)).toBe(true);
    expect(context.output).toHaveBeenCalledWith(expect.stringContaining('/whoami'));

    expect(await executeCommand('/does-not-exist', context)).toBe(false);
    expect(context.output).toHaveBeenLastCalledWith(expect.stringContaining('command not found'));
  });

  it('launches the /leg animation', async () => {
    const context = createContext();
    expect(await executeCommand('/leg', context)).toBe(true);
    expect(context.launchLeg).toHaveBeenCalledOnce();
    expect(await executeCommand('leg', context)).toBe(true);
    expect(context.launchLeg).toHaveBeenCalledTimes(2);
  });

  it('does not keep the old sl command', async () => {
    const context = createContext();
    expect(await executeCommand('sl', context)).toBe(false);
    expect(context.launchLeg).not.toHaveBeenCalled();
  });

  it('removes the clear command', async () => {
    const context = createContext();
    expect(await executeCommand('clear', context)).toBe(false);
    expect(await executeCommand('/clear', context)).toBe(false);
    expect(context.clear).not.toHaveBeenCalled();
  });

  it('hides /leg from prompt suggestions and keeps it in /help', async () => {
    expect(getCommandSuggestions('/').some((command) => command.name === '/leg')).toBe(false);
    expect(getCommandSuggestions('/leg').some((command) => command.name === '/leg')).toBe(false);
    expect(getCommandSuggestions('').some((command) => command.name === '/leg')).toBe(false);

    const context = createContext();
    expect(await executeCommand('/help', context)).toBe(true);
    expect(context.output).toHaveBeenCalledWith(expect.stringContaining('/leg'));
    expect(context.output).toHaveBeenCalledWith(expect.not.stringContaining('clear'));
  });

  it('switches locale from the locale command', async () => {
    const context = createContext();
    expect(await executeCommand('/locale ru', context)).toBe(true);
    expect(context.setLocale).toHaveBeenCalledWith('ru');
    expect(await executeCommand('locale by', context)).toBe(true);
    expect(context.setLocale).toHaveBeenCalledWith('by');
    expect(await executeCommand('/locale', context)).toBe(true);
    expect(context.output).toHaveBeenCalledWith(expect.stringContaining('ENG'));
  });
});
