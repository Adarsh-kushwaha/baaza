# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server (Turbopack) on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # typecheck only
```

No test runner is configured.

## Stack

Next.js 16.3.5 (App Router) · React 19.2 · TypeScript strict · Tailwind CSS v4.

Tailwind v4 has no `tailwind.config.js`: theme tokens live in `app/globals.css` via `@import "tailwindcss"` plus an `@theme inline` block that maps CSS variables (`--background`, `--foreground`, the Geist font variables set in `app/layout.tsx`) to utility classes. Add design tokens there, not in a config file.

Next 16 supplies global route-typed prop types — `app/layout.tsx` uses `LayoutProps<"/">` rather than a hand-written props interface. Page/layout params are generated into `.next/types`, so run `npm run dev` or `npm run build` once after adding a route before those types resolve.

Path alias: `@/*` → repo root.

## Project state

Scaffolded `create-next-app` template (`app/page.tsx` is still the starter page). The actual product is a directory of Indian internet radio / playlist sites, whose content is staged in two uncommitted places:

- `playlist_cards.json` — 101 card records, flat array, every record has all keys: `id`, `slug`, `title`, `titleEn` (nullable, set on 27 non-English titles), `description`, `url`, `domain`, `category`, `creator` (X handle), `creatorUrl`, `status` (`live` | `offline`), `image` (bare filename, nullable).
- `images/` — one cover image per card. Filenames match `image` values exactly (currently 1:1, no orphans, no missing refs); keep that invariant when adding cards.

`images/` sits at the repo root, **not** under `public/`, so those files are not served yet. Moving them to `public/images/` (and prefixing the `image` value at render time) is the step that makes cards displayable.

Nothing consumes `playlist_cards.json` yet. It is `resolveJsonModule`-importable directly from a Server Component; no API layer exists.
