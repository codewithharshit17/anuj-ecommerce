import { Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
        <div className="hidden md:flex items-center border rounded-lg px-3 py-2 w-[400px]">
            <Search size={20} />
            <input
                placeholder="Search products..."
                className="ml-2 outline-none w-full"
            />
        </div>
      <div className="container mx-auto px-4 py-4">

        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-bold text-red-500">
            KAPI PEN
          </h1>

          <div className="flex gap-4">

            <Search className="cursor-pointer" />

            <ShoppingCart className="cursor-pointer" />

            <User className="cursor-pointer" />

          </div>

        </div>

      </div>
    </header>
  );
}