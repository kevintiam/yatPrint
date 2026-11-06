/**
 * Questions fréquentes, regroupées par thème (page /faq).
 * ⚠️ Réponses PROVISOIRES à faire valider par Gessica (délais, retours...).
 */
export const FAQ_SECTIONS = [
  {
    id: "commande",
    title: "Commander",
    questions: [
      {
        id: "apercu",
        question: "Est-ce que je vois mon article avant de commander ?",
        answer:
          "Oui. Le configurateur affiche un aperçu de votre design sur l'article. Si un détail pose problème pour l'impression (image floue, texte trop petit), nous vous écrivons avant de commencer.",
      },
      {
        id: "fichiers",
        question: "Quels fichiers puis-je envoyer ?",
        answer:
          "Des images PNG, JPG, WEBP ou SVG, ou un PDF, de 10 Mo maximum. Pour un résultat net, privilégiez une image de bonne qualité ou un fichier PNG avec fond transparent. Vous pouvez aussi simplement écrire votre texte ou décrire votre idée.",
      },
      {
        id: "couleur",
        question: "La couleur que je veux n'est pas dans la liste. Que faire ?",
        answer:
          "Choisissez « Choisir ma couleur » dans le configurateur et indiquez la couleur souhaitée. Nous vous confirmons sa disponibilité par courriel.",
      },
      {
        id: "paiement",
        question: "Comment se passe le paiement ?",
        answer:
          "Par carte, sur la page sécurisée de Stripe. Votre numéro de carte n'est jamais enregistré sur notre site.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Livraison et suivi",
    questions: [
      {
        id: "zones",
        question: "Livrez-vous partout au Canada ?",
        answer: "Oui, avec un tarif d'expédition unique. Le ramassage à l'atelier est gratuit.",
      },
      {
        id: "suivi",
        question: "Comment suivre ma commande ?",
        answer:
          "Rendez-vous sur la page « Suivre ma commande » avec votre numéro de commande (reçu par courriel) et votre adresse courriel. Vous recevez aussi un courriel à chaque étape importante.",
      },
    ],
  },
  {
    id: "entretien",
    title: "Entretien de vos articles",
    questions: [
      {
        id: "premier-lavage",
        question: "Quand puis-je laver mon t-shirt pour la première fois ?",
        answer:
          "Attendez 24 à 48 heures avant le premier lavage : l'impression a besoin de ce temps pour bien se fixer.",
      },
      {
        id: "lavage",
        question: "Comment laver un vêtement imprimé ?",
        answer:
          "Lavez-le à l'envers, à l'eau froide ou tiède, et évitez le sèche-linge à haute température. Ne repassez jamais directement sur l'impression.",
      },
    ],
  },
  {
    id: "entreprises-mentorat",
    title: "Entreprises et mentorat",
    questions: [
      {
        id: "quantite",
        question: "Faites-vous des commandes en grande quantité ?",
        answer:
          "Oui. Remplissez le formulaire de la page Entreprises : nous vous rappelons avec un devis adapté à votre projet.",
      },
      {
        id: "mentorat",
        question: "Comment se déroule le mentorat ?",
        answer:
          "Vous choisissez un thème (Canva, impression ou les deux) et proposez vos disponibilités. Nous confirmons la date, le format et le tarif par courriel avant la séance.",
      },
    ],
  },
];
