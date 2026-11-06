"use client";

/**
 * Formulaire de commande de la page Panier :
 * 1. Coordonnées  2. Livraison  3. Note facultative  -> récapitulatif + bouton Payer.
 *
 * Les champs sont « à plat » (firstName, line1...) pour rester simples ;
 * on construit l'objet attendu par l'API au moment de l'envoi.
 */
import { useState } from "react";
import { Lock } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { DeliveryFields } from "./DeliveryFields";
import { OrderSummary } from "./OrderSummary";
import { useForm, flattenErrorKeys } from "@/hooks/useForm";
import { useCheckout } from "@/hooks/useCheckout";
import { checkoutSchema } from "@/lib/validation/checkout";
import { validateData } from "@/lib/validation/validate";
import { toCheckoutItems } from "@/lib/cart/cartUtils";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  deliveryMethod: "shipping",
  province: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  customerNote: "",
};

/**
 * Cherche une erreur concernant un article du panier (clé « items.0.xxx »).
 * @param {Record<string, string>} fieldErrors
 * @returns {string} le message, ou ""
 */
function findItemError(fieldErrors) {
  for (const [path, message] of Object.entries(fieldErrors)) {
    if (path.startsWith("items")) return message;
  }
  return "";
}

/**
 * @param {object} props
 * @param {object[]} props.items - lignes du panier
 */
export function CheckoutForm({ items }) {
  const form = useForm(INITIAL_VALUES);
  const { values, errors, handleChange } = form;
  const { submitCheckout, isSubmitting, error: serverError } = useCheckout();
  const [itemError, setItemError] = useState("");

  /** Construit les données au format attendu par POST /api/checkout. */
  function buildPayload() {
    return {
      items: toCheckoutItems(items),
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      },
      delivery: {
        method: values.deliveryMethod,
        province: values.province,
        address: { line1: values.line1, line2: values.line2, city: values.city, postalCode: values.postalCode },
      },
      customerNote: values.customerNote,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setItemError("");
    const payload = buildPayload();

    // 1. Vérification dans le navigateur (réponse immédiate)
    const check = validateData(checkoutSchema, payload);
    if (!check.success) {
      form.setErrors(flattenErrorKeys(check.fieldErrors));
      setItemError(findItemError(check.fieldErrors));
      return;
    }

    // 2. Envoi au serveur (qui revérifie tout et recalcule les prix)
    const result = await submitCheckout(payload);
    if (!result.ok && result.fieldErrors) {
      form.setErrors(flattenErrorKeys(result.fieldErrors));
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 font-display text-xl font-bold">1. Vos coordonnées</legend>
        <Field label="Prénom" htmlFor="firstName" error={errors.firstName} required>
          <Input id="firstName" name="firstName" autoComplete="given-name" value={values.firstName} onChange={handleChange} invalid={Boolean(errors.firstName)} />
        </Field>
        <Field label="Nom" htmlFor="lastName" error={errors.lastName} required>
          <Input id="lastName" name="lastName" autoComplete="family-name" value={values.lastName} onChange={handleChange} invalid={Boolean(errors.lastName)} />
        </Field>
        <Field label="Courriel" htmlFor="email" error={errors.email} hint="Pour la confirmation et le suivi." required>
          <Input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} invalid={Boolean(errors.email)} />
        </Field>
        <Field label="Téléphone" htmlFor="phone" error={errors.phone} required>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="613 555-0101" value={values.phone} onChange={handleChange} invalid={Boolean(errors.phone)} />
        </Field>
      </fieldset>

      <DeliveryFields form={form} />

      <Field label="3. Une précision pour nous ? (facultatif)" htmlFor="customerNote" error={errors.customerNote}>
        <Textarea
          id="customerNote"
          name="customerNote"
          rows={3}
          placeholder="Ex. : date importante, question sur votre design…"
          value={values.customerNote}
          onChange={handleChange}
        />
      </Field>

      <div className="rounded-3xl border-2 border-ink bg-paper p-5 shadow-hard">
        <OrderSummary items={items} deliveryMethod={values.deliveryMethod} provinceCode={values.province} />
      </div>

      {itemError && <Alert tone="error">{itemError}</Alert>}
      {hasErrors && !itemError && <Alert tone="error">Vérifiez les champs en rouge.</Alert>}
      {serverError && <Alert tone="error">{serverError}</Alert>}

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner label="Envoi en cours" /> : <Lock aria-hidden="true" />}
        {isSubmitting ? "Préparation du paiement…" : "Passer au paiement sécurisé"}
      </Button>
      <p className="-mt-4 text-center text-sm text-muted">
        Paiement par carte sur la page sécurisée de Stripe.
      </p>
    </form>
  );
}
