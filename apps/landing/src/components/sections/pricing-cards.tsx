import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { THEME } from "@/styles/theme";
import { cn } from "@/lib/utils";

interface PricingCardsProps {
  /** When true, the Pro plan shows the annual price ($100/yr). */
  annual?: boolean;
}

export default function PricingCards({ annual = false }: PricingCardsProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      {/* ── Free ── */}
      <div className="glow-card bg-card relative flex flex-col rounded-2xl p-8 ring-1 ring-foreground/10">
        <h3 className="text-lg font-semibold tracking-tight">Free</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          For tinkering and side projects.
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="font-heading text-5xl font-semibold tracking-tight">
            $0
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            forever
          </span>
        </div>

        <ul className="mt-8 space-y-3">
          {[
            "1 project",
            "100 API calls/mo",
            "Community support",
            "API access",
          ].map((feature) => (
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
            variant="outline"
            render={<a href={THEME.appUrl} />}
            className="h-11 w-full px-6 text-sm"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* ── Pro ── */}
      <div
        className={cn(
          "glow-card bg-card relative flex flex-col rounded-2xl p-8 ring-1 ring-foreground/10",
          "ring-2 ring-primary shadow-[0_8px_40px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
        )}
      >
        <span className="bg-primary text-primary-foreground absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-medium">
          Most popular
        </span>

        <h3 className="text-lg font-semibold tracking-tight">Pro</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          For growing teams and production apps.
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="font-heading text-5xl font-semibold tracking-tight tabular-nums">
            {annual ? "$100" : "$10"}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            {annual ? "/yr" : "/mo"}
          </span>
        </div>

        <ul className="mt-8 space-y-3">
          {[
            "Unlimited projects",
            "10k API calls/mo",
            "Priority support",
            "Credits included",
            "Custom domains",
          ].map((feature) => (
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
            variant="default"
            render={<a href={THEME.appUrl} />}
            className="h-11 w-full px-6 text-sm"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
