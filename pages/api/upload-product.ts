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
    const { name, description, price, stock_quantity, image } = req.body;

    if (!name || !price || !stock_quantity || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 📌 1️⃣ Bild in Supabase Storage hochladen
    const fileName = `products/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, Buffer.from(image, "base64"), {
        contentType: "image/jpeg",
      });

    if (uploadError) throw uploadError;

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // 📌 2️⃣ Produkt in `products`-Tabelle speichern
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([{ name, description, price, stock_quantity, image_url: imageUrl }]);

    if (productError) throw productError;

    return res.status(200).json({ message: "Product added successfully!", product: productData });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
