"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Calendar, Home, Settings, CreditCard, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Overview", href: "/guest/dashboard", icon: Home },
  { label: "My Bookings", href: "/guest/dashboard/bookings", icon: Calendar },
  { label: "Billing & Payments", href: "/guest/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/guest/dashboard/settings", icon: Settings },
];

export default function GuestSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/guest/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ display: "none" /* Unhide if you add full mobile responsiveness to the layout shell */ }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar glass ${mobileOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="admin-sidebar-logo">
          <Link href="/guest/dashboard" style={{ textDecoration: "none" }}>
            <span className="admin-sidebar-logo-main">Yala Diary</span>
            <span className="admin-sidebar-logo-sub">Guest Panel</span>
          </Link>
        </div>

        <nav className="sidebar-nav" style={{ padding: "16px 0", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer" style={{ borderTop: "1px solid var(--dash-border)", paddingTop: 16 }}>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })} 
            className="admin-nav-item text-danger" 
            style={{ width: "100%", justifyContent: "flex-start", color: "var(--dash-muted)", border: "none", background: "transparent", cursor: "pointer", display: "flex", gap: "12px", padding: "10px 24px", fontSize: "0.875rem", fontWeight: 500, transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--dash-muted)"; }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
