/**
 * About-page hero. The headline and subtext are intentionally generic
 * placeholder copy — edit them in place when you rebrand.
 */
export default function AboutHero() {
  return (
    <section className="bg-dot-grid relative overflow-hidden border-b">
      {/* soft accent spotlight over the dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(55%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
      />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <span className="section-label">About</span>
        <h1 className="text-accent mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Built by founders, powered by AI.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          We&rsquo;re a small team on a mission to make great software
          accessible to everyone.
        </p>
      </div>
    </section>
  );
}
