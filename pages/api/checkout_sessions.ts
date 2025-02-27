// pages/api/checkout_sessions.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Stripe-Initialisierung mit deinem geheimen API-Schlüssel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Die Produktinformationen für den Checkout
      const products = req.body.products;

      // Erstelle eine Stripe-Checkout-Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((product: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: "usd", // Währung einstellen
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // Preis in Cent
          },
          quantity: product.quantity,
        })),
        mode: "payment", // Zahlung statt Abonnement
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`, // Erfolgs-URL nach der Zahlung
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`, // Stornierungs-URL
      });

      // Stripe-Session-ID zurückgeben
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
