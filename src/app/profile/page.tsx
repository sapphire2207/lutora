"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  Package,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  // Demo profile data
  const profile = {
    full_name: "Guest User",
    email: "guest@lutora.in",
    phone: "9876543210",
    avatar: null,
    addresses: [
      {
        id: "1",
        label: "Home",
        address_line: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        pincode: "400001",
        is_default: true,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10 max-w-2xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage your account settings
          </p>
        </motion.div>

        {/* Avatar & Name */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mt-8 p-6 bg-white rounded-2xl border border-border"
        >
          <div className="w-16 h-16 rounded-full bg-accent-light text-accent text-xl font-bold flex items-center justify-center">
            {profile.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-foreground-secondary">{profile.email}</p>
          </div>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <h3 className="text-sm font-semibold px-6 pt-5 pb-3">
            Personal Information
          </h3>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Full Name</p>
                  <p className="text-sm font-medium">{profile.full_name}</p>
                </div>
              </div>
              <button className="text-xs text-accent font-medium">Edit</button>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Email</p>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Phone</p>
                  <p className="text-sm font-medium">+91 {profile.phone}</p>
                </div>
              </div>
              <button className="text-xs text-accent font-medium">Edit</button>
            </div>
          </div>
        </motion.div>

        {/* Saved Addresses */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-sm font-semibold">Saved Addresses</h3>
            <button className="text-xs text-accent font-medium">Add New</button>
          </div>
          <div className="divide-y divide-border">
            {profile.addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between px-6 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-foreground-muted mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{addr.label}</p>
                      {addr.is_default && (
                        <span className="px-1.5 py-0.5 bg-accent-light text-accent text-[9px] font-bold rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground-secondary mt-0.5">
                      {addr.address_line}, {addr.city} - {addr.pincode}
                    </p>
                  </div>
                </div>
                <button className="text-xs text-accent font-medium">Edit</button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <Link
            href="/orders"
            className="flex items-center justify-between px-6 py-4 hover:bg-background-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-foreground-muted" />
              <span className="text-sm font-medium">Order History</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground-muted" />
          </Link>
          <div className="border-t border-border">
            <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-background-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-foreground-muted" />
                <span className="text-sm font-medium">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground-muted" />
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-danger/20 text-danger text-sm font-medium rounded-2xl hover:bg-danger-light transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
