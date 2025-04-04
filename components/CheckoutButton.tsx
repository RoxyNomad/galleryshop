import { useState, useEffect } from "react"; // Import React hooks for state and side effects
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe library to load Stripe JS
import { supabase } from "@/utils/supabaseClient"; // Import the Supabase client for database interaction
import styles from '@/styles/customer/checkoutButton.module.scss'; // Import styles for the checkout button

// Load Stripe with the public test key (used to initiate Stripe checkout)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY!);

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false); // State for handling the loading state of the button
  const [userId, setUserId] = useState<string | null>(null); // State to store the user's ID
  const [error, setError] = useState<string | null>(null); // State for handling any error messages

  // useEffect hook to fetch the user's ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Fetch the session data from Supabase to get the authenticated user
        const { data: { session } } = await supabase.auth.getSession();
        
        // If the user is authenticated, fetch their user data from the "users" table
        if (session && session.user) {
          const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("id", session.user.id)
            .single();

          // If user data is found, set the user ID in state
          if (data) {
            setUserId(data.id);
          } else {
            // If no user is found in the "users" table, log error and set error state
            console.error("User not found in 'users' table", error);
            setError("User not found.");
          }
        } else {
          // If the user is not authenticated, log error and set error state
          console.error("User is not authenticated");
          setError("User is not authenticated.");
        }
      } catch (error) {
        // Catch any errors in the user fetching process and set the error state
        console.error("Error fetching user data", error);
        setError("Error fetching user data.");
      }
    };

    // Call the fetchUserId function to get the user ID
    fetchUserId();
  }, []);

  // Handle the checkout process
  const handleCheckout = async () => {
    // If no user ID is found, log error and set error state
    if (!userId) {
      console.error("User is not authenticated");
      setError("User is not authenticated.");
      return;
    }

    // Set the loading state to true and reset any previous errors
    setLoading(true);
    setError(null); // Reset error state before starting checkout

    try {
      // Make a POST request to your API to create a checkout session with the user ID
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // Parse the response from the API (sessionId and any potential error message)
      const { sessionId, error } = await res.json();

      // If there's an error from the API, set the error state and stop loading
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      // Load the Stripe object and if sessionId exists, redirect to Stripe checkout
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        // If sessionId or Stripe object is missing, set error state
        setError("Missing sessionId or Stripe object.");
        setLoading(false);
      }
    } catch (error) {
      // Catch any errors during the checkout process and set the error state
      console.error("Checkout error:", error);
      setError("Error during checkout process.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to trigger the checkout process, disables when loading */}
      <button
        onClick={handleCheckout} // Trigger checkout on button click
        disabled={loading} // Disable button while loading
        className={styles.checkoutButton}
      >
        {loading ? "Loading..." : "Buy Now"} {/* Show loading text if loading is true */}
      </button>

      {/* If there's an error, display it under the button */}
      {error && <p className={styles.errorMessage}>{error}</p>} {/* Display any error message */}
    </div>
  );
}
