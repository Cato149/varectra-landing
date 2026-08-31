export const themes = ['default', 'dracula', 'gruvbox', 'github', 'nordic'] as const;
export type ThemeName = (typeof themes)[number];

export const themeLabels: Record<ThemeName, string> = {
  default: 'shades-of-purple',
  dracula: 'dracula',
  gruvbox: 'gruvbox',
  github: 'github',
  nordic: 'nordic',
};

export const isThemeName = (value: string): value is ThemeName =>
  themes.some((theme) => theme === value);

export const readStoredTheme = (storage: Pick<Storage, 'getItem'>): ThemeName => {
  const stored = storage.getItem('varectra-theme');
  return stored && isThemeName(stored) ? stored : 'default';
};

export const persistTheme = (
  theme: ThemeName,
  storage: Pick<Storage, 'setItem'>,
): void => {
  storage.setItem('varectra-theme', theme);
};
