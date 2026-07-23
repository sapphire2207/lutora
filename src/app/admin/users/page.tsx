"use client";

import { motion } from "framer-motion";
import { Search, User, Shield, Ban, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const USERS = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", role: "customer", orders: 12, status: "active", joined: "Jan 2025" },
  { id: "2", name: "Arjun Patel", email: "arjun@email.com", role: "customer", orders: 8, status: "active", joined: "Feb 2025" },
  { id: "3", name: "Admin User", email: "admin@lutora.in", role: "admin", orders: 0, status: "active", joined: "Dec 2024" },
  { id: "4", name: "Sneha Reddy", email: "sneha@email.com", role: "customer", orders: 23, status: "active", joined: "Mar 2025" },
  { id: "5", name: "Rahul Gupta", email: "rahul@email.com", role: "customer", orders: 5, status: "suspended", joined: "Apr 2025" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-foreground-secondary mt-1">Manage your customers and staff</p>
      </div>

      <div className="relative max-w-sm mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((user, i) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{user.name}</span>
                  {user.role === "admin" && (
                    <span className="px-1.5 py-0.5 bg-accent-light text-accent text-[9px] font-bold rounded flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                  {user.status === "suspended" && (
                    <span className="px-1.5 py-0.5 bg-danger-light text-danger text-[9px] font-bold rounded">Suspended</span>
                  )}
                </div>
                <p className="text-xs text-foreground-muted">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-[52px] sm:ml-0">
              <div className="text-right">
                <p className="text-xs font-semibold">{user.orders} orders</p>
                <p className="text-[10px] text-foreground-muted">Joined {user.joined}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toast.info("User details coming soon!")} className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors" title="View">
                  <User className="w-4 h-4" />
                </button>
                <button onClick={() => toast.warning("User suspended")} className="p-1.5 rounded-lg text-foreground-muted hover:text-warning hover:bg-warning-light transition-colors" title="Suspend">
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
