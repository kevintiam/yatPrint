/**
 * Deux grands blocs d'appel à l'action côte à côte :
 * Entreprises (magenta) et Mentorat (cyan).
 */
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

export function DuoCta() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <Reveal className="group relative overflow-hidden rounded-[2rem] border-2 border-ink bg-magenta p-10 text-white transition-shadow duration-300 hover:shadow-hard-lg">
        <Briefcase className="relative size-12" aria-hidden="true" />
        <h2 className="relative mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
          Une grosse commande pour votre équipe ?
        </h2>
        <p className="relative mt-4 max-w-md text-lg text-white/90">
          Uniformes, cadeaux clients, événements : parlez-nous de votre projet et recevez un devis adapté.
        </p>
        <Button asChild variant="light" size="lg" className="relative mt-8">
          <Link href="/entreprises">
            Demander un devis
          </Link>
        </Button>
      </Reveal>

      <Reveal delay={0.1} className="group relative overflow-hidden rounded-[2rem] border-2 border-ink bg-cyan p-10 text-white transition-shadow duration-300 hover:shadow-hard-lg">
        <GraduationCap className="relative size-12" aria-hidden="true" />
        <h2 className="relative mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
          Apprenez à créer vos propres visuels
        </h2>
        <p className="relative mt-4 max-w-md text-lg text-white/90">
          Mentorat Canva et impression, en ligne ou à l&apos;atelier, adapté à votre niveau.
        </p>
        <Button asChild variant="light" size="lg" className="relative mt-8">
          <Link href="/mentorat">
            Découvrir le mentorat
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
