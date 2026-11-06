/**
 * Demandes de mentorat (/admin/mentorat).
 */
import { MentorshipView } from "@/components/admin/MentorshipView";

export const metadata = { title: "Mentorat" };

export default function AdminMentorshipPage() {
  return <MentorshipView />;
}
