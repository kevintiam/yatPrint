/**
 * Une étape numérotée du configurateur : pastille de couleur avec le numéro,
 * titre, contenu, et message d'erreur éventuel.
 */
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Couleur de la pastille, à tour de rôle
const NUMBER_COLORS = ["bg-cyan text-white", "bg-magenta text-white", "bg-yellow text-ink", "bg-ink text-cream"];

/**
 * @param {object} props
 * @param {number} props.number - numéro de l'étape (1, 2, 3...)
 * @param {string} props.title
 * @param {string} [props.hint] - précision à côté du titre
 * @param {string} [props.error]
 * @param {boolean} [props.isLast] - dernière étape (pas de trait en dessous)
 */
export function CustomizerStep({ number, title, hint, error, isLast = false, children }) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {/* Trait vertical qui relie les étapes */}
      {!isLast && <span className="absolute bottom-0 left-[1.15rem] top-11 w-0.5 bg-ink/10" aria-hidden="true" />}

      <span
        className={cn(
          "relative grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink font-display font-bold",
          NUMBER_COLORS[(number - 1) % NUMBER_COLORS.length]
        )}
        aria-hidden="true"
      >
        {number}
      </span>

      <div className="min-w-0 flex-1 pt-1.5">
        <h2 className="mb-3 font-display text-lg font-bold">
          {title}
          {hint && <span className="ml-2 text-sm font-normal text-muted">{hint}</span>}
        </h2>
        {children}
        {error && (
          <p role="alert" className="mt-2 flex items-center gap-1 text-sm font-medium text-danger">
            <CircleAlert className="size-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
