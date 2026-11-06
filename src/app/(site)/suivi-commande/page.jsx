/**
 * Page de suivi de commande (/suivi-commande).
 * Le lien des courriels ajoute ?commande=YP-... pour préremplir le numéro.
 */
import { PageHeader } from "@/components/layout/PageHeader";
import { TrackOrderForm } from "@/components/forms/TrackOrderForm";

export const metadata = {
  title: "Suivre ma commande",
  description: "Suivez l'avancement de votre commande Yat'Print.",
};

export default async function TrackOrderPage({ searchParams }) {
  const params = await searchParams;
  const initialOrderNumber = typeof params.commande === "string" ? params.commande.slice(0, 30) : "";

  return (
    <>
      <PageHeader
        eyebrow="Suivi"
        title="Où en est"
        highlight="ma commande ?"
        text="Votre numéro de commande se trouve dans le courriel de confirmation."
        accent="cyan"
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <TrackOrderForm initialOrderNumber={initialOrderNumber} />
      </section>
    </>
  );
}
