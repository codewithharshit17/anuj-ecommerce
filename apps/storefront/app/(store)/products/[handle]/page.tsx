// apps/storefront/app/(store)/products/[handle]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronRight, Truck, RotateCcw, Shield, Check, ShoppingBag, CreditCard } from "lucide-react";
import { getMedusaClient, MedusaProduct } from "@/lib/medusa/client";
import ImageGallery from "@/components/store/product/ImageGallery";
import VariantSelector from "@/components/store/product/VariantSelector";
import QuantitySelector from "@/components/store/product/QuantitySelector";
import ProductTabs from "@/components/store/product/ProductTabs";
import ProductCard from "@/components/store/products/ProductCard";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/components/store/ui-store";
import { checkAuth } from "@/components/store/auth/AuthGate";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { handle } = use(params);
  const router = useRouter();
  const medusa = getMedusaClient();
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();

  const [product, setProduct] = useState<MedusaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<MedusaProduct[]>([]);

  // Fetch product & related items
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { product: fetchedProd } = await medusa.store.product.retrieve(handle);
        setProduct(fetchedProd);
        
        // Setup default options
        const defaults: Record<string, string> = {};
        fetchedProd.options.forEach((o) => {
          if (o.values.length > 0) defaults[o.id] = o.values[0];
        });
        setSelectedOptions(defaults);

        // Fetch related products
        const { products: fetchedRelated } = await medusa.store.product.list({
          collection_id: [fetchedProd.collection_id],
          limit: 4,
        });
        setRelatedProducts(fetchedRelated.filter((p) => p.id !== fetchedProd.id).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ag-gray-100)]">
        <div className="w-10 h-10 border-4 border-[var(--ag-red)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleSelectOption = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  // Find price of active variant (or default first variant)
  const activePrice = product.variants[0]?.prices[0]?.amount || 0;
  const originalPrice = product.variants[0]?.prices[0]?.original_amount || Math.round(activePrice * 1.3);
  const discount = Math.round(((originalPrice - activePrice) / originalPrice) * 100);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    // Find matching variant title based on options
    const selectedVariantName = Object.values(selectedOptions).join(" / ");
    
    addItem({
      id: product.id as any,
      name: product.title,
      price: activePrice,
      image: product.thumbnail,
      quantity: quantity,
    });

    setTimeout(() => {
      setAddingToCart(false);
      setCartSuccess(true);
      setCartOpen(true);
      setTimeout(() => setCartSuccess(false), 1500);
    }, 600);
  };

  const handleBuyNow = () => {
    const isAuthed = checkAuth();
    if (!isAuthed) {
      router.push(`/account/login?redirect=${encodeURIComponent(`/products/${handle}`)}`);
    } else {
      // Proceed to checkout
      handleAddToCart();
      router.push("/cart");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ag-gray-100)] select-none py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[var(--ag-gray-500)] mb-6 font-semibold">
          <Link href="/" className="hover:text-[var(--ag-dark)] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[var(--ag-dark)] transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--ag-red)] font-bold">{product.title}</span>
        </nav>

        {/* Dynamic Detail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: ImageGallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column: Info details */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              {/* Brand Chip */}
              <span className="inline-block bg-[var(--ag-gray-200)] text-[var(--ag-gray-800)] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                {product.brand}
              </span>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-display font-black leading-tight tracking-tight text-[var(--ag-dark)]">
                {product.title}
              </h1>
            </div>

            {/* Stars Review Row */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-0.5 text-amber-500">
                {"★".repeat(5)}
              </div>
              <span className="text-[var(--ag-dark)]">4.5</span>
              <span className="text-[var(--ag-gray-500)]">|</span>
              <span className="text-[var(--ag-gray-500)]">{product.reviewCount} ratings</span>
              <span className="text-[var(--ag-gray-500)]">|</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
                In Stock
              </span>
            </div>

            {/* Price Tags */}
            <div className="flex items-baseline gap-3 p-4 bg-white rounded-[var(--radius-lg)] border border-[var(--ag-gray-200)] w-fit">
              <span className="text-2xl font-extrabold text-[var(--ag-red)]">
                ₹{activePrice}
              </span>
              <span className="text-sm text-[var(--ag-gray-500)] line-through">
                ₹{originalPrice}
              </span>
              <span className="bg-[var(--ag-red)] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                -{discount}% OFF
              </span>
            </div>

            {/* Description intro */}
            <p className="text-sm text-[var(--ag-gray-500)] leading-relaxed font-semibold">
              {product.description.split(".")[0]}. Perfect for everyday task efficiency.
            </p>

            {/* Separator */}
            <hr className="border-[var(--ag-gray-200)]" />

            {/* Variant Selector */}
            {product.options && product.options.length > 0 && (
              <VariantSelector
                options={product.options}
                selectedOptions={selectedOptions}
                onSelectOption={handleSelectOption}
              />
            )}

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={product.variants[0]?.inventory_quantity || 10}
            />

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 h-13 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] disabled:bg-[var(--ag-gray-500)] text-white text-sm font-bold rounded-[var(--radius-md)] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all select-none"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : cartSuccess ? (
                  <>
                    <Check size={16} /> ADDED!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> ADD TO CART
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 h-13 bg-white hover:bg-[var(--ag-gray-100)] border-2 border-[var(--ag-red)] text-[var(--ag-red)] text-sm font-bold rounded-[var(--radius-md)] flex items-center justify-center gap-2 transition-colors select-none"
              >
                <CreditCard size={16} /> BUY NOW
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex flex-col gap-2 bg-white border border-[var(--ag-gray-200)] p-4 rounded-[var(--radius-lg)] mt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--ag-gray-800)]">
                <Truck size={15} className="text-emerald-600 shrink-0" />
                <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--ag-gray-800)]">
                <RotateCcw size={15} className="text-emerald-600 shrink-0" />
                <span>Easy 7-day return policy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--ag-gray-800)]">
                <Shield size={15} className="text-emerald-600 shrink-0" />
                <span>100% genuine & authentic product</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs
          description={product.description}
          brand={product.brand}
          reviewCount={product.reviewCount}
          specifications={product.specifications}
        />

        {/* You Might Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-[var(--ag-gray-200)] pt-12">
            <h2 className="text-lg sm:text-xl font-display font-black text-[var(--ag-dark)] section-title-underline pb-1 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
