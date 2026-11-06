"use client";

/**
 * Petits composants partagés par les pages de l'admin :
 * en-tête de page coloré, badge de statut, menu de statut, pagination.
 * (Les cartes de chiffres animées sont dans DashboardCards.jsx.)
 */
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/form-controls";
import { getStatusInfo } from "@/config/statuses";
import { getPageNumbers } from "@/lib/utils/pagination";
import { cn } from "@/lib/utils/cn";

/** Couleurs possibles pour l'icône de l'en-tête. */
const ACCENTS = {
  cyan: "bg-cyan text-white",
  magenta: "bg-magenta text-white",
  yellow: "bg-yellow text-ink",
  ink: "bg-ink text-cream",
};

/**
 * En-tête d'une page admin : icône colorée, titre, sous-titre et boutons à droite.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.text]
 * @param {React.ReactNode} [props.actions]
 * @param {React.ComponentType} [props.icon] - icône Lucide
 * @param {keyof ACCENTS} [props.accent] - couleur de l'icône
 */
export function AdminPageHeader({ title, text, actions, icon: Icon, accent = "magenta" }) {
  return (
    <motion.div
      className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <motion.span
            className={cn("grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-ink shadow-hard", ACCENTS[accent])}
            initial={{ rotate: -12, scale: 0.8 }}
            animate={{ rotate: -4, scale: 1 }}
            whileHover={{ rotate: 4, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
          >
            <Icon className="size-7" aria-hidden="true" />
          </motion.span>
        )}
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {text && <p className="mt-1 text-muted">{text}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.div>
  );
}

/**
 * Badge coloré d'un statut.
 * @param {{statusList: object, status: string}} props - ex. statusList = ORDER_STATUSES
 */
export function StatusBadge({ statusList, status }) {
  const info = getStatusInfo(statusList, status);
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

/**
 * Menu déroulant pour changer un statut.
 * @param {object} props
 * @param {object} props.statusList - ex. QUOTE_STATUSES
 * @param {string} props.value
 * @param {(status: string) => void} props.onChange
 * @param {boolean} [props.includeAll] - ajoute « Tous les statuts » (filtre)
 * @param {string} [props.label] - nom lu par les lecteurs d'écran
 */
export function StatusSelect({ statusList, value, onChange, includeAll = false, label = "Statut", disabled, className }) {
  return (
    <Select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn("h-10 min-w-48 text-sm", className)}
    >
      {includeAll && <option value="">Tous les statuts</option>}
      {Object.entries(statusList).map(([key, status]) => (
        <option key={key} value={key}>
          {status.label}
        </option>
      ))}
    </Select>
  );
}

/**
 * Pagination : boutons Précédent / numéros / Suivant.
 * @param {object} props
 * @param {number} props.page
 * @param {number} props.pageCount
 * @param {(page: number) => void} props.onPageChange
 * @param {string} [props.summary] - ex. « 32 commandes »
 */
export function Pagination({ page, pageCount, onPageChange, summary }) {
  if (pageCount <= 1 && !summary) return null;

  const buttonClass =
    "grid h-9 min-w-9 place-items-center rounded-full border-2 border-ink px-2 text-sm font-semibold transition hover:bg-yellow disabled:pointer-events-none disabled:opacity-30";

  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted">{summary}</p>
      {pageCount > 1 && (
        <div className="flex items-center gap-1.5">
          <button type="button" className={buttonClass} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Page précédente">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          {getPageNumbers(page, pageCount).map((number, index) =>
            number === null ? (
              <span key={`gap-${index}`} className="px-1 text-muted" aria-hidden="true">…</span>
            ) : (
              <button
                key={number}
                type="button"
                onClick={() => onPageChange(number)}
                aria-current={number === page ? "page" : undefined}
                className={cn(buttonClass, number === page && "bg-ink text-cream shadow-[2px_2px_0_0_var(--color-magenta)] hover:bg-ink")}
              >
                {number}
              </button>
            )
          )}
          <button type="button" className={buttonClass} onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="Page suivante">
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
}
