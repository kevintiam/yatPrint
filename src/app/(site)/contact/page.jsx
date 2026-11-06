/**
 * Page Contact (/contact) : coordonnées et formulaire de contact.
 * Les coordonnées viennent des réglages de la boutique (/admin/reglages).
 */
import Link from "next/link";
import { Mail, MapPin, MessageCircleQuestion, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { InstagramIcon } from "@/components/layout/InstagramIcon";
import { Reveal } from "@/components/motion/Reveal";
import { loadStoreSettings } from "@/lib/server/storeSettings";

export const metadata = {
  title: "Contact",
  description: "Une question, une idée, une commande spéciale ? Écrivez à Yat'Print.",
};

/** Une carte de coordonnée (icône colorée + titre + valeur). */
function ContactCard({ icon: Icon, color, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border-2 border-ink bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-hard">
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink ${color}`}>
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display font-bold">{title}</p>
        <div className="text-ink-soft">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage() {
  const settings = await loadStoreSettings();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Une idée ? Une question ?"
        highlight="Parlons-en."
        text="Nous répondons à tous les messages. Pour une grosse commande, la page Entreprises vous fera gagner du temps."
        accent="yellow"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[22rem_1fr]">
        <Reveal className="flex flex-col gap-4">
          <ContactCard icon={Mail} color="bg-cyan text-white" title="Courriel">
            <a href={`mailto:${settings.email}`} className="hover:text-magenta">{settings.email}</a>
          </ContactCard>
          {settings.phone && (
            <ContactCard icon={Phone} color="bg-yellow" title="Téléphone">
              <a href={`tel:${settings.phone}`} className="hover:text-magenta">{settings.phone}</a>
            </ContactCard>
          )}
          <ContactCard icon={MapPin} color="bg-magenta text-white" title="Atelier">
            {settings.city}
          </ContactCard>
          <ContactCard icon={InstagramIcon} color="bg-ink text-cream" title="Instagram">
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-magenta">
              {settings.instagramHandle}
            </a>
          </ContactCard>
          <ContactCard icon={MessageCircleQuestion} color="bg-cream-dark" title="Questions fréquentes">
            <Link href="/faq" className="hover:text-magenta">Consulter la FAQ </Link>
          </ContactCard>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[2rem] border-2 border-ink bg-paper p-6 shadow-hard-lg sm:p-10">
          <h2 className="mb-8 font-display text-3xl font-extrabold">Écrivez-nous</h2>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
