import { ArrowRight } from "lucide-react";

import type { BlogPostMeta } from "./blog-post-meta";

interface BlogGridProps {
  posts: BlogPostMeta[];
  /** When true (empty grid state) render a friendly fallback message. */
  emptyMessage?: string;
}

/**
 * Responsive grid of blog-post cards for the blog index. Each card shows a
 * generated accent-gradient thumbnail (swap for `coverImage` when you add
 * real images), the first tag as a category pill, the title, description,
 * and a "Read more" affordance.
 */
export default function BlogGrid({
  posts,
  emptyMessage = "No posts yet — check back soon.",
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <a
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="glow-card bg-card group flex flex-col overflow-hidden rounded-2xl ring-1 ring-foreground/10"
        >
          <div className="relative h-40 overflow-hidden border-b border-foreground/5 bg-gradient-to-br from-[color-mix(in_oklch,var(--primary)_22%,transparent)] to-muted/50">
            {post.tags.length > 0 && (
              <span className="bg-background/80 text-foreground absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur">
                {post.tags[0]}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="text-muted-foreground mt-5 flex items-center gap-3 text-xs">
              <span>{post.dateFormatted}</span>
              {post.readTime && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.readTime}</span>
                </>
              )}
            </div>

            <span className="text-foreground group-hover:text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
              Read more
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
