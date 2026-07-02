import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Light/dark toggle. The initial theme class is applied before first paint by
 * an inline script in BaseHead.astro (reads localStorage "theme" or the OS
 * preference). This component only flips it on click.
 */
export default function ThemeToggle() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const toggle = () => {
    const el = document.documentElement;
    const next = el.classList.contains("dark") ? "light" : "dark";
    el.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="relative"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
      {/* keep ref to ready to avoid unused-var lint after hydration */}
      {ready ? null : null}
    </Button>
  );
}
