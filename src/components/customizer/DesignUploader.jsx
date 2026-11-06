"use client";

/**
 * Zone de téléversement du design : on clique ou on glisse un fichier.
 * Affiche une barre de progression, puis le fichier envoyé avec un bouton
 * pour le retirer. Toute la logique d'envoi est dans le hook useDesignUpload.
 */
import { useRef, useState } from "react";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { DESIGN_UPLOAD_RULES } from "@/config/catalog";
import { formatFileSize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {ReturnType<typeof import("@/hooks/useDesignUpload").useDesignUpload>} props.upload
 */
export function DesignUploader({ upload }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  /** Envoie le premier fichier choisi. */
  function handleFiles(fileList) {
    const file = fileList && fileList[0];
    if (file) upload.upload(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  // --- Fichier déjà envoyé ---
  if (upload.uploadedFile) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-success-soft px-4 py-3">
        <FileCheck2 className="size-6 shrink-0 text-success" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{upload.uploadedFile.name}</p>
          <p className="text-sm text-muted">{formatFileSize(upload.uploadedFile.size)} · bien reçu</p>
        </div>
        <button
          type="button"
          onClick={upload.clear}
          className="grid size-9 place-items-center rounded-full border-2 border-ink bg-paper transition hover:bg-danger hover:text-white"
          aria-label="Retirer le design"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // --- Zone de dépôt ---
  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        disabled={upload.isUploading}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
          isDragging ? "border-magenta bg-magenta-soft" : "border-ink/30 bg-paper hover:border-ink hover:bg-yellow-soft"
        )}
      >
        <UploadCloud className={cn("size-9 transition-transform", isDragging && "-translate-y-1 text-magenta")} aria-hidden="true" />
        <span className="font-semibold">
          {upload.isUploading ? `Envoi en cours… ${upload.progress} %` : "Cliquez ou glissez votre fichier ici"}
        </span>
        <span className="text-sm text-muted">
          {DESIGN_UPLOAD_RULES.acceptedLabel} · {DESIGN_UPLOAD_RULES.maxSizeMb} Mo maximum
        </span>

        {upload.isUploading && (
          <span className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
            <span className="block h-full rounded-full bg-magenta transition-all" style={{ width: `${upload.progress}%` }} />
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={DESIGN_UPLOAD_RULES.acceptedTypes.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-label="Choisir un fichier de design"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = ""; // permet de choisir à nouveau le même fichier
        }}
      />

      {upload.error && (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">
          {upload.error}
        </p>
      )}
    </div>
  );
}
