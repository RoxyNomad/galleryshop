import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from '@/styles/artists.module.scss';

interface Artist {
  id: number;
  artist_name: string;
  bio: string;
  portfolio_url: string;
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('id, artist_name, bio, portfolio_url');

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
          <h2>{artist.artist_name}</h2>
          <p>{artist.bio}</p>
          <a href={artist.portfolio_url} target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
        </div>
      ))}
    </div>
  );
};

export default Artists;
