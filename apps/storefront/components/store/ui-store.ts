// apps/storefront/components/store/ui-store.ts
import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  wishlist: [],
  toggleWishlist: (productId) =>
    set((state) => {
      const exists = state.wishlist.includes(productId);
      if (exists) {
        return { wishlist: state.wishlist.filter((id) => id !== productId) };
      } else {
        return { wishlist: [...state.wishlist, productId] };
      }
    }),
}));
