import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient"; // Your Supabase client instance
import { createCheckoutSession } from "@/services/stripe"; // Function to create a Stripe checkout session

// API route configuration
export const config = {
  api: {
    externalResolver: true, // Prevents Next.js from automatically handling the request resolution
  },
};

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { userId } = req.body; // Extract userId from request body

  // Validate the presence of userId
  if (!userId) {
    return res.status(400).json({ error: "Benutzer-ID fehlt" });
  }

  try {
    // Fetch user details from Supabase
    const { error } = await supabase
      .from("users")
      .select("id, email, name") // Select necessary fields
      .eq("id", userId) // Match the user ID
      .single(); // Ensure only one record is retrieved

    // If there's an error, return a response indicating the user was not found
    if (error) {
      return res.status(400).json({ error: "Benutzer nicht gefunden" });
    }

    // Create a Stripe checkout session
    const stripeSession = await createCheckoutSession(userId);
    
    // Validate that a session was created successfully
    if (!stripeSession || !stripeSession.id) {
      return res.status(400).json({ error: "Fehlende sessionId von Stripe" });
    }

    // Respond with the session ID
    res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    // Log and handle unexpected errors
    console.error("Fehler in der API:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unbekannter Fehler" });
  }
}
