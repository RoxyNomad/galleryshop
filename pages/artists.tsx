import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from '@/styles/artists.module.scss';
import Image from 'next/image';  // Importiere Image für das Bild-Handling
import Link from 'next/link';

interface Artist {
  id: number;
  artist_name: string;
  bio: string;
  portfolio_url: string;
  profile_image_url: string | null;  // Füge die URL des Profilbildes hinzu
  cover_image_url: string | null;    // Füge die URL des Coverbildes hinzu
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      // Hole alle Künstler ohne Benutzerspezifische Filterung, einschließlich Bild-URLs
      const { data, error } = await supabase
        .from('artists')
        .select('id, artist_name, bio, portfolio_url, profile_image_url, cover_image_url');
  
      if (error) {
        console.error('Error fetching artists:', error);
      } else {
        setArtists(data);
      }
      setLoading(false);
    };
  
    fetchArtists();
  }, []);
  
  
  if (loading) return <p>Loading artists...</p>;
  if (artists.length === 0) return <p>No artists found.</p>;

  return (
    <div className={styles.artistContainer}>
      {artists.map((artist) => (
        <div key={artist.id} className={styles.artist}>
          <h2 className={styles.artistName}>{artist.artist_name}</h2>
          
          {/* Anzeigen des Profilbildes */}
          {artist.profile_image_url && (
            <div className={styles.profileImageContainer}>
              <Image
                src={artist.profile_image_url}
                alt={`${artist.artist_name}'s profile`}
                width={200}  // Setze eine passende Breite
                height={200} // Setze eine passende Höhe
                className={styles.profileImage}
              />
            </div>
          )}

          {/* Anzeigen des Coverbildes */}
          {artist.cover_image_url && (
            <div className={styles.coverImageContainer}>
              <Image
                src={artist.cover_image_url}
                alt={`${artist.artist_name}'s cover`}
                width={300}  // Setze eine passende Breite
                height={150} // Setze eine passende Höhe
                className={styles.coverImage}
              />
            </div>
          )}

          <p className={styles.artistBio}>{artist.bio}</p>
          <button className={styles.artistButton}>
            <Link className={styles.artistLink} href={artist.portfolio_url} target="_blank" rel="noopener noreferrer">
              Portfolio
            </Link>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Artists;
