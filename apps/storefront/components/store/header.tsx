import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
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

            <Link href="/cart">
              <ShoppingCart className="cursor-pointer hover:text-red-500 transition" />
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