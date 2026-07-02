import { Code, Gauge, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "Fast Setup",
    description:
      "Get started in minutes. No complex configuration required.",
    icon: Zap,
  },
  {
    title: "Secure by Default",
    description:
      "Built-in authentication, API keys, and credit-based access control.",
    icon: ShieldCheck,
  },
  {
    title: "Developer Friendly",
    description:
      "Comprehensive API with Swagger docs. Integrates with any stack.",
    icon: Code,
  },
  {
    title: "Scale Ready",
    description:
      "From prototype to production. Docker, PocketBase, and Hono — production-tested stack.",
    icon: Gauge,
  },
] as const;

export default function Features() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Features</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything you need, nothing you don&rsquo;t.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            A focused toolkit that gets out of your way so you can ship.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="glow-card bg-card flex flex-col rounded-2xl p-6 ring-1 ring-foreground/10"
            >
              <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
