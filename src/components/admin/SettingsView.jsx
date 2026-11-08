"use client";

/**
 * Page Réglages de l'admin : réglages de la boutique (à gauche) et
 * compte de l'admin (à droite), chacun avec son propre bouton Enregistrer.
 *
 * Les formulaires ne s'affichent qu'une fois les données chargées : ils
 * partent ainsi directement des bonnes valeurs.
 */
import { Settings } from "lucide-react";
import { AdminPageHeader } from "./AdminUi";
import { StoreSettingsForm } from "./StoreSettingsForm";
import { AccountForm } from "./AccountForm";
import { Alert, LoadingBlock } from "@/components/ui/feedback";
import { useAdminAccount, useAdminSettings } from "@/hooks/admin/useAdminSettings";

export function SettingsView() {
  const settingsState = useAdminSettings();
  const accountState = useAdminAccount();

  return (
    <>
      <AdminPageHeader
        title="Réglages"
        text="Modifiez les informations du site sans toucher au code."
        icon={Settings}
        accent="ink"
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div>
          {settingsState.loadError && <Alert tone="error" className="mb-4">{settingsState.loadError}</Alert>}
          {settingsState.isLoading && !settingsState.settings && <LoadingBlock />}
          {settingsState.settings && (
            <StoreSettingsForm
              initialSettings={settingsState.settings}
              onSave={settingsState.saveSettings}
              isSaving={settingsState.isSaving}
              serverErrors={settingsState.fieldErrors}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-8">
          {accountState.loadError && <Alert tone="error">{accountState.loadError}</Alert>}
          {accountState.isLoading && !accountState.account && <LoadingBlock />}
          {accountState.account && (
            <AccountForm
              account={accountState.account}
              onSave={accountState.updateAccount}
              isSaving={accountState.isSaving}
              serverErrors={accountState.fieldErrors}
            />
          )}
        </div>
      </div>
    </>
  );
}
