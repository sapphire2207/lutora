"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Package,
} from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

// Demo data
const STATS = [
  {
    label: "Today's Orders",
    value: "12",
    change: "+18%",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-accent-light text-accent",
  },
  {
    label: "Today's Revenue",
    value: formatPrice(4350),
    change: "+23%",
    trend: "up",
    icon: IndianRupee,
    color: "bg-success-light text-success",
  },
  {
    label: "Active Users",
    value: "148",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "bg-info-light text-info",
  },
  {
    label: "Pending Orders",
    value: "3",
    change: "-2",
    trend: "down",
    icon: Clock,
    color: "bg-warning-light text-warning",
  },
];

const RECENT_ORDERS = [
  {
    id: "LUT-K8M2P1",
    customer: "Priya S.",
    items: "2x Peri Peri Makhna",
    total: 358,
    status: "preparing",
    time: "2025-07-23T12:30:00Z",
  },
  {
    id: "LUT-N4R7X3",
    customer: "Arjun P.",
    items: "1x Honey Makhna",
    total: 199,
    status: "out_for_delivery",
    time: "2025-07-23T12:15:00Z",
  },
  {
    id: "LUT-Q9T5W2",
    customer: "Sneha R.",
    items: "1x Peri Peri, 1x Honey",
    total: 378,
    status: "delivered",
    time: "2025-07-23T11:45:00Z",
  },
  {
    id: "LUT-B3F8Y6",
    customer: "Rahul G.",
    items: "3x Peri Peri Makhna",
    total: 537,
    status: "pending",
    time: "2025-07-23T12:35:00Z",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">Revenue Overview</h2>
          <select className="text-xs px-3 py-1.5 bg-background-secondary border border-border rounded-lg">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 px-4">
          {[65, 40, 80, 55, 90, 70, 85].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
              className="flex-1 bg-accent/20 hover:bg-accent/40 rounded-t-lg transition-colors relative group cursor-pointer"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-foreground text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatPrice(h * 50)}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-3 px-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="text-[10px] text-foreground-muted flex-1 text-center">
              {d}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-border mt-6"
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs text-accent font-medium flex items-center gap-0.5 hover:text-accent-hover transition-colors"
          >
            View All
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-background-secondary rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-foreground-muted" />
                  <span className="text-xs font-semibold">{order.id}</span>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold rounded-full",
                    ORDER_STATUS_COLORS[order.status]
                  )}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-foreground-secondary">
                <span>{order.customer}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-foreground-muted">
                <th className="text-left font-medium px-6 py-3">Order</th>
                <th className="text-left font-medium px-6 py-3">Customer</th>
                <th className="text-left font-medium px-6 py-3">Items</th>
                <th className="text-left font-medium px-6 py-3">Total</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-b-0 hover:bg-background-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-secondary">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-secondary">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 text-[10px] font-semibold rounded-full",
                        ORDER_STATUS_COLORS[order.status]
                      )}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-foreground-muted">
                    {formatDateTime(order.time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
