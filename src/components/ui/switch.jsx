"use client";

/**
 * Interrupteur oui / non (plus visuel qu'une case à cocher).
 *
 * Exemple :
 *   <Switch checked={values.pickupEnabled} onCheckedChange={(on) => setValue("pickupEnabled", on)}
 *           label="Ramassage à l'atelier" description="Gratuit pour le client." />
 *
 * Accessibilité : c'est un <button role="switch"> : Espace ou Entrée le bascule,
 * et les lecteurs d'écran annoncent « activé » ou « désactivé ».
 */
import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {boolean} props.checked
 * @param {(checked: boolean) => void} props.onCheckedChange
 * @param {string} props.label
 * @param {string} [props.description]
 * @param {boolean} [props.disabled]
 */
export function Switch({ checked, onCheckedChange, label, description, disabled = false, className }) {
  const id = useId();

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <label htmlFor={id} className="cursor-pointer font-semibold">
          {label}
        </label>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-ink px-0.5 transition-colors disabled:opacity-50",
          checked ? "justify-end bg-magenta" : "justify-start bg-cream-dark"
        )}
      >
        {/* La pastille glisse d'un côté à l'autre (animation « layout ») */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 600, damping: 32 }}
          className="block size-6 rounded-full border-2 border-ink bg-paper"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
