"use client";

import { motion } from "framer-motion";
import {
  Search,
  User as UserIcon,
  Shield,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Package,
  MapPin,
  Trash2,
  Edit2,
  Check,
  X,
  Save,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Edit user modal/inline state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("customer");
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const supabase = createClient();

      const [profilesRes, ordersRes, addressesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id"),
        supabase.from("addresses").select("user_id"),
      ]);

      const profiles = profilesRes.data || [];
      const orders = ordersRes.data || [];
      const addresses = addressesRes.data || [];

      // Calculate order count per user
      const orderCountMap = new Map<string, number>();
      orders.forEach((o) => {
        if (o.user_id) {
          orderCountMap.set(o.user_id, (orderCountMap.get(o.user_id) || 0) + 1);
        }
      });

      // Calculate address count per user
      const addressCountMap = new Map<string, number>();
      addresses.forEach((a) => {
        if (a.user_id) {
          addressCountMap.set(a.user_id, (addressCountMap.get(a.user_id) || 0) + 1);
        }
      });

      const merged = profiles.map((p) => ({
        ...p,
        orders_count: orderCountMap.get(p.id) || 0,
        addresses_count: addressCountMap.get(p.id) || 0,
      }));

      setUsers(merged);
    } catch (err) {
      console.error("Users exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStartEdit = (user: any) => {
    setEditingUserId(user.id);
    setEditName(user.full_name || "");
    setEditPhone(user.phone || "");
    setEditRole(user.role || "customer");
  };

  const handleSaveEdit = async (userId: string) => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editName,
          phone: editPhone,
          role: editRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        toast.error(`Failed to update user: ${error.message}`);
      } else {
        toast.success("User details updated!");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, full_name: editName, phone: editPhone, role: editRole }
              : u
          )
        );
        setEditingUserId(null);
      }
    } catch {
      toast.error("Failed to save user updates");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user profile?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").delete().eq("id", userId);

      if (error) {
        toast.error(`Failed to delete profile: ${error.message}`);
      } else {
        toast.success("User profile deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch {
      toast.error("Failed to delete user profile");
    }
  };

  const filtered = users.filter((u) => {
    const name = u.full_name || "";
    const email = u.email || "";
    const phone = u.phone || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            View and manage all registered customer accounts & staff data (passwords excluded)
          </p>
        </div>
        <span className="px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-semibold text-foreground-secondary self-start sm:self-auto">
          Total Users: {users.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-border mt-6">
          <UserIcon className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold">No registered users found</h3>
          <p className="text-xs text-foreground-secondary mt-1">
            Accounts created on LUTORA will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((userItem, i) => {
            const fullName = userItem.full_name || "User";
            const initials = fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();
            const isEditing = editingUserId === userItem.id;
            const ordersCount = userItem.orders_count || 0;
            const addressesCount = userItem.addresses_count || 0;

            return (
              <motion.div
                key={userItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-border p-5 shadow-sm"
              >
                {isEditing ? (
                  /* Edit Form Mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-sm font-bold text-accent">Edit User: {userItem.email}</h3>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="p-1 text-foreground-muted hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-foreground-secondary block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground-secondary block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground-secondary block mb-1">
                          Role Privilege
                        </label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent capitalize"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="px-4 py-2 bg-background-secondary text-foreground-secondary text-xs font-medium rounded-xl hover:bg-border transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(userItem.id)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal View Mode */
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent-light text-accent text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold">{fullName}</span>
                          {userItem.role === "admin" ? (
                            <span className="px-2 py-0.5 bg-accent-light text-accent text-[10px] font-bold rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-background-secondary text-foreground-secondary text-[10px] font-medium rounded-full">
                              Customer
                            </span>
                          )}
                        </div>

                        {/* Metadata Details Grid */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted mt-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-foreground-muted" />
                            {userItem.email}
                          </span>

                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-foreground-muted" />
                            {userItem.phone || "No phone"}
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
                            Joined {formatDate(userItem.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-foreground-secondary mt-2">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <Package className="w-3.5 h-3.5 text-accent" />
                            {ordersCount} Orders
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {addressesCount} Saved Addresses
                          </span>
                          <span>·</span>
                          <span className="text-foreground-muted text-[10px] font-mono">
                            ID: {userItem.id.slice(0, 13)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleStartEdit(userItem)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-foreground-secondary bg-background-secondary hover:bg-accent-light hover:text-accent rounded-xl border border-border transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit User
                      </button>

                      <button
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-xl transition-colors"
                        title="Delete User Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
