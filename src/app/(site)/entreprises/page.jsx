/**
 * Page Entreprises (/entreprises) : offres pour les organisations
 * et formulaire de demande de devis.
 */
import { Building2, CalendarDays, Gift, Stamp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { BUSINESS_OFFERS, BUSINESS_STEPS } from "@/content/pages";
import { cn } from "@/lib/utils/cn";

export const metadata = {
  title: "Commandes d'entreprise",
  description: "Uniformes, cadeaux clients, événements et gravure de logo : demandez un devis à Yat'Print.",
};

const OFFER_ICONS = [Building2, Gift, CalendarDays, Stamp];
const OFFER_COLORS = ["bg-cyan text-white", "bg-magenta text-white", "bg-yellow text-ink", "bg-ink text-cream"];

export default function BusinessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Entreprises"
        title="Vos couleurs,"
        highlight="sur tout ce qui compte."
        text="Uniformes d'équipe, cadeaux clients, articles d'événement : nous préparons vos grosses commandes avec le même soin qu'une pièce unique."
        accent="magenta"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_OFFERS.map((offer, index) => {
            const Icon = OFFER_ICONS[index];
            return (
              <StaggerItem key={offer.title} className="rounded-3xl border-2 border-ink bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hard">
                <span className={cn("grid size-12 place-items-center rounded-2xl border-2 border-ink", OFFER_COLORS[index])}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold">{offer.title}</h2>
                <p className="mt-2 text-ink-soft">{offer.text}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="font-script text-2xl text-magenta">Comment ça se passe ?</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Un devis en trois étapes</h2>
          <ol className="mt-8 flex flex-col gap-5">
            {BUSINESS_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-yellow font-display font-bold">
                  {index + 1}
                </span>
                <p className="pt-1.5 text-lg">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[2rem] border-2 border-ink bg-paper p-6 shadow-hard-lg sm:p-8">
          <h2 className="mb-6 font-display text-2xl font-extrabold">Parlez-nous de votre projet</h2>
          <QuoteForm />
        </Reveal>
      </section>
    </>
  );
}
