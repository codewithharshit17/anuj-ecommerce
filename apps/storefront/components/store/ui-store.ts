import { create } from "zustand";
import { useAuthStore } from "@/lib/store/auth-store";
import { toggleWishlistAction } from "@/lib/actions/wishlist";

interface UIStore {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  wishlist: string[]; // array of product IDs
  setWishlist: (ids: string[]) => void;
  toggleWishlist: (productId: string) => Promise<void>;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  wishlist: [],
  setWishlist: (wishlist) => set({ wishlist }),
  toggleWishlist: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      try {
        const res = await toggleWishlistAction(productId);
        if (res.success && res.items) {
          set({ wishlist: res.items });
        }
      } catch (err) {
        console.error("[toggleWishlist] Failed to sync with DB:", err);
      }
    } else {
      set((state) => {
        const exists = state.wishlist.includes(productId);
        if (exists) {
          return { wishlist: state.wishlist.filter((id) => id !== productId) };
        } else {
          return { wishlist: [...state.wishlist, productId] };
        }
      });
    }
  },
}));

