import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/utils";

/**
 * DM Sans — display / heading font (scooboo.in spec, weights 400-700)
 * Exposed as CSS var --font-dm-sans → consumed by --font-display in globals.css
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

/**
 * Inter — body copy fallback (scooboo.in spec)
 * Exposed as CSS var --font-inter → consumed by --font-body in globals.css
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAPI PEN — Pens, Stationery & Art Supplies",
  description:
    "India's premium wholesale stationery store. Shop pens, notebooks, planners, art supplies & more. COD available above ₹500.",
  keywords: ["stationery", "pens", "notebooks", "art supplies", "wholesale"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        dmSans.variable,
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
