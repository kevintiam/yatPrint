"use client";

/**
 * Formulaire de création et de modification d'un produit (admin).
 *
 * - ProductForm charge le produit (si modification) avec son hook.
 * - ProductFormFields contient les champs ; il démarre avec les valeurs
 *   du produit chargé (la « key » le recrée si on change de produit).
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ImageListEditor, ColorListEditor, MaterialListEditor } from "./ProductMediaFields";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, LoadingBlock, Spinner } from "@/components/ui/feedback";
import { flattenErrorKeys } from "@/hooks/useForm";
import { useAdminProductEditor } from "@/hooks/admin/useAdminProducts";
import { productSchema } from "@/lib/validation/admin";
import { validateData } from "@/lib/validation/validate";
import { CATEGORIES, SIZES } from "@/config/catalog";
import { centsToPriceInput, parsePriceToCents, slugify } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** Valeurs de départ d'un nouveau produit. */
const EMPTY_PRODUCT = {
  name: "", slug: "", line: "service", category: "tshirt", priceCents: 0, shortDescription: "", description: "",
  images: [], colors: [], allowCustomColor: false, sizes: [], materials: [], isActive: true, isFeatured: false, sortOrder: 0,
};

/** Une section encadrée du formulaire. */
function FormSection({ title, text, children }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-paper p-6">
      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {text && <p className="text-sm text-muted">{text}</p>}
      </div>
      {children}
    </section>
  );
}

/** Case à cocher avec texte. */
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-semibold">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-magenta" />
      {label}
    </label>
  );
}

function ProductFormFields({ initialProduct, isNew, onSave, isSaving, saveError, serverErrors }) {
  const router = useRouter();
  // Prix affiché en dollars ; vide pour un nouveau produit (plus simple à remplir)
  const [values, setValues] = useState({ ...initialProduct, price: isNew ? "" : centsToPriceInput(initialProduct.priceCents) });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [localErrors, setLocalErrors] = useState({});
  const errors = { ...flattenErrorKeys(serverErrors), ...localErrors };

  /** Change un champ (et l'adresse automatiquement si on tape le nom d'un nouveau produit). */
  function setField(field, value) {
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      if (field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  }

  function toggleSize(size) {
    const nextSizes = [];
    for (const existing of SIZES) {
      const isChecked = existing === size ? !values.sizes.includes(size) : values.sizes.includes(existing);
      if (isChecked) nextSizes.push(existing); // garde l'ordre XS -> 2XL
    }
    setField("sizes", nextSizes);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...values, priceCents: parsePriceToCents(values.price) };
    delete payload.price;
    delete payload.id;

    const check = validateData(productSchema, payload);
    if (!check.success) {
      setLocalErrors(flattenErrorKeys(check.fieldErrors));
      toast.error("Certains champs sont à corriger.");
      return;
    }
    setLocalErrors({});

    const result = await onSave(check.data);
    if (result.ok) {
      toast.success(isNew ? "Produit créé !" : "Modifications enregistrées.");
      if (isNew) router.push("/admin/produits");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-6">
        <FormSection title="Informations">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom" htmlFor="name" error={errors.name} required>
              <Input id="name" value={values.name} onChange={(event) => setField("name", event.target.value)} invalid={Boolean(errors.name)} />
            </Field>
            <Field label="Adresse (slug)" htmlFor="slug" error={errors.slug} hint="Lettres minuscules, chiffres et tirets" required>
              <Input id="slug" value={values.slug} onChange={(event) => { setSlugTouched(true); setField("slug", event.target.value); }} invalid={Boolean(errors.slug)} />
            </Field>
            <Field label="Ligne" htmlFor="line" error={errors.line} required>
              <Select id="line" value={values.line} onChange={(event) => setField("line", event.target.value)}>
                <option value="service">Personnalisation (atelier)</option>
                <option value="collection">Collection Yat&apos;Print</option>
              </Select>
            </Field>
            <Field label="Catégorie" htmlFor="category" error={errors.category} required>
              <Select id="category" value={values.category} onChange={(event) => setField("category", event.target.value)}>
                {Object.entries(CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>{category.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Prix (en dollars, avant taxes)" htmlFor="price" error={errors.priceCents} required>
              <Input id="price" inputMode="decimal" value={values.price} onChange={(event) => setField("price", event.target.value)} invalid={Boolean(errors.priceCents)} />
            </Field>
            <Field label="Ordre d'affichage" htmlFor="sortOrder" error={errors.sortOrder} hint="Petit nombre = affiché en premier">
              <Input id="sortOrder" type="number" min={0} value={values.sortOrder} onChange={(event) => setField("sortOrder", event.target.value)} />
            </Field>
          </div>
          <Field label="Description courte" htmlFor="shortDescription" error={errors.shortDescription} hint="Affichée sous le nom (200 caractères max.)">
            <Input id="shortDescription" value={values.shortDescription} maxLength={200} onChange={(event) => setField("shortDescription", event.target.value)} />
          </Field>
          <Field label="Description complète" htmlFor="description" error={errors.description}>
            <Textarea id="description" rows={5} value={values.description} onChange={(event) => setField("description", event.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Photos" text="La première photo est la photo principale.">
          <ImageListEditor images={values.images} category={values.category} onChange={(images) => setField("images", images)} />
        </FormSection>

        <FormSection title="Couleurs" text="Facultatif. Chaque couleur peut avoir sa propre photo.">
          <ColorListEditor colors={values.colors} onChange={(colors) => setField("colors", colors)} />
          <Checkbox label="Proposer « Choisir ma couleur »" checked={values.allowCustomColor} onChange={(checked) => setField("allowCustomColor", checked)} />
        </FormSection>

        <FormSection title="Tailles et matériaux" text="Cochez les tailles proposées (vêtements). Les matériaux servent surtout à la gravure.">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button key={size} type="button" onClick={() => toggleSize(size)} aria-pressed={values.sizes.includes(size)}
                className={cn("rounded-xl border-2 px-4 py-2 font-semibold", values.sizes.includes(size) ? "border-ink bg-ink text-cream" : "border-ink/20 bg-paper")}>
                {size}
              </button>
            ))}
          </div>
          <MaterialListEditor materials={values.materials} onChange={(materials) => setField("materials", materials)} />
        </FormSection>
      </div>

      <div className="flex flex-col gap-6 xl:sticky xl:top-8 xl:self-start">
        <FormSection title="Publication">
          <Checkbox label="Visible sur le site" checked={values.isActive} onChange={(checked) => setField("isActive", checked)} />
          <Checkbox label="Mis en avant" checked={values.isFeatured} onChange={(checked) => setField("isFeatured", checked)} />
          {Object.keys(errors).length > 0 && <Alert tone="error">Vérifiez les champs en rouge (y compris les couleurs et matériaux).</Alert>}
          {saveError && <Alert tone="error">{saveError}</Alert>}
          <Button type="submit" variant="accent" size="lg" disabled={isSaving}>
            {isSaving ? <Spinner label="Enregistrement" /> : <Save aria-hidden="true" />}
            {isNew ? "Créer le produit" : "Enregistrer"}
          </Button>
        </FormSection>
      </div>
    </form>
  );
}

/**
 * @param {{productId: string|null}} props - null pour un nouveau produit
 */
export function ProductForm({ productId }) {
  const editor = useAdminProductEditor(productId);

  if (productId && editor.isLoading && !editor.product) return <LoadingBlock />;
  if (productId && !editor.product) return <Alert tone="error">{editor.loadError || "Produit introuvable."}</Alert>;

  const initialProduct = editor.product || EMPTY_PRODUCT;
  return (
    <ProductFormFields
      key={initialProduct.id || "nouveau"}
      initialProduct={initialProduct}
      isNew={!productId}
      onSave={editor.saveProduct}
      isSaving={editor.isSaving}
      saveError={editor.saveError}
      serverErrors={editor.fieldErrors}
    />
  );
}
