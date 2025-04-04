import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Category, Props } from "@/services/types";
import styles from "@/styles/artists/artworks.module.scss";

export default function ImageUploader({ onUpload, artistId }: Props) {
  // Get the current session using Supabase authentication
  const session = useSession();

  // Get the artist ID (either from props or session)
  const userArtistId = artistId || session?.user?.id;

  // State hooks to manage form data and statuses
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

  // useEffect hook to fetch categories from the Supabase database on component mount
  useEffect(() => {
    const loadSupabase = async () => {
      const { supabase } = await import('@/utils/supabaseClient');
      // Fetch categories from the database
      const { data, error } = await supabase.from("categories").select("id, name");

      if (error) {
        console.error("Fehler beim Laden der Kategorien:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    loadSupabase();
  }, []);

  // Check if user artist ID exists, if not show a message to login
  if (!userArtistId) {
    return <p>Künstler ID ist nicht verfügbar. Bitte melden Sie sich an.</p>;
  }

  // Handle file change when a user selects a file for upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Handle category change when a user selects a category from the dropdown
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setNewCategory(""); // Reset newCategory field if a category is selected
  };

  // Handle the upload process when the user clicks the upload button
  const handleUpload = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    
    // Check if the user is logged in before proceeding
    if (!session) {
      alert("Sie müssen angemeldet sein um ein Bild hochzuladen.");
      return;
    }

    // Validate the required fields and selected file
    if (!selectedFile || (!selectedCategory && !newCategory) || !name || !baseColor || !price) {
      alert("Bitte füllen Sie alle Felder aus und wählen Sie eine Datei.");
      return;
    }

    // Validate price input
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Bitte geben Sie einen gültigen Preis ein.");
      return;
    }

    // Start the upload process and set uploading status
    setUploading(true);
    const fileName = `${Date.now()}_${selectedFile.name}`;
    
    const { supabase } = await import('@/utils/supabaseClient');
    
    // If a new category is provided, insert it into the database
    let categoryId = selectedCategory;
    if (newCategory) {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategory }])
        .select("id");
      
      if (error) {
        console.error("Error adding new category:", error.message);
        setErrorMessage("Fehler beim hinzufügen der Kategorie");
        setUploading(false);
        return;
      }

      // Get the category ID from the database and update the categories state
      categoryId = data?.[0]?.id || "";
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: categoryId, name: newCategory },
      ]);
    }

    // Upload the selected image to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setErrorMessage('Hochladen fehlgeschlagen: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // Generate the URL for the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${fileName}`;

    // Insert the artwork details into the 'artworks' table in Supabase
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
      console.error("Insert error:", insertError);
      setErrorMessage('Fehler beim speichern in die Datenbank: ' + insertError.message);
      setUploading(false);
      return;
    }

    // Set success message and notify parent component with the uploaded image URL
    setSuccessMessage('Bild erfolgreich hochgeladen!');
    onUpload(imageUrl);

    // Reset the form fields
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

      {/* Input fields for artwork details */}
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

      {/* Dropdown for selecting a category or adding a new one */}
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

      {/* Input for new category if selected */}
      {selectedCategory === "new" && (
        <input
          className={styles.uploadContainerInput}
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      )}

      {/* File input for selecting an image */}
      <input
        className={styles.uploadContainerInput5}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        required
      />

      {/* Upload button */}
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
