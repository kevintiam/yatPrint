/**
 * Réglages de la boutique et du compte admin (/admin/reglages).
 */
import { SettingsView } from "@/components/admin/SettingsView";

export const metadata = { title: "Réglages" };

export default function AdminSettingsPage() {
  return <SettingsView />;
}
