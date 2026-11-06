/**
 * POST /api/webhooks/stripe
 * Stripe appelle cette adresse quand un paiement est terminé.
 *
 * Sécurité : on vérifie la SIGNATURE de la requête avec STRIPE_WEBHOOK_SECRET.
 * Sans signature valide, la requête est refusée (personne ne peut faire
 * passer une commande pour payée en appelant cette adresse).
 *
 * En local : stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
import { NextResponse } from "next/server";
import { constructStripeEvent, isStripeConfigured } from "@/lib/services/stripe";
import { handleStripeEvent } from "@/lib/services/payments";

export async function POST(request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Webhook Stripe non configuré." }, { status: 400 });
  }

  // Le corps doit être lu en TEXTE BRUT : la signature est calculée sur ce texte exact
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (error) {
    console.error("[Stripe] Signature du webhook invalide :", error.message);
    return NextResponse.json({ message: "Signature invalide." }, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    console.error("[Stripe] Erreur pendant le traitement du webhook :", error);
    // Code 500 : Stripe réessaiera plus tard automatiquement
    return NextResponse.json({ message: "Erreur de traitement." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
