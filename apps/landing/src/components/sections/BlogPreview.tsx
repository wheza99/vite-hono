import { ArrowRight } from "lucide-react";

import type { BlogPostMeta } from "./blog-post-meta";

interface BlogPreviewProps {
  /** Latest posts, passed in from the homepage (fetched via getCollection). */
  posts: BlogPostMeta[];
}

/**
 * Homepage "From our blog" preview. Renders up to three of the latest
 * posts. The post data is fetched in `src/pages/index.astro` via
 * `getCollection('blog')` and passed here as props, so the homepage build
 * always reflects the live content collection.
 */
export default function BlogPreview({ posts }: BlogPreviewProps) {
  const preview = posts.slice(0, 3);

  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-label">Blog</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              From our blog.
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty text-lg">
              Guides, tips, and updates from the team.
            </p>
          </div>
          <a
            href="/blog"
            className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            View all posts
            <ArrowRight className="size-4" />
          </a>
        </div>

        {preview.length === 0 ? (
          <p className="text-muted-foreground mt-14 text-sm">
            No posts yet — check back soon.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {preview.map((post) => (
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

                  <div className="text-muted-foreground mt-5 flex items-center justify-between text-xs">
                    <span>{post.dateFormatted}</span>
                    {post.readTime && <span>{post.readTime}</span>}
                  </div>

                  <span className="text-foreground group-hover:text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                    Read more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
