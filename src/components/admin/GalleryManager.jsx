"use client";

/**
 * Gestion de la galerie (/admin/galerie) : ajouter une photo, la cacher
 * ou l'afficher, la supprimer.
 */
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Images, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "./AdminUi";
import { ImageUploadButton } from "./ImageUploadButton";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { flattenErrorKeys } from "@/hooks/useForm";
import { useAdminGallery } from "@/hooks/admin/useAdminGallery";
import { GALLERY_CATEGORIES, getOptionLabel } from "@/config/options";

const EMPTY_FORM = { title: "", category: "textile", imageUrl: "", description: "" };

export function GalleryManager() {
  const gallery = useAdminGallery();
  const [form, setForm] = useState(EMPTY_FORM);
  const errors = flattenErrorKeys(gallery.addFieldErrors);

  function setField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleAdd(event) {
    event.preventDefault();
    const result = await gallery.addItem(form);
    if (result.ok) {
      toast.success("Photo ajoutée à la galerie.");
      setForm(EMPTY_FORM);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Supprimer « ${item.title} » de la galerie ?`)) return;
    const result = await gallery.removeItem(item.id);
    if (result.ok) toast.success("Photo supprimée.");
  }

  return (
    <>
      <AdminPageHeader title="Galerie" text="Les photos de réalisations affichées sur le site." icon={Images} accent="yellow" />

      <form onSubmit={handleAdd} className="mb-10 grid gap-4 rounded-3xl border-2 border-ink bg-paper p-6 md:grid-cols-[10rem_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-ink/30 bg-cream">
          {form.imageUrl ? (
            <Image src={form.imageUrl} alt="Aperçu" fill unoptimized className="object-cover" sizes="160px" />
          ) : (
            <span className="grid size-full place-items-center p-3 text-center text-sm text-muted">Aucune photo</span>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre" htmlFor="gallery-title" error={errors.title} required>
            <Input id="gallery-title" value={form.title} maxLength={80} onChange={(event) => setField("title", event.target.value)} invalid={Boolean(errors.title)} />
          </Field>
          <Field label="Catégorie" htmlFor="gallery-category" error={errors.category} required>
            <Select id="gallery-category" value={form.category} onChange={(event) => setField("category", event.target.value)}>
              {Object.entries(GALLERY_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>{category.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Description (facultatif)" htmlFor="gallery-description" className="sm:col-span-2">
            <Input id="gallery-description" value={form.description} maxLength={300} onChange={(event) => setField("description", event.target.value)} />
          </Field>
          <div className="flex flex-wrap items-start gap-3 sm:col-span-2">
            <ImageUploadButton purpose="gallery" label={form.imageUrl ? "Changer la photo" : "Choisir la photo"} onUploaded={(url) => setField("imageUrl", url)} />
            <Button type="submit" variant="accent" size="sm" disabled={gallery.isAdding}>
              <Plus aria-hidden="true" />
              Ajouter à la galerie
            </Button>
          </div>
          {(errors.imageUrl || gallery.addError) && (
            <Alert tone="error" className="sm:col-span-2">{errors.imageUrl || gallery.addError}</Alert>
          )}
        </div>
      </form>

      {gallery.error && <Alert tone="error" className="mb-6">{gallery.error}</Alert>}
      {gallery.isLoading && gallery.items.length === 0 && <LoadingBlock />}
      {!gallery.isLoading && gallery.items.length === 0 && <EmptyState icon={Images} title="La galerie est vide" />}

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {gallery.items.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-3xl border-2 border-ink bg-paper">
            <div className="relative aspect-square">
              <Image src={item.imageUrl} alt={item.title} fill unoptimized={item.imageUrl.startsWith("/api/")} sizes="(min-width: 1280px) 20vw, 45vw" className={item.isVisible ? "object-cover" : "object-cover opacity-40 grayscale"} />
              {!item.isVisible && <Badge tone="ink" className="absolute left-3 top-3">Cachée</Badge>}
            </div>
            <div className="flex flex-col gap-2 p-4">
              <p className="font-semibold leading-tight">{item.title}</p>
              <p className="text-xs text-muted">{getOptionLabel(GALLERY_CATEGORIES, item.category)}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => gallery.updateItem(item.id, { isVisible: !item.isVisible })}>
                  {item.isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  {item.isVisible ? "Cacher" : "Afficher"}
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto text-danger" onClick={() => handleDelete(item)} aria-label={`Supprimer ${item.title}`}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
