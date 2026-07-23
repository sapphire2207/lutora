"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  FileText,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/validators";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, generateOrderId } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } =
    useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address_id: "default",
      phone: "",
      notes: "",
    },
  });

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
          <h1 className="text-xl font-bold">Cart is empty</h1>
          <p className="text-sm text-foreground-secondary mt-2">
            Add items to your cart before checking out
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto bg-success-light rounded-full flex items-center justify-center mb-6"
          >
            <Check className="w-10 h-10 text-success" />
          </motion.div>
          <h1 className="text-2xl font-bold">Order Placed! 🎉</h1>
          <p className="text-sm text-foreground-secondary mt-2">
            Your order <span className="font-semibold text-foreground">{orderId}</span> has
            been placed successfully. We&apos;ll start preparing it right away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/orders"
              className="px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Simulate order placement
      await new Promise((r) => setTimeout(r, 1500));
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      clearCart();
      setIsSuccess(true);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/cart"
            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  {/* Default address selection */}
                  <div className="p-4 bg-background-secondary rounded-xl border-2 border-accent">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Home</p>
                        <p className="text-xs text-foreground-secondary mt-0.5">
                          123 Main Street, Apartment 4B, City - 400001
                        </p>
                      </div>
                    </div>
                  </div>
                  <input type="hidden" {...register("address_id")} value="default" />
                  {errors.address_id && (
                    <p className="text-xs text-danger">{errors.address_id.message}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-accent" />
                  Contact Details
                </h2>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium mb-1.5 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      {...register("phone")}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-accent" />
                  Delivery Notes
                </h2>
                <textarea
                  placeholder="Any special instructions? (optional)"
                  {...register("notes")}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-[calc(var(--nav-height)+24px)]">
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5 pb-5 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground-secondary">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Subtotal</span>
                    <span className="font-medium">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">GST (5%)</span>
                    <span className="font-medium">{formatPrice(getTax())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Delivery</span>
                    <span className={getDeliveryFee() === 0 ? "text-success font-medium" : "font-medium"}>
                      {getDeliveryFee() === 0 ? "FREE" : formatPrice(getDeliveryFee())}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order — {formatPrice(getTotal())}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-foreground-muted text-center mt-3">
                  Cash on Delivery • No advance payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
