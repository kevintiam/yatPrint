/**
 * Page Panier (/panier) : articles + formulaire de commande.
 * Le panier vit dans le navigateur, donc le contenu est un composant client.
 */
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata = {
  title: "Mon panier",
  robots: { index: false }, // page personnelle : inutile dans Google
};

export default async function CartPage({ searchParams }) {
  const params = await searchParams;
  // ?paiement=annule : le client revient de Stripe sans avoir payé
  const paymentCancelled = params.paiement === "annule";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="font-script text-2xl text-magenta">Presque fini !</p>
      <h1 className="mb-10 text-4xl font-extrabold sm:text-5xl">Votre panier</h1>
      <CartPageContent paymentCancelled={paymentCancelled} />
    </div>
  );
}
