import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import styles from "@/styles/artistDashboard.module.scss";

interface Category {
  id: string;
  name: string;
}

interface Props {
  onUpload: (imageUrl: string) => void;
  artistId?: string; // Optionally passed as a prop
}

export default function ImageUploader({ onUpload, artistId }: Props) {
  const session = useSession(); // Gets the current session!

  // If artistId is not passed as a prop, fallback to the session artist ID
  const userArtistId = artistId || session?.user?.id;

  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [baseColor, setBaseColor] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically load Supabase
    const loadSupabase = async () => {
      const { supabase } = await import('@/utils/supabaseClient');
      const { data, error } = await supabase.from("categories").select("id, name");

      if (error) {
        console.error("Fehler beim laden der Kategorien:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    loadSupabase();
  }, []);

  if (!userArtistId) {
    return <p>Artist ID nicht verfügbar. Bitte logge dich ein.</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  
    if (!session) {
      alert("Sie müssen eingeloggt sein um ein Bild hoch zu laden.");
      return;
    }
  
    if (!selectedFile || !selectedCategory || !name || !baseColor || !price) {
      alert("Bitte fülle alle Felder aus und wähle eine Datei.");
      return;
    }
  
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Bitte gib einen gültigen Preis ein.");
      return;
    }
  
    setUploading(true);
    const fileName = `${Date.now()}_${selectedFile.name}`;
  
    const { supabase } = await import('@/utils/supabaseClient');
  
    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(fileName, selectedFile);
  
    if (uploadError) {
      console.error("Upload error:", uploadError);
      setErrorMessage('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
  
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${fileName}`;
  
    // Wenn die Session vorhanden ist, wird der artist_id vom Benutzer gezogen
    const userArtistId = session.user.id; // Assuming user.id is a valid UUID
  
    console.log("Artist ID:", userArtistId); // Überprüfe den Wert
  
    const { error: insertError } = await supabase.from("artworks").insert([
      {
        name,
        base_color: baseColor,
        price: parsedPrice,
        created_at: new Date().toISOString(),
        image_url: imageUrl,
        category_id: selectedCategory,
        artist_id: userArtistId, // Ändere hier artist_id auf id, da das der richtige Name ist
      },
    ]);
  
    if (insertError) {
      console.error("Insert error:", insertError);
      setErrorMessage('Error saving to database: ' + insertError.message);
      setUploading(false);
      return;
    }
  
    setSuccessMessage('Bild erfolgreich hochgeladen und gespeichert!');
    onUpload(imageUrl);
    setName("");
    setBaseColor("");
    setPrice("");
    setSelectedCategory("");
    setSelectedFile(null);
    setUploading(false);
  };
  

  return (
    <div className={styles.uploadContainer}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <input
        className={styles.uploadContainerInput}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className={styles.uploadContainerInput}
        type="text"
        placeholder="Farbe"
        value={baseColor}
        onChange={(e) => setBaseColor(e.target.value)}
        required
      />
      <input
        className={styles.uploadContainerInput}
        type="number"
        placeholder="Preis"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <select
        className={styles.uploadContainerInput}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
      >
        <option className={styles.uploadContainerOption} value="" disabled>
          Wähle eine Kategorie
        </option>
        {categories.map((category) => (
          <option
            className={styles.uploadContainerOption}
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <input
        className={styles.uploadContainerInput5}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        required
      />

      <button
        className={styles.uploadButton}
        onClick={handleUpload}
        disabled={uploading || !session}
      >
        {uploading ? "Hochladen..." : "Hochladen"}
      </button>
    </div>
  );
}
