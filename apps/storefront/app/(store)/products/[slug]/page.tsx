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

  const originalPrice = Math.round(product.price * 2.2);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">

      <div className="grid md:grid-cols-2 gap-12">

        {/* Product Image */}
        <div>

          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl border"
          />

        </div>

        {/* Product Info */}
        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">

            <span className="text-3xl font-bold text-red-500">
              ₹{product.price}
            </span>

            <span className="line-through text-gray-400">
              ₹{originalPrice}
            </span>

          </div>

          <p className="text-green-600 font-semibold mt-2">
            In Stock
          </p>

          <p className="mt-6 text-gray-600">
            Premium quality stationery product.
            Perfect for school, college, office,
            and everyday writing needs.
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-8">

            <button className="border px-4 py-2 rounded">
              -
            </button>

            <span>1</span>

            <button className="border px-4 py-2 rounded">
              +
            </button>

          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">

            <Button
              className="
                bg-red-500
                hover:bg-red-600
              "
            >
              Add To Cart
            </Button>

            <Button variant="outline">
              Buy Now
            </Button>

          </div>

          {/* Product Details */}
          <div className="mt-10">

            <h3 className="text-xl font-bold mb-4">
              Product Details
            </h3>

            <ul className="space-y-2 text-gray-600">

              <li>✓ Premium Quality Material</li>
              <li>✓ Genuine Product</li>
              <li>✓ Fast Shipping</li>
              <li>✓ Ideal For Daily Use</li>

            </ul>

          </div>

        </div>

      </div>

    </main>
  );
}