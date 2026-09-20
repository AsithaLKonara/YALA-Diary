"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface TopbarProps {
  title: string;
}

export default function AdminTopbar({ title }: TopbarProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial fetch
    fetch("/api/admin/notifications")
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
        if (typeof data.unreadCount === "number") setUnreadCount(data.unreadCount);
      })
      .catch(console.error);

    // 2. Connect to Server-Sent Events for real-time updates
    const sse = new EventSource("/api/admin/notifications/sse");
    
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "CONNECTED") return;

        // It's a new notification!
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    return () => {
      sse.close();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" })
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

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
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button 
            className="admin-topbar-icon-btn" 
            title="Notifications" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="admin-notif-dot" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "bold" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div style={{
              position: "absolute",
              top: "120%", right: 0,
              width: 350,
              background: "var(--dash-surface-2)",
              border: "1px solid var(--dash-border)",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              zIndex: 999,
              overflow: "hidden",
              animation: "fadeIn 0.2s ease-out"
            }}>
              <div style={{ padding: "16px", borderBottom: "1px solid var(--dash-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "var(--dash-accent)", fontSize: "0.8rem", cursor: "pointer" }}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center", color: "var(--dash-muted)", fontSize: "0.85rem" }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id, notif.read)}
                      style={{
                        padding: 16,
                        borderBottom: "1px solid var(--dash-border)",
                        background: notif.read ? "transparent" : "rgba(22,163,74,0.05)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        display: "flex",
                        gap: 12
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                        background: notif.read ? "transparent" : "var(--dash-accent)"
                      }} />
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--dash-text)", marginBottom: 4 }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)", lineHeight: 1.4, marginBottom: 8 }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link href="/" className="admin-topbar-icon-btn" title="View Site" aria-label="View public site">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        <div className="admin-topbar-avatar" title="Account">A</div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </header>
  );
}
