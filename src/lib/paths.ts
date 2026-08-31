/**
 * Prefix a public-folder path with Astro `base` so GitHub project Pages
 * (`/repo-name/…`) and a local root (`/…`) resolve the same assets.
 */
export const publicUrl = (path: string): string => {
  const raw = typeof import.meta.env.BASE_URL === 'string' && import.meta.env.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';
  const base = raw.endsWith('/') ? raw : `${raw}/`;
  return `${base}${path.replace(/^\//, '')}`;
};
