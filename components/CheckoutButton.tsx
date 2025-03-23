import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import styles from '@/styles/customer/checkoutButton.module.scss'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Checkout Response:", res);
  
      if (!res.ok) {
        throw new Error(`Fehler bei der API-Anfrage: ${res.statusText}`);
      }
  
      const { sessionId } = await res.json();
      console.log("Session ID:", sessionId);
  
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Checkout-Fehler:", error);
    }
    setLoading(false);
  };  

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={styles.checkoutButton}
    >
      {loading ? "Lädt..." : "Jetzt kaufen"}
    </button>
  );
}
