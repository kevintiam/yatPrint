/**
 * Page de remerciement après une commande (/commande/merci).
 *
 * Deux façons d'arriver ici :
 * - ?session_id=cs_... : retour de Stripe après le paiement (cas normal) ;
 * - ?commande=YP-...   : mode démo (sans Stripe, en développement).
 *
 * Par discrétion, la page n'affiche ni l'adresse ni le téléphone du client.
 */
import Link from "next/link";
import { CircleCheckBig, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { Confetti } from "@/components/cart/Confetti";
import { findOrderByNumber, findOrderByStripeSessionId } from "@/lib/db/orders";
import { syncOrderWithStripeSession } from "@/lib/services/payments";
import { isStripeConfigured } from "@/lib/services/stripe";
import { formatPrice } from "@/lib/utils/format";
import { describeItemOptions } from "@/lib/utils/itemOptions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Merci pour votre commande", robots: { index: false } };

/**
 * Retrouve la commande à partir des paramètres de l'adresse.
 * @param {{session_id?: string, commande?: string}} params
 */
async function loadOrder(params) {
  if (params.session_id) {
    // Vérifie aussi le paiement auprès de Stripe (utile si le webhook n'est pas encore arrivé)
    if (isStripeConfigured()) return syncOrderWithStripeSession(params.session_id);
    return findOrderByStripeSessionId(params.session_id);
  }
  if (params.commande) {
    const order = await findOrderByNumber(params.commande);
    // Avec un simple numéro, on n'affiche que les commandes du mode démo
    return order && order.paymentMode === "demo" ? order : null;
  }
  return null;
}

export default async function ThankYouPage({ searchParams }) {
  const order = await loadOrder(await searchParams);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Commande introuvable</h1>
        <p className="mt-4 text-ink-soft">Si vous venez de payer, vérifiez vos courriels : la confirmation y est envoyée.</p>
        <Button asChild variant="accent" className="mt-8">
          <Link href="/suivi-commande">Suivre une commande</Link>
        </Button>
      </div>
    );
  }

  const isPaid = order.status !== "pending_payment";

  return (
    <div className="relative">
      <ClearCartOnMount />
      {isPaid && <Confetti />}

      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-ink bg-yellow shadow-hard">
          {isPaid ? <CircleCheckBig className="size-10" aria-hidden="true" /> : <Clock className="size-10" aria-hidden="true" />}
        </span>
        <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
          Merci <span className="marker">{order.customer.firstName}</span> !
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {isPaid
            ? "Votre commande est confirmée. Un courriel de confirmation est en route."
            : "Nous attendons la confirmation de votre paiement. Cela ne prend généralement que quelques secondes."}
        </p>
        <p className="mt-6 inline-flex rounded-full border-2 border-ink bg-paper px-5 py-2 font-display text-xl font-bold">
          Commande {order.orderNumber}
        </p>

        {order.paymentMode === "demo" && (
          <Alert tone="info" className="mt-6 text-left">
            Mode démo : aucun paiement réel n&apos;a été effectué (aucune clé Stripe configurée).
          </Alert>
        )}

        <ul className="mt-10 divide-y-2 divide-dashed divide-ink/15 rounded-3xl border-2 border-ink bg-paper px-6 text-left">
          {order.items.map((item, index) => (
            <li key={`${item.productSlug}-${index}`} className="flex justify-between gap-4 py-4">
              <div>
                <p className="font-bold">
                  {item.productName} × {item.quantity}
                </p>
                <p className="text-sm text-muted">{describeItemOptions(item)}</p>
              </div>
              <p className="shrink-0 font-semibold">{formatPrice(item.unitPriceCents * item.quantity)}</p>
            </li>
          ))}
          <li className="flex justify-between py-4 font-display text-xl font-extrabold">
            <span>Total payé</span>
            <span>{formatPrice(order.totalCents)}</span>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent">
            <Link href={`/suivi-commande?commande=${encodeURIComponent(order.orderNumber)}`}>Suivre ma commande</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
