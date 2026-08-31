import type { ContentLocale } from './locales';

export interface SitePack {
  tagline: string;
  description: string;
  location: string;
  whoami: Array<{ title: string; label: string; body: string }>;
  specs: Array<{
    id: string;
    title: string;
    x: number;
    y: number;
    output: string[];
    body: string;
  }>;
  interactions: Array<{
    title: string;
    state: string;
    description: string;
    severity: 'allowed' | 'ask' | 'warning' | 'forbidden' | 'info';
  }>;
  projects: Array<{
    id: string;
    title: string;
    directory: string;
    summary: string;
    body: string;
    images: Array<{ src: string; alt: string; width: number; height: number }>;
    technologies: string[];
    links: Array<{ label: string; url: string }>;
  }>;
  events: Array<{
    title: string;
    date: string;
    type: string;
    city: string;
    summary?: string | undefined;
  }>;
  gallery: Array<{
    image: string;
    alt: string;
    caption?: string | undefined;
    date?: string | undefined;
    category?: string | undefined;
    width: number;
    height: number;
  }>;
  protocols: Array<{
    platform: string;
    label: string;
    username?: string | undefined;
    url: string;
    symbol: string;
  }>;
}

export type SiteCatalog = Record<ContentLocale, SitePack>;
