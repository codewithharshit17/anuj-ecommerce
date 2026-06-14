"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

interface AddToCartButtonProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      className="bg-red-500 hover:bg-red-600"
      onClick={() =>
        addItem({
          id,
          name,
          price,
          image,
          quantity: 1,
        })
      }
    >
      Add To Cart
    </Button>
  );
}