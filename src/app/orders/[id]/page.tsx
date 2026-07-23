"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Phone,
  Package,
  ChefHat,
  Truck,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types";

// Timeline steps with icons
const TIMELINE_STEPS = [
  { status: "pending", label: "Order Placed", icon: Package, description: "Your order has been received" },
  { status: "confirmed", label: "Confirmed", icon: Check, description: "Restaurant accepted your order" },
  { status: "preparing", label: "Preparing", icon: ChefHat, description: "Your food is being prepared" },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck, description: "On the way to you" },
  { status: "delivered", label: "Delivered", icon: PartyPopper, description: "Enjoy your meal!" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*, product:products(*))")
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)
          .single();

        if (error) {
          console.error("Error fetching order detail:", error.message);
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error("Order detail exception:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();

    // Realtime subscription for live status changes
    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.new && (payload.new.id === orderId || payload.new.order_number === orderId)) {
            setOrder((prev) => (prev ? { ...prev, status: payload.new.status } : prev));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <Package className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
          <h1 className="text-xl font-bold">Order Not Found</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            We couldn&apos;t find an order matching #{orderId}
          </p>
          <Link
            href="/orders"
            className="inline-flex mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = TIMELINE_STEPS.findIndex(
    (s) => s.status === order.status
  );

  const displayOrderNumber = order.order_number || order.id.slice(0, 8);

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/orders"
            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Order {displayOrderNumber}</h1>
            <p className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-6 mb-6"
        >
          <h2 className="text-base font-semibold mb-6">Order Status</h2>
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Line + Dot */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                        isCompleted
                          ? "bg-accent border-accent text-white"
                          : "bg-background-secondary border-border text-foreground-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    {index < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "w-0.5 h-10 transition-colors",
                          index < currentStatusIndex
                            ? "bg-accent"
                            : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        !isCompleted && "text-foreground-muted"
                      )}
                    >
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-accent-light text-accent text-[10px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border p-6 mb-6"
        >
          <h2 className="text-base font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">
                    {item.product?.name || "Makhna"} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-foreground-secondary">Makhna Order</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
            )}

            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Subtotal</span>
                <span>{formatPrice(order.subtotal || order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Tax</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Delivery</span>
                <span className="text-success font-medium">
                  {order.delivery_fee === 0 ? "FREE" : formatPrice(order.delivery_fee)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border p-6"
        >
          <h2 className="text-base font-semibold mb-4">Delivery Details</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span className="text-foreground-secondary">
                123 Main Street, Apartment 4B, City - 400001
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span className="text-foreground-secondary">+91 {order.phone}</span>
            </div>
            {order.notes && (
              <div className="p-3 bg-background-secondary rounded-lg text-xs text-foreground-secondary">
                <span className="font-medium text-foreground">Note:</span> {order.notes}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
