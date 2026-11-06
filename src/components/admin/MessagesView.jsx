"use client";

/**
 * Messages reçus par le formulaire de contact (/admin/messages).
 */
import { useState } from "react";
import { Mail, Reply } from "lucide-react";
import { AdminPageHeader, StatusSelect } from "./AdminUi";
import { RequestCard } from "./RequestCard";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { useAdminMessages } from "@/hooks/admin/useAdminRequests";
import { MESSAGE_STATUSES } from "@/config/statuses";
import { CONTACT_SUBJECTS, getOptionLabel } from "@/config/options";

export function MessagesView() {
  const [statusFilter, setStatusFilter] = useState("");
  const { items, isLoading, error, isSaving, updateRequest } = useAdminMessages(statusFilter);

  return (
    <>
      <AdminPageHeader
        title="Messages"
        icon={Mail}
        accent="cyan"
        text="Messages envoyés depuis la page Contact."
        actions={<StatusSelect statusList={MESSAGE_STATUSES} value={statusFilter} onChange={setStatusFilter} includeAll label="Filtrer par statut" />}
      />

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && items.length === 0 && <LoadingBlock />}
      {!isLoading && items.length === 0 && !error && <EmptyState icon={Mail} title="Aucun message" />}

      <div className="grid gap-5 xl:grid-cols-2">
        {items.map((message) => (
          <RequestCard
            key={message.id}
            title={message.name}
            createdAt={message.createdAt}
            statusList={MESSAGE_STATUSES}
            status={message.status}
            onStatusChange={(status) => updateRequest(message.id, { status })}
            isSaving={isSaving}
            details={[
              { label: "Sujet", value: getOptionLabel(CONTACT_SUBJECTS, message.subject) },
              { label: "Courriel", value: message.email, href: `mailto:${message.email}` },
              { label: "Téléphone", value: message.phone, href: `tel:${message.phone}` },
              { label: "Message", value: message.message },
            ]}
          >
            <Button asChild variant="outline" size="sm" className="w-fit">
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent("Re : votre message à Yat'Print")}`}
                onClick={() => message.status === "new" && updateRequest(message.id, { status: "read" })}
              >
                <Reply aria-hidden="true" />
                Répondre par courriel
              </a>
            </Button>
          </RequestCard>
        ))}
      </div>
    </>
  );
}
