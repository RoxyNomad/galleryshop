// pages/cart.tsx
import CheckoutButton from "@/components/CheckoutButton";

const CartPage = () => {
  const products = [
    { id: "1", name: "Produkt A", price: 20, quantity: 1 },
    { id: "2", name: "Produkt B", price: 15, quantity: 2 },
  ];

  return (
    <div>
      <h1>Warenkorb</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.quantity} x {product.price} CHF
          </li>
        ))}
      </ul>
      <CheckoutButton products={products} />
    </div>
  );
};

export default CartPage;
