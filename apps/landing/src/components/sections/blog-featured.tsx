import { ArrowRight } from "lucide-react";

import type { BlogPostMeta } from "./blog-post-meta";

/**
 * Large "featured" card for the blog index — highlights a single post
 * (the most recent `featured: true` entry). The thumbnail is a generated
 * accent-gradient block; replace the gradient with a real `coverImage`
 * once you add images to your posts.
 */
interface BlogFeaturedProps {
  post: BlogPostMeta;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="glow-card bg-card group grid overflow-hidden rounded-2xl ring-1 ring-foreground/10 md:grid-cols-2"
    >
      <div className="relative min-h-56 overflow-hidden border-b border-foreground/5 bg-gradient-to-br from-[color-mix(in_oklch,var(--primary)_28%,transparent)] to-muted/50 md:border-b-0 md:border-r">
        <span className="bg-background/80 text-foreground absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur">
          Featured
        </span>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-10">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-muted-foreground mt-3 text-pretty leading-relaxed">
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

        <span className="text-foreground group-hover:text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
          Read more
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}
