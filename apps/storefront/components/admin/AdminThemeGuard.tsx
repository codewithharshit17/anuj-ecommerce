"use client";

import { useEffect } from "react";

/**
 * AdminThemeGuard — Client Component
 *
 * Ensures that the admin portal is always rendered in a clean, consistent light theme.
 * Strips the 'dark' class from the document element when entering any admin route,
 * and restores it when leaving (to keep the storefront's theme preferences intact).
 */
export default function AdminThemeGuard() {
  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    
    // Force light mode
    html.classList.remove("dark");
    html.style.colorScheme = "light";

    return () => {
      // Restore previous state if needed
      if (hadDark) {
        html.classList.add("dark");
        html.style.colorScheme = "dark";
      } else {
        html.style.colorScheme = "";
      }
    };
  }, []);

  return null;
}
