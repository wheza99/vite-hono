import { ArrowLeft } from "lucide-react";

import type { BlogPostMeta } from "./blog-post-meta";

interface BlogPostLayoutProps {
  post: BlogPostMeta;
}

/**
 * Single-post header chrome: the "back to blog" link, the featured tag,
 * the title, the description, the author/date/read-time meta row, and the
 * tags.
 *
 * NOTE: the actual article body (the MDX `<Content />`) is rendered
 * server-side in `src/pages/blog/[slug].astro`, NOT here. Astro renders
 * MDX natively and wraps the body in `prose dark:prose-invert`; a React
 * island can't receive an Astro `<Content />` component as a prop.
 *
 * This component only owns the header so it can stay a pure client island
 * (no Markdown hydration cost on the body itself).
 */
export default function BlogPostLayout({ post }: BlogPostLayoutProps) {
  return (
    <header className="mx-auto max-w-3xl px-6 pt-16 md:pt-24">
      <a
        href="/blog"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </a>

      {post.featured && (
        <span className="bg-primary/10 text-primary mt-8 inline-flex rounded-full px-3 py-1 text-xs font-medium">
          Featured
        </span>
      )}

      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
        {post.title}
      </h1>

      {post.description && (
        <p className="text-muted-foreground mt-4 text-pretty text-lg">
          {post.description}
        </p>
      )}

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="text-foreground font-medium">{post.author}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{post.dateFormatted}</span>
        {post.readTime && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readTime}</span>
          </>
        )}
      </div>

      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
