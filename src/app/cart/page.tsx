"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getTax, getDeliveryFee, getTotal, getItemCount } =
    useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const itemCount = getItemCount();
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="w-20 h-20 mx-auto bg-background-secondary rounded-full flex items-center justify-center mb-5">
            <ShoppingBag className="w-8 h-8 text-foreground-muted" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-sm text-foreground-secondary mt-2 max-w-xs mx-auto">
            Looks like you haven&apos;t added any makhana yet. Let&apos;s fix that!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="text-xs text-foreground-muted hover:text-danger transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-border"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-background-secondary rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success(`${item.product.name} removed`);
                        }}
                        className="p-1.5 text-foreground-muted hover:text-danger transition-colors rounded-lg hover:bg-danger-light"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-0 border border-border rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-foreground-secondary hover:bg-background-secondary rounded-l-full transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-foreground-secondary hover:bg-background-secondary rounded-r-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="text-sm font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add More */}
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Add more items
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-[calc(var(--nav-height)+24px)]">
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-5">Order Summary</h2>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">GST (5%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Delivery</span>
                    <span
                      className={cn(
                        "font-medium",
                        deliveryFee === 0 && "text-success"
                      )}
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[10px] text-foreground-muted text-center mt-3">
                  Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
