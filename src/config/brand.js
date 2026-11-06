/**
 * Identité de Yat'Print et valeurs par défaut de la boutique.
 *
 * - BRAND : ce qui ne change pas (nom, slogan, logos).
 * - DEFAULT_STORE_SETTINGS : coordonnées, livraison et taxes utilisées tant que
 *   Gessica n'a rien enregistré dans l'admin (/admin/reglages). Ensuite, ce sont
 *   les valeurs de la base de données qui s'appliquent.
 *
 * ⚠️ Les valeurs marquées « PROVISOIRE » doivent être confirmées par Gessica.
 */
export const BRAND = {
  name: "Yat'Print",
  slogan: "Votre idée, imprimée.",
  description:
    "Personnalisation de t-shirts, hoodies, tasses, cadres et gravures sur bois ou acrylique. " +
    "Collection maison, commandes d'entreprise et mentorat Canva et impression.",

  // Logos (dossier public/brand)
  logoBlack: "/brand/logo-black.png",
  logoWhite: "/brand/logo-white.png",
};

/** Réglages de départ de la boutique (modifiables ensuite dans l'admin). */
export const DEFAULT_STORE_SETTINGS = {
  email: "info@yatprint.ca", // PROVISOIRE
  phone: "", // vide = téléphone masqué sur le site
  city: "Ottawa, Ontario", // PROVISOIRE
  instagramUrl: "https://www.instagram.com/yatprint.ca/",
  instagramHandle: "@yatprint.ca",
  shippingPriceCents: 1500, // PROVISOIRE : 15,00 $ partout au Canada
  pickupEnabled: true, // ramassage gratuit à l'atelier
  taxesEnabled: true, // false si Gessica est « petit fournisseur » (voir config/taxes.js)
};

/** Fuseau horaire de la boutique (dates des rapports de ventes). */
export const STORE_TIME_ZONE = "America/Toronto";

/**
 * Adresse publique du site, utilisée pour construire des liens complets
 * (retour après paiement Stripe, liens dans les courriels).
 * @returns {string} ex. "https://yatprint.ca" (sans « / » à la fin)
 */
export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}
