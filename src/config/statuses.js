/**
 * Statuts des commandes et des demandes, avec leur libellé et leur couleur.
 *
 * `tone` choisit la couleur du badge (voir src/components/ui/badge.jsx).
 * `step` donne l'ordre d'affichage dans la frise de suivi de commande.
 */

/** Statuts d'une commande, dans l'ordre normal de traitement. */
export const ORDER_STATUSES = {
  pending_payment: {
    label: "En attente de paiement",
    tone: "neutral",
    step: 0,
    description: "La commande est créée, le paiement n'est pas encore confirmé.",
  },
  paid: {
    label: "Payée",
    tone: "cyan",
    step: 1,
    description: "Paiement reçu. Nous préparons votre commande.",
  },
  in_production: {
    label: "En production",
    tone: "magenta",
    step: 2,
    description: "Votre article est en cours d'impression ou de gravure.",
  },
  ready: {
    label: "Prête",
    tone: "yellow",
    step: 3,
    description: "Votre commande est prête : ramassage ou expédition très bientôt.",
  },
  shipped: {
    label: "Expédiée",
    tone: "yellow",
    step: 4,
    description: "Votre colis est en route.",
  },
  completed: {
    label: "Terminée",
    tone: "success",
    step: 5,
    description: "Commande livrée ou ramassée. Merci !",
  },
  cancelled: {
    label: "Annulée",
    tone: "danger",
    step: -1,
    description: "Cette commande a été annulée.",
  },
};

/** Statuts qu'un client voit dans la frise de suivi (sans « annulée »). */
export const ORDER_TIMELINE_KEYS = ["paid", "in_production", "ready", "shipped", "completed"];

/** Statuts d'une demande de devis entreprise. */
export const QUOTE_STATUSES = {
  new: { label: "Nouvelle", tone: "magenta" },
  contacted: { label: "Contactée", tone: "cyan" },
  quoted: { label: "Devis envoyé", tone: "yellow" },
  won: { label: "Acceptée", tone: "success" },
  closed: { label: "Fermée", tone: "neutral" },
};

/** Statuts d'une demande de mentorat. */
export const MENTORSHIP_STATUSES = {
  new: { label: "Nouvelle", tone: "magenta" },
  confirmed: { label: "Confirmée", tone: "success" },
  declined: { label: "Refusée", tone: "danger" },
  completed: { label: "Terminée", tone: "neutral" },
};

/** Statuts d'un message reçu par le formulaire de contact. */
export const MESSAGE_STATUSES = {
  new: { label: "Non lu", tone: "magenta" },
  read: { label: "Lu", tone: "cyan" },
  archived: { label: "Archivé", tone: "neutral" },
};

/**
 * Renvoie les informations d'un statut, ou un statut neutre s'il est inconnu.
 * @param {object} statusList - ex. ORDER_STATUSES
 * @param {string} statusKey - ex. "paid"
 * @returns {{label: string, tone: string}}
 */
export function getStatusInfo(statusList, statusKey) {
  const status = statusList[statusKey];
  if (status) {
    return status;
  }
  return { label: statusKey, tone: "neutral" };
}
