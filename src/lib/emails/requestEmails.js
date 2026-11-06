/**
 * Courriels liés aux demandes : devis entreprise, mentorat et contact.
 * Chaque fonction renvoie { subject, html, text }.
 */
import { renderEmailLayout, renderEmailText, renderDetailsTable } from "./layout";
import { getSiteUrl } from "@/config/brand";
import {
  CONTACT_SUBJECTS,
  MENTORSHIP_FORMATS,
  MENTORSHIP_LEVELS,
  MENTORSHIP_TOPICS,
  getOptionLabel,
} from "@/config/options";

/**
 * Transforme des lignes { label, value } en lignes de texte « label : valeur ».
 * @param {{label: string, value: string}[]} rows
 * @returns {string[]}
 */
function rowsToText(rows) {
  const lines = [];
  for (const row of rows) {
    if (row.value) lines.push(`${row.label} : ${row.value}`);
  }
  return lines;
}

/** Alerte admin : nouvelle demande de devis entreprise. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function adminQuoteEmail(quote, settings) {
  const title = "Nouvelle demande de devis entreprise";
  const rows = [
    { label: "Nom", value: `${quote.firstName} ${quote.lastName}` },
    { label: "Entreprise", value: quote.company },
    { label: "Téléphone", value: quote.phone },
    { label: "Courriel", value: quote.email },
    { label: "Besoin", value: quote.comment },
  ];
  return {
    subject: `💼 Demande de devis : ${quote.firstName} ${quote.lastName}`,
    html: renderEmailLayout({
      settings,
      title,
      paragraphs: ["Une demande de devis vient d'arriver par la page Entreprises."],
      bodyHtml: renderDetailsTable(rows),
      button: { label: "Voir les devis", url: `${getSiteUrl()}/admin/devis` },
    }),
    text: renderEmailText(title, rowsToText(rows)),
  };
}

/**
 * Lignes de détail d'une demande de mentorat.
 * @param {object} request
 */
function mentorshipRows(request) {
  return [
    { label: "Nom", value: `${request.firstName} ${request.lastName}` },
    { label: "Courriel", value: request.email },
    { label: "Téléphone", value: request.phone },
    { label: "Thème", value: getOptionLabel(MENTORSHIP_TOPICS, request.topic) },
    { label: "Niveau", value: getOptionLabel(MENTORSHIP_LEVELS, request.level) },
    { label: "Format", value: getOptionLabel(MENTORSHIP_FORMATS, request.format) },
    { label: "Disponibilités", value: request.preferredDates },
    { label: "Message", value: request.message },
  ];
}

/** Alerte admin : nouvelle demande de mentorat. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function adminMentorshipEmail(request, settings) {
  const title = "Nouvelle demande de mentorat";
  const rows = mentorshipRows(request);
  return {
    subject: `🎓 Mentorat : ${request.firstName} ${request.lastName}`,
    html: renderEmailLayout({
      settings,
      title,
      paragraphs: ["Une personne souhaite réserver une séance de mentorat."],
      bodyHtml: renderDetailsTable(rows),
      button: { label: "Répondre dans l'admin", url: `${getSiteUrl()}/admin/mentorat` },
    }),
    text: renderEmailText(title, rowsToText(rows)),
  };
}

/** Accusé de réception envoyé à la personne qui demande un mentorat. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function mentorshipReceivedEmail(request, settings) {
  const title = "Nous avons reçu votre demande de mentorat";
  const paragraphs = [
    `Bonjour ${request.firstName},`,
    "Merci pour votre intérêt ! Nous regardons vos disponibilités et vous écrivons très bientôt pour confirmer une date.",
  ];
  return {
    subject: "Votre demande de mentorat — Yat'Print",
    html: renderEmailLayout({ settings, title, paragraphs, bodyHtml: renderDetailsTable(mentorshipRows(request).slice(3)) }),
    text: renderEmailText(title, paragraphs),
  };
}

/** Réponse envoyée quand Gessica confirme ou refuse une demande de mentorat. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function mentorshipStatusEmail(request, settings) {
  const isConfirmed = request.status === "confirmed";
  const title = isConfirmed ? "Votre séance de mentorat est confirmée !" : "À propos de votre demande de mentorat";
  const paragraphs = [`Bonjour ${request.firstName},`];

  if (isConfirmed) {
    paragraphs.push(`Rendez-vous le ${request.confirmedDate || "(date à préciser)"}.`);
    paragraphs.push("Nous vous enverrons les détails pratiques avant la séance.");
  } else {
    paragraphs.push("Nous ne pouvons malheureusement pas donner suite à cette demande pour le moment.");
    paragraphs.push("N'hésitez pas à nous écrire pour proposer d'autres disponibilités.");
  }
  // Remarque : la note interne (adminNote) n'est jamais envoyée au client.

  return {
    subject: isConfirmed ? "Mentorat confirmé — Yat'Print" : "Votre demande de mentorat — Yat'Print",
    html: renderEmailLayout({ settings, title, paragraphs }),
    text: renderEmailText(title, paragraphs),
  };
}

/** Alerte admin : nouveau message de contact. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function adminContactEmail(message, settings) {
  const title = "Nouveau message depuis le site";
  const rows = [
    { label: "Nom", value: message.name },
    { label: "Courriel", value: message.email },
    { label: "Téléphone", value: message.phone },
    { label: "Sujet", value: getOptionLabel(CONTACT_SUBJECTS, message.subject) },
    { label: "Message", value: message.message },
  ];
  return {
    subject: `✉️ Message de ${message.name}`,
    html: renderEmailLayout({
      settings,
      title,
      paragraphs: ["Vous pouvez répondre directement à ce courriel."],
      bodyHtml: renderDetailsTable(rows),
      button: { label: "Voir les messages", url: `${getSiteUrl()}/admin/messages` },
    }),
    text: renderEmailText(title, rowsToText(rows)),
  };
}
