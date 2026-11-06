/**
 * Envoi des courriels déclenchés par les événements du site.
 *
 * Les routes API appellent ces fonctions après avoir enregistré les données.
 * Elles n'échouent jamais : un courriel raté est seulement noté dans le terminal
 * (voir services/email.js), la commande ou la demande reste enregistrée.
 *
 * Chaque courriel affiche en bas les coordonnées des réglages de la boutique.
 */
import { sendEmail, getAdminNotificationEmail } from "./email";
import { getStoreSettings } from "@/lib/db/settings";
import { DEFAULT_STORE_SETTINGS } from "@/config/brand";
import { adminNewOrderEmail, orderConfirmationEmail, orderStatusEmail } from "@/lib/emails/orderEmails";
import {
  adminContactEmail,
  adminMentorshipEmail,
  adminQuoteEmail,
  mentorshipReceivedEmail,
  mentorshipStatusEmail,
} from "@/lib/emails/requestEmails";

/**
 * Réglages de la boutique pour le pied des courriels
 * (valeurs par défaut si la base ne répond pas : un courriel ne doit jamais bloquer).
 */
async function readSettings() {
  try {
    return await getStoreSettings();
  } catch (error) {
    console.error("[courriels] Réglages illisibles, valeurs par défaut utilisées :", error.message);
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Envoie un courriel préparé ({ subject, html, text }) à une adresse.
 * @param {string} to
 * @param {{subject: string, html: string, text: string}} email
 * @param {string} [replyTo]
 */
async function deliver(to, email, replyTo) {
  await sendEmail({ to, subject: email.subject, html: email.html, text: email.text, replyTo });
}

/** Commande payée : confirmation au client + alerte à l'admin. */
export async function notifyOrderPaid(order) {
  if (!order) return;
  const settings = await readSettings();
  await deliver(order.customer.email, orderConfirmationEmail(order, settings));
  await deliver(getAdminNotificationEmail(), adminNewOrderEmail(order, settings), order.customer.email);
}

/** Statut de commande modifié dans l'admin : courriel au client. */
export async function notifyOrderStatusChanged(order, note) {
  if (!order) return;
  const settings = await readSettings();
  await deliver(order.customer.email, orderStatusEmail(order, note, settings));
}

/** Nouvelle demande de devis : alerte à l'admin. */
export async function notifyQuoteReceived(quote) {
  const settings = await readSettings();
  await deliver(getAdminNotificationEmail(), adminQuoteEmail(quote, settings), quote.email || undefined);
}

/** Nouvelle demande de mentorat : alerte à l'admin + accusé de réception. */
export async function notifyMentorshipReceived(request) {
  const settings = await readSettings();
  await deliver(getAdminNotificationEmail(), adminMentorshipEmail(request, settings), request.email);
  await deliver(request.email, mentorshipReceivedEmail(request, settings));
}

/** Mentorat confirmé ou refusé dans l'admin : courriel à la personne. */
export async function notifyMentorshipStatusChanged(request) {
  if (request.status !== "confirmed" && request.status !== "declined") return;
  const settings = await readSettings();
  await deliver(request.email, mentorshipStatusEmail(request, settings));
}

/** Nouveau message de contact : alerte à l'admin (répondre = répondre au visiteur). */
export async function notifyContactReceived(message) {
  const settings = await readSettings();
  await deliver(getAdminNotificationEmail(), adminContactEmail(message, settings), message.email);
}
