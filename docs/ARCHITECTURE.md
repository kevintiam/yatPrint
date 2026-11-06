# Architecture du code

Ce document explique **où se trouve chaque chose** et **comment circule une donnée**.

## Le chemin d'une action du visiteur

Exemple : le client envoie une demande de devis.

```text
QuoteForm.jsx            (composant : affiche le formulaire)
   │  useQuoteRequest()  (hook : SEUL endroit qui appelle l'API)
   ▼
axiosClient.post("/quotes")
   ▼
src/app/api/quotes/route.js        (route API : mince)
   │  validateOrThrow(quoteRequestSchema)   (validation Zod)
   │  createQuoteRequest(data)              (fonction ORM)
   │  notifyQuoteReceived(quote)            (service : courriel)
   ▼
src/lib/db/quoteRequests.js  →  client Prisma (getPrisma)  →  PostgreSQL (Neon)
```

Les **pages publiques** qui affichent des produits (accueil, atelier, collection) sont des
composants **serveur** : elles appellent directement les fonctions ORM de `src/lib/db`
(pas besoin de passer par l'API, la page est déjà sur le serveur).

## Les règles du projet

1. **Appels d'API seulement dans les hooks** (`src/hooks`). Aucun composant n'utilise
   Axios ou `fetch` directement.
2. **Base de données seulement dans `src/lib/db`** (fonctions ORM avec Prisma). La forme
   des tables est décrite dans `prisma/schema.prisma`.
3. **Validation dans `src/lib/validation`** (Zod), utilisée des deux côtés :
   dans le navigateur (erreurs immédiates) et sur le serveur (vérification définitive).
4. **Routes API minces** : lire → valider → appeler une fonction ORM ou un service → répondre.
5. **300 lignes maximum par fichier**, vérifié par ESLint et `npm run check:lines`.
6. **Noms en anglais, commentaires en français.** Les dossiers des pages portent le nom
   de l'adresse en français (`/personnaliser`, `/suivi-commande`), car ce sont des adresses
   visibles par les clients.

## Les dossiers

| Dossier | Contenu |
| --- | --- |
| `src/app/(site)/` | Pages publiques (le groupe `(site)` leur donne en-tête et pied de page) |
| `src/app/admin/` | Espace admin : `connexion/` + pages protégées dans `(protected)/` |
| `src/app/api/` | Routes API publiques |
| `src/app/api/admin/` | Routes API de l'admin (toutes protégées par `requireAdmin()`) |
| `src/hooks/` | Hooks : appels d'API (Axios), panier, formulaires |
| `src/hooks/admin/` | Hooks de l'admin |
| `src/components/ui/` | Kit de base : bouton, champs, badge, panneaux, accordéon… |
| `src/components/layout/` | En-tête, pied de page, logo, bandeaux de titre |
| `src/components/motion/` | Animations réutilisables (apparition, bandeau, autocollant…) |
| `src/components/home/` | Sections de l'accueil |
| `src/components/customizer/` | Configurateur et aperçu en direct |
| `src/components/cart/` | Panier, tiroir, formulaire de commande, récapitulatif |
| `src/components/forms/` | Formulaires publics (devis, mentorat, contact, suivi) |
| `src/components/admin/` | Écrans de l'admin |
| `prisma/schema.prisma` | **Tables de la base** (modèles Prisma) ; `prisma/migrations/` : historique SQL |
| `src/lib/db/` | **Fonctions ORM** (lecture et écriture avec Prisma) |
| `src/generated/prisma/` | Client Prisma créé automatiquement (`npm install`) — ne pas modifier, pas dans Git |
| `src/lib/validation/` | **Schémas Zod** |
| `src/lib/services/` | Logique métier : prix et taxes, paiement, Stripe, courriels, fichiers |
| `src/lib/emails/` | Modèles des courriels |
| `src/lib/server/` | Outils des routes API : réponses, erreurs, session admin, anti-abus |
| `src/lib/api/` | Instance Axios et lecture des erreurs (utilisés par les hooks) |
| `src/lib/cart/` | Magasin du panier (localStorage) et règles du configurateur |
| `src/config/` | Constantes : marque et réglages par défaut, catalogue, statuts, taxes, livraison, menus |
| `src/content/` | Textes du site (accueil, FAQ, pages, mentions) |
| `scripts/` | Remplissage de la base, création d'admin, vérification des 300 lignes |
| `tests/` | Tests Vitest |
| `public/` | Logo et photos de départ |

## Les hooks en bref

| Hook | Requête |
| --- | --- |
| `useApiQuery(url)` | Lecture générique (GET) : `data`, `isLoading`, `error`, `refetch` |
| `useApiMutation(fn)` | Envoi générique (POST/PATCH/DELETE) : `mutate`, `isLoading`, `error`, `fieldErrors` |
| `useCart()` | Panier (pas d'API) |
| `useForm(valeurs, schéma)` | Valeurs et erreurs d'un formulaire (pas d'API) |
| `useDesignUpload()` | `POST /api/uploads` avec barre de progression |
| `useCheckout()` | `POST /api/checkout` puis redirection vers Stripe |
| `useQuoteRequest()`, `useMentorshipRequest()`, `useContactMessage()`, `useOrderTracking()` | Formulaires publics |
| `useAdminAuth()` | Connexion / déconnexion (Auth.js) |
| `useAdminDashboard()`, `useAdminCounters(page)` | Tableau de bord, pastilles du menu |
| `useAdminOrders(filtres)`, `useAdminOrdersExport()`, `useAdminOrder(id)` | Commandes (pagination, export CSV) |
| `useAdminProducts()`, `useAdminProductEditor(id)` | Produits |
| `useAdminQuotes()`, `useAdminMentorships()`, `useAdminMessages()` | Demandes |
| `useAdminGallery()`, `useAdminImageUpload()` | Galerie et photos |
| `useAdminSettings()`, `useAdminAccount()` | Réglages de la boutique, compte admin |
| `useStoreSettings()` | Réglages dans les composants du site public (pas d'API : fournis par le gabarit) |

## Les routes API

| Route | Rôle |
| --- | --- |
| `POST /api/uploads` | Design d'un client (privé) |
| `POST /api/checkout` | Crée la commande et la session Stripe |
| `POST /api/webhooks/stripe` | Stripe confirme le paiement (signature vérifiée) |
| `POST /api/quotes`, `/api/mentorship-requests`, `/api/contact` | Formulaires |
| `POST /api/orders/track` | Suivi (numéro + courriel) |
| `GET /api/files/<id>` | Fichier téléversé (public, ou réservé à l'admin) |
| `/api/admin/...` | Statistiques, compteurs, commandes (+ `export` CSV), produits, photos, devis, mentorat, messages, galerie, réglages (`settings`), compte (`account`) |

## La base de données (Prisma + PostgreSQL)

- **Une commande** est répartie sur plusieurs tables : `orders`, `order_items`,
  `order_tax_lines`, `order_status_events`. Les fichiers `src/lib/db/mappers.js`
  la remettent en un seul objet (`order.customer.firstName`, `order.delivery.address.city`…),
  si bien que le reste du code ne voit pas la différence.
- **Les montants** sont des nombres entiers en cents (`3800` = 38,00 $).
- **Les identifiants** sont des « cuid » créés par Prisma (`cmh3k2x0a0000…`).
- **Connexion** : `src/lib/db/prisma.js` crée un seul client Prisma (adaptateur `pg`)
  avec `DATABASE_URL` (adresse « pooled » de Neon). Les commandes Prisma
  (`db:migrate`, `db:studio`) utilisent `DIRECT_URL` (voir `prisma.config.js`).
- **Transactions** : marquer une commande payée ou changer son statut écrit la commande ET
  l'historique en une seule opération (tout ou rien).

## Les réglages de la boutique

Une seule ligne dans la table `store_settings`, modifiée dans **Admin → Réglages**.

```text
app/(site)/layout.jsx  →  loadStoreSettings()  (lecture une fois par page, valeurs par défaut si erreur)
   ├─ TopBar, Footer, page Contact, pages d'information  (props, côté serveur)
   └─ StoreSettingsProvider  →  useStoreSettings()  →  menu mobile, choix de livraison, récapitulatif
services/checkout.js  →  getStoreSettings()  (toujours la vraie valeur : prix de livraison, taxes)
services/notifications.js  →  pied des courriels
```

## Sécurité, en résumé

- Les **prix** sont toujours relus dans la base au paiement : le navigateur ne décide pas du montant.
- Une commande ne devient « payée » que par le **webhook signé** de Stripe (ou la vérification
  de la session auprès de Stripe).
- Les **designs des clients** sont privés : téléchargement réservé à l'admin, jamais affichés
  dans une page (protection contre les SVG piégés).
- Les formulaires publics ont un **champ piège** anti-robots et une **limite de requêtes** par adresse IP.
- Le **mot de passe admin** est stocké sous forme d'empreinte bcrypt ; la session expire après 8 h.
  Pour le changer dans les Réglages, le mot de passe actuel est exigé (6 essais / 15 min).
- L'**export CSV** neutralise les valeurs qui commencent par `=`, `+`, `-` ou `@`
  (pas de formule Excel exécutée).
- Tout texte écrit par un visiteur est **protégé** avant d'être inséré dans un courriel HTML.

## Ajouter la version anglaise plus tard

Les textes sont déjà regroupés dans `src/content` et `src/config`. La démarche conseillée :
installer `next-intl`, déplacer les pages de `(site)` dans `[locale]`, puis créer une version
anglaise de chaque fichier de `src/content`.
