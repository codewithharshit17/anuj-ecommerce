"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const initialTheme = isDark ? "dark" : "light";
    const frame = requestAnimationFrame(() => {
      setTheme(initialTheme);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    if (newTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] flex items-center justify-center text-[var(--ag-gray-800)] opacity-50 shrink-0" aria-hidden="true">
        <Moon size={18} />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] dark:border-neutral-800 flex items-center justify-center text-[var(--ag-dark)] dark:text-[var(--foreground)] hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 transition-colors shadow-sm focus:outline-none shrink-0"
      aria-label="Toggle Theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {theme === "light" ? (
          <Moon size={18} className="text-[var(--ag-gray-800)]" />
        ) : (
          <Sun size={18} className="text-amber-400" />
        )}
      </motion.div>
    </button>
  );
}
