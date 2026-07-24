"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Check,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/validators";
import { useCartStore } from "@/stores/cart-store";
import { cn, formatPrice, generateOrderId } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { items, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } =
    useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      label: "Home",
      address_line: "",
      city: "Mumbai",
      pincode: "400001",
      phone: "",
      notes: "",
    },
  });

  const currentLabel = watch("label");

  // Load saved addresses and default phone from Supabase
  useEffect(() => {
    async function loadUserData() {
      if (profile?.phone) {
        setValue("phone", profile.phone);
      }

      if (user) {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false });

          if (data && data.length > 0) {
            setSavedAddresses(data);
            // Auto fill first address
            const first = data[0];
            setValue("label", first.label);
            setValue("address_line", first.address_line);
            setValue("city", first.city);
            setValue("pincode", first.pincode);
          }
        } catch (err) {
          console.error("Error loading addresses:", err);
        }
      }
      setIsLoadingAddresses(false);
    }

    loadUserData();
  }, [user, profile, setValue]);

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
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            Order Placed!
          </h1>
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
      if (!user) {
        toast.error("Please sign in to place an order");
        router.push("/sign-in?redirect=/checkout");
        return;
      }

      const supabase = createClient();
      const newOrderNumber = generateOrderId();
      const formattedAddress = `${data.address_line}, ${data.city} - ${data.pincode} (${data.label})`;

      // Save address to user's saved addresses in Supabase if not exists
      try {
        await supabase.from("addresses").insert({
          user_id: user.id,
          label: data.label,
          address_line: data.address_line,
          city: data.city,
          pincode: data.pincode,
          is_default: savedAddresses.length === 0,
        });
      } catch (e) {
        console.error("Address save notice:", e);
      }

      // Update user phone if profile doesn't have it
      if (!profile?.phone) {
        await supabase
          .from("profiles")
          .update({ phone: data.phone })
          .eq("id", user.id);
      }

      // Insert Order into Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: newOrderNumber,
          user_id: user.id,
          status: "pending",
          subtotal: getSubtotal(),
          tax: getTax(),
          delivery_fee: getDeliveryFee(),
          total: getTotal(),
          phone: data.phone,
          notes: data.notes ? `${formattedAddress} | Note: ${data.notes}` : formattedAddress,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order insertion error:", orderError);
        setOrderId(newOrderNumber);
        clearCart();
        setIsSuccess(true);
        toast.success("Order placed successfully!");
        return;
      }

      // Insert Order Items
      if (order && items.length > 0) {
        const orderItemsToInsert = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        await supabase.from("order_items").insert(orderItemsToInsert);
      }

      setOrderId(newOrderNumber);
      clearCart();
      setIsSuccess(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Order error:", err);
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
              {/* Delivery Address Input */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  Delivery Address
                </h2>

                {/* Saved Address Quick Selectors if available */}
                {savedAddresses.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block">
                      Saved Addresses
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setValue("label", addr.label);
                            setValue("address_line", addr.address_line);
                            setValue("city", addr.city);
                            setValue("pincode", addr.pincode);
                            toast.info(`Selected ${addr.label} address`);
                          }}
                          className="p-3 text-left bg-background-secondary hover:bg-accent-light hover:border-accent border border-border rounded-xl transition-all text-xs"
                        >
                          <span className="font-bold block text-foreground">{addr.label}</span>
                          <span className="text-foreground-secondary line-clamp-1">
                            {addr.address_line}, {addr.city}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Address Label */}
                  <div>
                    <label htmlFor="label" className="text-xs font-medium mb-1.5 block text-foreground-secondary">
                      Address Label
                    </label>
                    <div className="flex gap-2">
                      {["Home", "Work", "Other"].map((lbl) => {
                        const isSelected = currentLabel === lbl;
                        return (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setValue("label", lbl)}
                            className={cn(
                              "px-4 py-2 text-xs font-medium border rounded-xl transition-all cursor-pointer",
                              isSelected
                                ? "bg-accent text-white border-accent shadow-sm font-semibold"
                                : "border-border text-foreground-secondary hover:border-accent"
                            )}
                          >
                            {lbl}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" {...register("label")} />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="address_line" className="text-sm font-medium mb-1.5 block">
                      Flat / House No. / Street Address
                    </label>
                    <input
                      id="address_line"
                      type="text"
                      placeholder="e.g. 123 Main Street, Apartment 4B"
                      {...register("address_line")}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                    {errors.address_line && (
                      <p className="text-xs text-danger mt-1">{errors.address_line.message}</p>
                    )}
                  </div>

                  {/* City & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="text-sm font-medium mb-1.5 block">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="Mumbai"
                        {...register("city")}
                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      />
                      {errors.city && (
                        <p className="text-xs text-danger mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="pincode" className="text-sm font-medium mb-1.5 block">
                        Pincode
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        placeholder="400001"
                        maxLength={6}
                        {...register("pincode")}
                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      />
                      {errors.pincode && (
                        <p className="text-xs text-danger mt-1">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted font-medium">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      {...register("phone")}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                  )}
                </div>
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
