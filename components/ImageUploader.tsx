import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import styles from "@/styles/artistDashboard.module.scss";

interface Category {
  id: string;
  name: string;
}

interface Props {
  onUpload: (imageUrl: string) => void;
  artistId?: string;
}

export default function ImageUploader({ onUpload, artistId }: Props) {
  const session = useSession();

  const userArtistId = artistId || session?.user?.id;

  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [baseColor, setBaseColor] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSupabase = async () => {
      const { supabase } = await import('@/utils/supabaseClient');
      const { data, error } = await supabase.from("categories").select("id, name");

      if (error) {
        console.error("Fehler beim Laden der Kategorien:", error.message);
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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setNewCategory(""); // Reset newCategory field if a category is selected
  };

  const handleUpload = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!session) {
      alert("Sie müssen eingeloggt sein, um ein Bild hochzuladen.");
      return;
    }

    if (!selectedFile || (!selectedCategory && !newCategory) || !name || !baseColor || !price) {
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
    
    // Wenn eine neue Kategorie eingegeben wurde, fügen wir sie der Datenbank hinzu
    let categoryId = selectedCategory;
    if (newCategory) {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategory }])
        .select("id");
      
      if (error) {
        console.error("Fehler beim Hinzufügen der neuen Kategorie:", error.message);
        setErrorMessage("Fehler beim Hinzufügen der Kategorie.");
        setUploading(false);
        return;
      }

      categoryId = data?.[0]?.id || "";
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: categoryId, name: newCategory },
      ]);
    }

    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error("Upload-Fehler:", uploadError);
      setErrorMessage('Upload fehlgeschlagen: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${fileName}`;

    const { error: insertError } = await supabase.from("artworks").insert([
      {
        name,
        base_color: baseColor,
        price: parsedPrice,
        created_at: new Date().toISOString(),
        image_url: imageUrl,
        category_id: categoryId,
        artist_id: userArtistId,
      },
    ]);

    if (insertError) {
      console.error("Insert-Fehler:", insertError);
      setErrorMessage('Fehler beim Speichern in der Datenbank: ' + insertError.message);
      setUploading(false);
      return;
    }

    setSuccessMessage('Bild erfolgreich hochgeladen und gespeichert!');
    onUpload(imageUrl);
    setName("");
    setBaseColor("");
    setPrice("");
    setSelectedCategory("");
    setNewCategory("");
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
        onChange={handleCategoryChange}
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
        <option className={styles.uploadContainerOption} value="new">
          Neue Kategorie hinzufügen
        </option>
      </select>

      {selectedCategory === "new" && (
        <input
          className={styles.uploadContainerInput}
          type="text"
          placeholder="Neue Kategorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      )}

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
