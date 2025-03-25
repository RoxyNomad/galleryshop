import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "✔️ Geladen" : "❌ Fehlt!");

export const createCheckoutSession = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: { name: "Dein Produkt" },
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log("Stripe-Session erstellt:", session);
    return session;
  } catch (error) {
    console.error("Stripe API Fehler:", error);
    throw new Error("Fehler bei der Stripe-API-Anfrage.");
  }
};

