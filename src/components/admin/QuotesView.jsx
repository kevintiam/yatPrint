"use client";

/**
 * Demandes de devis entreprise (/admin/devis).
 */
import { useState } from "react";
import { toast } from "sonner";
import { ReceiptText } from "lucide-react";
import { AdminPageHeader, StatusSelect } from "./AdminUi";
import { RequestCard } from "./RequestCard";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { useAdminQuotes } from "@/hooks/admin/useAdminRequests";
import { QUOTE_STATUSES } from "@/config/statuses";

export function QuotesView() {
  const [statusFilter, setStatusFilter] = useState("");
  const { items, isLoading, error, isSaving, updateRequest } = useAdminQuotes(statusFilter);

  async function changeStatus(quote, status) {
    const result = await updateRequest(quote.id, { status });
    if (result.ok) toast.success("Statut mis à jour.");
  }

  return (
    <>
      <AdminPageHeader
        title="Devis entreprises"
        icon={ReceiptText}
        accent="yellow"
        text="Demandes reçues par la page Entreprises. Rappelez la personne, puis suivez l'avancement ici."
        actions={<StatusSelect statusList={QUOTE_STATUSES} value={statusFilter} onChange={setStatusFilter} includeAll label="Filtrer par statut" />}
      />

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && items.length === 0 && <LoadingBlock />}
      {!isLoading && items.length === 0 && !error && <EmptyState icon={ReceiptText} title="Aucune demande de devis" />}

      <div className="grid gap-5 xl:grid-cols-2">
        {items.map((quote) => (
          <RequestCard
            key={quote.id}
            title={`${quote.firstName} ${quote.lastName}`}
            createdAt={quote.createdAt}
            statusList={QUOTE_STATUSES}
            status={quote.status}
            onStatusChange={(status) => changeStatus(quote, status)}
            isSaving={isSaving}
            details={[
              { label: "Entreprise", value: quote.company },
              { label: "Téléphone", value: quote.phone, href: `tel:${quote.phone}` },
              { label: "Courriel", value: quote.email, href: `mailto:${quote.email}` },
              { label: "Projet", value: quote.comment },
            ]}
            adminNote={quote.adminNote}
            onSaveNote={(adminNote) => updateRequest(quote.id, { adminNote })}
          />
        ))}
      </div>
    </>
  );
}
