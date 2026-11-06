/**
 * Tableau de bord de l'admin (/admin).
 *
 * La date du jour est mise en forme ici, sur le serveur, dans le fuseau de
 * l'atelier : le navigateur affiche donc exactement le même texte.
 */
import { auth } from "@/auth";
import { DashboardView } from "@/components/admin/DashboardView";
import { STORE_TIME_ZONE } from "@/config/brand";

export const metadata = { title: "Tableau de bord" };

const todayFormatter = new Intl.DateTimeFormat("fr-CA", { timeZone: STORE_TIME_ZONE, weekday: "long", day: "numeric", month: "long" });
const monthFormatter = new Intl.DateTimeFormat("fr-CA", { timeZone: STORE_TIME_ZONE, month: "long" });

export default async function AdminDashboardPage() {
  const session = await auth();
  const name = session?.user?.name || "";
  const firstName = name.split(" ")[0] || "Gessica";

  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  return (
    <DashboardView
      firstName={firstName}
      todayLabel={todayFormatter.format(now)}
      previousMonthLabel={monthFormatter.format(previousMonth)}
    />
  );
}
