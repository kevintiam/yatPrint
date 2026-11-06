/**
 * Combine des classes Tailwind sans doublons ni conflits.
 *
 * Exemple : cn("px-2 py-1", estActif && "bg-ink", "px-4")  ->  "py-1 bg-ink px-4"
 * (le dernier « px-4 » remplace « px-2 »).
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param  {...any} classes - chaînes, objets ou valeurs conditionnelles
 * @returns {string} la liste finale de classes
 */
export function cn(...classes) {
  return twMerge(clsx(classes));
}
