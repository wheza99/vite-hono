import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { THEME } from "@/styles/theme";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Perfect for getting started.",
    features: ["1 project", "Community support", "API access"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$10",
    cadence: "/mo",
    description: "For growing teams.",
    features: [
      "Unlimited projects",
      "Priority support",
      "API access",
      "Credits included",
    ],
    featured: true,
  },
] as const;

export default function Pricing() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Pricing</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Simple, transparent pricing.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            Start free, upgrade when you&rsquo;re ready. No surprises.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "glow-card bg-card relative flex flex-col rounded-2xl p-8 ring-1 ring-foreground/10",
                plan.featured &&
                  "ring-2 ring-primary shadow-[0_8px_40px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
              )}
            >
              {plan.featured && (
                <span className="bg-primary text-primary-foreground absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-medium">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold tracking-tight">
                {plan.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-heading text-5xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {plan.cadence}
                </span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span className="bg-primary/10 text-primary grid size-5 shrink-0 place-items-center rounded-full">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  render={<a href={THEME.appUrl} />}
                  className="h-11 w-full px-6 text-sm"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/pricing"
            className="text-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            See full pricing &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
