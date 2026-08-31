export type TreeStem = '├── ' | '└── ' | '│   ' | '    ';
export type TreeBranch = '├── ' | '└── ' | '';

export interface TreeAffix {
  /** Root-level 4ch: tee, corner, ancestor pipe, or blank. */
  stem: TreeStem;
  /** Nested 4ch branch; empty on root rows. */
  branch: TreeBranch;
  /** Stretch a │ through the stem column so wrapped lines stay connected. */
  stemPipe: boolean;
  /** Stretch a │ through a nested tee so wrapped children stay connected. */
  branchPipe: boolean;
}

const teeOrCorner = (isLast: boolean): '├── ' | '└── ' => (isLast ? '└── ' : '├── ');

/**
 * Box-drawing prefix for one filesystem row.
 * Nested files under a non-last folder keep a `│` in the stem column
 * so the tree stays one continuous path, including when names wrap.
 */
export const treeAffix = (
  isLast: boolean,
  nested: boolean,
  parentIsLast = false,
): TreeAffix => {
  if (!nested) {
    const stem = teeOrCorner(isLast);
    return {
      stem,
      branch: '',
      stemPipe: stem === '├── ',
      branchPipe: false,
    };
  }

  const stem: TreeStem = parentIsLast ? '    ' : '│   ';
  const branch = teeOrCorner(isLast);
  return {
    stem,
    branch,
    stemPipe: stem === '│   ',
    branchPipe: branch === '├── ',
  };
};
