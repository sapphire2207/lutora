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
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();

  if (isLoading) {
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
          <div className="w-16 h-16 mx-auto bg-background-secondary rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-foreground-muted" />
          </div>
          <h1 className="text-xl font-bold">Sign in to view your profile</h1>
          <p className="text-sm text-foreground-secondary mt-1 max-w-xs mx-auto">
            Manage your orders, saved addresses, and profile details.
          </p>
          <Link
            href="/sign-in?redirect=/profile"
            className="inline-flex items-center justify-center mt-6 px-7 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const fullName = profile?.full_name || user.user_metadata?.full_name || "Makhna Lover";
  const email = profile?.email || user.email || "";
  const phone = profile?.phone || user.phone || "Not set";
  const userInitials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <div className="container-app py-6 md:py-10 max-w-2xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Avatar & Name */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-4 mt-8 p-6 bg-white rounded-2xl border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-light text-accent text-xl font-bold flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{fullName}</h2>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-accent-light text-accent text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground-secondary">{email}</p>
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full transition-colors"
            >
              Dashboard
            </Link>
          )}
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
                  <p className="text-sm font-medium">{fullName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Email</p>
                  <p className="text-sm font-medium">{email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Phone</p>
                  <p className="text-sm font-medium">{phone}</p>
                </div>
              </div>
            </div>
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
          {isAdmin && (
            <div className="border-t border-border">
              <Link
                href="/admin"
                className="flex items-center justify-between px-6 py-4 hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-center gap-3 text-accent">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold">Admin Portal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-accent" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-danger/20 text-danger text-sm font-medium rounded-2xl hover:bg-danger-light transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
