import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is there a free tier?",
    a: "Yes, the Free plan is free forever.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Upgrade or downgrade instantly. Changes prorate automatically.",
  },
  {
    q: "What happens if I exceed my API calls?",
    a: "You can top up credits or upgrade to a higher tier.",
  },
  {
    q: "Do you offer refunds?",
    a: "Contact us within 14 days for a full refund.",
  },
] as const;

export default function PricingFaq() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="text-center">
          <span className="section-label">Pricing FAQ</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Questions about pricing.
          </h2>
        </div>

        <div className="bg-card mt-12 rounded-2xl px-6 ring-1 ring-foreground/10 md:px-8">
          <Accordion>
            {FAQS.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-foreground py-5 text-base font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  keepMounted
                  className="text-muted-foreground text-base leading-relaxed"
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
