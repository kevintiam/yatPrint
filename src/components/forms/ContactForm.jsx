"use client";

/**
 * Formulaire de la page Contact.
 */
import { Send } from "lucide-react";
import { Field, HoneypotField } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { FormSuccess } from "./FormSuccess";
import { useForm, flattenErrorKeys } from "@/hooks/useForm";
import { useContactMessage } from "@/hooks/usePublicForms";
import { contactMessageSchema } from "@/lib/validation/forms";
import { CONTACT_SUBJECTS } from "@/config/options";

const INITIAL_VALUES = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export function ContactForm() {
  const form = useForm(INITIAL_VALUES, contactMessageSchema);
  const request = useContactMessage();
  const { values, errors, handleChange } = form;

  async function handleSubmit(event) {
    event.preventDefault();
    const check = form.validate();
    if (!check.success) return;

    const result = await request.submit({ ...check.data, website: values.website });
    if (!result.ok) {
      form.setErrors(flattenErrorKeys(result.fieldErrors || {}));
    }
  }

  if (request.data) {
    return (
      <FormSuccess
        title="Message envoyé !"
        text="Merci de nous avoir écrit. Nous vous répondons par courriel dans les meilleurs délais."
        onReset={() => {
          form.reset();
          request.reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <HoneypotField value={values.website} onChange={handleChange} />

      <Field label="Nom" htmlFor="contact-name" error={errors.name} required>
        <Input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={handleChange} invalid={Boolean(errors.name)} />
      </Field>
      <Field label="Courriel" htmlFor="contact-email" error={errors.email} required>
        <Input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Téléphone" htmlFor="contact-phone" error={errors.phone} hint="Facultatif">
        <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} invalid={Boolean(errors.phone)} />
      </Field>
      <Field label="Sujet" htmlFor="contact-subject" error={errors.subject} required>
        <Select id="contact-subject" name="subject" value={values.subject} onChange={handleChange} invalid={Boolean(errors.subject)}>
          <option value="">Choisissez…</option>
          {Object.entries(CONTACT_SUBJECTS).map(([key, subject]) => (
            <option key={key} value={key}>
              {subject.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Message" htmlFor="contact-message" error={errors.message} required className="sm:col-span-2">
        <Textarea id="contact-message" name="message" rows={6} value={values.message} onChange={handleChange} invalid={Boolean(errors.message)} />
      </Field>

      {request.error && (
        <Alert tone="error" className="sm:col-span-2">
          {request.error}
        </Alert>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={request.isLoading} className="sm:col-span-2">
        {request.isLoading ? <Spinner label="Envoi en cours" /> : <Send aria-hidden="true" />}
        {request.isLoading ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
