/**
 * Liens de navigation du site public (en-tête, menu mobile et pied de page).
 * Ajouter une page au menu = ajouter une ligne ici.
 */

/** Menu principal (en-tête et menu mobile). */
export const MAIN_NAVIGATION = [
  { href: "/personnaliser", label: "Personnaliser" },
  { href: "/collection", label: "Collection" },
  { href: "/entreprises", label: "Entreprises" },
  { href: "/mentorat", label: "Mentorat" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

/** Colonne « Explorer » du pied de page. */
export const FOOTER_EXPLORE_LINKS = [
  { href: "/personnaliser", label: "Atelier de personnalisation" },
  { href: "/collection", label: "La collection" },
  { href: "/entreprises", label: "Commandes d'entreprise" },
  { href: "/mentorat", label: "Mentorat Canva et impression" },
  { href: "/galerie", label: "Nos réalisations" },
  { href: "/a-propos", label: "À propos" },
];

/** Colonne « Aide » du pied de page. */
export const FOOTER_HELP_LINKS = [
  { href: "/suivi-commande", label: "Suivre ma commande" },
  { href: "/faq", label: "Questions fréquentes" },
  { href: "/informations/livraison-et-retours", label: "Livraison et retours" },
  { href: "/informations/conditions-de-vente", label: "Conditions de vente" },
  { href: "/informations/confidentialite", label: "Confidentialité" },
];
