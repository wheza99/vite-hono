import { ArrowRight } from "lucide-react";

/**
 * NOTE (blog milestone): These are static placeholder posts. In the blog
 * milestone, replace `POSTS` with data fetched from `getCollection('blog')`
 * (the collection + content live in `src/content/blog`). Kept static + inline
 * here so the homepage build never breaks before that collection exists.
 */
const POSTS = [
  {
    category: "Guide",
    title: "Getting Started Guide",
    excerpt:
      "Set up your workspace, invite your team, and ship your first project in under ten minutes.",
    date: "May 12, 2026",
    readTime: "5 min read",
  },
  {
    category: "Tutorial",
    title: "Best Practices",
    excerpt:
      "Patterns for keeping your API keys safe, organizing projects, and managing credits as you scale.",
    date: "Apr 28, 2026",
    readTime: "7 min read",
  },
  {
    category: "Examples",
    title: "Common Use Cases",
    excerpt:
      "From internal tools to customer-facing dashboards — see how teams put the platform to work.",
    date: "Apr 10, 2026",
    readTime: "6 min read",
  },
] as const;

export default function BlogPreview() {
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

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {POSTS.map((post) => (
            <a
              key={post.title}
              href="/blog"
              className="glow-card bg-card group flex flex-col overflow-hidden rounded-2xl ring-1 ring-foreground/10"
            >
              <div className="relative h-40 overflow-hidden border-b border-foreground/5 bg-gradient-to-br from-[color-mix(in_oklch,var(--primary)_22%,transparent)] to-muted/50">
                <span className="bg-background/80 text-foreground absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="text-muted-foreground mt-5 flex items-center justify-between text-xs">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <span className="text-foreground group-hover:text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                  Read more
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
