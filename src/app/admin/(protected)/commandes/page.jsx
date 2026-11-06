/**
 * Liste des commandes (/admin/commandes).
 * Accepte ?statut=paid pour ouvrir la liste déjà filtrée (liens du tableau de bord).
 */
import { OrdersView } from "@/components/admin/OrdersView";
import { ORDER_STATUSES } from "@/config/statuses";

export const metadata = { title: "Commandes" };

export default async function AdminOrdersPage({ searchParams }) {
  const { statut } = await searchParams;
  const initialStatus = typeof statut === "string" && ORDER_STATUSES[statut] ? statut : "";

  // key : si l'adresse change (?statut=...), la liste repart avec le nouveau filtre
  return <OrdersView key={initialStatus} initialStatus={initialStatus} />;
}
