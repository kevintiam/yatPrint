"use client";

/**
 * Contenu de la page Panier : la liste des articles à gauche et le
 * formulaire de commande à droite (collé en haut pendant le défilement).
 */
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartLine } from "./CartLine";
import { CheckoutForm } from "./CheckoutForm";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { useCart } from "@/hooks/useCart";
import { pluralize } from "@/lib/utils/format";

/**
 * @param {object} props
 * @param {boolean} props.paymentCancelled - le client revient de Stripe sans avoir payé
 */
export function CartPageContent({ paymentCancelled }) {
  const { items, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Votre panier est vide"
        text="Commencez par personnaliser un article ou par explorer la collection Yat'Print."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent">
              <Link href="/personnaliser">Personnaliser un article</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/collection">Voir la collection</Link>
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_28rem]">
      <section aria-labelledby="cart-items-title">
        <h2 id="cart-items-title" className="mb-5 font-display text-2xl font-bold">
          {pluralize(itemCount, "article")} dans votre panier
        </h2>
        {paymentCancelled && (
          <Alert tone="warning" className="mb-5">
            Le paiement a été annulé : votre panier est toujours là. Vous pouvez réessayer quand vous voulez.
          </Alert>
        )}
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <CartLine key={item.lineId} item={item} />
          ))}
        </ul>
        <Link href="/collection" className="mt-6 inline-block font-semibold underline-offset-4 hover:underline">
          Continuer mes achats
        </Link>
      </section>

      <section aria-label="Commande" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] border-2 border-ink bg-cream-dark/60 p-6">
          <CheckoutForm items={items} />
        </div>
      </section>
    </div>
  );
}
