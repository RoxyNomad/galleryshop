import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient"; // Dein Supabase-Client
import { createCheckoutSession } from "@/services/stripe";

export const config = {
  api: {
    externalResolver: true, // Falls Next.js den Request nicht vollständig verarbeiten soll
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  // User ID aus dem Body der Anfrage holen
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Benutzer-ID fehlt" });
  }

  // Optional: Weitere Daten aus der 'users'-Tabelle abrufen, falls erforderlich
  const { error } = await supabase
    .from("users")
    .select("id, email, name") // Hier kannst du auch andere User-Daten abfragen
    .eq("id", userId)
    .single();

  if (error) {
    return res.status(400).json({ error: "Benutzer nicht gefunden", details: error });
  }

  try {
    const stripeSession = await createCheckoutSession(userId); // Erstelle die Stripe-Sitzung mit der User-ID

    // Prüfen, ob die Session korrekt erstellt wurde
    if (!stripeSession || !stripeSession.id) {
      return res.status(400).json({ error: "Fehlende Session ID von Stripe" });
    }

    // Falls die Session-ID vorhanden ist, sende sie zurück
    return res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    // Logge den Fehler detailliert auf dem Server
    console.error("Fehler bei der Erstellung der Stripe-Session:", error);

    // Fehlerbehandlung bei Stripe-Fehlern oder anderen Problemen
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unbekannter Fehler", details: error });
  }
}
