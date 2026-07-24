import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, CartState } from "@/types";
import { useCartModalStore } from "@/stores/modal-store";
import { getSellingPrice } from "@/lib/utils";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: crypto.randomUUID(),
                product,
                quantity,
              },
            ],
          });
        }

        // Trigger Item Added Modal
        try {
          useCartModalStore.getState().openModal(product, quantity);
        } catch (e) {
          console.error("Failed to open modal:", e);
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const sellingPrice = getSellingPrice(item.product);
          return total + sellingPrice * item.quantity;
        }, 0);
      },

      getTax: () => 0,

      getDeliveryFee: () => 0,

      getTotal: () => get().getSubtotal(),
    }),
    {
      name: "lutora-cart",
    }
  )
);
