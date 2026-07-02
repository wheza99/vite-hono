import { ArrowRight } from "lucide-react";

/**
 * Abstract "screen" previews built from accent + neutral tokens only
 * (no hardcoded colors). Each block suggests a different part of the app.
 */
function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex gap-2">
        <span className="bg-primary/80 h-2 w-16 rounded-full" />
        <span className="bg-muted-foreground/30 h-2 w-10 rounded-full" />
      </div>
      <div className="mt-1 flex flex-1 items-end gap-1.5">
        {[45, 62, 38, 78, 56, 88, 70].map((h, i) => (
          <span
            key={i}
            className="bg-primary/25 w-full rounded-md"
            style={{
              height: `${h}%`,
              backgroundImage:
                "linear-gradient(to top, color-mix(in oklch, var(--primary) 35%, transparent), var(--primary))",
            }}
          />
        ))}
      </div>
      <div className="bg-muted-foreground/15 h-px w-full" />
    </div>
  );
}

function ApiKeysPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-5">
      <div className="bg-muted-foreground/30 h-2 w-20 rounded-full" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-card mt-1.5 flex items-center gap-2 rounded-lg p-2.5 ring-1 ring-foreground/10"
        >
          <span className="bg-primary/70 size-2 shrink-0 rounded-sm" />
          <span className="bg-muted-foreground/30 h-2 flex-1 rounded-full" />
          <span
            className="h-2 w-10 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklch, var(--primary) 55%, transparent), color-mix(in oklch, var(--primary) 20%, transparent))",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function BillingPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="bg-card mx-auto w-full max-w-[180px] rounded-xl p-4 ring-1 ring-foreground/10">
        <div className="flex items-center justify-between">
          <span className="bg-muted-foreground/30 h-2 w-8 rounded-full" />
          <span className="bg-primary/70 size-4 rounded-sm" />
        </div>
        <span
          className="mt-4 block h-5 w-24 rounded-md"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklch, var(--primary) 60%, transparent), color-mix(in oklch, var(--primary) 25%, transparent))",
          }}
        />
        <span className="bg-muted-foreground/25 mt-2 block h-2 w-16 rounded-full" />
      </div>
      <div className="bg-muted-foreground/15 mx-auto h-1.5 w-full max-w-[180px] rounded-full">
        <span className="bg-primary block h-full w-2/3 rounded-full" />
      </div>
    </div>
  );
}

const ITEMS = [
  { label: "Dashboard", description: "Track usage and analytics at a glance.", preview: DashboardPreview },
  { label: "API Keys", description: "Create and rotate keys with fine-grained scopes.", preview: ApiKeysPreview },
  { label: "Billing", description: "Manage plans, credits, and invoices.", preview: BillingPreview },
] as const;

export default function Showcase() {
  return (
    <section className="border-border border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-label">Showcase</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              See it in action.
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty text-lg">
              A clean, consistent interface across every part of the product.
            </p>
          </div>
          <a
            href="/showcase"
            className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            View all
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ITEMS.map(({ label, description, preview: Preview }) => (
            <a
              key={label}
              href="/showcase"
              className="glow-card bg-card group block overflow-hidden rounded-2xl ring-1 ring-foreground/10"
            >
              <div className="bg-gradient-to-b from-[color-mix(in_oklch,var(--primary)_10%,transparent)] to-muted/40 h-48 border-b border-foreground/5">
                <Preview />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight">
                  {label}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {description}
                </p>
                <span className="text-muted-foreground group-hover:text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                  Explore
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
