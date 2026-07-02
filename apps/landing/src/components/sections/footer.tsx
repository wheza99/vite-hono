import { FOOTER_COLUMNS } from "@/consts";
import { THEME } from "@/styles/theme";

/** Brand glyphs as inline SVG (lucide-react dropped brand icons). */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<keyof typeof THEME.socials, typeof XIcon> = {
  x: XIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
};

export const Footer = () => {
  const socials = Object.entries(THEME.socials).filter(([, url]) => url) as [
    keyof typeof THEME.socials,
    string,
  ][];

  return (
    <footer className="border-border bg-background mt-24 border-t">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="flex items-center gap-2 font-semibold">
              <span
                aria-hidden="true"
                className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md text-sm"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {THEME.name.charAt(0)}
              </span>
              <span className="text-base tracking-tight">{THEME.name}</span>
            </span>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              {THEME.tagline}. Built on a modern, production-tested stack.
            </p>
            <a
              href={`mailto:${THEME.supportEmail}`}
              className="text-muted-foreground hover:text-foreground mt-4 block text-sm transition-colors"
            >
              {THEME.supportEmail}
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-12">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-foreground mb-4 text-sm font-semibold">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {THEME.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(([key, href]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
