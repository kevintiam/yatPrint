"use client";

/**
 * Formulaire des réglages de la boutique : coordonnées affichées sur le site,
 * prix de la livraison, ramassage et taxes.
 * (L'enregistrement est fait par le hook useAdminSettings, via SettingsView.)
 */
import { toast } from "sonner";
import { Mail, Save, Truck } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/form-controls";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { storeSettingsSchema } from "@/lib/validation/settings";
import { centsToPriceInput, parsePriceToCents } from "@/lib/utils/format";

/**
 * Bloc titré du formulaire.
 * @param {{icon: React.ComponentType, color: string, title: string, text: string}} props
 */
function SettingsSection({ icon: Icon, color, title, text, children }) {
  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-6">
      <div className="mb-6 flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-ink ${color}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted">{text}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

/**
 * @param {object} props
 * @param {object} props.initialSettings - réglages lus dans la base
 * @param {(values: object) => Promise<{ok: boolean, message?: string}>} props.onSave
 * @param {boolean} props.isSaving
 * @param {Record<string, string>} props.serverErrors - erreurs renvoyées par le serveur
 */
export function StoreSettingsForm({ initialSettings, onSave, isSaving, serverErrors }) {
  const form = useForm(
    { ...initialSettings, shippingPrice: centsToPriceInput(initialSettings.shippingPriceCents) },
    storeSettingsSchema
  );
  const { values, handleChange, setValue } = form;

  /** Erreur d'un champ : d'abord celle du navigateur, sinon celle du serveur. */
  function errorOf(name) {
    return form.errors[name] || serverErrors[name];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Le prix est saisi en dollars (« 15,00 ») mais enregistré en cents (1500)
    const payload = { ...values, shippingPriceCents: parsePriceToCents(values.shippingPrice) };
    delete payload.shippingPrice;

    const check = form.validate(payload);
    if (!check.success) {
      toast.error("Vérifiez les champs en rouge.");
      return;
    }
    const result = await onSave(check.data);
    if (result.ok) toast.success("Réglages enregistrés : le site est déjà à jour.");
    else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <SettingsSection icon={Mail} color="bg-cyan text-white" title="Coordonnées" text="Affichées dans le bandeau du haut, le pied de page, la page Contact et les courriels.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Courriel de contact" htmlFor="email" error={errorOf("email")} required>
            <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} invalid={Boolean(errorOf("email"))} />
          </Field>
          <Field label="Téléphone" htmlFor="phone" error={errorOf("phone")} hint="Laissez vide pour ne pas l'afficher.">
            <Input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} invalid={Boolean(errorOf("phone"))} />
          </Field>
          <Field label="Ville de l'atelier" htmlFor="city" error={errorOf("city")} required>
            <Input id="city" name="city" value={values.city} onChange={handleChange} invalid={Boolean(errorOf("city"))} />
          </Field>
          <Field label="Nom Instagram" htmlFor="instagramHandle" error={errorOf("instagramHandle")} hint="Exemple : kevin.ca (sans le @).">
            <Input id="instagramHandle" name="instagramHandle" value={values.instagramHandle} onChange={handleChange} />
          </Field>
          <Field label="Adresse de la page Instagram" htmlFor="instagramUrl" error={errorOf("instagramUrl")} className="sm:col-span-2">
            <Input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              placeholder="https://www.instagram.com/kevin.ca/"
              value={values.instagramUrl}
              onChange={handleChange}
              invalid={Boolean(errorOf("instagramUrl"))}
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection icon={Truck} color="bg-yellow text-ink" title="Livraison et taxes" text="Utilisés dans le panier et recalculés par le serveur au paiement.">
        <div className="flex flex-col gap-5">
          <Field
            label="Prix de la livraison au Canada (en $)"
            htmlFor="shippingPrice"
            error={errorOf("shippingPriceCents")}
            hint="Mettez 0 pour offrir la livraison."
            className="sm:max-w-sm"
          >
            <Input
              id="shippingPrice"
              name="shippingPrice"
              inputMode="decimal"
              value={values.shippingPrice}
              onChange={handleChange}
              invalid={Boolean(errorOf("shippingPriceCents"))}
            />
          </Field>
          <Switch
            checked={values.pickupEnabled}
            onCheckedChange={(checked) => setValue("pickupEnabled", checked)}
            label="Ramassage à l'atelier"
            description="Gratuit pour le client. Désactivez-le pendant les vacances, par exemple."
          />
          <Switch
            checked={values.taxesEnabled}
            onCheckedChange={(checked) => setValue("taxesEnabled", checked)}
            label="Facturer les taxes (TPS, TVH, TVP, TVQ)"
            description="À désactiver seulement si Yat'Print n'est pas inscrite aux taxes (petit fournisseur). Demandez à votre comptable."
          />
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button type="submit" variant="accent" disabled={isSaving}>
          <Save aria-hidden="true" />
          {isSaving ? "Enregistrement…" : "Enregistrer les réglages"}
        </Button>
      </div>
    </form>
  );
}
