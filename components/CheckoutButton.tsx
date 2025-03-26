import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/utils/supabaseClient"; // Dein Supabase-Client
import styles from '@/styles/customer/checkoutButton.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY!);

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Fehlerzustand hinzufügen

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (data) {
            setUserId(data.id);
          } else {
            console.error("Benutzer nicht gefunden in der 'users' Tabelle", error);
            setError("Benutzer konnte nicht gefunden werden.");
          }
        } else {
          console.error("Benutzer ist nicht authentifiziert");
          setError("Benutzer ist nicht authentifiziert.");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten", error);
        setError("Fehler beim Abrufen der Benutzerdaten.");
      }
    };

    fetchUserId();
  }, []);

  const handleCheckout = async () => {
    if (!userId) {
      console.error("Benutzer ist nicht authentifiziert");
      setError("Benutzer ist nicht authentifiziert.");
      return;
    }

    setLoading(true);
    setError(null); // Fehler zurücksetzen vor dem Checkout
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const { sessionId, error } = await res.json();

      if (error) {
        setError(error); // Setze die Fehlermeldung von der API
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        setError("Fehlende sessionId oder Stripe-Objekt.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout-Fehler:", error);
      setError("Fehler beim Checkout-Prozess.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={styles.checkoutButton}
      >
        {loading ? "Lädt..." : "Jetzt kaufen"}
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>} {/* Fehlermeldung anzeigen */}
    </div>
  );
}
