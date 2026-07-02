import { Settings, TrendingUp, UserPlus } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Sign Up",
    description:
      "Create your account in seconds. No credit card required to start.",
    icon: UserPlus,
  },
  {
    n: "02",
    title: "Configure",
    description:
      "Set up your workspace and connect the tools you already use.",
    icon: Settings,
  },
  {
    n: "03",
    title: "Scale",
    description:
      "Grow from a single project to a full team with built-in billing and credits.",
    icon: TrendingUp,
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">How it works</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Get started in three simple steps
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            From zero to running in minutes. No steep learning curve, no
            onboarding tax.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ n, title, description, icon: Icon }) => (
            <div
              key={n}
              className="glow-card bg-card relative rounded-2xl p-8 ring-1 ring-foreground/10"
            >
              <div className="flex items-center justify-between">
                <span className="bg-primary/10 text-primary grid size-12 place-items-center rounded-xl">
                  <Icon className="size-6" />
                </span>
                <span className="font-heading text-4xl font-semibold text-muted-foreground/30 tabular-nums">
                  {n}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
