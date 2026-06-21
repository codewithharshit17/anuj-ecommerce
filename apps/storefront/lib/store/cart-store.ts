import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth-store";
import { syncCartAction } from "@/lib/actions/cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  userId: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  setCartItems: (items: CartItem[]) => void;
  setUserId: (userId: string | null) => void;
}

async function syncDb(items: CartItem[], set: (state: Partial<CartStore>) => void) {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    try {
      const dbItems = await syncCartAction(items);
      set({ items: dbItems });
    } catch (err) {
      console.error("[cart-store] Failed to sync cart with DB:", err);
    }
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setCartItems: (items) => set({ items }),
      setUserId: (userId) => set({ userId }),

      addItem: async (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        let newItems;

        if (existingItem) {
          const totalQty = existingItem.quantity + item.quantity;
          if (totalQty > item.stock) {
            alert(`Only ${item.stock} units available.`);
            return;
          }
          newItems = currentItems.map((i) =>
            i.id === item.id
              ? { ...i, quantity: totalQty }
              : i
          );
        } else {
          if (item.quantity > item.stock) {
            alert(`Only ${item.stock} units available.`);
            return;
          }
          newItems = [...currentItems, item];
        }

        set({ items: newItems });
        await syncDb(newItems, set);
      },

      removeItem: async (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({ items: newItems });
        await syncDb(newItems, set);
      },

      increaseQuantity: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        if (item.quantity >= item.stock) {
          alert(`Only ${item.stock} units available.`);
          return;
        }

        const newItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        set({ items: newItems });
        await syncDb(newItems, set);
      },

      decreaseQuantity: async (id) => {
        const newItems = get().items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        );
        set({ items: newItems });
        await syncDb(newItems, set);
      },
    }),
    {
      name: "kapi-cart",
    }
  )
);