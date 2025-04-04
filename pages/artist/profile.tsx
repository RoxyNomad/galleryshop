import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { ArtistInfo } from "@/services/types"; // Ensure this type is correctly defined
import styles from "@/styles/artists/profile.module.scss";
import Image from "next/image";
import Sidebar from '@/components/ArtistSidebar';
import Link from "next/link";

// Main functional component for the artist profile page
const ArtistProfile: NextPage & { disableHeader?: boolean } = () => {
  // Using session hook to get user session
  const session = useSession();

  // Setting up state variables to manage artist data and form fields
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const [newPortfolioUrl, setNewPortfolioUrl] = useState<string>("");
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect hook to load the artist data when the session changes
  useEffect(() => {
    const loadArtistData = async () => {
      // Ensures user is logged in before fetching the artist data
      if (!session?.user?.id) return;

      // Fetching artist information from Supabase
      const { data: artistData, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', session.user.id)
        .limit(1) // Ensure only one row is returned
        .maybeSingle(); // Prevents error if no row exists

      if (error) {
        console.error('Fehler beim Laden der Künstlerdaten:', error.message);
        return;
      }

      // If no artist data is found, display a warning
      if (!artistData) {
        console.warn("Kein Künstlerprofil gefunden.");
        return;
      }

      // Set the artist data into the state variables
      setArtistInfo(artistData);
      setNewName(artistData.artist_name || "");
      setNewBio(artistData.bio || "");
      setNewPortfolioUrl(artistData.portfolio_url || "");
    };

    loadArtistData();
  }, [session]);

  // Function to toggle edit mode for profile
  const handleEditProfile = () => {
    if (editing) {
      // If already in edit mode, exit edit mode and reset values
      setEditing(false);
      setNewName(artistInfo?.artist_name || "");
      setNewBio(artistInfo?.bio || "");
      setNewPortfolioUrl(artistInfo?.portfolio_url || "");
      setNewProfileImage(null);
      setNewCoverImage(null);
    } else {
      // Enable edit mode if not already in edit mode
      setEditing(true);
    }
  };

  // Function to save changes made to the profile
  const handleSaveProfile = async () => {
    setLoading(true);

    // Function to check the validity of image types
    const isValidImage = (file: File) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      return allowedTypes.includes(file.type);
    };

    try {
      // Object to hold updated artist information
      const updates: { artist_name: string; bio: string; portfolio_url: string; profile_image_url?: string | null; cover_image_url?: string | null } = {
        artist_name: newName,
        bio: newBio,
        portfolio_url: newPortfolioUrl
      };

      // Function to upload an image to Supabase
      const uploadImage = async (file: File, path: string) => {
        console.log("Dateityp prüfen:", file.type);
        if (!isValidImage(file)) {
          alert("Ungültiger Dateityp. Nur JPEG- und PNG-Bilder sind erlaubt.");
          return null;
        }

        const { data, error } = await supabase
          .storage
          .from('artist_images')
          .upload(path, file, { upsert: true });

        if (error) {
          console.error("Fehler beim Hochladen:", error.message);
          alert("Fehler beim Hochladen des Bildes: " + error.message);
          return null;
        }
        console.log("Hochgeladene Datei:", data);
        return supabase.storage.from('artist_images').getPublicUrl(data.path).data.publicUrl;
      };

      // Upload profile and cover images if provided
      if (newProfileImage) {
        updates.profile_image_url = await uploadImage(newProfileImage, `profile_images/${session?.user?.id}.jpg`);
      }
      if (newCoverImage) {
        updates.cover_image_url = await uploadImage(newCoverImage, `cover_images/${session?.user?.id}.jpg`);
      }

      // Update the artist data in Supabase
      const { error } = await supabase
        .from('artists')
        .update(updates);

      // Update local state with the new data
      setArtistInfo((prev) => prev ? ({ ...prev, ...updates }) : null);

      if (error) {
        alert("Fehler beim Speichern: " + error.message);
        setLoading(false);
        return;
      }

      setEditing(false);
    } catch (error) {
      console.error("Fehler beim Hochladen der Bilder:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle image click and open the image in a new tab
  const handleImageClick = (url: string) => window.open(url, '_blank');

  return (
    <div>
      <Sidebar />
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          {artistInfo ? (
            <>
              <div className={styles.profileHeader}>
                <h1>Dein Profil</h1>
                <button className={styles.editButton} onClick={handleEditProfile}>
                  {editing ? "Abbrechen" : "Profil bearbeiten"}
                </button>
              </div>

              {editing ? (
                <div className={styles.editProfileForm}>
                  <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.editInput} />
                  <textarea placeholder="Bio" value={newBio} onChange={(e) => setNewBio(e.target.value)} className={styles.editTextarea} />
                  <input type="url" placeholder="Portfolio URL" value={newPortfolioUrl} onChange={(e) => setNewPortfolioUrl(e.target.value)} className={styles.editInput} />
                  <input type="file" accept="image/*" onChange={(e) => setNewProfileImage(e.target.files ? e.target.files[0] : null)} />
                  <input type="file" accept="image/*" onChange={(e) => setNewCoverImage(e.target.files ? e.target.files[0] : null)} />
                  <button className={styles.editSaveButton} onClick={handleSaveProfile} disabled={loading}>
                    {loading ? "Speichert..." : "Speichern"}
                  </button>
                </div>
              ) : (
                <div className={styles.profileInfo}>
                  <div className={styles.imagesContainer}>
                    {artistInfo.profile_image_url && (
                      <div className={styles.profileImageContainer}>
                        <p className={styles.profileImageTitle}>Profilbild</p>
                        <Image 
                          src={artistInfo.profile_image_url} 
                          alt="Profilbild" 
                          className={styles.profileImage} 
                          onClick={() => handleImageClick(artistInfo.profile_image_url as string)} 
                          width={250} 
                          height={250}/>
                      </div>
                    )}
                    {artistInfo.cover_image_url && (
                      <div className={styles.coverImageContainer}>
                        <p className={styles.coverImageTitle}>Titelbild</p>
                        <Image 
                          src={artistInfo.cover_image_url} 
                          alt="Titelbild" 
                          className={styles.coverImage} 
                          onClick={() => handleImageClick(artistInfo.cover_image_url as string)} 
                          width={250} 
                          height={125}/>
                      </div>
                    )}
                  </div>
                  <p><strong>Name</strong><br />{artistInfo.artist_name}</p>
                  <p className={styles.profileInfoBio}><strong>Bio</strong><br />{artistInfo.bio}</p>
                  <p><strong>Portfolio</strong><br />
                    <Link 
                      className={styles.profileInfoLink} 
                      href={artistInfo.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer">
                        {artistInfo.portfolio_url}
                    </Link>
                  </p>
                </div>
              )}
            </>
          ) : (
            <p>Lade Künstlerprofil...</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Disable header for this page
ArtistProfile.disableHeader = true;

export default ArtistProfile;
