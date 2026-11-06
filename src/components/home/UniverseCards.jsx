/**
 * Les 4 « portes d'entrée » du site : Personnaliser, Collection,
 * Entreprises, Mentorat. Chaque carte a sa couleur CMJN.
 */
import Link from "next/link";
import { Briefcase, GraduationCap, Palette, Shirt } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/layout/PageHeader";
import { UNIVERSES } from "@/content/home";
import { cn } from "@/lib/utils/cn";

const ICONS = { palette: Palette, shirt: Shirt, briefcase: Briefcase, graduation: GraduationCap };

// Couleur du haut de la carte et de son bouton
const ACCENTS = {
  cyan: { top: "bg-cyan text-white", chip: "group-hover:bg-cyan group-hover:text-white" },
  magenta: { top: "bg-magenta text-white", chip: "group-hover:bg-magenta group-hover:text-white" },
  yellow: { top: "bg-yellow text-ink", chip: "group-hover:bg-yellow" },
  ink: { top: "bg-ink text-cream", chip: "group-hover:bg-ink group-hover:text-cream" },
};

export function UniverseCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Par où commencer ?"
        title="Que voulez-vous créer aujourd'hui ?"
        text="Un article unique, une pièce de la collection, une grosse commande ou un coup de pouce pour apprendre : tout part d'ici."
      />

      <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {UNIVERSES.map((universe, index) => {
          const Icon = ICONS[universe.icon];
          const accent = ACCENTS[universe.accent];
          return (
            <StaggerItem key={universe.href}>
              <Link
                href={universe.href}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink bg-paper transition-all duration-300 hover:-translate-y-2 hover:shadow-hard-lg",
                  index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"
                )}
              >
                <div className={cn("flex items-center justify-between px-6 py-5", accent.top)}>
                  <Icon className="size-9 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true" />
                  <span className="font-display text-sm font-bold opacity-80">0{index + 1}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-2xl font-bold">{universe.title}</h3>
                  <p className="text-ink-soft">{universe.text}</p>
                  <span
                    className={cn(
                      "mt-auto flex w-fit items-center justify-center gap-1.5 rounded-full border-2 border-ink px-4 py-2 text-[1rem] font-bold transition-colors",
                      accent.chip
                    )}
                  >
                    {universe.cta}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
