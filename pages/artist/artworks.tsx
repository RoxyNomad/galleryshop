import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/utils/supabaseClient"; // Make sure you're importing the Supabase instance correctly
import { Artwork } from '@/services/types'; // Ensure this path is correct
import Image from "next/image";
import styles from "@/styles/artists/artworks.module.scss";
import Sidebar from "@/components/ArtistSidebar";
import ImageUploader from "@/components/ImageUploader";

const Artworks: NextPage & { disableHeader?: boolean } = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const session = useSession();
  const artistId = session?.user?.id; // Use the artistId from the session

  // Load the artist's artworks on initial render
  useEffect(() => {
    if (artistId) {
      const fetchArtworks = async () => {
        const { data, error } = await supabase
          .from('artworks')
          .select('id, image_url, created_at, category_id, name, base_color, price')
          .eq('artist_id', artistId); // Filter by artistId
          
        if (error) {
          console.error('Error fetching artworks:', error);
        } else if (data) {
          setArtworks(
            data.map((artwork) => ({
              id: artwork.id,
              image_url: artwork.image_url, // Convert image_url from DB to imageUrl
              created_at: artwork.created_at || '',
              artist_id: artistId,
              category_id: artwork.category_id || null,
              name: artwork.name || '',
              base_color: artwork.base_color || '',
              price: artwork.price || 0
            }))
          );
        }
      };

      fetchArtworks();
    }
  }, [artistId]);

  // If the user is not logged in, show a message
  if (!session) {
    return <p>Bitte logge dich ein, um deine Kunstwerke zu sehen.</p>;
  }

  // Function to add the uploaded image to the artworks list
  const handleUpload = async (imageUrl: string) => {
    if (artistId) {
      // Save the new image to the database
      const { data, error } = await supabase
        .from('artworks')
        .insert([{ artist_id: artistId, image_url: imageUrl }])
        .select('id, created_at');

      if (error) {
        console.error('Error inserting artwork:', error);
      } else if (data && data.length > 0) {
        // If insert is successful, update the local state
        setArtworks((prevArtworks) => [
          ...prevArtworks,
          {
            id: data[0].id,
            image_url: imageUrl, // Ensure consistency
            created_at: data[0].created_at || '',
            artist_id: artistId,
            category_id: '',
            name: '',
            base_color: '',
            price: 0
          }
        ]);
      }
    }
  };

  return (
    <div>
      <Sidebar />
      <ImageUploader onUpload={handleUpload} artistId={artistId} />
      <div className={styles.artworksContainer}>
        {artworks.length === 0 ? (
          <p>Keine Kunstwerke vorhanden. Lade ein neues Bild hoch.</p>
        ) : (
          artworks.map((artwork) => (
            <div key={artwork.id}>
              <Image
                className={styles.picture}
                src={artwork.image_url} // Ensure correct key usage
                alt={`Artwork ${artwork.id}`}
                width={300}
                height={200}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

Artworks.disableHeader = true;

export default Artworks;

