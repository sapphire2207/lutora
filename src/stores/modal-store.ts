import { create } from "zustand";
import type { Product } from "@/types";

interface CartModalState {
  isOpen: boolean;
  product: Product | null;
  quantity: number;
  openModal: (product: Product, quantity?: number) => void;
  closeModal: () => void;
}

export const useCartModalStore = create<CartModalState>((set) => ({
  isOpen: false,
  product: null,
  quantity: 1,
  openModal: (product, quantity = 1) =>
    set({ isOpen: true, product, quantity }),
  closeModal: () => set({ isOpen: false, product: null, quantity: 1 }),
}));
