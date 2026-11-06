"use client";

/**
 * Récapitulatif des montants : sous-total, livraison, taxes, total.
 * Utilise le même calcul que le serveur (services/pricing.js), avec les
 * réglages de la boutique, mais seul le montant recalculé par le serveur
 * au paiement fait foi.
 */
import { computeOrderTotals, formatTaxRate } from "@/lib/services/pricing";
import { formatPrice } from "@/lib/utils/format";
import { useStoreSettings } from "@/hooks/useStoreSettings";

/**
 * @param {object} props
 * @param {{unitPriceCents: number, quantity: number}[]} props.items
 * @param {"shipping"|"pickup"} props.deliveryMethod
 * @param {string} props.provinceCode
 */
export function OrderSummary({ items, deliveryMethod, provinceCode }) {
  const settings = useStoreSettings();
  const totals = computeOrderTotals({ items, deliveryMethod, provinceCode, settings });
  const taxesKnown = deliveryMethod === "pickup" || Boolean(provinceCode);

  return (
    <dl className="flex flex-col gap-2 text-[0.95rem]">
      <div className="flex justify-between">
        <dt className="text-muted">Sous-total</dt>
        <dd className="font-semibold">{formatPrice(totals.subtotalCents)}</dd>
      </div>

      <div className="flex justify-between">
        <dt className="text-muted">Livraison</dt>
        <dd className="font-semibold">{totals.shippingCents === 0 ? "Gratuit" : formatPrice(totals.shippingCents)}</dd>
      </div>

      {!settings.taxesEnabled ? null : taxesKnown ? (
        totals.taxLines.map((taxLine) => (
          <div key={taxLine.label} className="flex justify-between">
            <dt className="text-muted">
              {taxLine.label} ({formatTaxRate(taxLine.rate)})
            </dt>
            <dd className="font-semibold">{formatPrice(taxLine.amountCents)}</dd>
          </div>
        ))
      ) : (
        <div className="flex justify-between">
          <dt className="text-muted">Taxes</dt>
          <dd className="text-sm text-muted">Choisissez votre province</dd>
        </div>
      )}

      <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink pt-3">
        <dt className="font-display text-lg font-bold">Total</dt>
        <dd className="font-display text-3xl font-extrabold">{formatPrice(totals.totalCents)}</dd>
      </div>
    </dl>
  );
}
