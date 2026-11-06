/**
 * Avis clients. La section ne s'affiche que s'il y a de vrais avis
 * dans src/content/testimonials.js (liste vide = section masquée).
 */
import { Quote } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/layout/PageHeader";
import { TESTIMONIALS } from "@/content/testimonials";
import { cn } from "@/lib/utils/cn";

const CARD_COLORS = ["bg-cyan-soft", "bg-magenta-soft", "bg-yellow-soft"];

export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Ils en parlent" title="Ce que disent nos clients" align="center" />

      <StaggerGroup className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <StaggerItem
            key={testimonial.name}
            className={cn("rounded-3xl border-2 border-ink p-7", CARD_COLORS[index % CARD_COLORS.length])}
          >
            <Quote className="size-8 text-magenta" aria-hidden="true" />
            <blockquote className="mt-4 text-lg leading-relaxed">{testimonial.text}</blockquote>
            <p className="mt-5 font-bold">{testimonial.name}</p>
            {testimonial.product && <p className="text-sm text-muted">{testimonial.product}</p>}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
