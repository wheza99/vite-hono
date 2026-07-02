import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How does the free trial work?",
    a: "14 days, full access, no credit card required.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees.",
  },
  {
    q: "Do you offer team plans?",
    a: "Contact us for custom team pricing.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted in transit and at rest.",
  },
  {
    q: "Do you provide an API?",
    a: "Yes. Every plan includes API access with documentation.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via our secure payment processor.",
  },
] as const;

export default function Faq() {
  return (
    <section className="border-border border-b bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="text-center">
          <span className="section-label">FAQ</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Frequently asked questions.
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty text-lg">
            Everything else you might want to know.
          </p>
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
