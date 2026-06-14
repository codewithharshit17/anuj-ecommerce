import ProductCard from "@/components/store/product-card";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">

      <h1 className="text-4xl font-bold mb-10">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={product.image}
            />
        ))}

      </div>

    </main>
  );
}