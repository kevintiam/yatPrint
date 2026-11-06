"use client";

/**
 * Accordéon (questions fréquentes, détails d'un produit), basé sur Radix.
 *
 * Exemple :
 *   <Accordion items={[{ id: "q1", title: "Question ?", content: "Réponse." }]} />
 */
import { Accordion as RadixAccordion } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {{id: string, title: string, content: React.ReactNode}[]} props.items
 * @param {string} [props.defaultOpenId] - élément ouvert au départ
 */
export function Accordion({ items, defaultOpenId, className }) {
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={defaultOpenId}
      className={cn("flex flex-col gap-3", className)}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.id}
          value={item.id}
          className="overflow-hidden rounded-2xl border-2 border-ink bg-paper transition-shadow data-[state=open]:shadow-hard"
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold">
              <span>{item.title}</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-yellow-soft transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-magenta group-data-[state=open]:text-white">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="px-5 pb-5 leading-relaxed text-ink-soft">
            {item.content}
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
