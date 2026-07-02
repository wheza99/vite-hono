import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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
    author: z.string().default("Your Startup"),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
