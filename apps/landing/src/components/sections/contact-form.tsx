import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { THEME } from "@/styles/theme";
import { cn } from "@/lib/utils";

// TEMPLATE: Wire this form to your backend or form service (e.g. Resend,
// Formspree, PocketBase, or your Hono API). For now it is a placeholder
// that either opens the user's email client via a `mailto:` link to
// THEME.supportEmail, or shows an inline success message — no backend.

/**
 * Placeholder contact form (client island).
 *
 * Fields: name, email, subject, message. On submit it builds a
 * `mailto:` link to `THEME.supportEmail` and falls back to an inline
 * success message. Replace `handleSubmit` with a real submission once you
 * have a backend or form service.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Build a prefilled mailto so the placeholder "just works" out of the
    // box. Swap this for a real POST when you wire up a backend.
    const params = new URLSearchParams({
      subject: subject || `New message from ${name || "a visitor"}`,
      body: `${message}\n\n— ${name}${email ? `\n${email}` : ""}`,
    });
    window.location.href = `mailto:${THEME.supportEmail}?${params.toString()}`;

    // Optimistically show the success state. A real implementation should
    // set this only after the request succeeds.
    setSubmitted(true);
  }

  const fieldClass =
    "h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={cn("h-11 px-3")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            className={cn("h-11 px-3")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="How can we help?"
          className={cn("h-11 px-3")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us a little more…"
          className={cn(fieldClass, "resize-y")}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" className="h-11 px-6 text-sm">
          Send message
        </Button>
        {submitted && (
          <p className="text-sm text-muted-foreground">
            Thanks! Your email client should have opened — we&rsquo;ll get back
            to you shortly.
          </p>
        )}
      </div>
    </form>
  );
}
