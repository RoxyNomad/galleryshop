import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  onUpload: (imageUrl: string) => void; // ✅ Erwartet eine URL als Callback
}

export default function ImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 🔹 Dateiname mit Zeitstempel erstellen
    const fileName = `products/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      console.error("Fehler beim Hochladen:", error.message);
      setUploading(false);
      return;
    }

    // 🔹 URL des hochgeladenen Bildes generieren
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // ✅ Bild-URL an `onUpload` übergeben
    onUpload(imageUrl);

    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Hochladen...</p>}
    </div>
  );
}
