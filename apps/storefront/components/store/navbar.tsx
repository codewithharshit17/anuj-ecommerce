import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">

      <div className="container mx-auto px-4">

        <ul className="flex gap-8 py-3 font-medium">

          <li>
            <Link href="/products">
                Products
            </Link>
          </li>
          <li>
            <Link href="/">
                Home
            </Link>
          </li>

        </ul>

      </div>

    </nav>
  );
}