/**
 * Frise de suivi d'une commande : Payée → En production → Prête → Expédiée → Terminée.
 * Les étapes franchies sont colorées ; la date et la précision éventuelle s'affichent.
 */
import { Check } from "lucide-react";
import { ORDER_STATUSES, ORDER_TIMELINE_KEYS } from "@/config/statuses";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Trouve le dernier passage d'une commande à un statut donné.
 * @param {object[]} history
 * @param {string} status
 */
function findHistoryEntry(history, status) {
  let found = null;
  for (const entry of history) {
    if (entry.status === status) found = entry;
  }
  return found;
}

/**
 * @param {object} props
 * @param {string} props.status - statut actuel
 * @param {string} props.deliveryMethod - "shipping" ou "pickup" (pas d'étape « Expédiée » pour un ramassage)
 * @param {object[]} props.history - historique des statuts
 */
export function OrderTimeline({ status, deliveryMethod, history }) {
  if (status === "cancelled") {
    return <p className="rounded-2xl border-2 border-danger bg-danger-soft px-4 py-3 font-semibold text-danger">Cette commande a été annulée.</p>;
  }

  const currentStep = ORDER_STATUSES[status] ? ORDER_STATUSES[status].step : 0;
  const steps = [];
  for (const key of ORDER_TIMELINE_KEYS) {
    if (key === "shipped" && deliveryMethod === "pickup") continue;
    steps.push(key);
  }

  return (
    <ol className="flex flex-col gap-0">
      {steps.map((key, index) => {
        const info = ORDER_STATUSES[key];
        const isDone = info.step <= currentStep;
        const isCurrent = key === status;
        const entry = findHistoryEntry(history, key);
        const isLast = index === steps.length - 1;

        return (
          <li key={key} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span className={cn("absolute left-[1.1rem] top-10 h-[calc(100%-2.5rem)] w-0.5", isDone ? "bg-ink" : "bg-ink/15")} aria-hidden="true" />
            )}
            <span
              className={cn(
                "relative grid size-9 shrink-0 place-items-center rounded-full border-2",
                isDone ? "border-ink bg-magenta text-white" : "border-ink/20 bg-paper text-muted",
                isCurrent && "ring-4 ring-magenta/25"
              )}
            >
              {isDone ? <Check className="size-4" aria-hidden="true" /> : <span className="text-sm font-bold">{index + 1}</span>}
            </span>
            <div className="pt-1">
              <p className={cn("font-bold", !isDone && "text-muted")}>
                {info.label}
                {isCurrent && <span className="ml-2 text-sm font-semibold text-magenta">(étape actuelle)</span>}
              </p>
              {isCurrent && <p className="text-sm text-ink-soft">{info.description}</p>}
              {entry && <p className="text-sm text-muted">{formatDateTime(entry.changedAt)}</p>}
              {entry && entry.note && <p className="mt-1 text-sm">« {entry.note} »</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
