/**
 * Envoi des courriels avec Resend.
 *
 * Sans clé RESEND_API_KEY (développement), le courriel n'est pas envoyé :
 * son contenu s'affiche dans le terminal. Pratique pour tester.
 *
 * Un courriel qui échoue ne doit JAMAIS faire échouer une commande :
 * les erreurs sont donc écrites dans le terminal, sans être relancées.
 */
import { Resend } from "resend";

let resendClient = null;

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

  const resend = getResend();

  // Mode développement : on affiche le courriel au lieu de l'envoyer
  if (!resend) {
    console.log("\n📧 [Courriel non envoyé : RESEND_API_KEY absente]");
    console.log(`   À : ${message.to}`);
    console.log(`   Objet : ${message.subject}`);
    console.log(`   ${message.text.split("\n").join("\n   ")}\n`);
    return true;
  }

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
    console.error("[Courriel] Échec de l'envoi :", error);
    return false;
  }
}

/**
 * Adresse qui reçoit les alertes de l'admin (nouvelle commande, devis...).
 * @returns {string}
 */
export function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "";
}
