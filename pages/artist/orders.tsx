import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Artwork, OrderItem } from '@/services/types'; // Types for Artwork and OrderItem
import { supabase } from '@/utils/supabaseClient'; // Supabase client for interacting with the database
import Image from 'next/image'; // Next.js Image component for optimized image loading
import Sidebar from '@/components/ArtistSidebar'; // Sidebar component for navigation
import styles from '@/styles/artists/orders.module.scss'; // Styles for the orders page


// ArtistOrders page component
const ArtistOrders: NextPage & { disableHeader?: boolean } = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]); // State to hold the artist's artworks
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({}); // State to hold orders grouped by artwork

  // Fetch artworks and orders when the component mounts
  useEffect(() => {
    const fetchArtworksAndOrders = async () => {
      // Get the current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return; // If there's an error or no user, exit early

      // Fetch the artist's artworks from the database
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', user.id);

      if (artworksError) return console.error(artworksError); // Handle any errors in fetching artworks
      setArtworks(artworksData || []); // Set artworks to the fetched data

      const artworkIds = artworksData?.map(a => a.id) || []; // Get artwork IDs
      if (artworkIds.length > 0) {
        // Fetch orders related to the fetched artworks
        const { data: ordersData, error: ordersError } = await supabase
          .from('order_items')
          .select('*')
          .in('artwork_id', artworkIds); // Fetch orders for specific artwork IDs

        if (ordersError) return console.error(ordersError); // Handle any errors in fetching orders

        // Group orders by artwork ID
        const groupedOrders = ordersData?.reduce((acc, order) => {
          acc[order.artwork_id] = [...(acc[order.artwork_id] || []), order];
          return acc;
        }, {});
        setOrders(groupedOrders || {}); // Set orders to the grouped data
      }
    };

    fetchArtworksAndOrders(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs only once on component mount

  return (
    <div className={styles.ordersPage}>
      {/* Sidebar component for navigation */}
      <Sidebar />
      
      <div className={styles.ordersContainer}>
        {/* Render each artwork and its associated orders */}
        {artworks.map(artwork => (
          <div key={artwork.id} className={styles.orderItem}>
            {/* Display artwork image */}
            <Image src={artwork.image_url} alt={artwork.name} width={300} height={300} className={styles.orderImage} />
            <h3>{artwork.name}</h3> {/* Display artwork name */}
            <h4>Bestellungen:</h4> {/* Heading for orders section */}
            
            {/* Render orders if there are any */}
            {orders[artwork.id]?.length > 0 ? (
              <ul>
                {orders[artwork.id].map(order => (
                  <li key={order.id}>
                    {/* Display order details */}
                    Bestellung #{order.order_id} - Menge: {order.quantity} - Preis: {order.price}€
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Bestellungen</p> // If no orders, show this message
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Disable header for this page
ArtistOrders.disableHeader = true;

export default ArtistOrders;
