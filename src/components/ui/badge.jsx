/**
 * Petite étiquette colorée (statut d'une commande, catégorie, « Nouveau »...).
 *
 * Exemple : <Badge tone="magenta">Nouveau</Badge>
 * Les « tones » correspondent à ceux de config/statuses.js.
 */
import { cn } from "@/lib/utils/cn";

const TONES = {
  neutral: "bg-ink/5 text-ink-soft border-ink/15",
  ink: "bg-ink text-cream border-ink",
  cyan: "bg-cyan-soft text-cyan-dark border-cyan/40",
  magenta: "bg-magenta-soft text-magenta-dark border-magenta/40",
  yellow: "bg-yellow-soft text-ink border-yellow",
  success: "bg-success-soft text-success border-success/40",
  danger: "bg-danger-soft text-danger border-danger/40",
};

/**
 * @param {object} props
 * @param {keyof TONES} [props.tone]
 */
export function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone] || TONES.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
