// Deine API-Route
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

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Benutzer-ID fehlt" });
  }

  try {
    const { error } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(400).json({ error: "Benutzer nicht gefunden" });
    }

    // Stripe-Session erstellen
    const stripeSession = await createCheckoutSession(userId); 
    if (!stripeSession || !stripeSession.id) {
      return res.status(400).json({ error: "Fehlende sessionId von Stripe" });
    }

    res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error("Fehler in der API:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unbekannter Fehler" });
  }
}
