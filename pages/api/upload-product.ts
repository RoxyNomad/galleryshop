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
    // Destructure required fields from request body
    const { name, description, price, stock_quantity, image } = req.body;

    // Validate presence of required fields
    if (!name || !price || !stock_quantity || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 📌 1️⃣ Upload image to Supabase Storage
    const fileName = `products/${Date.now()}.jpg`; // Generate unique file name
    const { error: uploadError } = await supabase.storage
      .from("product-images") // Target storage bucket
      .upload(fileName, Buffer.from(image, "base64"), {
        contentType: "image/jpeg", // Define content type
      });

    // Handle possible upload error
    if (uploadError) throw uploadError;

    // Construct public image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // 📌 2️⃣ Insert new product into `products` table
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([{ name, description, price, stock_quantity, image_url: imageUrl }]);

    // Handle insertion error
    if (productError) throw productError;

    // Respond with success message and inserted product data
    return res.status(200).json({ message: "Product added successfully!", product: productData });
  } catch (error: unknown) {
    // Catch any unexpected errors and respond with error message
    return res.status(500).json({ error: (error as Error).message });
  }
} 

