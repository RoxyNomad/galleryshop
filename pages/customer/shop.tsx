import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/CustomerSidebar';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import styles from '@/styles/customer/shop.module.scss';
import { Artwork, CartItem } from '@/services/types'
import CheckoutButton from '@/components/CheckoutButton';

const Shop: NextPage & { disableHeader?: boolean } = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [sizes, setSizes] = useState<{ id: string; width: number; height: number; unit: string }[]>([]);
  const [frames, setFrames] = useState<{ id: string; name: string; material: string }[]>([]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [isSelectionOpen, setIsSelectionOpen] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Benutzer-ID aus der Session abrufen
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchCart(user.id);
        fetchWishlist(user.id);
      }
    };
    fetchUser();
  }, []);

  // Warenkorb aus der Datenbank abrufen
  const fetchCart = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart')
      .select('*, artworks(name)')
      .eq('user_id', userId);
    if (error) {
      console.error("Error fetching cart:", error);
    } else {
      setCart(data || []);
    }
  };

  // Wunschliste aus der Datenbank abrufen
  const fetchWishlist = async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, artworks(name)')
      .eq('user_id', userId);
    if (error) {
      console.error("Error fetching wishlist:", error);
    } else {
      setWishlist(data || []);
    }
  };

  // Größen und Rahmen aus der Supabase-Datenbank abrufen
  useEffect(() => {
    const fetchSizesAndFrames = async () => {
      const { data: sizeData, error: sizeError } = await supabase.from('sizes').select('*');
      if (sizeError) {
        console.error("Error fetching sizes:", sizeError);
      } else {
        setSizes(sizeData || []);
      }

      const { data: frameData, error: frameError } = await supabase.from('frames').select('*');
      if (frameError) {
        console.error("Error fetching frames:", frameError);
      } else {
        setFrames(frameData || []);
      }
    };

    fetchSizesAndFrames();
  }, []);

  // Daten aus Supabase abrufen
  useEffect(() => {
    const fetchArtworks = async () => {
      const { data, error } = await supabase.from('artworks').select('id, price, image_url, artist_id, category_id, name, base_color, created_at');
      if (error) {
        console.error("Error fetching artworks:", error);
      } else {
        setArtworks(data);
      }
    };
    fetchArtworks();
  }, []);

  // Artwork zum Warenkorb hinzufügen und Menge aktualisieren
  const handleAddToCart = async (artwork_id: string) => {
    if (!userId || !selectedSize || !selectedFrame) return;

    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('artwork_id', artwork_id)
      .eq('size_id', selectedSize)
      .eq('frame_id', selectedFrame)
      .single();

    if (existingItem) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('user_id', userId)
        .eq('artwork_id', artwork_id)
        .eq('size_id', selectedSize)
        .eq('frame_id', selectedFrame);
      if (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      const { error } = await supabase
        .from('cart')
        .insert([{ artwork_id, user_id: userId, size_id: selectedSize, frame_id: selectedFrame, quantity: 1 }]);
      if (error) {
        console.error("Error adding to cart:", error);
      }
    }

    fetchCart(userId);
    setIsSelectionOpen(false);  // Auswahl schließen
  };

  // Artwork zur Wunschliste hinzufügen und in Supabase speichern
  const addToWishlist = async (artwork_id: string) => {
    if (!userId) return;
    const { error } = await supabase.from('wishlist').insert([{ artwork_id, user_id: userId }]);
    if (error) {
      console.error("Error adding to wishlist:", error);
    } else {
      fetchWishlist(userId);
    }
  };

  return (
    <div className={styles.shopContainer}>
      <Sidebar />
      
      {/* Produkte anzeigen */}
      <div className={styles.productList}>
        {artworks.map((artwork) => (
          <div key={artwork.id} className={styles.productCard}>
            <Image 
              src={artwork.image_url} 
              alt="Artwork" 
              width={150} 
              height={150} 
              className={styles.productImage} 
            />
            <h3>{artwork.name}</h3>
            <p>{artwork.price} CHF</p>
            <button onClick={() => { setIsSelectionOpen(true); setSelectedArtwork(artwork); }} className={styles.addToButton}>
              Zum Warenkorb hinzufügen
            </button>
            <button onClick={() => addToWishlist(artwork.id)} className={styles.addToButton}>
              Zur Wunschliste hinzufügen
            </button>
          </div>
        ))}
      </div>

      {/* Auswahlmodal für Größe und Rahmen */}
      {isSelectionOpen && (
        <div className={styles.overlayContainer}>
          <div className={styles.cartOverlay}>
            <div className={styles.cartContent}>
              <button className={styles.closeButton} onClick={() => setIsSelectionOpen(false)}>✖</button>
              <h2>Wähle Größe und Rahmen</h2>

              {/* Größen-Auswahl */}
              <div className={styles.selectionGroup}>
                <label htmlFor="size">Größe wählen:</label>
                <select className={styles.selectionField} id="size" onChange={(e) => setSelectedSize(e.target.value || null)} value={selectedSize || ''}>
                  <option className={styles.selectionField} value="" disabled>Wählen Sie eine Größe</option>
                  {sizes.map((size) => (
                    <option className={styles.selectionField} key={size.id} value={size.id}>{size.width} x {size.height} {size.unit}</option>
                  ))}
                </select>
              </div>

              {/* Rahmen-Auswahl */}
              <div className={styles.selectionGroup}>
                <label htmlFor="frame">Rahmen wählen:</label>
                <select className={styles.selectionField} id="frame" onChange={(e) => setSelectedFrame(e.target.value)} value={selectedFrame || ''}>
                  <option className={styles.selectionField} value="" disabled>Wählen Sie einen Rahmen</option>
                  {frames.map((frame) => (
                    <option className={styles.selectionField} key={frame.id} value={frame.id}>{frame.name} ({frame.material})</option>
                  ))}
                </select>
              </div>
              <button onClick={() => selectedArtwork && handleAddToCart(selectedArtwork.id)} className={styles.addToButton}>Zum Warenkorb hinzufügen</button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist-Button */}
      <button className={styles.wishlistButton} onClick={() => setIsWishlistOpen(true)} aria-label="wishlist">
        <Image src='/icons/heart-icon.png' alt='wishlist icon' className={styles.buttonImage} width={18} height={18} />
      </button>

      {/* Wishlist-Overlay */}
      {isWishlistOpen && (
        <div className={styles.overlayContainer}>
          <div className={styles.cartOverlay}>
            <div className={styles.cartContent}>
              <button className={styles.closeButton} onClick={() => setIsWishlistOpen(false)}>✖</button>
              <h2>Wunschliste</h2>
              {wishlist.length === 0 ? <p>Keine Bilder auf der Wunschliste</p> : (
                <span className={styles.cartArticle}>
                  {wishlist.map((item, index) => (
                    <li className={styles.cartArticle} key={index}>{item.artwork_name}</li>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cart-Button */}
      <button className={styles.cartButton} onClick={() => setIsCartOpen(true)} aria-label="cart">
        <Image className={styles.buttonImage} src='/icons/shopping-cart-icon.png' alt='cart icon' width={18} height={18} />
      </button>

      {/* Warenkorb-Overlay */}
      {isCartOpen && (
        <div className={styles.overlayContainer}>
          <div className={styles.cartOverlay}>
            <div className={styles.cartContent}>
              <button className={styles.closeButton} onClick={() => setIsCartOpen(false)}>✖</button>
              <h2>Warenkorb</h2>
              {cart.length === 0 ? <p>Keine Bilder im Warenkorb</p> : (
                <p className={styles.cartArticle}>
                  {cart.map((item, index) => (
                    <span key={index} className={styles.spanContainer}>
                      <span className={styles.span1}>{item.artwork_name}</span>
                      <span className={styles.span2}>{item.quantity} Stück</span><br />
                    </span>
                  ))}
                </p>
              )}
              <CheckoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Shop.disableHeader = true;

export default Shop;
