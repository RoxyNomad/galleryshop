import { NextApiRequest, NextApiResponse } from "next";
import { createCheckoutSession } from "@/services/stripe";

export const config = {
  api: {
    externalResolver: true, // Falls Next.js den Request nicht vollständig verarbeiten soll
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🚀 API /checkout wurde aufgerufen");

  if (req.method !== "POST") {
    console.error("❌ Fehler: Falsche HTTP-Methode");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("API /checkout wurde aufgerufen."); // Debugging-Log
    const session = await createCheckoutSession();
    
    if (!session) {
      throw new Error("Stripe-Session konnte nicht erstellt werden.");
    }
    
    console.log("Checkout-Session erfolgreich erstellt:", session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout API Fehler:", error); // Detaillierter Log
    res.status(500).json({ error: (error as Error).message });
  }
}