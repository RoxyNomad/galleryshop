export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "offen" | "versendet" | "storniert"; // Beispiel-Status
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  quantity: number;
  price: number;
  artwork_id: number;
}

export interface CartItem {
  artwork_id: string;
  user_id: string;
  size_id: string;
  frame_id: string;
  quantity: number;
  artwork_name: string;
}

export interface Artwork {
  id: string;
  artist_id: string;
  category_id: string;
  name: string;
  base_color: string;
  price: number;
  created_at: string;
  image_url: string;
}

export interface SelectionBarProps {
  handleSortChange: (option: string) => void;
  handleColorChange: (color: string) => void;
  selectedOption: string;
  sortOptions: string[];
  pictures: Artwork[]; // Add the pictures property
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

export interface Product {
  name: string;
  artist: string;
  price: string;
  image_url: string;
  description: string;
}

export interface ProductPageProps {
  product: Product | null;
}