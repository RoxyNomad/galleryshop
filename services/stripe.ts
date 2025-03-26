import Stripe from "stripe";
import { supabase } from "@/utils/supabaseClient";

// Stripe initialisieren
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

// Funktion, um den Checkout zu erstellen
export const createCheckoutSession = async (userId: string) => {
  try {
    console.log("🚀 Lade Warenkorb für User:", userId);

    // Warenkorb aus Supabase abrufen
    const { data: cartItems, error } = await supabase
      .from("cart")
      .select("id, artwork_name, price, quantity")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Fehler beim Abrufen des Warenkorbs: ${error.message}`);
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error("❌ Warenkorb ist leer!");
    }

    console.log("🛒 Warenkorb:", cartItems);

    // Stripe Checkout-Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "chf",
          product_data: { name: item.artwork_name },
          unit_amount: Math.round(item.price * 100), // Preis in Cent
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log("✅ Stripe-Session erstellt:", session.url);
    return session;
  } catch (error) {
    console.error("Fehler beim Erstellen der Checkout-Session:", error); // Detaillierter Fehler
    throw new Error("Fehler bei der Stripe-API-Anfrage.");
  }
  
};
