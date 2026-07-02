import { ArrowUpRight } from "lucide-react";

interface Project {
  title: string;
  category: string;
  /** Accent gradient strength for the placeholder block (lighter → heavier). */
  weight: number;
}

/* TEMPLATE: Replace with real screenshots */
const PROJECTS: Project[] = [
  { title: "Example Project 01", category: "Dashboard", weight: 30 },
  { title: "Example Project 02", category: "SaaS", weight: 55 },
  { title: "Example Project 03", category: "Internal Tool", weight: 18 },
  { title: "Example Project 04", category: "API", weight: 70 },
  { title: "Example Project 05", category: "Marketing", weight: 42 },
  { title: "Example Project 06", category: "Mobile", weight: 60 },
] as const;

export default function ShowcasePreview() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {/* TEMPLATE: Replace with real screenshots */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map(({ title, category, weight }) => (
            <div
              key={title}
              className="glow-card bg-card group block overflow-hidden rounded-2xl ring-1 ring-foreground/10"
            >
              {/* abstract gradient placeholder block (accent + color-mix) */}
              <div
                className="relative aspect-[16/10] overflow-hidden border-b border-foreground/5"
                style={{
                  backgroundImage: `linear-gradient(135deg,
                    color-mix(in oklch, var(--primary) ${weight}%, transparent),
                    color-mix(in oklch, var(--primary) ${Math.min(
                      weight + 20,
                      90,
                    )}%, transparent))`,
                }}
              >
                {/* faux UI accents on top of the gradient */}
                <div className="absolute inset-0 p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/30 h-2 w-12 backdrop-blur-sm" />
                    <span className="rounded-full bg-black/10 h-2 w-6" />
                  </div>
                  <div className="mt-auto flex flex-col gap-1.5">
                    <span className="rounded-md bg-white/40 h-3 w-1/2 backdrop-blur-sm" />
                    <span className="rounded-md bg-black/10 h-2 w-1/3" />
                  </div>
                </div>
                {/* subtle top-down darkening for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
              </div>

              <div className="flex items-center justify-between p-6">
                <div>
                  <span className="bg-primary/10 text-primary inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                </div>
                <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-5 shrink-0 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
