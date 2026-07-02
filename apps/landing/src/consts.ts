import { THEME } from "./styles/theme";

/** Central, theme-driven site metadata used by <BaseHead> and layouts. */
export const SITE = {
  name: THEME.name,
  domain: THEME.domain,
  appUrl: THEME.appUrl,
  tagline: THEME.tagline,
  description: `${THEME.name} helps you streamline your workflow, collaborate with your team, and boost productivity. Built on a modern, production-tested stack — Vite, Hono, PocketBase, and React.`,
};

export const SITE_TITLE = `${THEME.name} — ${THEME.tagline}`;
export const SITE_DESCRIPTION = SITE.description;

/** Primary navigation shown in the navbar + mobile menu. */
export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Showcase", href: "/showcase" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Footer link columns. */
export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Showcase", href: "/showcase" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
] as const;
