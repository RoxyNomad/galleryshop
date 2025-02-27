// pages/product/[id].tsx
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";
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

interface ProductPageProps {
  product: Product | null;
}

export default function ProductPage({ product }: ProductPageProps) {

  if (!product) {
    return <div>Produkt nicht gefunden</div>;
  }

  return (
    <div>
      <Image src={product.image_url} alt={product.name} width={300} height={300} />
      <Image src={product.image_url} alt={product.name} width={300} height={300} />
      <p>{product.description}</p>
      <p>Preis: {product.price} CHF</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single(); // `single()` gibt nur ein Ergebnis zurück

  if (error || !data) {
    return {
      notFound: true, // Produkt nicht gefunden, zeige 404
    };
  }

  return {
    props: {
      product: data,
    },
  };
};
