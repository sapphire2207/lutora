"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, ShoppingBag, ClipboardList } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartModalStore } from "@/stores/modal-store";
import { useEffect } from "react";

export function ItemAddedModal() {
  const { isOpen, product, quantity, closeModal } = useCartModalStore();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const prod = product as any;
  const imgSrc =
    prod?.image ||
    prod?.image_url ||
    (product?.slug === "peri-peri-makhna" || product?.id === "makhna-spicy"
      ? "/images/makhna-spicy.png"
      : "/images/makhna-honey.jpg");

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Card */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-3xl border border-border shadow-2xl overflow-hidden z-10 p-6 sm:p-7 text-left"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-foreground-muted hover:text-foreground hover:bg-background-secondary rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2.5 text-success font-bold text-sm mb-4">
              <div className="w-7 h-7 rounded-full bg-success-light flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-success" />
              </div>
              Item Added to Your Cart!
            </div>

            {/* Product Details */}
            <div className="flex items-center gap-4 p-3.5 bg-background-secondary rounded-2xl border border-border mb-6">
              <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-border shadow-xs">
                <Image
                  src={imgSrc}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-foreground-secondary mt-0.5 font-medium">
                  Qty: {quantity} · {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  closeModal();
                  router.push("/checkout");
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full shadow-md shadow-accent/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 px-4 bg-background-secondary hover:bg-border-light text-foreground-secondary hover:text-foreground text-xs font-semibold rounded-full transition-colors cursor-pointer text-center"
                >
                  Continue Browsing
                </button>

                <button
                  onClick={() => {
                    closeModal();
                    router.push("/orders");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-background-secondary hover:bg-border-light text-foreground-secondary hover:text-foreground text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  View Orders
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
