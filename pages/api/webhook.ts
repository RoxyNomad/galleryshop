import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export const config = {
  api: {
    bodyParser: false, // Deaktiviert Next.js' JSON-Parser, damit Stripe den originalen Body erhält
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Fehlende Stripe-Signatur.");

  try {
    const rawBody = await getRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    console.log("Webhook Event empfangen:", event.type);
    
    res.json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }
}
