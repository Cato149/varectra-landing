/**
 * Slanted block banner for the home name. Trailing spaces keep letter
 * columns aligned; do not trim.
 */
export const varectraBannerSource = [
  ' █████   █████                                        █████                       ',
  '░░███   ░░███                                        ░░███                        ',
  ' ░███    ░███   ██████   ████████   ██████   ██████  ███████   ████████   ██████  ',
  ' ░███    ░███  ░░░░░███ ░░███░░███ ███░░███ ███░░███░░░███░   ░░███░░███ ░░░░░███ ',
  ' ░░███   ███    ███████  ░███ ░░░ ░███████ ░███ ░░░   ░███     ░███ ░░░   ███████ ',
  '  ░░░█████░    ███░░███  ░███     ░███░░░  ░███  ███  ░███ ███ ░███      ███░░███ ',
  '    ░░███     ░░████████ █████    ░░██████ ░░██████   ░░█████  █████    ░░████████',
  '     ░░░       ░░░░░░░░ ░░░░░      ░░░░░░   ░░░░░░     ░░░░░  ░░░░░      ░░░░░░░░ ',
] as const;

const bannerWidth = Math.max(...varectraBannerSource.map((line) => line.length));

export const varectraBannerLines = varectraBannerSource.map((line) => line.padEnd(bannerWidth, ' '));

export const BANNER_LINE_MS = 90;

/** Same cutoff as the compact chrome / site-nav mobile layout. */
export const HERO_BANNER_MQ = '(min-width: 761px)';

export const revealBannerLines = (count: number): string[] => {
  const clamped = Math.max(0, Math.min(count, varectraBannerLines.length));
  return varectraBannerLines.slice(0, clamped);
};
