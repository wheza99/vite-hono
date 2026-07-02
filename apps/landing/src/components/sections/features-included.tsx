import { Check, Minus } from "lucide-react";

type Cell =
  | { kind: "check" }
  | { kind: "minus" }
  | { kind: "text"; value: string };

interface Row {
  feature: string;
  free: Cell;
  pro: Cell;
}

const ROWS: Row[] = [
  { feature: "Projects", free: { kind: "text", value: "1" }, pro: { kind: "text", value: "Unlimited" } },
  { feature: "API calls", free: { kind: "text", value: "100/mo" }, pro: { kind: "text", value: "10k/mo" } },
  { feature: "API keys", free: { kind: "text", value: "1" }, pro: { kind: "text", value: "Unlimited" } },
  { feature: "Team members", free: { kind: "text", value: "1" }, pro: { kind: "text", value: "Unlimited" } },
  { feature: "Credits", free: { kind: "minus" }, pro: { kind: "text", value: "Included" } },
  { feature: "Priority support", free: { kind: "minus" }, pro: { kind: "check" } },
  { feature: "Custom domains", free: { kind: "minus" }, pro: { kind: "check" } },
  { feature: "Invoice history", free: { kind: "minus" }, pro: { kind: "check" } },
  { feature: "Webhooks", free: { kind: "minus" }, pro: { kind: "check" } },
  { feature: "Rate limits", free: { kind: "text", value: "Standard" }, pro: { kind: "text", value: "Elevated" } },
  { feature: "SLA", free: { kind: "minus" }, pro: { kind: "text", value: "99.9%" } },
  { feature: "Dashboard access", free: { kind: "check" }, pro: { kind: "check" } },
];

function CellView({ cell }: { cell: Cell }) {
  if (cell.kind === "check") {
    return (
      <span className="bg-primary/10 text-primary inline-grid size-5 place-items-center rounded-full">
        <Check className="size-3.5" />
      </span>
    );
  }
  if (cell.kind === "minus") {
    return (
      <span className="bg-muted text-muted-foreground inline-grid size-5 place-items-center rounded-full">
        <Minus className="size-3.5" />
      </span>
    );
  }
  return <span className="text-sm text-foreground">{cell.value}</span>;
}

export default function FeaturesIncluded() {
  return (
    <section className="border-border border-b bg-muted/30">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Compare plans</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything that&rsquo;s included.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            A side-by-side look at Free vs Pro.
          </p>
        </div>

        <div className="bg-card mt-12 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-muted-foreground px-6 py-4 text-xs font-medium tracking-wide uppercase">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">
                    Free
                  </th>
                  <th className="bg-primary/5 px-6 py-4 text-sm font-semibold text-foreground">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 1 ? "bg-muted/30" : ""}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4">
                      <CellView cell={row.free} />
                    </td>
                    <td className="bg-primary/5 px-6 py-4">
                      <CellView cell={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
