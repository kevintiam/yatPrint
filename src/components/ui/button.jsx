/**
 * Bouton du site (style shadcn/ui), avec plusieurs variantes de couleur.
 *
 * Exemples :
 *   <Button>Ajouter au panier</Button>
 *   <Button variant="accent" size="lg">Personnaliser</Button>
 *   <Button asChild variant="outline"><Link href="/collection">Voir</Link></Button>
 *
 * `asChild` : le style du bouton est appliqué à l'élément enfant (ex. un lien),
 * au lieu de créer un <button>.
 */
import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  // Styles communs à tous les boutons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold " +
    "transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan " +
    "[&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Noir : action principale
        primary:
          "bg-ink text-cream border-2 border-ink hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-magenta)] active:translate-y-0 active:shadow-none",
        // Magenta : appel à l'action le plus visible
        accent:
          "bg-magenta text-white border-2 border-ink shadow-hard-sm hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none",
        // Jaune : action secondaire joyeuse
        yellow:
          "bg-yellow text-ink border-2 border-ink shadow-hard-sm hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none",
        // Contour : action secondaire
        outline: "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream",
        // Discret : dans une barre d'outils ou une liste
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        // Sur fond foncé
        light: "bg-cream text-ink border-2 border-cream hover:bg-yellow hover:border-yellow",
        // Danger : supprimer, annuler
        danger: "bg-danger text-white border-2 border-danger hover:bg-danger/90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

/**
 * @param {object} props
 * @param {"primary"|"accent"|"yellow"|"outline"|"ghost"|"light"|"danger"} [props.variant]
 * @param {"sm"|"md"|"lg"|"icon"} [props.size]
 * @param {boolean} [props.asChild]
 */
export function Button({ className, variant, size, asChild = false, type, ...props }) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      // Un <button> sans type envoie le formulaire : on met "button" par défaut
      type={asChild ? undefined : type || "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
