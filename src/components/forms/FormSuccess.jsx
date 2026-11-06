"use client";

/**
 * Message de réussite affiché à la place d'un formulaire après l'envoi.
 */
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.text
 * @param {() => void} [props.onReset] - bouton « Envoyer une autre demande »
 */
export function FormSuccess({ title, text, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      role="status"
      className="flex flex-col items-center gap-4 rounded-3xl border-2 border-ink bg-success-soft px-6 py-12 text-center shadow-hard"
    >
      <motion.span
        initial={{ rotate: -30, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 12 }}
        className="grid size-16 place-items-center rounded-full border-2 border-ink bg-yellow"
      >
        <PartyPopper className="size-8" aria-hidden="true" />
      </motion.span>
      <h2 className="font-display text-2xl font-extrabold">{title}</h2>
      <p className="max-w-md text-ink-soft">{text}</p>
      {onReset && (
        <Button variant="outline" onClick={onReset}>
          Envoyer une autre demande
        </Button>
      )}
    </motion.div>
  );
}
