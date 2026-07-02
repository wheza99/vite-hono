import { Button } from "@/components/ui/button";
import { THEME } from "@/styles/theme";

export default function Cta() {
  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* subtle depth: a lighter accent glow centered at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_120%_at_50%_0%,color-mix(in_oklch,var(--primary-foreground)_14%,transparent),transparent)]"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-primary-foreground/80">
          Join today and start building in minutes.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            render={<a href={THEME.appUrl} />}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-11 px-7 text-sm"
          >
            Get Started
          </Button>
        </div>
        <p className="mt-5 text-sm text-primary-foreground/70">
          14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
