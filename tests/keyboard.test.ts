import { describe, expect, it } from 'vitest';
import {
  cycleIndex,
  getKeyboardLayer,
  routeShortcut,
} from '../src/lib/keyboard/router';

describe('keyboard routing priorities', () => {
  it('does not route section shortcuts while typing', () => {
    const input = {
      matches: (selector: string) => selector.includes('input'),
      isContentEditable: false,
    } as unknown as EventTarget;
    const context = { target: input, dialogOpen: true, sectionActive: true };
    expect(getKeyboardLayer(context)).toBe('input');
    expect(routeShortcut('n', context)).toBe('none');
  });

  it('routes consistent dialog shortcuts', () => {
    const context = { target: null, dialogOpen: true, sectionActive: false };
    expect(routeShortcut('n', context)).toBe('next');
    expect(routeShortcut('P', context)).toBe('previous');
    expect(routeShortcut('Escape', context)).toBe('close');
    expect(routeShortcut('d', context)).toBe('download');
    expect(routeShortcut('d', { ...context, dialogOpen: false })).toBe('none');
  });

  it('routes file pager keys outside dialogs', () => {
    const section = { target: null, dialogOpen: false, sectionActive: true };
    expect(routeShortcut(']', section)).toBe('next-file');
    expect(routeShortcut('[', section)).toBe('previous-file');
    expect(routeShortcut(']', { ...section, dialogOpen: true })).toBe('none');
  });

  it('routes arrows, enter, and order outside inputs', () => {
    const section = { target: null, dialogOpen: false, sectionActive: true };
    expect(routeShortcut('ArrowDown', section)).toBe('focus-next');
    expect(routeShortcut('ArrowRight', section)).toBe('focus-next');
    expect(routeShortcut('ArrowUp', section)).toBe('focus-previous');
    expect(routeShortcut('ArrowLeft', section)).toBe('focus-previous');
    expect(routeShortcut('Enter', section)).toBe('activate');
    expect(routeShortcut('o', section)).toBe('order');
    expect(cycleIndex(0, 3, 1)).toBe(1);
    expect(cycleIndex(2, 3, 1)).toBe(0);
    expect(cycleIndex(0, 3, -1)).toBe(2);
  });

  it('opens the command prompt from slash outside inputs', () => {
    const section = { target: null, dialogOpen: false, sectionActive: true };
    expect(routeShortcut('/', section)).toBe('open-terminal');
    expect(routeShortcut('/', { ...section, dialogOpen: true })).toBe('open-terminal');
  });

  it('does not steal slash while a field is focused', () => {
    const input = {
      matches: (selector: string) => selector.includes('input'),
      isContentEditable: false,
    } as unknown as EventTarget;
    expect(routeShortcut('/', { target: input, dialogOpen: false, sectionActive: true })).toBe('none');
  });
});
