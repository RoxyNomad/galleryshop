import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET requests
  if (req.method === "GET") {
    const userId = req.query.userId as string; // Extract userId from query parameters

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ error: "userId ist erforderlich" });
    }

    // Fetch messages where the user is either sender or receiver
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false }); // Order messages by creation date (newest first)

    // Handle errors from Supabase
    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    // Return fetched messages
    return res.status(200).json(data);
  }

  // Handle POST requests
  if (req.method === "POST") {
    const { sender_id, receiver_id, message } = req.body; // Extract message data from request body

    // Validate required fields
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

    // Insert a new message into the database
    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender_id, receiver_id, message }]);

    // Handle errors from Supabase
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Return the inserted message
    return res.status(200).json(data);
  }

  // Handle unsupported HTTP methods
  return res.status(405).json({ error: "Methode nicht erlaubt" });
} 
