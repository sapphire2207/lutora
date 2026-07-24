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
  Edit2,
  Plus,
  Trash2,
  Check,
  X,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, isAdmin, signOut, refreshProfile } = useAuth();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newFlatHouseBuilding, setNewFlatHouseBuilding] = useState("");
  const [newAreaStreetSector, setNewAreaStreetSector] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newCity, setNewCity] = useState("Mumbai");
  const [newState, setNewState] = useState("Maharashtra");
  const [newPincode, setNewPincode] = useState("400001");
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Load user data into edit state & fetch addresses
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    async function fetchAddresses() {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching addresses:", error.message);
        } else {
          setAddresses(data || []);
        }
      } catch (err) {
        console.error("Addresses error:", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    }

    fetchAddresses();
  }, [user]);

  // Handle Save Profile
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.success("Profile updated successfully!");
        await refreshProfile();
        setIsEditingProfile(false);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Add Address
  const handleAddAddress = async () => {
    if (!user) return;
    if (!newFlatHouseBuilding || !newAreaStreetSector || !newCity || !newState || !newPincode) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setIsSavingAddress(true);
    try {
      const supabase = createClient();
      const isFirst = addresses.length === 0;
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          label: newLabel,
          flat_house_building: newFlatHouseBuilding,
          area_street_sector: newAreaStreetSector,
          landmark: newLandmark || null,
          city: newCity,
          state: newState,
          pincode: newPincode,
          is_default: isFirst,
        })
        .select()
        .single();

      if (error) {
        toast.error(`Failed to add address: ${error.message}`);
      } else {
        toast.success("Address added!");
        setAddresses([data, ...addresses]);
        setIsAddingAddress(false);
        setNewFlatHouseBuilding("");
        setNewAreaStreetSector("");
        setNewLandmark("");
      }
    } catch {
      toast.error("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);

      if (error) {
        toast.error(`Failed to delete address: ${error.message}`);
      } else {
        toast.success("Address deleted!");
        setAddresses(addresses.filter((a) => a.id !== addressId));
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

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

  const displayName = profile?.full_name || user.user_metadata?.full_name || "Makhana Lover";
  const displayEmail = profile?.email || user.email || "";
  const displayPhone = profile?.phone || user.phone || "Not set";
  const userInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

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
                <h2 className="text-lg font-semibold">{displayName}</h2>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-accent-light text-accent text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground-secondary">{displayEmail}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-accent-light hover:bg-accent hover:text-white rounded-full transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </button>
        </motion.div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-6 bg-white rounded-2xl border border-accent/30 shadow-md space-y-4"
          >
            <h3 className="text-sm font-bold text-foreground">Edit Profile Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Phone Number (+91)
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Personal Info Display */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <h3 className="text-sm font-semibold px-6 pt-5 pb-3">
            Personal Details
          </h3>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Full Name</p>
                  <p className="text-sm font-medium">{displayName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Email Address</p>
                  <p className="text-sm font-medium">{displayEmail}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-foreground-muted" />
                <div>
                  <p className="text-xs text-foreground-muted">Phone Number</p>
                  <p className="text-sm font-medium">{displayPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Addresses CRUD */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
            <h3 className="text-sm font-semibold">Saved Delivery Addresses</h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="flex items-center gap-1 text-xs text-accent font-semibold hover:text-accent-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingAddress ? "Cancel" : "Add New"}
            </button>
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <div className="p-6 bg-background-secondary border-b border-border space-y-3">
              <div className="flex gap-2 mb-2">
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                      newLabel === lbl
                        ? "bg-accent text-white border-accent"
                        : "bg-white border-border text-foreground-secondary"
                    )}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Flat / House No. / Building / Apartment *"
                value={newFlatHouseBuilding}
                onChange={(e) => setNewFlatHouseBuilding(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />

              <input
                type="text"
                placeholder="Area / Street / Sector / Village *"
                value={newAreaStreetSector}
                onChange={(e) => setNewAreaStreetSector(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />

              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City *"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  maxLength={6}
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <button
                onClick={handleAddAddress}
                disabled={isSavingAddress}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSavingAddress ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Address
              </button>
            </div>
          )}

          {/* List Saved Addresses */}
          {isLoadingAddresses ? (
            <div className="p-6 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-accent mx-auto" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="p-6 text-center text-xs text-foreground-muted">
              No saved addresses yet. Click &quot;Add New&quot; above or enter address on checkout.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between px-6 py-4"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{addr.label}</p>
                        {addr.is_default && (
                          <span className="px-1.5 py-0.5 bg-accent-light text-accent text-[9px] font-bold rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground-secondary mt-0.5">
                        {addr.flat_house_building || addr.address_line}
                        {addr.area_street_sector ? `, ${addr.area_street_sector}` : ""}
                        {addr.landmark ? `, Landmark: ${addr.landmark}` : ""}
                        {`, ${addr.city}`}{addr.state ? `, ${addr.state}` : ""} - {addr.pincode}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-foreground-muted hover:text-danger rounded-lg transition-colors"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
