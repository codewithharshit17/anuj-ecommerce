import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = products.find(
    (p) => p.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">

      <div className="grid md:grid-cols-2 gap-12">

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-red-500 text-3xl font-bold mt-4">
            ₹{product.price}
          </p>

          <p className="mt-6 text-gray-600">
            Premium quality stationery product.
            Perfect for students, professionals,
            and daily use.
          </p>

          <Button
            className="
              mt-8
              bg-red-500
              hover:bg-red-600
            "
          >
            Add To Cart
          </Button>

        </div>

      </div>

    </main>
  );
}