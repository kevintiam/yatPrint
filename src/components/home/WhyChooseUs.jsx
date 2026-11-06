/**
 * Section « Pourquoi nous choisir ? » : 4 cartes numérotées 01 à 04,
 * reprises du site modèle, chacune avec une couleur CMJN.
 */
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/layout/PageHeader";
import { WHY_CHOOSE_US } from "@/content/home";
import { cn } from "@/lib/utils/cn";

// Couleur du grand numéro et du trait de chaque carte, dans l'ordre
const NUMBER_COLORS = ["text-cyan", "text-magenta", "text-yellow", "text-ink"];
const BAR_COLORS = ["bg-cyan", "bg-magenta", "bg-yellow", "bg-ink"];

export function WhyChooseUs() {
  return (
    <section className="bg-cream-dark/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pourquoi Yat'Print ?"
          title="Ce qui fait la différence"
          align="center"
        />

        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((reason, index) => (
            <StaggerItem
              key={reason.title}
              className="group relative overflow-hidden rounded-3xl border-2 border-ink bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-hard"
            >
              <span className={cn("absolute inset-x-0 top-0 h-2", BAR_COLORS[index])} aria-hidden="true" />
              <p
                className={cn(
                  "font-display text-6xl font-extrabold leading-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                  NUMBER_COLORS[index]
                )}
                style={{ WebkitTextStroke: "2px var(--color-ink)" }}
                aria-hidden="true"
              >
                0{index + 1}
              </p>
              <h3 className="mt-5 font-display text-xl font-bold">{reason.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{reason.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
