"use client";

/**
 * Formulaire de demande de devis entreprise (page Entreprises).
 * Champs demandés par Gessica : prénom, nom, téléphone, commentaire.
 * Courriel et entreprise sont facultatifs.
 */
import { Send } from "lucide-react";
import { Field, HoneypotField } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { FormSuccess } from "./FormSuccess";
import { useForm, flattenErrorKeys } from "@/hooks/useForm";
import { useQuoteRequest } from "@/hooks/usePublicForms";
import { quoteRequestSchema } from "@/lib/validation/forms";

const INITIAL_VALUES = { firstName: "", lastName: "", phone: "", email: "", company: "", comment: "", website: "" };

export function QuoteForm() {
  const form = useForm(INITIAL_VALUES, quoteRequestSchema);
  const request = useQuoteRequest();
  const { values, errors, handleChange } = form;

  async function handleSubmit(event) {
    event.preventDefault();
    const check = form.validate();
    if (!check.success) return;

    // Le champ piège « website » est envoyé tel quel (vide pour un humain)
    const result = await request.submit({ ...check.data, website: values.website });
    if (!result.ok) {
      form.setErrors(flattenErrorKeys(result.fieldErrors || {}));
    }
  }

  function handleReset() {
    form.reset();
    request.reset();
  }

  if (request.data) {
    return (
      <FormSuccess
        title="Demande envoyée !"
        text="Merci. Nous vous rappelons rapidement pour préciser votre projet et vous envoyer un devis."
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <HoneypotField value={values.website} onChange={handleChange} />

      <Field label="Prénom" htmlFor="quote-firstName" error={errors.firstName} required>
        <Input id="quote-firstName" name="firstName" autoComplete="given-name" value={values.firstName} onChange={handleChange} invalid={Boolean(errors.firstName)} />
      </Field>
      <Field label="Nom" htmlFor="quote-lastName" error={errors.lastName} required>
        <Input id="quote-lastName" name="lastName" autoComplete="family-name" value={values.lastName} onChange={handleChange} invalid={Boolean(errors.lastName)} />
      </Field>
      <Field label="Téléphone" htmlFor="quote-phone" error={errors.phone} required>
        <Input id="quote-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} invalid={Boolean(errors.phone)} />
      </Field>
      <Field label="Courriel" htmlFor="quote-email" error={errors.email} hint="Facultatif">
        <Input id="quote-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Entreprise ou organisation" htmlFor="quote-company" error={errors.company} hint="Facultatif" className="sm:col-span-2">
        <Input id="quote-company" name="company" autoComplete="organization" value={values.company} onChange={handleChange} />
      </Field>
      <Field
        label="Votre projet"
        htmlFor="quote-comment"
        error={errors.comment}
        hint="Articles, quantités, couleurs, date souhaitée…"
        required
        className="sm:col-span-2"
      >
        <Textarea id="quote-comment" name="comment" rows={5} value={values.comment} onChange={handleChange} invalid={Boolean(errors.comment)} />
      </Field>

      {request.error && (
        <Alert tone="error" className="sm:col-span-2">
          {request.error}
        </Alert>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={request.isLoading} className="sm:col-span-2">
        {request.isLoading ? <Spinner label="Envoi en cours" /> : <Send aria-hidden="true" />}
        {request.isLoading ? "Envoi…" : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
