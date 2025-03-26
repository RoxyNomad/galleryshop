import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/utils/supabaseClient"; // Dein Supabase-Client
import styles from '@/styles/customer/checkoutButton.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Supabase-Session abrufen und UserID aus der Tabelle 'users' holen
    const fetchUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        // User-ID aus der Supabase-Session holen und dann in der 'users'-Tabelle nach weiteren Daten suchen
        const { data, error } = await supabase
          .from("users")
          .select("id") // Hier gehst du davon aus, dass die User-ID in der 'users' Tabelle gespeichert ist
          .eq("id", session.user.id) // Wir nehmen an, dass die `id` der Supabase-Session mit der User-ID übereinstimmt
          .single();

        if (data) {
          setUserId(data.id); // Setze die Benutzer-ID
        } else {
          console.error("Benutzer nicht gefunden in der 'users' Tabelle", error);
        }
      } else {
        console.error("Benutzer ist nicht authentifiziert");
      }
    };

    fetchUserId();
  }, []);

  const handleCheckout = async () => {
    if (!userId) {
      console.error("Benutzer ist nicht authentifiziert");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // Übergebe die userId zur API
      });

      const { sessionId } = await res.json();

      const stripe = await stripePromise;
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error("Fehlende sessionId oder Stripe-Objekt.");
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
