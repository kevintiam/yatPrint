/**
 * Options de livraison proposées au moment de payer.
 *
 * Le PRIX de l'expédition et l'ouverture du ramassage se règlent dans l'admin
 * (/admin/reglages) : ils arrivent ici par le paramètre `settings`
 * (voir DEFAULT_STORE_SETTINGS dans src/config/brand.js).
 * Les montants sont en CENTS pour éviter les erreurs d'arrondi (1500 = 15,00 $).
 */
export const DELIVERY_METHODS = {
  shipping: {
    label: "Livraison partout au Canada",
    description: "Forfait unique, expédié dès que votre commande est prête.",
  },
  pickup: {
    label: "Ramassage à l'atelier",
    description: "Gratuit. Nous vous écrivons quand votre commande est prête.",
  },
};

/** Clés des modes de livraison (pour la validation). */
export const DELIVERY_METHOD_KEYS = Object.keys(DELIVERY_METHODS);

/**
 * Renvoie le prix d'un mode de livraison, en cents.
 * @param {string} methodKey - "shipping" ou "pickup"
 * @param {{shippingPriceCents: number}} settings - réglages de la boutique
 * @returns {number} prix en cents (0 pour le ramassage ou un mode inconnu)
 */
export function getDeliveryPriceCents(methodKey, settings) {
  if (methodKey === "shipping") {
    return settings.shippingPriceCents;
  }
  return 0;
}

/**
 * Modes de livraison ouverts, avec leur prix (pour l'affichage).
 * @param {{shippingPriceCents: number, pickupEnabled: boolean}} settings
 * @returns {{key: string, label: string, description: string, priceCents: number}[]}
 */
export function getAvailableDeliveryMethods(settings) {
  const methods = [];
  for (const key of DELIVERY_METHOD_KEYS) {
    if (key === "pickup" && !settings.pickupEnabled) continue;
    methods.push({ key, ...DELIVERY_METHODS[key], priceCents: getDeliveryPriceCents(key, settings) });
  }
  return methods;
}
