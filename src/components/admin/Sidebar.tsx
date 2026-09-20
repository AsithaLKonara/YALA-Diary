"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: GridIcon },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: CalendarIcon, badge: "3" },
      { label: "Guests", href: "/admin/guests", icon: UsersIcon },
      { label: "Rooms", href: "/admin/rooms", icon: HomeIcon },
      { label: "Safari Slots", href: "/admin/safaris", icon: SunIcon },
    ],
  },
  {
    section: "Analytics",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChartIcon },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: UsersIcon },
      { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <Link href="/admin/dashboard" style={{ textDecoration: "none" }}>
          <span className="admin-sidebar-logo-main">Yala Diary</span>
          <span className="admin-sidebar-logo-sub">Admin Panel</span>
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section} className="admin-nav-section">
            {!collapsed && (
              <div className="admin-nav-label">{group.section}</div>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
              >
                <item.icon />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-avatar">A</div>
        {!collapsed && (
          <div>
            <div className="admin-sidebar-user-name">Admin</div>
            <div className="admin-sidebar-user-role">Super Admin</div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Icons (inline SVG) ───────────────────────
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
