/**
 * Champs de formulaire de base (style shadcn/ui) : Input, Textarea, Select, Label.
 *
 * Ils acceptent toutes les propriétés HTML habituelles (name, value, onChange...).
 * `invalid` met le champ en rouge quand il y a une erreur.
 */
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Style commun à tous les champs
const fieldBase =
  "w-full rounded-xl border-2 border-ink/15 bg-paper px-4 text-ink placeholder:text-muted/70 " +
  "transition-colors hover:border-ink/35 focus:border-ink focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const invalidStyle = "border-danger hover:border-danger focus:border-danger bg-danger-soft/40";

/** Zone de texte sur une ligne. */
export function Input({ className, invalid = false, ...props }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "h-12", invalid && invalidStyle, className)}
      {...props}
    />
  );
}

/** Zone de texte sur plusieurs lignes. */
export function Textarea({ className, invalid = false, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "py-3 leading-relaxed", invalid && invalidStyle, className)}
      {...props}
    />
  );
}

/**
 * Menu déroulant natif (accessible et fiable sur mobile).
 * Les <option> sont passées en enfants.
 */
export function Select({ className, invalid = false, children, ...props }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(fieldBase, "h-12 appearance-none pr-10", invalid && invalidStyle, className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/** Étiquette d'un champ. */
export function Label({ className, ...props }) {
  return <label className={cn("text-sm font-semibold text-ink", className)} {...props} />;
}
