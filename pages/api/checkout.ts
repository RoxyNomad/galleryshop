import { NextApiRequest, NextApiResponse } from "next";
import { createCheckoutSession } from "@/services/stripe";

export const config = {
  api: {
    externalResolver: true, // Falls Next.js den Request nicht vollständig verarbeiten soll
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("API-Route wurde aufgerufen"); // Prüfen, ob API erreicht wird
    const session = await createCheckoutSession();
    if (!session) {
      throw new Error("Fehler: Stripe-Session ist null oder undefined.");
    }
    console.log("Erfolgreich Session erstellt:", session);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Fehler in checkout.ts:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}
