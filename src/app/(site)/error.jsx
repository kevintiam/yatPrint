"use client";

/**
 * Page affichée si une erreur imprévue survient sur une page publique
 * (ex. base de données injoignable). Le visiteur peut réessayer.
 */
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteError({ reset }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-24 text-center">
      <p className="font-script text-3xl text-magenta">Oups !</p>
      <h1 className="text-4xl font-extrabold">Une tache d&apos;encre s&apos;est glissée…</h1>
      <p className="text-lg text-ink-soft">
        Cette page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant ; si le problème continue,
        écrivez-nous.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="accent" onClick={() => reset()}>
          <RefreshCw aria-hidden="true" />
          Réessayer
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </section>
  );
}
