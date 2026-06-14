import ProductCard from "./product-card";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-10">
        Featured Products
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={product.image}
            />
        ))}
      </div>
    </section>
  );
}