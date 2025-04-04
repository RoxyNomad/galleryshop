import Stripe from "stripe";  // Import Stripe library
import { supabase } from "@/utils/supabaseClient";  // Import Supabase client

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string, {
  apiVersion: "2025-02-24.acacia",  // Set the API version for Stripe
});

// Function to create a checkout session
export const createCheckoutSession = async (userId: string) => {
  try {
    console.log("🚀 Lade Warenkorb für User:", userId);  // Log user ID

    // Fetch cart items from the Supabase database
    const { data: cartItems, error } = await supabase
      .from("cart")
      .select("id, artwork_name, price, quantity")
      .eq("user_id", userId);

    // If there is an error fetching cart items, throw an error
    if (error) {
      throw new Error(`Fehler beim Abrufen des Warenkorbs: ${error.message}`);
    }

    // If the cart is empty, throw an error
    if (!cartItems || cartItems.length === 0) {
      throw new Error("❌ Warenkorb ist leer!");
    }

    console.log("🛒 Warenkorb:", cartItems);  // Log cart items

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],  // Payment method allowed
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "chf",  // Currency is Swiss Franc (CHF)
          product_data: { name: item.artwork_name },  // Product name from cart item
          unit_amount: Math.round(item.price * 100), // Price in cents (Stripe expects amounts in cents)
        },
        quantity: item.quantity,  // Quantity of the item
      })),
      mode: "payment",  // Payment mode for the session
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/success`,  // URL to redirect to after a successful payment
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/cancel`,  // URL to redirect to if payment is canceled
    });

    console.log("✅ Stripe-Session erstellt:", session.url);  // Log the session URL
    return session;  // Return the created session
  } catch (error) {
    console.error("Fehler beim Erstellen der Checkout-Session:", error); // Log error if something goes wrong
    throw new Error(error instanceof Error ? error.message : "Fehler bei der Stripe-API-Anfrage.");  // Throw error with a message
  }
};

