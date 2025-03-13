import { useState, useEffect } from "react";
import Image from "next/image";
import { NextPage } from "next";
import styles from "@/styles/artists/artworks.module.scss";
import Sidebar from "@/components/ArtistSidebar";
import ImageUploader from "@/components/ImageUploader";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/utils/supabaseClient"; // Sicherstellen, dass du die Supabase Instanz korrekt importierst

interface Artwork {
  imageUrl: string;
  id: string; // ID des Artworks
}

const Artworks: NextPage & { disableHeader?: boolean } = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const session = useSession();

  const artistId = session?.user?.id; // Verwendet die artistId aus der Session

  // Lade die Kunstwerke des Künstlers bei der ersten Anzeige
  useEffect(() => {
    if (artistId) {
      // Hol dir die Kunstwerke des Künstlers aus der Datenbank
      const fetchArtworks = async () => {
        const { data, error } = await supabase
          .from('artworks')
          .select('id, image_url')
          .eq('artist_id', artistId); // Filter nach artistId
          
        if (error) {
          console.error('Error fetching artworks:', error);
        } else {
          setArtworks(data.map((artwork: { id: string; image_url: string }) => ({ id: artwork.id, imageUrl: artwork.image_url })));
        }
      };

      fetchArtworks();
    }
  }, [artistId]);

  // Wenn der Nutzer nicht eingeloggt ist, Anzeige eines Hinweises
  if (!session) {
    return <p>Bitte logge dich ein, um deine Kunstwerke zu sehen.</p>;
  }

  // Funktion, um das hochgeladene Bild in die Kunstwerke-Liste hinzuzufügen
  const handleUpload = async (imageUrl: string) => {
    if (artistId) {
      // Speichern des neuen Bildes in der Datenbank
      const { data, error } = await supabase
        .from('artworks')
        .insert([{ artist_id: artistId, image_url: imageUrl }])
        .select('id');

      if (error) {
        console.error('Error inserting artwork:', error);
      } else {
        // Das Bild wurde erfolgreich in der DB gespeichert
        if (data && data.length > 0) {
          setArtworks((prevArtworks) => [...prevArtworks, { imageUrl, id: data[0].id }]);
        }
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
                src={artwork.imageUrl}
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
