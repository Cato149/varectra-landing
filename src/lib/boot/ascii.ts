export type AsciiMetrics = {
  cols: number;
  rows: number;
};

/**
 * Derive the raster size from CMS ASCII so font scaling stays aligned
 * after an editor changes the portrait. Trailing spaces count as columns.
 */
export const measureAsciiArt = (art: string): AsciiMetrics => {
  const normalized = art.replace(/\r\n/g, '\n').replace(/\n$/, '');
  if (normalized.length === 0) return { cols: 0, rows: 0 };

  const lines = normalized.split('\n');
  return {
    rows: lines.length,
    cols: lines.reduce((max, line) => Math.max(max, line.length), 0),
  };
};
