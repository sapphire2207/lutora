"use client";

import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, XCircle, Package } from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";

const ORDERS = [
  { id: "LUT-K8M2P1", customer: "Priya Sharma", email: "priya@email.com", items: "2x Peri Peri Makhna", total: 358, status: "preparing", time: "2025-07-23T12:30:00Z" },
  { id: "LUT-N4R7X3", customer: "Arjun Patel", email: "arjun@email.com", items: "1x Honey Makhna", total: 199, status: "out_for_delivery", time: "2025-07-23T12:15:00Z" },
  { id: "LUT-Q9T5W2", customer: "Sneha Reddy", email: "sneha@email.com", items: "1x Peri Peri, 1x Honey", total: 378, status: "delivered", time: "2025-07-23T11:45:00Z" },
  { id: "LUT-B3F8Y6", customer: "Rahul Gupta", email: "rahul@email.com", items: "3x Peri Peri Makhna", total: 537, status: "pending", time: "2025-07-23T12:35:00Z" },
  { id: "LUT-M1X9K7", customer: "Anita Das", email: "anita@email.com", items: "1x Honey Makhna", total: 199, status: "confirmed", time: "2025-07-23T11:00:00Z" },
];

const STATUS_FILTERS = ["all", "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = ORDERS.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-foreground-secondary mt-1">Manage and track all orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all capitalize",
                statusFilter === s ? "bg-foreground text-white" : "bg-white border border-border text-foreground-secondary hover:bg-background-secondary"
              )}
            >
              {s === "all" ? "All" : ORDER_STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="mt-6 space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border p-4 md:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-foreground-muted shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{order.id}</span>
                    <span className={cn("px-2 py-0.5 text-[10px] font-semibold rounded-full", ORDER_STATUS_COLORS[order.status])}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {order.customer} · {order.items}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-7 sm:ml-0">
                <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                <span className="text-xs text-foreground-muted">{formatDateTime(order.time)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toast.info("Order details coming soon!")} className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => toast.success("Order status updated!")} className="p-1.5 rounded-lg text-foreground-muted hover:text-success hover:bg-success-light transition-colors" title="Complete">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => toast.error("Order cancelled")} className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger-light transition-colors" title="Cancel">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
