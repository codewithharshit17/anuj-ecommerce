import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  slug,
  name,
  price,
  image,
}: ProductCardProps) {
  const originalPrice = Math.round(price * 2.2);

  const discount = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );

  return (
    <Card
      className="
        overflow-hidden
        group
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >
      <Link href={`/products/${slug}`}>
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-56 object-cover"
          />

          <button
            className="
              absolute
              top-3
              right-3
              bg-white
              rounded-full
              p-2
              shadow-md
              z-10
            "
          >
            <Heart size={18} />
          </button>

          <span
            className="
              absolute
              top-3
              left-3
              bg-red-500
              text-white
              text-xs
              px-2
              py-1
              rounded
              font-medium
            "
          >
            SALE
          </span>

          <div
            className="
              absolute
              inset-0
              bg-black/40
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-300
              flex
              items-center
              justify-center
            "
          >
            <Button variant="secondary">
              Quick View
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3
            className="
              font-semibold
              text-lg
              hover:text-red-500
              transition
              cursor-pointer
            "
          >
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />

          <span className="text-sm text-gray-500 ml-1">
            (124)
          </span>
        </div>

        <div className="mt-3">
          <p className="text-red-500 font-bold text-lg">
            ₹{price}
          </p>

          <div className="flex items-center gap-2">
            <span className="line-through text-gray-400">
              ₹{originalPrice}
            </span>

            <span className="text-green-600 text-sm font-semibold">
              {discount}% OFF
            </span>
          </div>
        </div>

        <Button
          className="
            w-full
            mt-4
            bg-red-500
            hover:bg-red-600
          "
        >
          Add To Cart
        </Button>
      </div>
    </Card>
  );
}