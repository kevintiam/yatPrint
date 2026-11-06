/**
 * Textes de la page d'accueil.
 * Modifier un texte ici le change sur le site, sans toucher aux composants.
 */

/** Diapositives du carrousel du haut (comme les 3 messages du site modèle). */
export const HERO_SLIDES = [
  {
    eyebrow: "Qualité d'impression",
    title: "Donnez vie",
    highlight: "à vos idées.",
    text: "T-shirts, hoodies, tasses, cadres et gravures personnalisés avec votre design, votre texte ou votre logo.",
    image: "/images/collection/hoodie-endless-grace.webp",
    imageAlt: "Hoodie vert imprimé du motif Endless Grace",
    accent: "cyan",
    primaryCta: { label: "Personnaliser un article", href: "/personnaliser" },
    secondaryCta: { label: "Voir la collection", href: "/collection" },
  },
  {
    eyebrow: "Service attentionné",
    title: "Des impressions",
    highlight: "qui marquent.",
    text: "Vous voyez un aperçu de votre article avant de commander, et nous vous écrivons si un détail doit être ajusté.",
    image: "/images/collection/tshirt-endless-grace.webp",
    imageAlt: "Femme souriante portant un t-shirt noir imprimé",
    accent: "magenta",
    primaryCta: { label: "Créer mon t-shirt", href: "/personnaliser/t-shirt-personnalise" },
    secondaryCta: { label: "Nos réalisations", href: "/galerie" },
  },
  {
    eyebrow: "Sur mesure",
    title: "Imprimez plus.",
    highlight: "Démarquez-vous.",
    text: "Uniformes, cadeaux d'entreprise ou événement : demandez un devis pour vos grosses commandes.",
    image: "/images/customize/engraving-acrylic.webp",
    imageAlt: "Lampe en acrylique gravée du mot Grace",
    accent: "yellow",
    primaryCta: { label: "Demander un devis", href: "/entreprises" },
    secondaryCta: { label: "La gravure", href: "/personnaliser/gravure-bois-acrylique" },
  },
];

/** Mots du bandeau qui défile. */
export const MARQUEE_ITEMS = [
  "T-shirts",
  "Hoodies",
  "Tasses",
  "Cadres",
  "Gravure bois & acrylique",
  "Cadeaux d'entreprise",
  "Mentorat Canva",
];

/** Les 4 « portes d'entrée » du site. `accent` = couleur de la carte. */
export const UNIVERSES = [
  {
    title: "Personnaliser",
    text: "Votre design sur un t-shirt, un hoodie, une tasse, un cadre ou une gravure.",
    href: "/personnaliser",
    cta: "Commencer",
    accent: "cyan",
    icon: "palette",
  },
  {
    title: "La collection",
    text: "Les articles signature de Yat'Print, prêts à commander.",
    href: "/collection",
    cta: "Découvrir",
    accent: "magenta",
    icon: "shirt",
  },
  {
    title: "Entreprises",
    text: "Uniformes, cadeaux clients, événements : recevez un devis sur mesure.",
    href: "/entreprises",
    cta: "Demander un devis",
    accent: "yellow",
    icon: "briefcase",
  },
  {
    title: "Mentorat",
    text: "Apprenez Canva et les bases de l'impression, à votre rythme.",
    href: "/mentorat",
    cta: "En savoir plus",
    accent: "ink",
    icon: "graduation",
  },
];

/** Section « Pourquoi nous choisir ? » (4 cartes numérotées, comme le site modèle). */
export const WHY_CHOOSE_US = [
  {
    title: "Un service attentionné",
    text: "On répond à vos questions, on vous conseille sur le visuel et on vous prévient à chaque étape.",
  },
  {
    title: "Des impressions soignées",
    text: "Des couleurs nettes et des finitions propres, sur des articles choisis pour durer.",
  },
  {
    title: "L'œil d'une graphiste",
    text: "Pas encore de design ? Décrivez votre idée : nous vous aidons à la mettre en forme.",
  },
  {
    title: "Livraison partout au Canada",
    text: "Expédition au tarif unique, ou ramassage gratuit à l'atelier.",
  },
];

/** Section « La personnalisation, à votre façon ». */
export const CUSTOM_MADE = {
  eyebrow: "Fait pour vous",
  title: "La personnalisation, à votre façon",
  text:
    "Que ce soit pour vous, pour offrir ou pour votre marque, chaque article est préparé à la commande. " +
    "Vous choisissez l'article, la couleur, la taille et l'emplacement ; nous nous occupons du reste.",
  bullets: [
    "Un large choix d'articles : textile, tasses, cadres, bois et acrylique",
    "Votre design, votre texte ou votre logo, à l'emplacement de votre choix",
    "Un aperçu avant de commander, et « Choisir ma couleur » si elle n'est pas dans la liste",
    "Idéal pour les marques, les événements et les cadeaux",
  ],
};

/** Section « Comment ça marche ». */
export const HOW_IT_WORKS = [
  { title: "Choisissez", text: "Un article, sa couleur, sa taille et l'emplacement de l'impression." },
  { title: "Personnalisez", text: "Téléversez votre design ou écrivez votre texte, puis vérifiez l'aperçu." },
  { title: "Recevez", text: "Paiement sécurisé, puis livraison partout au Canada ou ramassage à l'atelier." },
];
