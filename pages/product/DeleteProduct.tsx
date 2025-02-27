// pages/product/DeleteProduct.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DeleteProduct() {
  const [productId, setProductId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!productId) return alert("Bitte eine Produkt-ID angeben");

    setIsDeleting(true);

    // **1. Bild aus dem Supabase Storage löschen**
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([`products/${productId}.jpg`]); // Hier verwendest du den Dateinamen entsprechend deiner Logik.

    if (storageError) {
      console.error("Fehler beim Löschen des Bildes:", storageError.message);
      setIsDeleting(false);
      return;
    }

    // **2. Produkt aus der Datenbank löschen**
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      console.error("Fehler beim Löschen des Produkts:", error.message);
      setIsDeleting(false);
      return;
    }

    alert("Produkt erfolgreich gelöscht!");
    setIsDeleting(false);
    setProductId(""); // Eingabefeld zurücksetzen
  };

  return (
    <div>
      <h2>Produkt löschen</h2>
      <input
        type="text"
        placeholder="Produkt-ID eingeben"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Löschen..." : "Produkt löschen"}
      </button>
    </div>
  );
}
