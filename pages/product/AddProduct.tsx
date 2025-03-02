// pages/product/AddProduct.tsx
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import ImageUploader from "@/components/ImageUploader";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  name: string;
  artist: string;
  price: string;
  image_url: string;
}

export default function AddProduct() {
  const [product, setProduct] = useState<Product>({
    name: "",
    artist: "",
    price: "",
    image_url: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrl: string) => {
    setProduct((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.from("products").insert([product]);

    if (error) console.error("Fehler beim Speichern:", error);
    else console.log("Produkt hinzugefügt:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Produktname" value={product.name} onChange={handleInputChange} required />
      <textarea name="description" placeholder="Beschreibung" value={product.artist} onChange={handleInputChange} />
      <input type="number" name="price" placeholder="Preis" value={product.price} onChange={handleInputChange} required />
    
      <ImageUploader onUpload={handleImageUpload} />
      {product.image_url && <Image src={product.image_url} alt="Produktbild" width={200} height={200} />}
      {product.image_url && <Image src={product.image_url} alt="Produktbild" width={200} height={200} />}
      
      <button type="submit">Produkt speichern</button>
    </form>
  );
}
