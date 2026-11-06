/**
 * Pages d'information (/informations/<slug>) :
 * conditions de vente, livraison et retours, confidentialité.
 * Le contenu vient de src/content/legal.js ; « {courriel} » y est remplacé
 * par le courriel des réglages de la boutique.
 */
import { notFound } from "next/navigation";
import { LEGAL_PAGES } from "@/content/legal";
import { Alert } from "@/components/ui/feedback";
import { loadStoreSettings } from "@/lib/server/storeSettings";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  return { title: page ? page.title : "Page introuvable" };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];

  if (!page) {
    notFound();
  }
  const settings = await loadStoreSettings();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-script text-2xl text-magenta">Informations</p>
      <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{page.title}</h1>

      <Alert tone="warning" className="mt-8">
        Texte provisoire : il sera relu et complété avant la mise en ligne du site.
      </Alert>

      <div className="mt-10 flex flex-col gap-8">
        {page.sections.map((section) => (
          <section key={section.heading} className="rounded-3xl border-2 border-ink bg-paper p-6">
            <h2 className="font-display text-2xl font-bold">{section.heading}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{section.text.replaceAll("{courriel}", settings.email)}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
