"use client";

/**
 * Formulaire de suivi de commande : numéro + courriel -> frise de suivi.
 */
import { PackageSearch } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { OrderTimeline } from "./OrderTimeline";
import { useForm } from "@/hooks/useForm";
import { useOrderTracking } from "@/hooks/usePublicForms";
import { orderTrackingSchema } from "@/lib/validation/forms";
import { formatDate, formatPrice } from "@/lib/utils/format";

/**
 * @param {object} props
 * @param {string} [props.initialOrderNumber] - numéro déjà connu (lien du courriel)
 */
export function TrackOrderForm({ initialOrderNumber = "" }) {
  const form = useForm({ orderNumber: initialOrderNumber, email: "" }, orderTrackingSchema);
  const tracking = useOrderTracking();
  const order = tracking.data ? tracking.data.order : null;

  async function handleSubmit(event) {
    event.preventDefault();
    const result = form.validate();
    if (result.success) {
      await tracking.submit(result.data);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[24rem_1fr]">
      <form onSubmit={handleSubmit} noValidate className="flex h-fit flex-col gap-4 rounded-3xl border-2 border-ink bg-paper p-6 shadow-hard">
        <Field label="Numéro de commande" htmlFor="orderNumber" error={form.errors.orderNumber} hint="Ex. : YP-261105-K7QF" required>
          <Input
            id="orderNumber"
            name="orderNumber"
            value={form.values.orderNumber}
            onChange={form.handleChange}
            invalid={Boolean(form.errors.orderNumber)}
            className="uppercase"
          />
        </Field>
        <Field label="Courriel utilisé pour la commande" htmlFor="email" error={form.errors.email} required>
          <Input id="email" name="email" type="email" autoComplete="email" value={form.values.email} onChange={form.handleChange} invalid={Boolean(form.errors.email)} />
        </Field>
        {tracking.error && <Alert tone="error">{tracking.error}</Alert>}
        <Button type="submit" variant="accent" disabled={tracking.isLoading}>
          {tracking.isLoading ? <Spinner /> : <PackageSearch aria-hidden="true" />}
          Voir le suivi
        </Button>
      </form>

      <div aria-live="polite">
        {order ? (
          <div className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Commande du {formatDate(order.createdAt)}</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold">{order.orderNumber}</h2>
            <p className="mt-1 text-ink-soft">
              Bonjour {order.firstName} · Total {formatPrice(order.totalCents)}
            </p>
            <div className="mt-8">
              <OrderTimeline status={order.status} deliveryMethod={order.deliveryMethod} history={order.statusHistory} />
            </div>
            <ul className="mt-8 flex flex-col gap-2 border-t-2 border-dashed border-ink/15 pt-6">
              {order.items.map((item, index) => (
                <li key={`${item.name}-${index}`} className="flex justify-between gap-3">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-muted">× {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="grid h-full min-h-64 place-items-center rounded-3xl border-2 border-dashed border-ink/20 p-8 text-center text-muted">
            <p>Entrez votre numéro de commande et votre courriel pour voir où en est votre commande.</p>
          </div>
        )}
      </div>
    </div>
  );
}
