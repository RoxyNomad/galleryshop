import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Sidebar from '@/components/ArtistSidebar';
import Image from 'next/image';
import styles from '@/styles/artists/orders.module.scss';
import { Artwork, OrderItem } from '@/services/types';

const ArtistOrders: NextPage & { disableHeader?: boolean } = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    const fetchArtworksAndOrders = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', user.id);

      if (artworksError) return console.error(artworksError);
      setArtworks(artworksData || []);

      const artworkIds = artworksData?.map(a => a.id) || [];
      if (artworkIds.length > 0) {
        const { data: ordersData, error: ordersError } = await supabase
          .from('order_items')
          .select('*')
          .in('artwork_id', artworkIds);

        if (ordersError) return console.error(ordersError);
        const groupedOrders = ordersData?.reduce((acc, order) => {
          acc[order.artwork_id] = [...(acc[order.artwork_id] || []), order];
          return acc;
        }, {});
        setOrders(groupedOrders || {});
      }
    };

    fetchArtworksAndOrders();
  }, []);

  return (
    <div className={styles.ordersPage}>
      <Sidebar />
      <div className={styles.ordersContainer}>
        {artworks.map(artwork => (
          <div key={artwork.id} className={styles.orderItem}>
            <Image src={artwork.image_url} alt={artwork.name} width={300} height={300} className={styles.orderImage} />
            <h3>{artwork.name}</h3>
            <h4>Bestellungen:</h4>
            {orders[artwork.id]?.length > 0 ? (
              <ul>
                {orders[artwork.id].map(order => (
                  <li key={order.id}>
                    Bestellung #{order.order_id} - Menge: {order.quantity} - Preis: {order.price}€
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Bestellungen</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ArtistOrders.disableHeader = true;

export default ArtistOrders;
