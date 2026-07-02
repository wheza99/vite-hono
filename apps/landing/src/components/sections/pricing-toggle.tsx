import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import PricingCards from "@/components/sections/pricing-cards";
import { cn } from "@/lib/utils";

/**
 * Stateful wrapper that owns the billing-period toggle (Monthly / Annual)
 * and feeds it into <PricingCards />. "Annual" gives 2 months free.
 */
export default function PricingToggle() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className={cn(!annual ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <Switch checked={annual} onCheckedChange={setAnnual} />
        <span
          className={cn(
            "flex items-center gap-2",
            annual ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Annual
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
            2 months free
          </span>
        </span>
      </div>

      <PricingCards annual={annual} />
    </div>
  );
}
