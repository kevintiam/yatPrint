/**
 * Demandes de devis entreprise (/admin/devis).
 */
import { QuotesView } from "@/components/admin/QuotesView";

export const metadata = { title: "Devis entreprises" };

export default function AdminQuotesPage() {
  return <QuotesView />;
}
