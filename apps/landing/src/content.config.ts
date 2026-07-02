import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { THEME } from "./styles/theme";

/**
 * Blog content collection.
 *
 * Articles live as `.mdx` files under `src/content/blog/`. They are loaded
 * with Astro's glob loader and validated against the schema below. Edit the
 * frontmatter of any file in that folder to add or change a post — no code
 * changes required.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Default author is the configured startup name so rebranding propagates.
    author: z.string().default(THEME.name),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Legal content collection.
 *
 * Generic, structured legal pages (Privacy Policy, Terms of Service, Cookie
 * Policy) live as `.mdx` files under `src/content/legal/`. Each carries a
 * `lastUpdated` date shown on the page. The body is plain prose rendered
 * server-side with `prose dark:prose-invert` typography.
 *
 * IMPORTANT: these are placeholder templates. Have a lawyer review and
 * customize every file here before launch.
 */
const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { blog, legal };
