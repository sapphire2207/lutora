import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface FavouritesState {
  favourites: Product[];
  addFavourite: (product: Product) => void;
  removeFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
  toggleFavourite: (product: Product) => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],

      addFavourite: (product: Product) => {
        const exists = get().favourites.some((f) => f.id === product.id);
        if (!exists) {
          set({ favourites: [...get().favourites, product] });
        }
      },

      removeFavourite: (productId: string) => {
        set({
          favourites: get().favourites.filter((f) => f.id !== productId),
        });
      },

      isFavourite: (productId: string) => {
        return get().favourites.some((f) => f.id === productId);
      },

      toggleFavourite: (product: Product) => {
        if (get().isFavourite(product.id)) {
          get().removeFavourite(product.id);
        } else {
          get().addFavourite(product);
        }
      },
    }),
    {
      name: "lutora-favourites",
    }
  )
);
