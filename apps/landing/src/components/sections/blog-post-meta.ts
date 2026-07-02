/**
 * Serialized blog-post metadata passed from `.astro` pages to React
 * components. Astro pages fetch the collection with `getCollection('blog')`
 * (which returns Date objects and other non-serializable values) and map
 * each entry into this plain-data shape before passing it as a prop.
 */
export interface BlogPostMeta {
  /** URL slug — also the collection entry id. */
  slug: string;
  title: string;
  description?: string;
  author: string;
  /** Pre-formatted, human-readable date string (e.g. "January 15, 2026"). */
  dateFormatted: string;
  tags: string[];
  coverImage?: string;
  featured: boolean;
  /** Estimated reading time, e.g. "5 min read". Omit to hide. */
  readTime?: string;
}
