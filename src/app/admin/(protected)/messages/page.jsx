/**
 * Messages de contact (/admin/messages).
 */
import { MessagesView } from "@/components/admin/MessagesView";

export const metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return <MessagesView />;
}
