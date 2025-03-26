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
    return res.status(400).json({ error: "Benutzer nicht gefunden" });
  }

  try {
    const stripeSession = await createCheckoutSession(userId); // Erstelle die Stripe-Sitzung mit der User-ID
    res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unbekannter Fehler" });
  }
}
