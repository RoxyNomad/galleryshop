// components/CheckoutButton.tsx
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutButtonProps {
  products: Product[];
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ products }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // Sende die Produkte an den Server, um eine Checkout-Session zu erstellen
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products }),
    });

    const { id } = await res.json();

    // Leite den Benutzer zum Stripe-Checkout weiter
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId: id });

    if (error) {
      console.error("Fehler beim Weiterleiten zu Stripe Checkout:", error);
    }

    setLoading(false);
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Wird geladen..." : "Jetzt Bezahlen"}
    </button>
  );
};

export default CheckoutButton;
