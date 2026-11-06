/**
 * Section « Comment ça marche » : 3 étapes sur fond noir, reliées par
 * une ligne pointillée, avec un bandeau défilant au-dessus.
 */
import { MousePointerClick, Package, UploadCloud } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Decorations";
import { HOW_IT_WORKS, MARQUEE_ITEMS } from "@/content/home";
import { cn } from "@/lib/utils/cn";

const STEP_ICONS = [MousePointerClick, UploadCloud, Package];
const STEP_COLORS = ["bg-cyan text-white", "bg-magenta text-white", "bg-yellow text-ink"];

export function HowItWorks() {
  return (
    <section className="overflow-hidden bg-ink text-cream">
      {/* Bandeau jaune légèrement incliné */}
      <div className="-mx-4 -rotate-1 border-y-2 border-ink bg-yellow text-ink">
        <Marquee items={MARQUEE_ITEMS} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 font-script text-2xl text-yellow">Simple comme bonjour</p>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">Comment ça marche ?</h2>
        </div>

        <StaggerGroup className="relative grid gap-10 md:grid-cols-3">
          {/* Ligne pointillée qui relie les étapes (grand écran seulement) */}
          <span className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-cream/30 md:block" aria-hidden="true" />

          {HOW_IT_WORKS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <StaggerItem key={step.title} className="relative flex flex-col items-start gap-4 md:items-center md:text-center">
                <span
                  className={cn(
                    "relative grid size-20 place-items-center rounded-full border-2 border-cream transition-transform duration-300 hover:rotate-12 hover:scale-110",
                    STEP_COLORS[index]
                  )}
                >
                  <Icon className="size-9" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full border-2 border-cream bg-ink font-display text-sm font-bold text-cream">
                    {index + 1}
                  </span>
                </span>
                <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                <p className="max-w-xs leading-relaxed text-cream/75">{step.text}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
