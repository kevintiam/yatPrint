"use client";

/**
 * Formulaire de demande de réservation de mentorat (page Mentorat).
 * Gessica confirme ensuite la date dans l'admin.
 */
import { CalendarHeart } from "lucide-react";
import { Field, HoneypotField } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { FormSuccess } from "./FormSuccess";
import { useForm, flattenErrorKeys } from "@/hooks/useForm";
import { useMentorshipRequest } from "@/hooks/usePublicForms";
import { mentorshipRequestSchema } from "@/lib/validation/forms";
import { MENTORSHIP_FORMATS, MENTORSHIP_LEVELS, MENTORSHIP_TOPICS } from "@/config/options";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  topic: "",
  level: "",
  format: "",
  preferredDates: "",
  message: "",
  website: "",
};

/**
 * Options d'un menu déroulant à partir d'un objet de configuration.
 * @param {object} options - ex. MENTORSHIP_LEVELS
 */
function renderOptions(options) {
  const elements = [<option key="" value="">Choisissez…</option>];
  for (const [key, option] of Object.entries(options)) {
    elements.push(
      <option key={key} value={key}>
        {option.label}
      </option>
    );
  }
  return elements;
}

export function MentorshipForm() {
  const form = useForm(INITIAL_VALUES, mentorshipRequestSchema);
  const request = useMentorshipRequest();
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
        title="Demande de mentorat reçue !"
        text="Un accusé de réception vient de partir dans votre boîte courriel. Nous vous écrivons très vite pour confirmer la date."
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

      <Field label="Prénom" htmlFor="mentor-firstName" error={errors.firstName} required>
        <Input id="mentor-firstName" name="firstName" autoComplete="given-name" value={values.firstName} onChange={handleChange} invalid={Boolean(errors.firstName)} />
      </Field>
      <Field label="Nom" htmlFor="mentor-lastName" error={errors.lastName} required>
        <Input id="mentor-lastName" name="lastName" autoComplete="family-name" value={values.lastName} onChange={handleChange} invalid={Boolean(errors.lastName)} />
      </Field>
      <Field label="Courriel" htmlFor="mentor-email" error={errors.email} required>
        <Input id="mentor-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Téléphone" htmlFor="mentor-phone" error={errors.phone} hint="Facultatif">
        <Input id="mentor-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} invalid={Boolean(errors.phone)} />
      </Field>

      <Field label="Thème" htmlFor="mentor-topic" error={errors.topic} required>
        <Select id="mentor-topic" name="topic" value={values.topic} onChange={handleChange} invalid={Boolean(errors.topic)}>
          {renderOptions(MENTORSHIP_TOPICS)}
        </Select>
      </Field>
      <Field label="Votre niveau" htmlFor="mentor-level" error={errors.level} required>
        <Select id="mentor-level" name="level" value={values.level} onChange={handleChange} invalid={Boolean(errors.level)}>
          {renderOptions(MENTORSHIP_LEVELS)}
        </Select>
      </Field>
      <Field label="Format souhaité" htmlFor="mentor-format" error={errors.format} required className="sm:col-span-2">
        <Select id="mentor-format" name="format" value={values.format} onChange={handleChange} invalid={Boolean(errors.format)}>
          {renderOptions(MENTORSHIP_FORMATS)}
        </Select>
      </Field>

      <Field label="Vos disponibilités" htmlFor="mentor-dates" error={errors.preferredDates} hint="Ex. : les mardis soir, ou le samedi 14 novembre en matinée" required className="sm:col-span-2">
        <Input id="mentor-dates" name="preferredDates" value={values.preferredDates} onChange={handleChange} invalid={Boolean(errors.preferredDates)} />
      </Field>
      <Field label="Votre projet ou vos questions" htmlFor="mentor-message" error={errors.message} hint="Facultatif" className="sm:col-span-2">
        <Textarea id="mentor-message" name="message" rows={4} value={values.message} onChange={handleChange} />
      </Field>

      {request.error && (
        <Alert tone="error" className="sm:col-span-2">
          {request.error}
        </Alert>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={request.isLoading} className="sm:col-span-2">
        {request.isLoading ? <Spinner label="Envoi en cours" /> : <CalendarHeart aria-hidden="true" />}
        {request.isLoading ? "Envoi…" : "Demander une séance"}
      </Button>
    </form>
  );
}
