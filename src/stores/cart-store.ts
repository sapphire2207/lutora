import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, CartState } from "@/types";
import { useCartModalStore } from "@/stores/modal-store";
import { getSellingPrice } from "@/lib/utils";

function sanitizeProduct(product: Product): Product {
  if (!product) return product;
  const copy = { ...product };
  // Auto-migrate stale cached prices from previous sessions
  if (copy.price === 179 || copy.price === 152 || copy.price === 98) {
    copy.price = 325;
    copy.discount_percent = 45;
  } else if (copy.price === 199 || copy.price === 169) {
    copy.price = 363;
    copy.discount_percent = 45;
  }
  return copy;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        const cleanProduct = sanitizeProduct(product);
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === cleanProduct.id || item.product.name === cleanProduct.name
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === cleanProduct.id || item.product.name === cleanProduct.name
                ? { ...item, product: cleanProduct, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: crypto.randomUUID(),
                product: cleanProduct,
                quantity,
              },
            ],
          });
        }

        // Trigger Item Added Modal
        try {
          useCartModalStore.getState().openModal(cleanProduct, quantity);
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
          const cleanProduct = sanitizeProduct(item.product);
          const sellingPrice = getSellingPrice(cleanProduct);
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
