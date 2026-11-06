/**
 * « Magasin » du panier, partagé par tout le site et sauvegardé dans le
 * navigateur (localStorage). Le panier survit donc à un rechargement de page.
 *
 * Ce n'est pas un composant React : c'est un petit objet JavaScript avec
 * une liste d'abonnés. Le hook useCart s'y abonne avec useSyncExternalStore,
 * ainsi l'icône du panier, le tiroir et la page Panier restent synchronisés.
 *
 * Le magasin garde aussi l'état d'ouverture du tiroir du panier.
 */
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "./cartUtils";

const STORAGE_KEY = "yatprint-cart-v1";
const EMPTY_CART = []; // même objet à chaque fois (exigé par useSyncExternalStore)

let cartItems = EMPTY_CART;
let hasLoaded = false;
let isDrawerOpen = false;
const listeners = new Set();

/** Lit le panier sauvegardé (une seule fois, et seulement dans le navigateur). */
function loadOnce() {
  if (hasLoaded || typeof window === "undefined") return;
  hasLoaded = true;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    cartItems = Array.isArray(parsed) ? parsed : EMPTY_CART;
  } catch {
    cartItems = EMPTY_CART; // stockage bloqué (navigation privée stricte) : panier vide
  }
}

/** Prévient tous les composants abonnés qu'il faut se redessiner. */
function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Remplace le panier, le sauvegarde, puis prévient les abonnés.
 * @param {object[]} newItems
 */
function saveCart(newItems) {
  cartItems = newItems;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  } catch {
    // Sauvegarde impossible : le panier reste en mémoire pour cette visite
  }
  notifyListeners();
}

/**
 * Identifiant unique pour une nouvelle ligne de panier.
 * randomUUID n'existe que sur une page sécurisée (https ou localhost) :
 * sinon (ex. test sur téléphone via l'adresse IP), on utilise une solution de secours.
 */
function createLineId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const cartStore = {
  /** Abonne un composant ; renvoie la fonction de désabonnement. */
  subscribe(listener) {
    listeners.add(listener);

    // Synchronise les onglets : un ajout dans un onglet met à jour les autres
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        hasLoaded = false;
        loadOnce();
        listener();
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  },

  /** Contenu actuel du panier (dans le navigateur). */
  getItems() {
    loadOnce();
    return cartItems;
  },

  /** Contenu « côté serveur » : toujours vide (le serveur ne connaît pas le panier). */
  getServerItems() {
    return EMPTY_CART;
  },

  /** Le tiroir du panier est-il ouvert ? */
  getDrawerState() {
    return isDrawerOpen;
  },

  getServerDrawerState() {
    return false;
  },

  addItem(item) {
    loadOnce();
    saveCart(addItemToCart(cartItems, item, createLineId()));
  },

  updateQuantity(lineId, quantity) {
    loadOnce();
    saveCart(updateItemQuantity(cartItems, lineId, quantity));
  },

  removeItem(lineId) {
    loadOnce();
    saveCart(removeItemFromCart(cartItems, lineId));
  },

  clear() {
    saveCart(EMPTY_CART);
  },

  setDrawerOpen(open) {
    isDrawerOpen = open;
    notifyListeners();
  },
};
