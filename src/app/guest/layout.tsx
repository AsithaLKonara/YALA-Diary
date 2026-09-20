import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Calendar, Home, Settings, CreditCard } from "lucide-react";
import "@/app/admin/admin.css"; // Reuse the admin shell styling for consistency

export const metadata: Metadata = {
  title: "Guest Dashboard — Yala Diary",
  description: "View your bookings, payments, and itineraries.",
  robots: { index: false },
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar glass">
        <div className="admin-sidebar-logo">
          <Link href="/guest/dashboard" style={{ textDecoration: "none" }}>
            <span className="admin-sidebar-logo-main">Yala Diary</span>
            <span className="admin-sidebar-logo-sub">Guest Panel</span>
          </Link>
        </div>

        <nav className="sidebar-nav" style={{ padding: "16px 0", flex: 1 }}>
          <Link href="/guest/dashboard" className="admin-nav-item">
            <Home size={18} />
            <span>Overview</span>
          </Link>
          <Link href="/guest/dashboard/bookings" className="admin-nav-item">
            <Calendar size={18} />
            <span>My Bookings</span>
          </Link>
          <Link href="/guest/dashboard/billing" className="admin-nav-item">
            <CreditCard size={18} />
            <span>Billing & Payments</span>
          </Link>
          <Link href="/guest/dashboard/settings" className="admin-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer" style={{ borderTop: "1px solid var(--dash-border)", paddingTop: 16 }}>
          <Link href="/api/auth/signout" className="admin-nav-item text-danger" style={{ width: "100%", justifyContent: "flex-start", color: "var(--dash-danger)" }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
      
      <div className="admin-main" style={{ paddingTop: 0 }}>
        {children}
      </div>
    </div>
  );
}
