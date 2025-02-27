// pages/products.tsx
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

interface ProductsPageProps {
  products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  return (
    <div>
      <h1>Produkte</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Image src={product.image_url} alt={product.name} width={100} height={100} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Preis: {product.price} CHF</p>
            <Link href={`/product/${product.id}`}>
              <a>Produkt ansehen</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Fehler beim Abrufen der Produkte:", error.message);
    return { props: { products: [] } }; // Rückgabe einer leeren Liste bei Fehler
  }

  return {
    props: {
      products: data,
    },
  };
};
