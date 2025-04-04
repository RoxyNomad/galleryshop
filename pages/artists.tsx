import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Artist } from '@/services/types';  // Import the Artist type definition
import styles from '@/styles/artists.module.scss';
import Image from 'next/image';  // Import Image for image handling
import Link from 'next/link';


const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);  // State to hold artist data
  const [loading, setLoading] = useState(true);  // State to handle loading state

  useEffect(() => {
    const fetchArtists = async () => {
      // Fetch all artists without user-specific filtering, including image URLs
      const { data, error } = await supabase
        .from('artists')
        .select('id, artist_name, bio, portfolio_url, profile_image_url, cover_image_url');
  
      if (error) {
        console.error('Error fetching artists:', error);  // Handle error if any
      } else {
        setArtists(data);  // Set fetched artists data to state
      }
      setLoading(false);  // Stop loading once the data is fetched
    };
  
    fetchArtists();  // Call fetchArtists function on component mount
  }, []);
  
  // Display loading message while artists data is being fetched
  if (loading) return <p>Loading artists...</p>;

  // Display message if no artists are found
  if (artists.length === 0) return <p>No artists found.</p>;

  return (
    <div className={styles.artistContainer}>
      {artists.map((artist) => (
        <div key={artist.id} className={styles.artist}>
          <h2 className={styles.artistName}>{artist.artist_name}</h2>
          
          {/* Display profile image if available */}
          {artist.profile_image_url && (
            <div className={styles.profileImageContainer}>
              <Image
                src={artist.profile_image_url}
                alt={`${artist.artist_name}'s profile`}  // Alt text for image
                width={200}  // Set appropriate width for the image
                height={200} // Set appropriate height for the image
                className={styles.profileImage}
              />
            </div>
          )}

          {/* Display cover image if available */}
          {artist.cover_image_url && (
            <div className={styles.coverImageContainer}>
              <Image
                src={artist.cover_image_url}
                alt={`${artist.artist_name}'s cover`}  // Alt text for image
                width={300}  // Set appropriate width for the image
                height={150} // Set appropriate height for the image
                className={styles.coverImage}
              />
            </div>
          )}

          <p className={styles.artistBio}>{artist.bio}</p>
          <button className={styles.artistButton}>
            {/* Button to navigate to the artist's portfolio */}
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

