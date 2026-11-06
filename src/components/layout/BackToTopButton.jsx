"use client";

/**
 * Bouton « Retour en haut » du pied de page (défilement doux).
 */
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 font-semibold text-cream transition hover:text-yellow"
    >
      Retour en haut
      <span className="grid size-9 place-items-center rounded-full border-2 border-cream/30 transition group-hover:-translate-y-1 group-hover:border-yellow">
        <ArrowUp className="size-4" aria-hidden="true" />
      </span>
    </button>
  );
}
