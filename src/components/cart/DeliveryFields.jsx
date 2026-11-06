"use client";

/**
 * Partie « Livraison » du formulaire de paiement :
 * choix entre expédition et ramassage, puis adresse si expédition.
 * Le prix et l'ouverture du ramassage viennent des réglages de la boutique.
 */
import { PackageCheck, Truck } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/form-controls";
import { getAvailableDeliveryMethods } from "@/config/shipping";
import { getProvinceOptions } from "@/config/taxes";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const METHOD_ICONS = { shipping: Truck, pickup: PackageCheck };
const PROVINCE_OPTIONS = getProvinceOptions();

/**
 * @param {object} props
 * @param {object} props.form - objet renvoyé par useForm (values, errors, handleChange, setValue)
 */
export function DeliveryFields({ form }) {
  const { values, errors, handleChange, setValue } = form;
  const deliveryMethods = getAvailableDeliveryMethods(useStoreSettings());

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-3 font-display text-xl font-bold">2. Livraison</legend>

      {/* Deux grandes cartes à choisir (boutons radio stylés) */}
      <div role="radiogroup" aria-label="Mode de livraison" className="grid gap-3 sm:grid-cols-2">
        {deliveryMethods.map((method) => {
          const methodKey = method.key;
          const Icon = METHOD_ICONS[methodKey];
          const isSelected = values.deliveryMethod === methodKey;
          return (
            <label
              key={methodKey}
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition",
                isSelected ? "border-ink bg-yellow-soft shadow-hard-sm" : "border-ink/20 bg-paper hover:border-ink/50"
              )}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={methodKey}
                checked={isSelected}
                onChange={() => setValue("deliveryMethod", methodKey)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <Icon className="size-6" aria-hidden="true" />
                <span className="font-bold">{method.priceCents === 0 ? "Gratuit" : formatPrice(method.priceCents)}</span>
              </span>
              <span className="font-semibold">{method.label}</span>
              <span className="text-sm text-muted">{method.description}</span>
            </label>
          );
        })}
      </div>

      {values.deliveryMethod === "shipping" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adresse" htmlFor="line1" error={errors.line1} required className="sm:col-span-2">
            <Input id="line1" name="line1" autoComplete="address-line1" value={values.line1} onChange={handleChange} invalid={Boolean(errors.line1)} />
          </Field>
          <Field label="Appartement, bureau (facultatif)" htmlFor="line2" error={errors.line2} className="sm:col-span-2">
            <Input id="line2" name="line2" autoComplete="address-line2" value={values.line2} onChange={handleChange} />
          </Field>
          <Field label="Ville" htmlFor="city" error={errors.city} required>
            <Input id="city" name="city" autoComplete="address-level2" value={values.city} onChange={handleChange} invalid={Boolean(errors.city)} />
          </Field>
          <Field label="Code postal" htmlFor="postalCode" error={errors.postalCode} required>
            <Input
              id="postalCode"
              name="postalCode"
              autoComplete="postal-code"
              placeholder="K1A 0B1"
              value={values.postalCode}
              onChange={handleChange}
              invalid={Boolean(errors.postalCode)}
            />
          </Field>
          <Field label="Province ou territoire" htmlFor="province" error={errors.province} required className="sm:col-span-2">
            <Select id="province" name="province" value={values.province} onChange={handleChange} invalid={Boolean(errors.province)}>
              <option value="">Choisissez…</option>
              {PROVINCE_OPTIONS.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}
    </fieldset>
  );
}
