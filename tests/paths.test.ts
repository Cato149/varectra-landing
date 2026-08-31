import { describe, expect, it } from 'vitest';
import { publicUrl } from '../src/lib/paths';

describe('publicUrl', () => {
  it('keeps root-relative public paths under the default base', () => {
    expect(publicUrl('/icons/social/generic.svg')).toBe('/icons/social/generic.svg');
    expect(publicUrl('favicon.svg')).toBe('/favicon.svg');
  });
});
