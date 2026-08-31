import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { localeIds } from './lib/i18n/locales';

const localeField = z.enum(localeIds).default('en');

const markdown = (base: string) => glob({ base, pattern: '**/*.{md,mdx}' });

const settings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '**/*.json' }),
  schema: z.object({
    locale: localeField,
    name: z.string(),
    handle: z.string(),
    tagline: z.string(),
    description: z.string(),
    siteUrl: z.string().url(),
    telegramUrl: z.string().url(),
    location: z.string(),
  }),
});

const whoami = defineCollection({
  loader: markdown('./src/content/whoami'),
  schema: z.object({
    title: z.string(),
    label: z.string(),
    order: z.number().int(),
    locale: localeField,
  }),
});

const specs = defineCollection({
  loader: markdown('./src/content/specs'),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    locale: localeField,
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    output: z.array(z.string()),
  }),
});

const interaction = defineCollection({
  loader: markdown('./src/content/interaction'),
  schema: z.object({
    title: z.string(),
    state: z.string(),
    description: z.string(),
    severity: z.enum(['allowed', 'ask', 'warning', 'forbidden', 'info']),
    order: z.number().int(),
    locale: localeField,
  }),
});

const projects = defineCollection({
  loader: markdown('./src/content/projects'),
  schema: z.object({
    title: z.string(),
    directory: z.string(),
    summary: z.string(),
    order: z.number().int(),
    locale: localeField,
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })).default([]),
    technologies: z.array(z.string()).default([]),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
  }),
});

const events = defineCollection({
  loader: markdown('./src/content/events'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.string(),
    city: z.string(),
    summary: z.string().optional(),
    locale: localeField,
  }),
});

const gallery = defineCollection({
  loader: markdown('./src/content/gallery'),
  schema: z.object({
    image: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    date: z.coerce.date().optional(),
    category: z.string().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    order: z.number().int(),
    locale: localeField,
  }),
});

const protocols = defineCollection({
  loader: markdown('./src/content/protocols'),
  schema: z.object({
    platform: z.string(),
    label: z.string(),
    url: z.string().refine((value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:';
      } catch {
        return false;
      }
    }, { message: 'Must be an http(s) or mailto URL' }),
    username: z.string().optional(),
    symbol: z.string().default('>'),
    order: z.number().int(),
    locale: localeField,
  }),
});

export const collections = {
  settings,
  whoami,
  specs,
  interaction,
  projects,
  events,
  gallery,
  protocols,
};
