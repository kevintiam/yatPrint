"use client";

/**
 * Formulaire « Mon compte » : nom affiché et changement du mot de passe.
 * Le mot de passe actuel est toujours demandé (sécurité).
 */
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { accountSchema } from "@/lib/validation/settings";

/**
 * @param {object} props
 * @param {{email: string, name: string}} props.account
 * @param {(values: object) => Promise<{ok: boolean, message?: string, data?: object}>} props.onSave
 * @param {boolean} props.isSaving
 * @param {Record<string, string>} props.serverErrors
 */
export function AccountForm({ account, onSave, isSaving, serverErrors }) {
  const form = useForm({ name: account.name, currentPassword: "", newPassword: "", confirmPassword: "" }, accountSchema);
  const { values, handleChange, setValue } = form;
  const [showPasswords, setShowPasswords] = useState(false);
  const passwordType = showPasswords ? "text" : "password";

  function errorOf(name) {
    return form.errors[name] || serverErrors[name];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const check = form.validate();
    if (!check.success) return;

    const result = await onSave(check.data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.data.passwordChanged ? "Mot de passe changé. Utilisez-le à la prochaine connexion." : "Compte mis à jour.");
    // On vide les champs de mot de passe (jamais gardés à l'écran)
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-ink bg-paper p-6" noValidate>
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-magenta text-white">
          <KeyRound className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">Mon compte</h2>
          <p className="text-sm text-muted">Connexion : {account.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Nom affiché" htmlFor="name" error={errorOf("name")} required>
          <Input id="name" name="name" autoComplete="name" value={values.name} onChange={handleChange} invalid={Boolean(errorOf("name"))} />
        </Field>

        <div className="rounded-2xl border-2 border-dashed border-ink/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-semibold">Changer le mot de passe</p>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink"
            >
              {showPasswords ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              {showPasswords ? "Masquer" : "Afficher"}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <Field label="Nouveau mot de passe" htmlFor="newPassword" error={errorOf("newPassword")} hint="10 caractères minimum. Laissez vide pour garder l'actuel.">
              <Input id="newPassword" name="newPassword" type={passwordType} autoComplete="new-password" value={values.newPassword} onChange={handleChange} invalid={Boolean(errorOf("newPassword"))} />
            </Field>
            <Field label="Confirmer le nouveau mot de passe" htmlFor="confirmPassword" error={errorOf("confirmPassword")}>
              <Input id="confirmPassword" name="confirmPassword" type={passwordType} autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} invalid={Boolean(errorOf("confirmPassword"))} />
            </Field>
          </div>
        </div>

        <Field label="Mot de passe actuel" htmlFor="currentPassword" error={errorOf("currentPassword")} hint="Obligatoire pour enregistrer un changement." required>
          <Input id="currentPassword" name="currentPassword" type={passwordType} autoComplete="current-password" value={values.currentPassword} onChange={handleChange} invalid={Boolean(errorOf("currentPassword"))} />
        </Field>

        <Button type="submit" variant="primary" disabled={isSaving} className="self-end">
          {isSaving ? "Enregistrement…" : "Mettre à jour mon compte"}
        </Button>
      </div>
    </form>
  );
}
