import { ArrowLeft } from "lucide-react";

interface LegalArticleProps {
  /** Page title (rendered as the H1). */
  title: string;
  /** Human-readable "Last updated" date, e.g. "July 2, 2026". */
  lastUpdated: string;
  /** Where the "back" link points. */
  backHref?: string;
  /** Label for the "back" link. */
  backLabel?: string;
}

/**
 * Header chrome for the generic legal pages (privacy, terms, cookie policy).
 *
 * Mirrors the blog single-post pattern: this island only owns the title +
 * "last updated" meta + back link. The actual MDX body (`<Content />`) is
 * rendered server-side in the `.astro` page and wrapped in
 * `prose dark:prose-invert`, because a React island cannot receive an Astro
 * `<Content />` component as a prop.
 *
 * IMPORTANT: the legal copy behind this header is placeholder template text.
 * Have a lawyer review and customize it before launch.
 */
export default function LegalArticle({
  title,
  lastUpdated,
  backHref = "/",
  backLabel = "Back to home",
}: LegalArticleProps) {
  return (
    <header className="mx-auto max-w-3xl px-6 pt-16 md:pt-24">
      <a
        href={backHref}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </a>

      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
        {title}
      </h1>

      <p className="text-muted-foreground mt-4 text-sm">
        Last updated: {lastUpdated}
      </p>
    </header>
  );
}
