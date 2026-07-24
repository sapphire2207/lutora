"use client";

import { motion } from "framer-motion";
import { Search, Eye, CheckCircle, XCircle, Package, Loader2 } from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { CustomSelect } from "@/components/ui/custom-select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const STATUS_FILTERS = ["all", "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

const STATUS_SELECT_OPTIONS = STATUS_FILTERS.filter((s) => s !== "all").map((st) => ({
  value: st,
  label: ORDER_STATUS_LABELS[st] || st,
}));

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const supabase = createClient();
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product:products(*))")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin orders:", error.message);
      } else if (ordersData) {
        const userIds = Array.from(new Set(ordersData.map((o) => o.user_id).filter(Boolean)));
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds);

          const profileMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
          const merged = ordersData.map((o) => ({
            ...o,
            profile: profileMap.get(o.user_id) || null,
          }));
          setOrders(merged);
        } else {
          setOrders(ordersData);
        }
      }
    } catch (err) {
      console.error("Admin orders exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      let { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select();

      if ((!data || data.length === 0)) {
        const res = await supabase
          .from("orders")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("order_number", orderId)
          .select();
        data = res.data;
        error = res.error;
      }

      if (error) {
        console.error("Status update error:", error);
        toast.error(`Update failed: ${error.message}`);
      } else if (!data || data.length === 0) {
        toast.error("Database update blocked by RLS. Run SQL command in Supabase.");
      } else {
        toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus] || newStatus}!`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = orders.filter((o) => {
    const displayId = o.order_number || o.id;
    const customerName = o.profile?.full_name || o.phone || "";
    const matchSearch =
      displayId.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Manage, track, and update status of customer orders in real-time
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                statusFilter === s
                  ? "bg-foreground text-white"
                  : "bg-white border border-border text-foreground-secondary hover:bg-background-secondary"
              )}
            >
              {s === "all" ? "All" : ORDER_STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-border mt-6">
          <Package className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold">No orders found</h3>
          <p className="text-xs text-foreground-secondary mt-1">
            New customer orders will appear here in real-time.
          </p>
        </div>
      ) : (
        /* Orders List */
        <div className="mt-6 space-y-3">
          {filtered.map((order, i) => {
            const displayId = order.order_number || order.id.slice(0, 8);
            const customerName = order.profile?.full_name || `Phone: ${order.phone}`;
            const itemSummary =
              order.order_items && order.order_items.length > 0
                ? order.order_items
                    .map((item: any) => `${item.product?.name || "Makhana"} ×${item.quantity}`)
                    .join(", ")
                : "1x Makhana Order";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-border p-4 md:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-foreground-muted shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{displayId}</span>
                        {/* Custom Select Dropdown for status update */}
                        <CustomSelect
                          options={STATUS_SELECT_OPTIONS}
                          value={order.status}
                          onChange={(val) => handleUpdateStatus(order.id, val)}
                          className="w-40"
                        />
                      </div>
                      <div className="space-y-1 mt-1 text-xs">
                        <p className="text-foreground-secondary font-medium">
                          <span className="font-semibold text-foreground">{customerName}</span> · {itemSummary}
                        </p>
                        {order.notes && (
                          <p className="text-[11px] text-foreground-muted line-clamp-1 flex items-center gap-1">
                            <span className="font-semibold text-accent shrink-0">Delivery:</span>
                            <span className="truncate">{order.notes.split(" | Note: ")[0]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-7 sm:ml-0">
                    <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                    <span className="text-xs text-foreground-muted">
                      {formatDateTime(order.created_at)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors"
                        title="View Full Admin Order & Customer Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {order.status !== "delivered" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                          className="p-1.5 rounded-lg text-foreground-muted hover:text-success hover:bg-success-light transition-colors"
                          title="Mark Delivered"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger-light transition-colors"
                          title="Cancel Order"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
