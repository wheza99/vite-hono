import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import { NAV_LINKS } from "@/consts";
import { cn } from "@/lib/utils";
import { THEME } from "@/styles/theme";

function usePathname() {
  const [path, setPath] = useState<string>("");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
}

/** Accent wordmark — a square mark + the startup name. Edit THEME.name to rebrand. */
function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-semibold", className)}>
      <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md text-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {THEME.name.charAt(0)}
      </span>
      <span className="text-base tracking-tight">{THEME.name}</span>
    </span>
  );
}

const HEADER_HEIGHT = 72; // h-18

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | "auto">(0);
  const [minOpenHeight, setMinOpenHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const remainder = Math.max(0, window.innerHeight - HEADER_HEIGHT);
    setMinOpenHeight(remainder);

    const onEnd = () => {
      if (isMenuOpen) setPanelHeight("auto");
      wrapper.removeEventListener("transitionend", onEnd);
    };

    if (isMenuOpen) {
      const target = Math.max(content.scrollHeight, remainder);
      setPanelHeight(target);
      wrapper.addEventListener("transitionend", onEnd);
    } else {
      const current = wrapper.getBoundingClientRect().height || 0;
      setPanelHeight(current);
      requestAnimationFrame(() => setPanelHeight(0));
    }
  }, [isMenuOpen, pathname]);

  useEffect(() => {
    const onResize = () => {
      if (!isMenuOpen || !contentRef.current) return;
      const remainder = Math.max(0, window.innerHeight - HEADER_HEIGHT);
      setMinOpenHeight(remainder);
      if (panelHeight !== "auto") {
        const target = Math.max(contentRef.current.scrollHeight, remainder);
        setPanelHeight(target);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMenuOpen, panelHeight]);

  return (
    <header className="bg-background/80 supports-backdrop-filter:backdrop-blur-md border-border sticky top-0 z-50 h-18 border-b px-4 lg:px-0">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-2 lg:grid lg:grid-cols-[auto_1fr_auto]">
        <a href="/" className="flex items-center gap-2" aria-label={THEME.name}>
          <Wordmark />
        </a>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={THEME.appUrl} className="hidden sm:block">
            <Button size="default">Get Started</Button>
          </a>

          <ThemeToggle />

          <button
            className="text-muted-foreground hover:text-foreground relative flex size-8 items-center justify-center lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle main menu"
          >
            <span className="sr-only">Toggle main menu</span>
            <div className="relative block w-[18px]">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-0.5 w-full rounded-full bg-current transition duration-300 ease-in-out",
                  isMenuOpen ? "rotate-45" : "-translate-y-1.5",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-0.5 w-full rounded-full bg-current transition duration-300 ease-in-out",
                  isMenuOpen ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-0.5 w-full rounded-full bg-current transition duration-300 ease-in-out",
                  isMenuOpen ? "-rotate-45" : "translate-y-1.5",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div
          ref={wrapperRef}
          style={{
            height: panelHeight === "auto" ? "auto" : panelHeight,
            minHeight: isMenuOpen ? `${minOpenHeight}px` : undefined,
            transition: "height 320ms cubic-bezier(.22,.61,.36,1)",
          }}
          className={cn(
            "bg-background border-border overflow-hidden border-t",
            "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen",
          )}
          aria-hidden={!isMenuOpen}
        >
          <div ref={contentRef} className="max-h-[calc(100vh-72px)] overflow-auto">
            <div className="mx-auto max-w-7xl px-4">
              <nav
                className={cn(
                  "mt-6 flex flex-col transition-[transform,opacity] duration-300",
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                )}
              >
                <div className="flex flex-col gap-6">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg tracking-tight",
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="mb-8 mt-8 flex flex-col gap-3">
                  <a href={THEME.appUrl} onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
