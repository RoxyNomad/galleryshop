import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from 'next';
import { supabase } from '@/utils/supabaseClient';
import styles from "@/styles/artists/profile.module.scss";
import Image from "next/image";
import Sidebar from '@/components/ArtistSidebar';
import Link from "next/link";

const ArtistProfile: NextPage & { disableHeader?: boolean } = () => {
  const session = useSession();
  interface ArtistInfo {
	artist_name: string;
	bio: string;
	portfolio_url: string;
	profile_image_url?: string | null;
	cover_image_url?: string | null;
  }

  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const [newPortfolioUrl, setNewPortfolioUrl] = useState<string>("");
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadArtistData = async () => {
      if (!session?.user?.id) return;

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

      if (!artistData) {
        console.warn("Kein Künstlerprofil gefunden.");
        return;
      }

      setArtistInfo(artistData);
      setNewName(artistData.artist_name || "");
      setNewBio(artistData.bio || "");
      setNewPortfolioUrl(artistData.portfolio_url || "");
    };

    loadArtistData();
  }, [session]);

	const handleEditProfile = () => {
    if (editing) {
      // Wenn bereits im Bearbeitungsmodus, auf falsches Zustand setzen
      setEditing(false);
      // Optional: Hier kannst du auch die Werte wieder auf die ursprünglichen zurücksetzen, falls du das möchtest
      setNewName(artistInfo?.artist_name || "");
      setNewBio(artistInfo?.bio || "");
      setNewPortfolioUrl(artistInfo?.portfolio_url || "");
      setNewProfileImage(null);
      setNewCoverImage(null);
    } else {
      // Wenn nicht im Bearbeitungsmodus, Bearbeitung aktivieren
      setEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    // Funktion zur Überprüfung der Dateitypen
    const isValidImage = (file: File) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      return allowedTypes.includes(file.type);
    };

    try {
	  const updates: { artist_name: string; bio: string; portfolio_url: string; profile_image_url?: string | null; cover_image_url?: string | null } = {
        artist_name: newName,
        bio: newBio,
        portfolio_url: newPortfolioUrl
      };

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
			

      if (newProfileImage) {
        updates.profile_image_url = await uploadImage(newProfileImage, `profile_images/${session?.user?.id}.jpg`);
      }
      if (newCoverImage) {
        updates.cover_image_url = await uploadImage(newCoverImage, `cover_images/${session?.user?.id}.jpg`);
      }

      const { error } = await supabase
        .from('artists')
        .update(updates)
	  setArtistInfo((prev) => prev ? ({ ...prev, ...updates }) : null);

      if (error) {
        alert("Fehler beim Speichern: " + error.message);
        setLoading(false);
        return;
      }

	  setArtistInfo((prev: ArtistInfo | null) => prev ? ({ ...prev, ...updates }) : null);
      setEditing(false);
    } catch (error) {
      console.error("Fehler beim Hochladen der Bilder:", error);
    } finally {
      setLoading(false);
    }
  };

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
													onClick={() => handleImageClick(artistInfo.profile_image_url)} 
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
													onClick={() => handleImageClick(artistInfo.cover_image_url)} 
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

ArtistProfile.disableHeader = true;

export default ArtistProfile;
