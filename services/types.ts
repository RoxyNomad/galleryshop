// Interface for representing an order
export interface Order {
  id: string;  // Unique identifier for the order
  name: string;  // Name of the order
  customer: string;  // Customer who placed the order
  amount: number;  // Total amount of the order
  status: "Bestellt" | "Verschickt" | "Zugestellt";  // Order status (Ordered, Shipped, Delivered)
  created_at: string;  // Date and time when the order was created
}

// Interface for representing an order item
export interface OrderItem {
  id: number;  // Unique identifier for the order item
  order_id: number;  // Reference to the order it belongs to
  quantity: number;  // Quantity of the item in the order
  price: number;  // Price of the item
  artwork_id: number;  // Reference to the artwork
}

// Interface for representing a cart item
export interface CartItem {
  artwork_id: string;  // Unique identifier for the artwork
  user_id: string;  // Reference to the user who added the item to the cart
  size_id: string;  // Reference to the selected size
  frame_id: string;  // Reference to the selected frame
  quantity: number;  // Quantity of the item
  artwork_name: string;  // Name of the artwork
  price: number;  // Price of a single item
  total_price: number;  // Total price for the quantity of items
}

// Interface for representing an artwork
export interface Artwork {
  id: string;  // Unique identifier for the artwork
  artist_id: string;  // Reference to the artist of the artwork
  category_id: string;  // Reference to the category of the artwork
  name: string;  // Name of the artwork
  base_color: string;  // Base color of the artwork
  price: number;  // Price of the artwork
  created_at: string;  // Date and time when the artwork was created
  image_url: string;  // URL of the artwork's image
}

// Interface for representing a picture
export interface Picture {
  id: string;  // Unique identifier for the picture
  name: string;  // Name of the picture
  image_url: string;  // URL of the picture
}

// Interface for representing a category of artwork
export interface Category {
  id: string;  // Unique identifier for the category
  name: string;  // Name of the category
}

// Interface for representing an artist
export interface Artist {
  id: number;  // Unique identifier for the artist
  artist_name: string;  // Name of the artist
  bio: string;  // Biography of the artist
  portfolio_url: string;  // URL of the artist's portfolio
  profile_image_url: string | null;  // URL of the artist's profile image (can be null)
  cover_image_url: string | null;  // URL of the artist's cover image (can be null)
}

// Interface for representing artist information with optional profile and cover images
export interface ArtistInfo {
  artist_name: string;  // Name of the artist
  bio: string;  // Biography of the artist
  portfolio_url: string;  // URL of the artist's portfolio
  profile_image_url?: string | null;  // Optional profile image URL
  cover_image_url?: string | null;  // Optional cover image URL
}

// Interface for the props of the upload component
export interface Props {
  onUpload: (imageUrl: string) => void;  // Function to handle image upload
  artistId?: string;  // Optional artist ID
}

// Interface for the props of the selection bar component
export interface SelectionBarProps {
  handleSortChange: (option: string) => void;  // Function to handle sorting option change
  handleColorChange: (color: string) => void;  // Function to handle color change
  selectedOption: string;  // The currently selected sorting option
  sortOptions: string[];  // List of available sorting options
  pictures: Artwork[];  // List of artwork pictures
}

// Interface for representing a message
export interface Message {
  id: string;  // Unique identifier for the message
  sender_id: string;  // Sender of the message
  receiver_id: string;  // Receiver of the message
  message: string;  // The content of the message
  created_at: string;  // Date and time when the message was created
  is_read: boolean;  // Indicates if the message has been read
}

// Interface for representing a product
export interface Product {
  name: string;  // Name of the product
  artist: string;  // Artist of the product
  price: string;  // Price of the product
  image_url: string;  // URL of the product's image
  description: string;  // Description of the product
}

// Interface for the props of the product page component
export interface ProductPageProps {
  product: Product | null;  // The product to display (could be null if not found)
}

// Interface for login response
export interface LoginResponse {
  user?: { id: string; email?: string; user_type?: string };  // User data if login is successful
  error?: string | null;  // Error message if login fails
}

// Define the message structure (different from the previous message interface)
export interface UserMessage {
  id: string;  // Unique identifier for the message
  sender_id: string;  // Sender's unique identifier
  receiver_id: string;  // Receiver's unique identifier
  message: string;  // The content of the message
}

// Define the user structure
export interface User {
  id: string;  // Unique identifier for the user
  name: string;  // Name of the user
  email: string;  // Email address of the user
}
