# Varectra Personal System

Static personal landing in the visual language of a calm Unix/TUI interface. The
site remains a semantic, scrollable web page; terminal commands, keyboard
shortcuts, boot output and character-map interactions are progressive
enhancements.

## Stack

- Astro 5 static generation
- TypeScript in strict mode
- Svelte 5 islands for interactive sections
- Astro Content Collections for validated Markdown/JSON content
- Sveltia CMS for Git-based editing
- Vitest for pure interaction and content logic

## Development

Node.js 20 LTS or newer is recommended. The project still builds on Node 18.17,
but several transitive development dependencies now declare newer engine
requirements.

```sh
npm install
npm run dev
```

The site runs at `http://localhost:4321`. Other commands:

```sh
npm run check
npm test
npm run build
npm run preview
```

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds on every push to `main`
and publishes `dist/` with GitHub Actions.

1. Push the repository to GitHub (`Cato149/varectra-landing` or your fork).
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Merge to `main` (or run **Actions → Deploy to GitHub Pages → Run workflow**).

A project site is served at `https://<user>.github.io/<repo>/`. CI sets Astro
`site` and `base` from `GITHUB_REPOSITORY`. Local `npm run dev` stays at `/`.

For a custom domain, add `public/CNAME` and set workflow env:

```yaml
env:
  SITE: https://varectra.example
  BASE_PATH: /
```

Also update `siteUrl` in `src/content/settings/`. Admin is then
`https://<host>/admin/` (or `/<repo>/admin/` on a project site).

## Content and CMS

Content lives under `src/content/`:

- `settings/<locale>/` — identity, SEO URL and Telegram order URL
- `whoami/<locale>/` — pageable text records
- `specs/<locale>/` — character-map hotspots and output lines
- `interaction/<locale>/` — interaction protocol states
- `projects/<locale>/` — README and project records
- `events/<locale>/` — historical/scheduled router entries
- `gallery/<locale>/` — media records with intrinsic dimensions
- `protocols/<locale>/` — social links

Locales are `en`, `ru`, and `by`. Open `/admin/` to use Sveltia CMS (switch
locale in the editor). Before production, verify the repository and
branch in `public/admin/config.yml`, configure GitHub OAuth for the deployed
domain, and replace `https://varectra.example` in `astro.config.mjs` and
`src/content/settings/en/site.json`.

Project categories are data-driven: entering a new `directory` value in a
project creates a new visual folder without a source-code change. Uploaded
media is committed to `public/images/`.

## Interface controls

- Terminal: `/help`, `/whoami`, `/tech-docs`, `/exec`, `/router`, `/static`,
  `/protocols`, `/themes [name]`, `clear`, `/leg`
- Terminal history: Arrow Up / Arrow Down; autocomplete: Tab
- Files: `[` previous file, `]` next file
- Viewers: `N` next, `P` previous, `Q` or Escape close
- Boot: Escape or Enter skips
- `/leg`: plays the long-legged ASCII easter egg

All keyboard interactions have clickable/touch equivalents. Reduced-motion,
deep-link boot skipping, dialog focus restoration, semantic landmarks and
no-JavaScript content rendering are included.
