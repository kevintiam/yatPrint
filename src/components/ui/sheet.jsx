"use client";

/**
 * Panneaux superposés (basés sur Radix Dialog, accessibles au clavier) :
 *
 * - Sheet  : panneau qui glisse depuis le côté (tiroir du panier, menu mobile)
 * - Modal  : fenêtre centrée (agrandissement d'une photo, confirmation)
 *
 * Radix gère pour nous : la touche Échap, le focus piégé dans le panneau,
 * le blocage du défilement de la page et les rôles d'accessibilité.
 */
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Fond sombre derrière le panneau. */
function Overlay() {
  return (
    <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_200ms_ease-out]" />
  );
}

/** Bouton de fermeture (croix). */
function CloseButton({ className }) {
  return (
    <Dialog.Close
      className={cn(
        "grid size-10 place-items-center rounded-full border-2 border-ink bg-paper transition hover:rotate-90 hover:bg-yellow",
        className
      )}
      aria-label="Fermer"
    >
      <X className="size-5" aria-hidden="true" />
    </Dialog.Close>
  );
}

/**
 * Panneau latéral.
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title - titre (lu par les lecteurs d'écran, affiché en haut)
 * @param {"right"|"left"} [props.side]
 */
export function Sheet({ open, onOpenChange, title, side = "right", children, footer }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-cream shadow-2xl",
            side === "right"
              ? "right-0 border-l-2 border-ink data-[state=open]:animate-[slide-in-right_280ms_ease-out]"
              : "left-0 border-r-2 border-ink data-[state=open]:animate-[slide-in-left_280ms_ease-out]"
          )}
        >
          <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
            <Dialog.Title className="font-display text-xl font-bold">{title}</Dialog.Title>
            <CloseButton />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="border-t-2 border-ink bg-paper px-6 py-5">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Fenêtre centrée.
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title - titre (peut être masqué visuellement avec hideTitle)
 * @param {boolean} [props.hideTitle]
 */
export function Modal({ open, onOpenChange, title, hideTitle = false, className, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-3xl border-2 border-ink bg-cream p-6 shadow-hard-lg data-[state=open]:animate-[pop-in_220ms_ease-out]",
            className
          )}
        >
          <div className={cn("mb-4 flex items-start justify-between gap-4", hideTitle && "mb-0")}>
            <Dialog.Title className={cn("font-display text-xl font-bold", hideTitle && "sr-only")}>{title}</Dialog.Title>
            <CloseButton className={cn(hideTitle && "absolute right-4 top-4 z-10")} />
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
