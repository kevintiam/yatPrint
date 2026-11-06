/**
 * Envoi des courriels (confirmation de commande, alertes de l'admin...).
 *
 * Trois façons d'envoyer, choisies automatiquement selon le fichier .env :
 * 1. GMAIL (le plus simple) : GMAIL_USER + GMAIL_APP_PASSWORD remplis.
 *    Les courriels partent du compte Gmail de la boutique, vers n'importe quel client.
 * 2. RESEND : RESEND_API_KEY rempli (demande un nom de domaine vérifié).
 * 3. Aucun des deux (développement) : le courriel n'est pas envoyé,
 *    son contenu s'affiche dans le terminal.
 *
 * Un courriel qui échoue ne doit JAMAIS faire échouer une commande :
 * les erreurs sont donc écrites dans le terminal, sans être relancées.
 */
import nodemailer from "nodemailer";
import { Resend } from "resend";

let gmailTransporter = null;
let resendClient = null;

/**
 * @returns {import("nodemailer").Transporter|null} l'envoi par Gmail, ou null s'il n'est pas configuré
 */
function getGmailTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail", // smtp.gmail.com, connexion chiffrée
      auth: {
        user: process.env.GMAIL_USER,
        // Google affiche le mot de passe d'application avec des espaces : on les retire
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
      },
    });
  }
  return gmailTransporter;
}

/**
 * @returns {Resend|null} le client Resend, ou null si aucune clé
 */
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Envoi avec Gmail.
 * @param {import("nodemailer").Transporter} transporter
 * @param {object} message - voir sendEmail
 * @returns {Promise<boolean>}
 */
async function sendWithGmail(transporter, message) {
  try {
    await transporter.sendMail({
      // Le nom affiché est « Yat'Print » ; l'adresse est celle du compte Gmail
      from: { name: "Yat'Print", address: process.env.GMAIL_USER },
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    return true;
  } catch (error) {
    console.error("[Courriel] Échec de l'envoi par Gmail :", error.message);
    return false;
  }
}

/**
 * Envoi avec Resend.
 * @param {Resend} resend
 * @param {object} message - voir sendEmail
 * @returns {Promise<boolean>}
 */
async function sendWithResend(resend, message) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Yat'Print <onboarding@resend.dev>",
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) {
      console.error("[Courriel] Resend a refusé l'envoi :", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Courriel] Échec de l'envoi par Resend :", error);
    return false;
  }
}

/**
 * Envoie un courriel.
 * @param {object} message
 * @param {string} message.to - destinataire
 * @param {string} message.subject - objet
 * @param {string} message.html - contenu HTML
 * @param {string} message.text - version texte (lecteurs simples, filtres anti-pourriel)
 * @param {string} [message.replyTo] - adresse de réponse
 * @returns {Promise<boolean>} true si envoyé (ou affiché en mode console)
 */
export async function sendEmail(message) {
  if (!message.to) {
    return false;
  }

  const gmail = getGmailTransporter();
  if (gmail) {
    return sendWithGmail(gmail, message);
  }

  const resend = getResend();
  if (resend) {
    return sendWithResend(resend, message);
  }

  // Mode développement : on affiche le courriel au lieu de l'envoyer
  console.log("\n📧 [Courriel non envoyé : ni Gmail ni Resend configuré dans .env]");
  console.log(`   À : ${message.to}`);
  console.log(`   Objet : ${message.subject}`);
  console.log(`   ${message.text.split("\n").join("\n   ")}\n`);
  return true;
}

/**
 * Adresse qui reçoit les alertes de l'admin (nouvelle commande, devis...).
 * @returns {string}
 */
export function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "";
}