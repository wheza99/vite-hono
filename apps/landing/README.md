# `@vite-hono/landing` — Astro marketing site

The marketing/landing app of the vite-hono template. Static-generated with
**Astro 6**, styled with **Tailwind CSS v4** + the same **Geist + shadcn
(base-ui)** design system as `apps/web`, and — crucially — **rebrandable from a
single file**.

```text
yourdomain.com      → this app (Astro static)   [dev port 1000]
app.yourdomain.com  → apps/web  (React dashboard)[dev port 2000]
app.yourdomain.com/api → apps/server (Hono)      [port 3000]
```

---

## Rebrand in 60 seconds

**Edit `src/styles/theme.ts`.** That is the single source of truth for branding.
Change one value and the whole site updates — navbar, footer, buttons, hero
headline, `<title>`, RSS feed, favicons' accent.

```ts
export const THEME = {
  name: "Your Startup",            // navbar, footer, <title>
  domain: "yourdomain.com",
  appUrl: "https://app.yourdomain.com", // every "Get Started" CTA
  accent: "oklch(0.55 0.2 265)",   // ← change this ONE line to rebrand
  accentHover: "oklch(0.48 0.22 265)",
  accentForeground: "oklch(0.985 0 0)",
  displayFont: "Geist Variable",   // headings
  tagline: "Transform the way you do business",
  supportEmail: "support@yourdomain.com",
  socials: { x: "...", github: "...", linkedin: "..." },
} as const;
```

**Accent color suggestions** (oklch):

| Vibe        | Value                   |
| ----------- | ----------------------- |
| Indigo/blue | `oklch(0.55 0.2 265)`   |
| Purple      | `oklch(0.55 0.25 300)`  |
| Emerald     | `oklch(0.65 0.18 145)`  |
| Amber       | `oklch(0.70 0.18 55)`   |
| Rose        | `oklch(0.60 0.22 25)`   |
| Teal        | `oklch(0.68 0.13 200)`  |

> How does it work? `DefaultLayout.astro` reads `THEME` and emits those values
> as live CSS custom properties (`--primary`, `--accent-text`, `--font-display`,
> …) into the page `<head>`, overriding the oklch fallbacks in `global.css`.
> Everything else reads `var(--primary)`. No hardcoded colors anywhere.

---

## Next steps after forking

1. **Rebrand** — edit `src/styles/theme.ts` (name, accent, tagline, domain).
2. **Replace content** — each section in `src/components/sections/` and page in
   `src/pages/` is clearly placeholder. Swap the copy for your startup's.
3. **Blog** — replace the structural placeholder MDX files in
   `src/content/blog/` with real articles (each starts with a
   `<!-- TEMPLATE: ... -->` comment to remind you).
4. **Hero image** — replace
   `public/images/homepage/hero/dashboard-preview.svg` with a real product
   screenshot (keep an SVG/PNG at the same path, or update the reference).
5. **Favicons** — replace the four files in `public/favicon/`
   (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`)
   with your brand marks. The defaults are a generic accent square.
6. **Display font** (optional) — to use a different heading font (e.g. Outfit,
   Sora, Plus Jakarta Sans), add the matching `@fontsource` import to the top of
   `src/styles/global.css` and set `displayFont` in `theme.ts`.
7. **SEO** — set `site` in `astro.config.mjs` to your real domain so sitemap &
   RSS generate correct absolute URLs.

---

## Project structure

```text
src/
├── styles/
│   ├── theme.ts        # ← SINGLE customization file (rebrand here)
│   └── global.css      # Tailwind v4 + shadcn tokens + accent utilities
├── components/
│   ├── BaseHead.astro  # SEO meta, OG, canonical, sitemap, RSS links, theme script
│   ├── ui/             # shadcn primitives (base-ui), shared with apps/web
│   └── sections/       # navbar.tsx, footer.tsx (React islands, client:load)
├── layouts/
│   ├── DefaultLayout.astro  # Navbar + Footer + theme injection
│   └── BasicLayout.astro    # Head-only (chromeless)
├── pages/              # Astro routes
└── consts.ts           # NAV_LINKS, FOOTER_COLUMNS (driven by THEME)
```

---

## Commands

```bash
pnpm --filter @vite-hono/landing dev        # http://localhost:5206
pnpm --filter @vite-hono/landing build      # static output → dist/
pnpm --filter @vite-hono/landing preview
pnpm --filter @vite-hono/landing typecheck  # astro check
```

## Tech

- **Astro 6** (static output, content collections, RSS, sitemap)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **shadcn** primitives on **`@base-ui/react`** — identical conventions to
  `apps/web` (same CVA + `cn` patterns). Copy new components from the web app or
  generate with `shadcn` (`components.json` is configured).
- **Geist Variable** for both body and headings by default.
- **React 19** islands for interactive sections (navbar, footer, accordions,
  tabs, etc.).
