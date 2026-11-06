/**
 * Détail d'une commande (/admin/commandes/<id>).
 * La page transmet l'identifiant ; le composant charge la commande avec son hook.
 */
import { OrderDetailView } from "@/components/admin/OrderDetailView";

export const metadata = { title: "Détail de la commande" };

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
