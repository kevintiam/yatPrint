/**
 * Textes des pages Entreprises, Mentorat et À propos.
 * ⚠️ Les passages marqués PROVISOIRE sont à remplacer par les vrais textes de Gessica.
 */

/** Page Entreprises : ce que Yat'Print propose aux organisations. */
export const BUSINESS_OFFERS = [
  { title: "Uniformes et tenues d'équipe", text: "T-shirts et hoodies à vos couleurs, avec votre logo." },
  { title: "Cadeaux clients et employés", text: "Tasses, cadres et gravures personnalisés pour marquer les esprits." },
  { title: "Événements", text: "Conférences, mariages, tournois, retraites : des articles souvenirs uniques." },
  { title: "Gravure de logo", text: "Votre logo gravé sur bois ou acrylique : plaques, présentoirs, cadeaux." },
];

/** Étapes d'une commande d'entreprise. */
export const BUSINESS_STEPS = [
  "Vous décrivez votre projet dans le formulaire.",
  "Nous vous rappelons pour préciser les quantités, les articles et les délais.",
  "Vous recevez un devis, puis une épreuve à valider avant la production.",
];

/** Page Mentorat : contenu des deux thèmes. */
export const MENTORSHIP_TRACKS = [
  {
    key: "canva",
    title: "Canva",
    accent: "cyan",
    text: "Créez vous-même des visuels professionnels, même sans expérience en design.",
    points: [
      "Publications et stories pour les réseaux sociaux",
      "Affiches, cartes et invitations",
      "Logos simples et modèles réutilisables",
      "Bonnes pratiques : couleurs, polices, mise en page",
    ],
  },
  {
    key: "printing",
    title: "Impression",
    accent: "magenta",
    text: "Comprenez comment passer d'un fichier à un article imprimé réussi.",
    points: [
      "Préparer un fichier pour l'impression (format, résolution)",
      "Choisir le bon support : textile, tasse, bois, acrylique",
      "Éviter les erreurs courantes (couleurs, marges, qualité)",
      "Les bases pour démarrer une petite activité d'impression",
    ],
  },
];

/** Déroulement d'une demande de mentorat. */
export const MENTORSHIP_STEPS = [
  { title: "Vous faites une demande", text: "Thème, niveau, format et disponibilités." },
  { title: "Nous confirmons", text: "La date, le format et le tarif vous sont envoyés par courriel." },
  { title: "On apprend ensemble", text: "Une séance concrète, adaptée à votre projet." },
];

/** Page À propos. */
export const ABOUT = {
  // PROVISOIRE : à remplacer par l'histoire de Gessica et de la marque
  story: [
    "Yat'Print est né d'une envie simple : permettre à chacun de porter, d'offrir et de partager ce qui lui ressemble.",
    "Depuis notre atelier, nous personnalisons vêtements et objets avec soin, une commande à la fois. Nous créons aussi notre propre collection, et nous partageons notre savoir-faire grâce au mentorat Canva et impression.",
  ],
  values: [
    { title: "Le soin du détail", text: "Chaque article est vérifié avant de partir de l'atelier.", accent: "cyan" },
    { title: "L'écoute", text: "Votre idée compte : nous vous aidons à la concrétiser.", accent: "magenta" },
    { title: "Le partage", text: "Transmettre ce que l'on sait, pour que d'autres créent à leur tour.", accent: "yellow" },
  ],
};
