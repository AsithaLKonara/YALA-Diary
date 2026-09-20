import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Calendar, Home, Settings, CreditCard } from "lucide-react";
import "@/app/admin/admin.css"; // Reuse the admin shell styling for consistency
import GuestSidebar from "@/components/guest/Sidebar";

export const metadata: Metadata = {
  title: "Guest Dashboard — Yala Diary",
  description: "View your bookings, payments, and itineraries.",
  robots: { index: false },
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <GuestSidebar />
      
      <div className="admin-main" style={{ paddingTop: 0 }}>
        {children}
      </div>
    </div>
  );
}
