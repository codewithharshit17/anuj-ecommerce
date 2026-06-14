"use client";

import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

export default function Header() {
  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/">
            <h1 className="text-3xl font-bold text-red-500 cursor-pointer">
              KAPI PEN
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center border rounded-lg px-3 py-2 flex-1 max-w-xl">
            <Search size={20} />

            <input
              placeholder="Search products..."
              className="ml-2 outline-none w-full"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">

            <Link href="/cart" className="relative">
              <ShoppingCart className="cursor-pointer hover:text-red-500 transition" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/login">
              <User className="cursor-pointer hover:text-red-500 transition" />
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}