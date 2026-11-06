/**
 * Choix proposés dans les formulaires (mentorat, contact, galerie).
 *
 * Même règle que pour le catalogue : les clés sont enregistrées dans
 * la base de données. On peut changer un libellé, pas une clé existante.
 */

/** Thèmes de mentorat. */
export const MENTORSHIP_TOPICS = {
  canva: { label: "Canva", description: "Créer des visuels pros : réseaux sociaux, affiches, logos simples." },
  printing: { label: "Impression", description: "Préparer un fichier, choisir le support, éviter les erreurs." },
  both: { label: "Les deux", description: "Du design dans Canva jusqu'à l'article imprimé." },
};

/** Niveau du participant. */
export const MENTORSHIP_LEVELS = {
  beginner: { label: "Débutant" },
  intermediate: { label: "Intermédiaire" },
  advanced: { label: "Avancé" },
};

/** Format souhaité pour la séance. */
export const MENTORSHIP_FORMATS = {
  online: { label: "En ligne (visioconférence)" },
  in_person: { label: "En personne, à l'atelier" },
  no_preference: { label: "Pas de préférence" },
};

/** Sujets du formulaire de contact. */
export const CONTACT_SUBJECTS = {
  order: { label: "Une commande en cours" },
  product: { label: "Un produit ou une personnalisation" },
  business: { label: "Une commande d'entreprise" },
  mentorship: { label: "Le mentorat" },
  other: { label: "Autre chose" },
};

/** Catégories de la galerie de réalisations. */
export const GALLERY_CATEGORIES = {
  textile: { label: "Vêtements" },
  engraving: { label: "Gravure" },
  gift: { label: "Cadeaux" },
  accessory: { label: "Accessoires" },
};

/**
 * Renvoie le libellé d'une option, ou la clé si elle est inconnue.
 * @param {object} options - ex. MENTORSHIP_TOPICS
 * @param {string} key - ex. "canva"
 * @returns {string}
 */
export function getOptionLabel(options, key) {
  const option = options[key];
  return option ? option.label : key;
}
