import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ── Abstract "screen" mockups (accent + neutral tokens only) ──────────── */

function DashboardMockup() {
  return (
    <div className="flex h-full flex-col gap-3 p-6">
      <div className="flex gap-2">
        <span className="bg-primary/80 h-2.5 w-16 rounded-full" />
        <span className="bg-muted-foreground/30 h-2.5 w-10 rounded-full" />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-card rounded-lg p-3 ring-1 ring-foreground/10"
          >
            <span className="bg-muted-foreground/30 block h-2 w-8 rounded-full" />
            <span
              className="mt-3 block h-5 w-12 rounded-md"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklch, var(--primary) 60%, transparent), color-mix(in oklch, var(--primary) 25%, transparent))",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex flex-1 items-end gap-1.5">
        {[45, 62, 38, 78, 56, 88, 70].map((h, i) => (
          <span
            key={i}
            className="w-full rounded-md"
            style={{
              height: `${h}%`,
              backgroundImage:
                "linear-gradient(to top, color-mix(in oklch, var(--primary) 35%, transparent), var(--primary))",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ApiMockup() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-6">
      <div className="bg-muted-foreground/30 h-2.5 w-20 rounded-full" />
      <div className="bg-card mt-2 flex items-center gap-2 rounded-lg p-3 ring-1 ring-foreground/10">
        <span className="bg-primary/80 rounded px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          GET
        </span>
        <span className="bg-muted-foreground/30 h-2 flex-1 rounded-full" />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-card flex items-center gap-2 rounded-lg p-2.5 ring-1 ring-foreground/10"
        >
          <span
            className="h-2 w-10 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklch, var(--primary) 55%, transparent), color-mix(in oklch, var(--primary) 20%, transparent))",
            }}
          />
          <span className="bg-muted-foreground/30 h-2 flex-1 rounded-full" />
          <span className="bg-muted-foreground/20 h-2 w-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function BillingMockup() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="bg-card mx-auto w-full max-w-[200px] rounded-xl p-4 ring-1 ring-foreground/10">
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
      <div className="bg-muted-foreground/15 mx-auto h-1.5 w-full max-w-[200px] rounded-full">
        <span className="bg-primary block h-full w-2/3 rounded-full" />
      </div>
    </div>
  );
}

function SecurityMockup() {
  return (
    <div className="flex h-full flex-col justify-center items-center gap-4 p-6">
      <span className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl">
        <span
          className="block size-7 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 70%, transparent), transparent)",
          }}
        />
      </span>
      <div className="w-full max-w-[200px] space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-card flex items-center gap-2 rounded-lg p-2.5 ring-1 ring-foreground/10"
          >
            <span
              className="block h-2 flex-1 rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklch, var(--primary) 50%, transparent), color-mix(in oklch, var(--primary) 15%, transparent))",
              }}
            />
            <span className="bg-primary/70 size-2 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TabItem {
  value: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  Mockup: () => JSX.Element;
}

const TABS: TabItem[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    title: "A clean overview of everything that matters.",
    description:
      "See your projects, usage, and activity at a glance. Designed to get you in and out fast.",
    bullets: ["Real-time stats", "Project management", "Activity feed"],
    Mockup: DashboardMockup,
  },
  {
    value: "api",
    label: "API",
    title: "A RESTful API with predictable responses.",
    description:
      "Consistent resource shapes, clear errors, and full reference docs generated from your routes.",
    bullets: ["Swagger docs", "API key auth", "Credit-gated endpoints"],
    Mockup: ApiMockup,
  },
  {
    value: "billing",
    label: "Billing",
    title: "Flexible billing that scales with you.",
    description:
      "Subscriptions and one-time payments powered by Whop, with automatic invoicing.",
    bullets: ["Whop checkout", "Subscription tiers", "Invoice history"],
    Mockup: BillingMockup,
  },
  {
    value: "security",
    label: "Security",
    title: "Security baked into every layer.",
    description:
      "From encrypted storage to session management and rate limiting, it is on by default.",
    bullets: ["Encrypted at rest", "Session management", "Rate limiting"],
    Mockup: SecurityMockup,
  },
];

export default function FeaturesTabs() {
  return (
    <section className="border-border border-b bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Product</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            One cohesive platform, four pillars.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            Explore each part of the product.
          </p>
        </div>

        <Tabs defaultValue={TABS[0].value} className="mt-12 items-center">
          <TabsList className="mx-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-4">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-10">
            {TABS.map(({ value, title, description, bullets, Mockup }) => (
              <TabsContent
                key={value}
                value={value}
                className="data-[hidden]:hidden"
              >
                <div className="glow-card bg-card grid gap-8 overflow-hidden rounded-2xl p-2 ring-1 ring-foreground/10 md:grid-cols-2 md:p-3">
                  {/* mockup illustration */}
                  <div className="bg-gradient-to-b from-[color-mix(in_oklch,var(--primary)_10%,transparent)] to-muted/40 h-64 rounded-xl border border-foreground/5 md:h-auto">
                    <Mockup />
                  </div>
                  {/* copy */}
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-pretty leading-relaxed">
                      {description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="bg-primary/10 text-primary grid size-5 shrink-0 place-items-center rounded-full">
                            <span className="block size-1.5 rounded-full bg-primary" />
                          </span>
                          <span className="text-foreground">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
