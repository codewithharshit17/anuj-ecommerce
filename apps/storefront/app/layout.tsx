import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Marketing Store — Pens, Stationery & Art Supplies",
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[var(--background)] text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
