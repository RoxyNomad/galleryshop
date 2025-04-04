import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";

// Initialize Stripe client with secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

// Disable Next.js body parser to allow raw request body for Stripe verification
export const config = {
  api: {
    bodyParser: false, // Deaktiviert Next.js' JSON-Parser, damit Stripe den originalen Body erhält
  },
};

// API route handler for Stripe webhooks
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve Stripe signature from request headers
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Fehlende Stripe-Signatur.");

  try {
    // Get the raw body to verify the signature
    const rawBody = await getRawBody(req);

    // Construct Stripe event using the raw body and signature
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Log the event type for debugging
    console.log("Webhook Event empfangen:", event.type);

    // Send a success response to Stripe
    res.json({ received: true });
  } catch (err) {
    // Return an error if verification fails
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }
}
