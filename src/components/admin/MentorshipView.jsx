"use client";

/**
 * Demandes de mentorat (/admin/mentorat).
 * Pour confirmer : indiquer la date retenue puis « Confirmer » (courriel envoyé).
 */
import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, GraduationCap, X } from "lucide-react";
import { AdminPageHeader, StatusSelect } from "./AdminUi";
import { RequestCard } from "./RequestCard";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { useAdminMentorships } from "@/hooks/admin/useAdminRequests";
import { MENTORSHIP_STATUSES } from "@/config/statuses";
import { MENTORSHIP_FORMATS, MENTORSHIP_LEVELS, MENTORSHIP_TOPICS, getOptionLabel } from "@/config/options";

/**
 * Bloc « Confirmer / Refuser » d'une demande.
 * @param {{request: object, onUpdate: Function, isSaving: boolean}} props
 */
function ConfirmationBox({ request, onUpdate, isSaving }) {
  const [confirmedDate, setConfirmedDate] = useState(request.confirmedDate || "");

  async function confirm() {
    if (!confirmedDate.trim()) {
      toast.error("Indiquez la date et l'heure de la séance.");
      return;
    }
    const result = await onUpdate({ status: "confirmed", confirmedDate: confirmedDate.trim() });
    if (result.ok) toast.success("Séance confirmée : un courriel a été envoyé.");
  }

  async function decline() {
    const result = await onUpdate({ status: "declined" });
    if (result.ok) toast.success("Demande refusée : un courriel a été envoyé.");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-cyan-soft p-4">
      <label htmlFor={`date-${request.id}`} className="text-sm font-semibold">
        Date et heure de la séance
      </label>
      <Input id={`date-${request.id}`} placeholder="Ex. : mardi 18 novembre, 18 h 30, en ligne" value={confirmedDate} onChange={(event) => setConfirmedDate(event.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Button variant="accent" size="sm" onClick={confirm} disabled={isSaving}>
          <CalendarCheck aria-hidden="true" />
          Confirmer la séance
        </Button>
        <Button variant="outline" size="sm" onClick={decline} disabled={isSaving}>
          <X aria-hidden="true" />
          Refuser
        </Button>
      </div>
    </div>
  );
}

export function MentorshipView() {
  const [statusFilter, setStatusFilter] = useState("");
  const { items, isLoading, error, isSaving, updateRequest } = useAdminMentorships(statusFilter);

  return (
    <>
      <AdminPageHeader
        title="Mentorat"
        icon={GraduationCap}
        accent="magenta"
        text="Demandes de séances Canva et impression."
        actions={<StatusSelect statusList={MENTORSHIP_STATUSES} value={statusFilter} onChange={setStatusFilter} includeAll label="Filtrer par statut" />}
      />

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && items.length === 0 && <LoadingBlock />}
      {!isLoading && items.length === 0 && !error && <EmptyState icon={GraduationCap} title="Aucune demande de mentorat" />}

      <div className="grid gap-5 xl:grid-cols-2">
        {items.map((request) => (
          <RequestCard
            key={request.id}
            title={`${request.firstName} ${request.lastName}`}
            createdAt={request.createdAt}
            statusList={MENTORSHIP_STATUSES}
            status={request.status}
            onStatusChange={(status) => updateRequest(request.id, { status })}
            isSaving={isSaving}
            details={[
              { label: "Courriel", value: request.email, href: `mailto:${request.email}` },
              { label: "Téléphone", value: request.phone, href: `tel:${request.phone}` },
              { label: "Thème", value: getOptionLabel(MENTORSHIP_TOPICS, request.topic) },
              { label: "Niveau", value: getOptionLabel(MENTORSHIP_LEVELS, request.level) },
              { label: "Format", value: getOptionLabel(MENTORSHIP_FORMATS, request.format) },
              { label: "Disponibilités", value: request.preferredDates },
              { label: "Message", value: request.message },
              { label: "Séance prévue", value: request.status === "confirmed" ? request.confirmedDate : "" },
            ]}
            adminNote={request.adminNote}
            onSaveNote={(adminNote) => updateRequest(request.id, { adminNote })}
          >
            {request.status === "new" && (
              <ConfirmationBox request={request} isSaving={isSaving} onUpdate={(changes) => updateRequest(request.id, changes)} />
            )}
          </RequestCard>
        ))}
      </div>
    </>
  );
}
