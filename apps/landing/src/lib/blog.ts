import type { CollectionEntry } from "astro:content";

import type { BlogPostMeta } from "@/components/sections/blog-post-meta";

/**
 * Blog collection helpers shared by the blog index, the post page, the
 * homepage preview, and the RSS feed. Keeping date formatting + read-time
 * estimation in one place guarantees every surface shows identical values.
 */

/** Format a Date as "January 15, 2026" (UTC-stable for date-only values). */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Estimate reading time from raw Markdown body (~200 wpm, min 1 minute). */
export function estimateReadTime(body: string | undefined): string {
  if (!body) return "1 min read";
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/** Map a blog collection entry to the serializable `BlogPostMeta` shape. */
export function toPostMeta(
  entry: CollectionEntry<"blog">,
): BlogPostMeta {
  return {
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    author: entry.data.author,
    dateFormatted: formatDate(entry.data.date),
    tags: entry.data.tags,
    coverImage: entry.data.coverImage,
    featured: entry.data.featured,
    readTime: estimateReadTime(entry.body),
  };
}

/**
 * Sort posts newest-first (stable on tie by slug). Returns a new array —
 * does not mutate the input.
 */
export function sortByDateDesc(
  entries: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return [...entries].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
