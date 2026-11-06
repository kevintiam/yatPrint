"use client";

/**
 * Petit hook pour gérer un formulaire : valeurs des champs, erreurs,
 * validation avec un schéma Zod. (Aucun appel d'API ici.)
 *
 * Exemple :
 *   const form = useForm({ email: "" }, monSchema);
 *   <input name="email" value={form.values.email} onChange={form.handleChange} />
 *   {form.errors.email && <p>{form.errors.email}</p>}
 *   const result = form.validate(); if (result.success) { envoyer(result.data) }
 */
import { useState } from "react";
import { validateData } from "@/lib/validation/validate";

/**
 * Garde seulement la dernière partie de chaque clé d'erreur :
 * « delivery.address.line1 » -> « line1 ». Utile quand le formulaire
 * a des champs « à plat » mais que le schéma est imbriqué.
 * @param {Record<string, string>} fieldErrors
 * @returns {Record<string, string>}
 */
export function flattenErrorKeys(fieldErrors) {
  const flat = {};
  for (const [path, message] of Object.entries(fieldErrors)) {
    const parts = path.split(".");
    const lastPart = parts[parts.length - 1];
    if (!flat[lastPart]) flat[lastPart] = message;
  }
  return flat;
}

/**
 * @param {object} initialValues - valeurs de départ de chaque champ
 * @param {import("zod").ZodType} [schema] - schéma de validation (facultatif)
 */
export function useForm(initialValues, schema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /** Change la valeur d'un champ et efface son erreur. */
  function setValue(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  /** À brancher sur onChange des <input>, <select> et <textarea>. */
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValue(name, type === "checkbox" ? checked : value);
  }

  /**
   * Valide les valeurs avec le schéma et affiche les erreurs.
   * @param {object} [valuesToCheck] - données à valider (par défaut : les valeurs du formulaire)
   * @returns {{success: boolean, data: any, fieldErrors: object}}
   */
  function validate(valuesToCheck) {
    if (!schema) return { success: true, data: values, fieldErrors: {} };

    const result = validateData(schema, valuesToCheck || values);
    setErrors(flattenErrorKeys(result.fieldErrors));
    return result;
  }

  /** Remet le formulaire à son état de départ. */
  function reset() {
    setValues(initialValues);
    setErrors({});
  }

  return { values, errors, setErrors, setValue, handleChange, validate, reset };
}
