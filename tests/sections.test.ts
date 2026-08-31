import { describe, expect, it } from 'vitest';
import {
  resolveSectionId,
  sectionFiles,
  shiftSectionId,
} from '../src/lib/sections/files';

describe('section files', () => {
  it('resolves hashes and aliases to a file id', () => {
    expect(resolveSectionId('#whoami')).toBe('whoami');
    expect(resolveSectionId('connect')).toBe('home');
    expect(resolveSectionId('info')).toBe('home');
    expect(resolveSectionId('documentation')).toBe('tech-docs');
    expect(resolveSectionId('contacts')).toBe('protocols');
    expect(resolveSectionId('')).toBe('home');
    expect(resolveSectionId('missing')).toBe('home');
  });

  it('uses plain menu titles without file chrome', () => {
    expect(sectionFiles.map((file) => file.menu)).toEqual([
      'info',
      'whoami',
      'documentation',
      'work',
      'events',
      'media',
      'contacts',
      'credits',
    ]);
  });

  it('resolves the LICENSE file', () => {
    expect(resolveSectionId('#license')).toBe('license');
    expect(resolveSectionId('LICENSE')).toBe('license');
    expect(resolveSectionId('credits')).toBe('license');
  });

  it('wraps previous and next files', () => {
    expect(shiftSectionId('home', 1)).toBe('whoami');
    expect(shiftSectionId('protocols', 1)).toBe('license');
    expect(shiftSectionId('license', 1)).toBe('home');
    expect(shiftSectionId('home', -1)).toBe('license');
  });
});
