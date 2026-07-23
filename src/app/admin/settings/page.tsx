"use client";

import { motion } from "framer-motion";
import { Store, Truck, Clock, Phone, Mail, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-foreground-secondary mt-1">Configure your restaurant</p>
      </motion.div>

      <div className="space-y-6 mt-6">
        {/* Restaurant Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-accent" /> Restaurant Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Restaurant Name</label>
              <input type="text" defaultValue="LUTORA — Peri Peri Makhna"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Address</label>
              <textarea defaultValue="123 Flavor Street, Food District, City - 400001" rows={2}
                className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-foreground-muted" /> Phone
                </label>
                <input type="tel" defaultValue="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-foreground-muted" /> Email
                </label>
                <input type="email" defaultValue="hello@lutora.in"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-accent" /> Delivery Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Delivery Fee (₹)</label>
              <input type="number" defaultValue={30}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Free Delivery Above (₹)</label>
              <input type="number" defaultValue={299}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
          </div>
        </motion.div>

        {/* Business Hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" /> Business Hours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mon - Sat</label>
              <input type="text" defaultValue="10:00 AM - 10:00 PM"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Sunday</label>
              <input type="text" defaultValue="11:00 AM - 9:00 PM"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <button onClick={handleSave} disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
