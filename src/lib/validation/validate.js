/**
 * Fonction unique pour valider des données avec un schéma Zod.
 *
 * Elle renvoie toujours le même format, facile à utiliser dans un formulaire :
 *   { success: true,  data: {...},  fieldErrors: {} }
 *   { success: false, data: null,   fieldErrors: { email: "Le courriel n'est pas valide." } }
 *
 * Les clés de fieldErrors sont les chemins des champs : "customer.email",
 * "items.0.quantity", etc. On garde seulement la première erreur de chaque champ.
 */

/**
 * @param {import("zod").ZodType} schema
 * @param {unknown} data
 * @returns {{success: boolean, data: any, fieldErrors: Record<string, string>}}
 */
export function validateData(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, fieldErrors: {} };
  }

  const fieldErrors = {};
  for (const issue of result.error.issues) {
    // Erreur sans chemin = erreur générale du formulaire
    const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "_form";
    if (!fieldErrors[fieldPath]) {
      fieldErrors[fieldPath] = issue.message;
    }
  }

  return { success: false, data: null, fieldErrors };
}

/**
 * Vérifie le champ piège « website » : il est caché aux humains,
 * donc seul un robot le remplit. Si c'est le cas, on ignore le formulaire.
 * @param {object} body - données reçues
 * @returns {boolean} true si c'est probablement un robot
 */
export function isSpamSubmission(body) {
  return Boolean(body && typeof body.website === "string" && body.website.trim() !== "");
}
