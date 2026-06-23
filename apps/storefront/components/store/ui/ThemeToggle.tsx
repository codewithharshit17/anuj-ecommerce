"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

type ThemePreference = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (preference: ThemePreference) => {
      const root = document.documentElement;
      const shouldUseDark =
        preference === "dark" || (preference === "system" && mediaQuery.matches);

      root.classList.toggle("dark", shouldUseDark);
      root.style.colorScheme = shouldUseDark ? "dark" : "light";
    };

    const storedTheme = localStorage.getItem("theme");
    const initialTheme: ThemePreference =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system";

    const frame = requestAnimationFrame(() => {
      setTheme(initialTheme);
      applyTheme(initialTheme);
      setMounted(true);
    });

    const handleSystemChange = () => {
      if ((localStorage.getItem("theme") || "system") === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      cancelAnimationFrame(frame);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const newTheme: ThemePreference =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    const shouldUseDark =
      newTheme === "dark" || (newTheme === "system" && mediaQuery.matches);

    root.classList.toggle("dark", shouldUseDark);
    root.style.colorScheme = shouldUseDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground opacity-70 shrink-0" aria-hidden="true">
        <Moon size={18} />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 shrink-0"
      aria-label={`Theme: ${theme}. Switch theme`}
      title={`Theme: ${theme}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {theme === "dark" ? (
          <Sun size={18} className="text-amber-400" />
        ) : theme === "system" ? (
          <Monitor size={18} className="text-muted-foreground" />
        ) : (
          <Moon size={18} className="text-foreground" />
        )}
      </motion.div>
    </button>
  );
}
