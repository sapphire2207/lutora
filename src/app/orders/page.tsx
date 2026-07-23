"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Clock, ChevronRight, Package } from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

// Demo orders for display
const DEMO_ORDERS = [
  {
    id: "LUT-A7X3K9",
    status: "delivered",
    total: 387,
    items: [
      { name: "Peri Peri Makhna", quantity: 1 },
      { name: "Honey Makhna", quantity: 1 },
    ],
    created_at: "2025-07-20T14:30:00Z",
  },
  {
    id: "LUT-B2M8P4",
    status: "preparing",
    total: 197,
    items: [{ name: "Peri Peri Makhna", quantity: 1 }],
    created_at: "2025-07-23T10:15:00Z",
  },
];

export default function OrdersPage() {
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

        <div className="mt-8 space-y-4">
          {DEMO_ORDERS.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/orders/${order.id}`}
                className="block bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-md transition-all p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-foreground-muted" />
                      <span className="text-sm font-semibold">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 text-[10px] font-semibold rounded-full",
                          ORDER_STATUS_COLORS[order.status]
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
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
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </p>
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {DEMO_ORDERS.length === 0 && (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <h2 className="text-lg font-bold">No orders yet</h2>
            <p className="text-sm text-foreground-secondary mt-1">
              Start ordering to see your history here
            </p>
            <Link
              href="/menu"
              className="inline-flex mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
