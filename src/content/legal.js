/**
 * Pages d'information : conditions de vente, livraison et retours, confidentialité.
 *
 * ⚠️ TEXTES PROVISOIRES : ils donnent une structure de départ, mais ne
 * constituent pas un avis juridique. À faire relire avant la mise en ligne.
 *
 * « {courriel} » est remplacé à l'affichage par le courriel des réglages de la
 * boutique (/admin/reglages) : pas besoin de modifier ce fichier s'il change.
 */

export const LEGAL_PAGES = {
  "conditions-de-vente": {
    title: "Conditions de vente",
    sections: [
      {
        heading: "Commandes",
        text: "Une commande est confirmée après la réception du paiement. Pour un article personnalisé, nous pouvons vous contacter si le fichier fourni ne permet pas une impression de qualité.",
      },
      {
        heading: "Prix et taxes",
        text: "Les prix sont affichés en dollars canadiens, avant taxes. Les taxes applicables (TPS, TVH, TVP ou TVQ) sont calculées selon la province de livraison et affichées avant le paiement.",
      },
      {
        heading: "Contenu fourni par le client",
        text: "En téléversant un design, vous confirmez avoir le droit de l'utiliser. Nous pouvons refuser un contenu haineux, illégal ou qui ne respecte pas les droits d'autrui.",
      },
    ],
  },
  "livraison-et-retours": {
    title: "Livraison et retours",
    sections: [
      {
        heading: "Livraison",
        text: "Nous expédions partout au Canada au tarif unique affiché au moment du paiement. Le ramassage à l'atelier est gratuit : nous vous écrivons dès que votre commande est prête.",
      },
      {
        heading: "Articles personnalisés",
        text: "Un article personnalisé est fabriqué spécialement pour vous : il ne peut pas être repris, sauf en cas de défaut ou d'erreur de notre part.",
      },
      {
        heading: "Article défectueux",
        text: "Si votre article présente un défaut, écrivez-nous à {courriel} avec une photo dans les 14 jours suivant la réception. Nous vous proposerons une solution (réimpression ou remboursement).",
      },
    ],
  },
  confidentialite: {
    title: "Confidentialité",
    sections: [
      {
        heading: "Renseignements recueillis",
        text: "Nous recueillons uniquement ce qui est nécessaire pour traiter vos commandes et vos demandes : nom, coordonnées, adresse de livraison et fichiers de design.",
      },
      {
        heading: "Paiement",
        text: "Le paiement est traité par Stripe. Nous n'avons jamais accès à votre numéro de carte.",
      },
      {
        heading: "Vos droits",
        text: "Vous pouvez demander l'accès à vos renseignements, leur correction ou leur suppression en écrivant à {courriel}.",
      },
    ],
  },
};

/** Liste des adresses des pages (pour vérifier qu'une page existe). */
export const LEGAL_SLUGS = Object.keys(LEGAL_PAGES);
