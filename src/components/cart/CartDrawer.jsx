"use client";

/**
 * Tiroir du panier : s'ouvre sur le côté quand on clique sur l'icône du
 * panier ou quand on ajoute un article.
 */
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { CartLine } from "./CartLine";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const { items, itemCount, subtotalCents, isDrawerOpen, setDrawerOpen, closeDrawer } = useCart();
  const isEmpty = items.length === 0;

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={setDrawerOpen}
      title={isEmpty ? "Votre panier" : `Votre panier (${itemCount})`}
      footer={
        isEmpty ? null : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Sous-total</span>
              <span className="font-display text-2xl font-extrabold">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="text-sm text-muted">Livraison et taxes calculées à l&apos;étape suivante.</p>
            <Button asChild variant="accent" size="lg">
              <Link href="/panier" onClick={closeDrawer}>
                Passer la commande
              </Link>
            </Button>
            <Button variant="ghost" onClick={closeDrawer}>
              Continuer mes achats
            </Button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          text="Créez un article à votre image ou découvrez la collection."
          action={
            <Button asChild variant="accent">
              <Link href="/personnaliser" onClick={closeDrawer}>
                Personnaliser un article
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y-2 divide-dashed divide-ink/15">
          {items.map((item) => (
            <CartLine key={item.lineId} item={item} compact onNavigate={closeDrawer} />
          ))}
        </ul>
      )}
    </Sheet>
  );
}
