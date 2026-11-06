/**
 * Page Mentorat (/mentorat) : les deux thèmes (Canva, impression),
 * le déroulement, puis le formulaire de demande de réservation.
 */
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MentorshipForm } from "@/components/forms/MentorshipForm";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { MENTORSHIP_STEPS, MENTORSHIP_TRACKS } from "@/content/pages";
import { cn } from "@/lib/utils/cn";

export const metadata = {
  title: "Mentorat Canva et impression",
  description: "Apprenez à créer vos visuels sur Canva et à préparer vos impressions, avec un accompagnement personnalisé.",
};

const TRACK_STYLES = {
  cyan: { header: "bg-cyan", check: "bg-cyan" },
  magenta: { header: "bg-magenta", check: "bg-magenta" },
};

export default function MentorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mentorat"
        title="Apprenez à créer"
        highlight="vos propres visuels."
        text="Un accompagnement concret, à votre rythme, pour maîtriser Canva et comprendre l'impression."
        accent="cyan"
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
        {MENTORSHIP_TRACKS.map((track, index) => {
          const style = TRACK_STYLES[track.accent];
          return (
            <Reveal key={track.key} delay={index * 0.1} className="overflow-hidden rounded-[2rem] border-2 border-ink bg-paper">
              <div className={cn("px-8 py-6 text-white", style.header)}>
                <h2 className="font-display text-4xl font-extrabold">{track.title}</h2>
                <p className="mt-2 text-lg text-white/90">{track.text}</p>
              </div>
              <ul className="flex flex-col gap-3 p-8">
                {track.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink text-white", style.check)}>
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </section>

      <section className="bg-cream-dark/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-3xl font-extrabold sm:text-4xl">Comment ça se passe ?</h2>
          <StaggerGroup className="grid gap-5 md:grid-cols-3">
            {MENTORSHIP_STEPS.map((step, index) => (
              <StaggerItem key={step.title} className="rounded-3xl border-2 border-ink bg-paper p-6 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full border-2 border-ink bg-yellow font-display text-xl font-bold">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.text}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <p className="mt-8 text-center text-muted">Format, durée et tarif : nous les confirmons avec vous par courriel.</p>
        </div>
      </section>

      <section id="reserver" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal className="rounded-[2rem] border-2 border-ink bg-paper p-6 shadow-hard-lg sm:p-10">
          <p className="font-script text-2xl text-magenta">On commence quand ?</p>
          <h2 className="mb-8 mt-1 font-display text-3xl font-extrabold">Demander une séance</h2>
          <MentorshipForm />
        </Reveal>
      </section>
    </>
  );
}
