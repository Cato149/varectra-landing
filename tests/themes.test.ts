import { describe, expect, it, vi } from 'vitest';
import {
  persistTheme,
  readStoredTheme,
} from '../src/lib/themes';

describe('theme persistence', () => {
  it('restores supported themes and rejects unknown values', () => {
    expect(readStoredTheme({ getItem: () => 'nordic' })).toBe('nordic');
    expect(readStoredTheme({ getItem: () => 'neon-rainbow' })).toBe('default');
  });

  it('stores the selected theme', () => {
    const setItem = vi.fn();
    persistTheme('gruvbox', { setItem });
    expect(setItem).toHaveBeenCalledWith('varectra-theme', 'gruvbox');
  });
});
