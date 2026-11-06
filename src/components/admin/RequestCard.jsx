"use client";

/**
 * Carte d'une demande reçue (devis, mentorat, message) dans l'admin :
 * en-tête (nom, date, statut), détails, contenu supplémentaire,
 * et note interne facultative.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { StatusSelect } from "./AdminUi";
import { Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/format";

/**
 * @param {object} props
 * @param {string} props.title - ex. nom de la personne
 * @param {string} props.createdAt
 * @param {object} props.statusList - ex. QUOTE_STATUSES
 * @param {string} props.status
 * @param {(status: string) => void} props.onStatusChange
 * @param {{label: string, value: string, href?: string}[]} props.details
 * @param {boolean} props.isSaving
 * @param {string} [props.adminNote] - note interne (si undefined : pas de bloc note)
 * @param {(note: string) => Promise<{ok: boolean}>} [props.onSaveNote]
 * @param {React.ReactNode} [props.children] - contenu supplémentaire (actions spéciales)
 */
export function RequestCard({ title, createdAt, statusList, status, onStatusChange, details, isSaving, adminNote, onSaveNote, children }) {
  const [note, setNote] = useState(adminNote || "");

  async function handleSaveNote() {
    const result = await onSaveNote(note);
    if (result.ok) toast.success("Note enregistrée.");
  }

  return (
    <article className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-paper p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted">Reçue le {formatDateTime(createdAt)}</p>
        </div>
        <StatusSelect statusList={statusList} value={status} onChange={onStatusChange} disabled={isSaving} label={`Statut de la demande de ${title}`} />
      </header>

      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
        {details.map((detail) =>
          detail.value ? (
            <div key={detail.label} className="contents">
              <dt className="font-semibold text-muted">{detail.label}</dt>
              <dd className="whitespace-pre-line break-words">
                {detail.href ? (
                  <a href={detail.href} className="text-magenta hover:underline">{detail.value}</a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ) : null
        )}
      </dl>

      {children}

      {onSaveNote && (
        <div className="flex flex-col gap-2 border-t-2 border-dashed border-ink/10 pt-4">
          <label className="text-sm font-semibold" htmlFor={`note-${title}-${createdAt}`}>
            Note interne
          </label>
          <Textarea id={`note-${title}-${createdAt}`} rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
          <Button variant="ghost" size="sm" className="w-fit" onClick={handleSaveNote} disabled={isSaving}>
            <Save aria-hidden="true" />
            Enregistrer la note
          </Button>
        </div>
      )}
    </article>
  );
}
