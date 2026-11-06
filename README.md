# Yat'Print — site web

Site de **Yat'Print** : personnalisation de vêtements et d'objets, collection maison,
commandes d'entreprise et mentorat Canva et impression. Version 1, **en français**.

**Stack** : Next.js 16 (App Router) en JavaScript · Tailwind CSS v4 + composants style shadcn/ui ·
**PostgreSQL (Neon) + Prisma 7** · Auth.js (connexion admin) · Stripe Checkout · Gmail ou Resend (courriels) ·
Zod (validation) · Axios dans les hooks · Motion (animations) · Vitest (tests).

---

## Ce que fait le site

**Côté client**
- Accueil animé : carrousel, bandeau qui défile, collection filtrable, galerie, appels à l'action.
- **Atelier** (`/personnaliser`) : configurateur avec aperçu en direct (couleur, taille,
  emplacement, design téléversé, texte), « Choisir ma couleur ».
- **Collection** (`/collection`) : fiches produits, tailles, articles similaires.
- **Panier et paiement** : tiroir du panier, taxes par province, livraison au forfait ou
  ramassage, paiement Stripe (ou **mode démo** sans clé Stripe).
- **Suivi de commande** (`/suivi-commande`) : numéro + courriel → frise d'avancement.
- **Entreprises** (devis), **Mentorat** (demande de réservation), **Contact**, **Galerie**,
  **FAQ**, **À propos**, pages d'information (conditions, livraison, confidentialité).

**Côté admin** (`/admin`)
- **Tableau de bord** : ventes du mois (avec l'évolution par rapport au mois précédent),
  panier moyen, graphique des ventes des 30 derniers jours, commandes par statut,
  meilleurs vendeurs, dernières commandes. Pastilles « à traiter » dans le menu.
- **Commandes** : filtres par statut, recherche, pagination, **export CSV** (Excel),
  changement de statut avec courriel au client, téléchargement des designs.
- **Produits** : recherche, filtres (ligne, catégorie, visibilité), pagination,
  photos, couleurs, tailles, matériaux.
- **Devis, mentorat** (confirmer une date), **messages, galerie**.
- **Réglages** : courriel, téléphone, ville, Instagram, prix de la livraison, ramassage,
  taxes, nom et mot de passe de l'admin — **sans toucher au code**.

---

## Installation (sans Docker)

### 1. Prérequis
- **Node.js 22** ou plus récent : `node -v`
- **Un compte gratuit [Neon](https://neon.tech)** (PostgreSQL en ligne).

### 2. Créer la base sur Neon
1. Créez un projet (ex. « yatprint », région la plus proche : Canada ou US Est).
2. Cliquez sur **Connect** et copiez les **deux** adresses :
   - l'adresse **pooled** (le nom d'hôte contient `-pooler`) → `DATABASE_URL` ;
   - l'adresse **directe** (sans `-pooler`) → `DIRECT_URL`.

Conseil : créez une **branche** Neon « dev » pour vos essais et gardez la branche
principale pour le site en ligne (chaque branche a ses propres adresses).

### 3. Installer et configurer
```bash
npm install                 # installe tout et crée le client Prisma (src/generated)
cp .env.example .env        # puis ouvrez .env et remplissez les valeurs
npx auth secret             # génère AUTH_SECRET (ou : openssl rand -base64 32)
```

Dans `.env`, remplissez au minimum `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`ADMIN_EMAIL` et `ADMIN_PASSWORD` (10 caractères minimum).

### 4. Créer les tables, remplir la base et lancer
```bash
npm run db:migrate          # 1re fois : nommez la migration « init »
npm run db:seed             # 16 produits, 16 photos de galerie, réglages, compte admin
npm run dev                 # http://localhost:3000
```
- `db:migrate` lit `prisma/schema.prisma`, écrit le SQL dans `prisma/migrations/` et crée
  les tables. **Gardez ce dossier dans Git** : il sert à mettre à jour la base en ligne.
- Admin : <http://localhost:3000/admin> avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Pour voir les tables : `npm run db:studio` (Prisma Studio dans le navigateur).

### Modifier la base plus tard
1. Modifiez `prisma/schema.prisma` (ex. ajouter un champ).
2. `npm run db:migrate` et donnez un nom clair (ex. `ajout-code-promo`).
3. En production (ex. Vercel), lancez `npm run db:deploy` avant le démarrage : il applique
   les migrations sans jamais effacer de données.

---

## Tester un paiement

**Sans Stripe (mode démo)** : laissez `STRIPE_SECRET_KEY` vide. La commande est confirmée
sans paiement, avec la mention « mode démo ». Ce mode est **bloqué en production**.

**Avec Stripe (mode test)** :
1. Copiez votre clé `sk_test_...` (tableau de bord Stripe → Développeurs → Clés API)
   dans `STRIPE_SECRET_KEY`.
2. Installez la [Stripe CLI](https://docs.stripe.com/stripe-cli), puis :
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copiez le `whsec_...` affiché dans `STRIPE_WEBHOOK_SECRET` et relancez `npm run dev`.
4. Payez avec la carte de test `4242 4242 4242 4242`, une date future et n'importe quel CVC.

Même sans webhook, la page de remerciement vérifie le paiement auprès de Stripe.

## Courriels
Le mode d'envoi est choisi automatiquement selon le `.env`, dans cet ordre :

1. **Gmail** (le plus simple) — si `GMAIL_USER` et `GMAIL_APP_PASSWORD` sont remplis.
   Les courriels partent du compte Gmail de la boutique, sans nom de domaine à vérifier.
   `GMAIL_APP_PASSWORD` est un **mot de passe d'application** (16 caractères), pas le mot de
   passe du compte : activez la [validation en deux étapes](https://myaccount.google.com/security),
   puis créez-le sur [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
2. **[Resend](https://resend.com)** — si `RESEND_API_KEY` est rempli (et Gmail non configuré).
   Les courriels sont envoyés depuis `EMAIL_FROM` (domaine à vérifier dans Resend).
3. **Aucun des deux** — les courriels **s'affichent dans le terminal** (pratique pour tester).

Les alertes de l'admin sont envoyées à `ADMIN_NOTIFICATION_EMAIL` (ou, à défaut, `ADMIN_EMAIL`).
Le bas de chaque courriel reprend les coordonnées des **Réglages** de l'admin.

> En production (Vercel), ajoutez ces mêmes variables dans les réglages du projet :
> sans elles, aucun courriel ne part et rien ne le signale à l'écran.

---

## Commandes utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Site en développement |
| `npm run build` puis `npm start` | Version de production |
| `npm run lint` | ESLint, dont la règle **300 lignes maximum** par fichier |
| `npm run check:lines` | 300 lignes maximum, y compris CSS, JSON et Markdown |
| `npm run test` | Tests unitaires Vitest |
| `npm run verify` | Lint + lignes + tests, avant chaque commit |
| `npm run db:migrate` | Crée ou met à jour les tables (développement) |
| `npm run db:deploy` | Applique les migrations en production |
| `npm run db:seed` | Produits, galerie, réglages et compte admin de départ |
| `npm run db:studio` | Explorer les tables dans le navigateur |
| `npm run admin:create -- courriel "MotDePasse" "Nom"` | Créer un admin ou changer son mot de passe |

---

## Où modifier quoi ?

| Je veux changer… | Où |
| --- | --- |
| Courriel, téléphone, ville, Instagram | **Admin → Réglages** |
| Prix de la livraison, ramassage, taxes oui/non | **Admin → Réglages** |
| Produits, prix, photos, galerie | **Admin** |
| Mot de passe de l'admin | **Admin → Réglages** (ou `npm run admin:create`) |
| Valeurs par défaut des réglages | `src/config/brand.js` (`DEFAULT_STORE_SETTINGS`) |
| Couleurs et polices du site | `src/app/globals.css` (bloc `@theme`) |
| Taux de taxes par province | `src/config/taxes.js` |
| Textes de l'accueil | `src/content/home.js` |
| FAQ / pages Entreprises, Mentorat, À propos | `src/content/faq.js`, `src/content/pages.js` |
| Conditions, livraison et retours, confidentialité | `src/content/legal.js` |
| Avis clients (section masquée tant qu'elle est vide) | `src/content/testimonials.js` |
| Structure de la base de données | `prisma/schema.prisma` puis `npm run db:migrate` |

L'organisation du code est expliquée dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## À savoir avant la mise en ligne

- **Valeurs provisoires** à faire confirmer : courriel `info@yatprint.ca`, ville, tarif
  d'expédition de 15 $, textes « À propos », FAQ et pages d'information.
- **Taxes** : taux vérifiés en novembre 2026, à faire valider par un comptable
  (petit fournisseur sous 30 000 $ : décocher « Facturer les taxes » dans les Réglages).
- **Photos** : celles du dossier `public/images` viennent du catalogue de
  craftsandimpressions.store. À remplacer par des photos de Yat'Print, sauf autorisation.
- **Fichiers téléversés** : enregistrés dans `storage/uploads`. Sur un hébergeur sans disque
  permanent (ex. Vercel), il faudra brancher un service cloud (Cloudinary, S3) dans
  `src/lib/services/storage.js` — c'est le seul fichier à changer.
- **Version anglaise** : prévue plus tard ; les textes sont déjà regroupés dans `src/content`.
