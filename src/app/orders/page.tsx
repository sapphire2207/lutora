"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Clock, ChevronRight, Package, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import type { Order } from "@/types";

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*, product:products(*))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Orders fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <ClipboardList className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
          <h1 className="text-xl font-bold">Sign in to view your orders</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Track your live orders and view order history
          </p>
          <Link
            href="/sign-in?redirect=/orders"
            className="inline-flex mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Track and manage your orders
          </p>
        </motion.div>

        {orders.length > 0 ? (
          <div className="mt-8 space-y-4">
            {orders.map((order, index) => {
              const displayId = order.order_number || order.id.slice(0, 8);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="block bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-md transition-all p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-foreground-muted" />
                          <span className="text-sm font-semibold">{displayId}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize",
                              ORDER_STATUS_COLORS[order.status] || "bg-background-secondary text-foreground-secondary"
                            )}
                          >
                            {ORDER_STATUS_LABELS[order.status] || order.status}
                          </span>
                          <span className="text-xs text-foreground-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-foreground-muted" />
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
                      <p className="text-xs text-foreground-secondary">
                        {order.items && order.items.length > 0
                          ? order.items
                              .map(
                                (i) =>
                                  `${i.product?.name || "Makhna"} ×${i.quantity}`
                              )
                              .join(", ")
                          : "1x Makhna Order"}
                      </p>
                      <span className="text-sm font-bold">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <h2 className="text-lg font-bold">No orders yet</h2>
            <p className="text-sm text-foreground-secondary mt-1">
              Start ordering to see your history here
            </p>
            <Link
              href="/menu"
              className="inline-flex mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
