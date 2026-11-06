/**
 * Enveloppe d'un champ de formulaire : étiquette + champ + aide + erreur.
 *
 * Exemple :
 *   <Field label="Courriel" htmlFor="email" error={errors.email} required>
 *     <Input id="email" name="email" ... invalid={Boolean(errors.email)} />
 *   </Field>
 *
 * Accessibilité : le message d'erreur a un identifiant (<id>-error) ; ajoutez
 * aria-describedby={`${htmlFor}-error`} au champ pour qu'il soit lu par les lecteurs d'écran.
 */
import { CircleAlert } from "lucide-react";
import { Label } from "./form-controls";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {string} props.label - texte de l'étiquette
 * @param {string} props.htmlFor - id du champ
 * @param {string} [props.error] - message d'erreur
 * @param {string} [props.hint] - petite aide sous le champ
 * @param {boolean} [props.required] - affiche un astérisque
 */
export function Field({ label, htmlFor, error, hint, required = false, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ml-0.5 text-magenta" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {children}

      {hint && !error && <p className="text-xs text-muted">{hint}</p>}

      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="flex items-center gap-1 text-sm font-medium text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Champ piège invisible pour les robots (anti-pourriel).
 * Un humain ne le voit pas et ne le remplit pas ; un robot remplit tout.
 * Le serveur ignore le formulaire si ce champ contient quelque chose.
 */
export function HoneypotField({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Ne pas remplir ce champ</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
    </div>
  );
}
