import {
  BookOpen,
  Coins,
  CreditCard,
  Database,
  KeyRound,
  LogIn,
} from "lucide-react";

const BENEFITS = [
  {
    title: "Authentication",
    description: "Secure login with OAuth and session management.",
    icon: LogIn,
  },
  {
    title: "API Keys",
    description:
      "Create, scope, and rotate keys with fine-grained permissions.",
    icon: KeyRound,
  },
  {
    title: "Credits System",
    description: "Usage-based credits with automatic top-ups and limits.",
    icon: Coins,
  },
  {
    title: "Billing (Whop)",
    description: "Subscriptions and one-time payments handled by Whop.",
    icon: CreditCard,
  },
  {
    title: "Database (PocketBase)",
    description: "Managed records, auth, and realtime out of the box.",
    icon: Database,
  },
  {
    title: "API Docs (Swagger)",
    description: "Interactive documentation generated from your routes.",
    icon: BookOpen,
  },
] as const;

export default function FeaturesBenefits() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Benefits</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Batteries included, nothing to wire up.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            Every building block of a modern SaaS, ready out of the box.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ title, description, icon: Icon }) => (
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
