/**
 * Carte « Articles » d'une commande dans l'admin : chaque article avec ses
 * options, les instructions du client et le lien de téléchargement du design.
 */
import { Download } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { Badge } from "@/components/ui/badge";
import { getItemOptionList } from "@/lib/utils/itemOptions";
import { formatPrice } from "@/lib/utils/format";
import { formatTaxRate } from "@/lib/services/pricing";

/**
 * @param {{order: object}} props
 */
export function OrderItemsCard({ order }) {
  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-6">
      <h2 className="mb-4 font-display text-xl font-bold">Articles</h2>

      <ul className="flex flex-col gap-5">
        {order.items.map((item, index) => (
          <li key={`${item.productSlug}-${index}`} className="flex gap-4 border-b-2 border-dashed border-ink/10 pb-5 last:border-0 last:pb-0">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border-2 border-ink">
              <ProductImage src={item.image} alt={item.productName} category={item.category} sizes="80px" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-bold">
                  {item.productName} × {item.quantity}
                  <Badge tone={item.line === "service" ? "cyan" : "magenta"} className="ml-2 align-middle">
                    {item.line === "service" ? "Personnalisé" : "Collection"}
                  </Badge>
                </p>
                <p className="font-semibold">{formatPrice(item.unitPriceCents * item.quantity)}</p>
              </div>

              <ul className="mt-2 flex flex-col gap-0.5 text-sm">
                {getItemOptionList(item).map((option) => (
                  <li key={option.label}>
                    <span className="font-semibold">{option.label} :</span> {option.value}
                  </li>
                ))}
              </ul>

              {item.instructions && (
                <p className="mt-2 rounded-xl bg-yellow-soft px-3 py-2 text-sm">
                  <span className="font-semibold">Instructions : </span>
                  {item.instructions}
                </p>
              )}

              {item.designFile && (
                <a
                  href={`/api/files/${item.designFile}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold transition hover:bg-ink hover:text-cream"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Télécharger le design
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 flex flex-col gap-1 border-t-2 border-ink pt-4 text-sm">
        <div className="flex justify-between"><dt>Sous-total</dt><dd>{formatPrice(order.subtotalCents)}</dd></div>
        <div className="flex justify-between"><dt>Livraison</dt><dd>{formatPrice(order.shippingCents)}</dd></div>
        {order.taxLines.map((taxLine) => (
          <div key={taxLine.label} className="flex justify-between">
            <dt>{taxLine.label} ({formatTaxRate(taxLine.rate)})</dt>
            <dd>{formatPrice(taxLine.amountCents)}</dd>
          </div>
        ))}
        <div className="mt-1 flex justify-between font-display text-lg font-extrabold"><dt>Total</dt><dd>{formatPrice(order.totalCents)}</dd></div>
      </dl>
    </section>
  );
}
