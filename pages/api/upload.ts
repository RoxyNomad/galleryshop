import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body; // Bild als Base64-String
    if (!image) return res.status(400).json({ error: "No image provided" });

    const fileName = `products/${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, Buffer.from(image, "base64"), {
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    return res.status(200).json({ imageUrl });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
