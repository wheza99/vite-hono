/**
 * ── CUSTOMIZE YOUR STARTUP HERE ─────────────────────────────────────────────
 *
 * This is the SINGLE file you edit to rebrand the entire landing page.
 * Change `name`, `accent`, `domain`, `appUrl`, and `tagline`, and the whole
 * site (navbar, footer, buttons, hero headline, <title>) updates instantly.
 *
 * The values here are injected as CSS custom properties on :root by
 * `src/layouts/DefaultLayout.astro`, so every `var(--primary)` / accent color
 * in the site resolves to the accent defined below.
 *
 * DO NOT hardcode the startup name or accent color anywhere else — always read
 * it from this `THEME` object.
 */
export const THEME = {
  /** Startup name — appears in navbar, footer, <title>, RSS feed. */
  name: "Your Startup",

  /** Root marketing domain (used for canonical URLs, sitemap, OG). */
  domain: "yourdomain.com",

  /** Where the React web app (dashboard / auth) lives. All "Get Started" CTAs link here. */
  appUrl: "https://app.yourdomain.com",

  /**
   * Accent color (oklch). Change this ONE value to rebrand.
   * Suggestions:
   *   indigo/blue   → "oklch(0.55 0.2 265)"
   *   violet/purple → "oklch(0.55 0.25 300)"
   *   emerald/green → "oklch(0.65 0.18 145)"
   *   amber/orange  → "oklch(0.70 0.18 55)"
   *   rose/red      → "oklch(0.60 0.22 25)"
   *   cyan/teal     → "oklch(0.68 0.13 200)"
   */
  accent: "oklch(0.55 0.2 265)",
  accentHover: "oklch(0.48 0.22 265)",
  /** Foreground (text) color drawn on top of the accent background. */
  accentForeground: "oklch(0.985 0 0)",

  /**
   * Display font for headings. Imported via @fontsource-variable/geist by
   * default. To switch (e.g. Outfit, Sora, Plus Jakarta Sans), add the
   * matching @fontsource package to global.css and change this value.
   */
  displayFont: "Geist Variable",

  /** Hero headline / tagline. */
  tagline: "Transform the way you do business",

  /** Support / contact email shown in footer + contact page. */
  supportEmail: "support@yourdomain.com",

  /** Social profile URLs. Leave empty ("") to hide a link. */
  socials: {
    x: "https://x.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
} as const;
