import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract base64-encoded image from request body
    const { image } = req.body; // Bild als Base64-String
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Generate a unique filename based on timestamp
    const fileName = `products/${Date.now()}.jpg`;

    // Upload the image to Supabase Storage in the "product-images" bucket
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, Buffer.from(image, "base64"), {
        contentType: "image/jpeg", // Define MIME type
      });

    // Throw error if upload fails
    if (error) throw error;

    // Construct public URL for the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // Return the image URL as response
    return res.status(200).json({ imageUrl });
  } catch (error: unknown) {
    // Handle any unexpected errors
    return res.status(500).json({ error: (error as Error).message });
  }
}

