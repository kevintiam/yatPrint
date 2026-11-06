/**
 * Mise en page commune de tous les courriels envoyés par le site.
 *
 * Les courriels utilisent du HTML très simple avec des styles « en ligne »
 * (style="...") : c'est ce que les logiciels de courriel affichent le mieux.
 */
import { BRAND, DEFAULT_STORE_SETTINGS, getSiteUrl } from "@/config/brand";

/**
 * Protège un texte avant de l'insérer dans du HTML.
 * Indispensable pour tout texte écrit par un visiteur (nom, message...) :
 * « <script> » devient « &lt;script&gt; » et ne peut donc pas s'exécuter.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Construit un tableau « libellé : valeur » (coordonnées, détails d'une demande).
 * @param {{label: string, value: string}[]} rows - valeurs en texte brut (elles sont protégées ici)
 * @returns {string} HTML
 */
export function renderDetailsTable(rows) {
  let html = '<table role="presentation" style="width:100%;border-collapse:collapse;margin:16px 0;">';
  for (const row of rows) {
    if (!row.value) continue;
    html +=
      "<tr>" +
      `<td style="padding:6px 0;color:#6b645b;width:38%;vertical-align:top;">${escapeHtml(row.label)}</td>` +
      `<td style="padding:6px 0;color:#141414;">${escapeHtml(row.value).replace(/\n/g, "<br>")}</td>` +
      "</tr>";
  }
  return html + "</table>";
}

/**
 * Assemble le courriel complet.
 * @param {object} content
 * @param {string} content.title - grand titre
 * @param {string[]} content.paragraphs - paragraphes en texte brut (protégés ici)
 * @param {string} [content.bodyHtml] - HTML supplémentaire DÉJÀ protégé (tableaux...)
 * @param {{label: string, url: string}} [content.button] - bouton d'action
 * @param {{city: string, email: string}} [content.settings] - réglages de la boutique (pied du courriel)
 * @returns {string} HTML complet
 */
export function renderEmailLayout(content) {
  const settings = content.settings || DEFAULT_STORE_SETTINGS;

  let paragraphsHtml = "";
  for (const paragraph of content.paragraphs) {
    paragraphsHtml += `<p style="margin:0 0 14px;line-height:1.6;">${escapeHtml(paragraph)}</p>`;
  }

  let buttonHtml = "";
  if (content.button) {
    buttonHtml =
      `<p style="margin:24px 0;"><a href="${escapeHtml(content.button.url)}" ` +
      'style="background:#e6007e;color:#ffffff;padding:12px 22px;border-radius:999px;' +
      `text-decoration:none;font-weight:bold;display:inline-block;">${escapeHtml(content.button.label)}</a></p>`;
  }

  // Bande CMJN : rappel visuel des encres d'imprimante
  const colorBar =
    '<table role="presentation" style="width:100%;border-collapse:collapse;"><tr>' +
    '<td style="height:6px;background:#00a3e0;"></td><td style="height:6px;background:#e6007e;"></td>' +
    '<td style="height:6px;background:#ffc21a;"></td><td style="height:6px;background:#141414;"></td>' +
    "</tr></table>";

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#f6f1e9;font-family:Arial,Helvetica,sans-serif;color:#141414;">
    <div style="max-width:600px;margin:0 auto;background:#fffdf8;border:2px solid #141414;border-radius:16px;overflow:hidden;">
      ${colorBar}
      <div style="padding:28px;">
        <p style="margin:0 0 20px;font-size:22px;font-weight:bold;">${escapeHtml(BRAND.name)}</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;">${escapeHtml(content.title)}</h1>
        ${paragraphsHtml}
        ${content.bodyHtml || ""}
        ${buttonHtml}
        <p style="margin:24px 0 0;color:#6b645b;font-size:13px;line-height:1.5;">
          ${escapeHtml(BRAND.name)} · ${escapeHtml(settings.city)} · ${escapeHtml(settings.email)}<br>
          <a href="${escapeHtml(getSiteUrl())}" style="color:#00729e;">${escapeHtml(getSiteUrl())}</a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Version texte d'un courriel (pour les logiciels qui n'affichent pas le HTML).
 * @param {string} title
 * @param {string[]} lines
 * @returns {string}
 */
export function renderEmailText(title, lines) {
  return [title, "", ...lines, "", `— ${BRAND.name} · ${getSiteUrl()}`].join("\n");
}
