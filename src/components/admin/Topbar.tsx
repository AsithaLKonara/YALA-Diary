"use client";

import React from "react";
import Link from "next/link";

interface TopbarProps {
  title: string;
}

export default function AdminTopbar({ title }: TopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <span className="admin-page-title">{title}</span>
      </div>

      <div className="admin-topbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,253,248,0.4)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Search bookings, guests..." />
      </div>

      <div className="admin-topbar-right">
        <button className="admin-topbar-icon-btn" title="Notifications" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="admin-notif-dot" />
        </button>

        <Link href="/" className="admin-topbar-icon-btn" title="View Site" aria-label="View public site">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        <div className="admin-topbar-avatar" title="Account">A</div>
      </div>
    </header>
  );
}
