/**
 * Petits composants de retour visuel : message d'alerte, indicateur de
 * chargement et état « vide ».
 */
import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ALERT_STYLES = {
  error: { box: "border-danger/40 bg-danger-soft text-danger", Icon: CircleAlert },
  success: { box: "border-success/40 bg-success-soft text-success", Icon: CircleCheck },
  info: { box: "border-cyan/40 bg-cyan-soft text-cyan-dark", Icon: Info },
  warning: { box: "border-yellow bg-yellow-soft text-ink", Icon: Info },
};

/**
 * Message encadré (erreur d'envoi, succès, information).
 * @param {object} props
 * @param {"error"|"success"|"info"|"warning"} [props.tone]
 */
export function Alert({ tone = "info", className, children }) {
  const style = ALERT_STYLES[tone] || ALERT_STYLES.info;
  const Icon = style.Icon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-medium", style.box, className)}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

/**
 * Indicateur de chargement (cercle qui tourne).
 * @param {object} props
 * @param {string} [props.label] - texte lu par les lecteurs d'écran
 */
export function Spinner({ className, label = "Chargement…" }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <LoaderCircle className={cn("size-5 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Bloc de chargement centré pour une page ou une section. */
export function LoadingBlock({ label = "Chargement…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <Spinner label={label} />
      <span>{label}</span>
    </div>
  );
}

/**
 * État vide (liste sans résultat, panier vide...).
 * @param {object} props
 * @param {React.ComponentType} [props.icon] - icône lucide
 * @param {string} props.title
 * @param {string} [props.text]
 * @param {React.ReactNode} [props.action] - bouton facultatif
 */
export function EmptyState({ icon: Icon, title, text, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/20 px-6 py-14 text-center", className)}>
      {Icon && (
        <span className="grid size-14 place-items-center rounded-full bg-yellow-soft text-ink">
          <Icon className="size-7" aria-hidden="true" />
        </span>
      )}
      <p className="font-display text-xl font-bold">{title}</p>
      {text && <p className="max-w-md text-muted">{text}</p>}
      {action}
    </div>
  );
}
