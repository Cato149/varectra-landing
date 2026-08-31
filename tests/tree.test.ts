import { describe, expect, it } from 'vitest';
import { treeAffix } from '../src/lib/sections/tree';

describe('tree affix', () => {
  it('uses a tee for a non-last root row', () => {
    expect(treeAffix(false, false)).toEqual({
      stem: '├── ',
      branch: '',
      stemPipe: true,
      branchPipe: false,
    });
  });

  it('uses a corner for a last root row', () => {
    expect(treeAffix(true, false)).toEqual({
      stem: '└── ',
      branch: '',
      stemPipe: false,
      branchPipe: false,
    });
  });

  it('keeps a pipe under a folder that has more siblings', () => {
    expect(treeAffix(true, true, false)).toEqual({
      stem: '│   ',
      branch: '└── ',
      stemPipe: true,
      branchPipe: false,
    });
  });

  it('drops the pipe under a last folder', () => {
    expect(treeAffix(true, true, true)).toEqual({
      stem: '    ',
      branch: '└── ',
      stemPipe: false,
      branchPipe: false,
    });
  });

  it('uses a nested tee when a folder has more than one file', () => {
    expect(treeAffix(false, true, false)).toEqual({
      stem: '│   ',
      branch: '├── ',
      stemPipe: true,
      branchPipe: true,
    });
  });
});
