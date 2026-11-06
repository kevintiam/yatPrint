"use client";

/**
 * Panneau de gestion d'une commande : changer le statut (le client reçoit
 * un courriel), écrire une note interne, voir l'historique.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Save, Send } from "lucide-react";
import { StatusBadge, StatusSelect } from "./AdminUi";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES } from "@/config/statuses";
import { formatDateTime } from "@/lib/utils/format";

/**
 * @param {object} props
 * @param {object} props.order
 * @param {(changes: object) => Promise<{ok: boolean, message?: string}>} props.onUpdate
 * @param {boolean} props.isSaving
 */
export function OrderStatusPanel({ order, onUpdate, isSaving }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [adminNote, setAdminNote] = useState(order.adminNote || "");

  async function handleStatusSubmit(event) {
    event.preventDefault();
    if (status === order.status) {
      toast.info("Choisissez un nouveau statut.");
      return;
    }
    const result = await onUpdate({ status, note });
    if (result.ok) {
      setNote("");
      toast.success("Statut mis à jour. Le client a été prévenu par courriel.");
    } else {
      toast.error(result.message);
    }
  }

  async function handleNoteSave() {
    const result = await onUpdate({ adminNote });
    if (result.ok) toast.success("Note enregistrée.");
    else toast.error(result.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleStatusSubmit} className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-paper p-6 shadow-hard">
        <h2 className="font-display text-xl font-bold">Changer le statut</h2>
        <StatusSelect statusList={ORDER_STATUSES} value={status} onChange={setStatus} label="Nouveau statut" />
        <Field label="Précision pour le client (facultatif)" htmlFor="status-note" hint="Ex. : numéro de suivi Postes Canada">
          <Input id="status-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={300} />
        </Field>
        <Button type="submit" variant="accent" disabled={isSaving}>
          <Send aria-hidden="true" />
          Mettre à jour et prévenir le client
        </Button>
      </form>

      <section className="flex flex-col gap-3 rounded-3xl border-2 border-ink bg-paper p-6">
        <h2 className="font-display text-xl font-bold">Note interne</h2>
        <p className="text-sm text-muted">Visible seulement dans l&apos;admin.</p>
        <Textarea rows={4} value={adminNote} onChange={(event) => setAdminNote(event.target.value)} aria-label="Note interne" />
        <Button variant="outline" onClick={handleNoteSave} disabled={isSaving}>
          <Save aria-hidden="true" />
          Enregistrer la note
        </Button>
      </section>

      <section className="rounded-3xl border-2 border-ink bg-paper p-6">
        <h2 className="mb-4 font-display text-xl font-bold">Historique</h2>
        <ol className="flex flex-col gap-3">
          {[...order.statusHistory].reverse().map((entry, index) => (
            <li key={`${entry.status}-${index}`} className="text-sm">
              <StatusBadge statusList={ORDER_STATUSES} status={entry.status} />
              <span className="ml-2 text-muted">{formatDateTime(entry.changedAt)}</span>
              {entry.note && <p className="mt-1 text-ink-soft">« {entry.note} »</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
