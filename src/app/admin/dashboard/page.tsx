"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import NewBookingPanel from "@/components/admin/NewBookingPanel";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeBookings: 0,
    todayCheckins: 0,
    monthRevenue: 0,
    occupancyPct: 0,
    occupiedRooms: 0,
    totalRooms: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivity();

    // SSE for Real-time Notifications/Activity
    const sse = new EventSource("/api/admin/notifications/sse");
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "CONNECTED") return;
        
        // Prepend new activity
        setRecentActivity((prev) => [data, ...prev].slice(0, 5));
        
        // Refresh dashboard stats aggressively when new bookings occur
        if (data.title.includes("Booking")) {
          fetchDashboardData();
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };
    return () => sse.close();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.upcomingBookings) setUpcomingBookings(data.upcomingBookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.notifications) setRecentActivity(data.notifications.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const exportReportCSV = () => {
    if (upcomingBookings.length === 0) return alert("No upcoming bookings to export.");
    const headers = ["Ref", "Guest Name", "Guest Email", "Country", "Check-in", "Check-out", "Room Type", "Status", "Revenue"];
    const rows = upcomingBookings.map(b => [
      b.ref, b.guestName, b.guestEmail, b.guestCountry, 
      format(new Date(b.checkIn), "yyyy-MM-dd"), 
      format(new Date(b.checkOut), "yyyy-MM-dd"),
      b.roomType?.name || "", b.status, b.totalRevenue
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(String).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `upcoming_bookings_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="admin-content">

        {/* Quick Actions */}
        <div className="quick-actions">
          <button onClick={() => setIsManualBookingOpen(true)} className="btn-primary">
            <PlusIcon /> New Booking
          </button>
          <button className="btn-ghost" onClick={() => window.print()}>
            <DownloadIcon /> Export PDF
          </button>
          <button onClick={exportReportCSV} className="btn-ghost">
            <DownloadIcon /> Export CSV
          </button>
        </div>

        {/* KPI Stat Cards */}
        <div className="stat-grid">
          <StatCard
            label="Today's Check-ins"
            value={stats.todayCheckins.toString()}
            sub="Arriving today"
            iconBg="var(--dash-accent-dim)"
            icon={<CalendarCheckIcon />}
          />
          <StatCard
            label="Active Bookings"
            value={stats.activeBookings.toString()}
            sub="Confirmed + Checked In"
            iconBg="rgba(74,159,212,0.12)"
            icon={<BookingIcon />}
          />
          <StatCard
            label="Month Revenue"
            value={`$${(stats.monthRevenue / 1000).toFixed(1)}k`}
            sub={format(new Date(), "MMM yyyy")}
            iconBg="rgba(76,175,114,0.12)"
            icon={<RevenueIcon />}
          />
          <StatCard
            label="Occupancy Rate"
            value={`${stats.occupancyPct}%`}
            sub={`${stats.occupiedRooms} of ${stats.totalRooms} rooms`}
            iconBg="rgba(212,160,23,0.12)"
            icon={<OccupancyIcon />}
          />
        </div>

        {/* Upcoming + Activity */}
        <div className="dash-grid-2">
          {/* Upcoming Bookings */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Upcoming Bookings</span>
              <Link href="/admin/bookings" className="btn-ghost" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>
                View All
              </Link>
            </div>
            <div className="admin-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--dash-muted)", padding: 20 }}>
                        {loading ? "Loading..." : "No upcoming bookings found."}
                      </td>
                    </tr>
                  ) : (
                    upcomingBookings.map((b) => (
                      <tr key={b.id}>
                        <td><Link href={`/admin/bookings/${b.id}`} className="ref-link">{b.ref}</Link></td>
                        <td>
                          <div>{b.guestName}</div>
                          <div className="muted">{b.guestCountry}</div>
                        </td>
                        <td>
                          <div>{b.room?.number || "Unassigned"}</div>
                          <div className="muted">{b.roomType?.name || ""}</div>
                        </td>
                        <td>{format(new Date(b.checkIn), "MMM dd")}</td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Recent Activity</span>
            </div>
            <div className="activity-list">
              {recentActivity.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: "var(--dash-muted)" }}>
                  No recent activity.
                </div>
              ) : (
                recentActivity.map((a) => (
                  <div key={a.id} className="activity-item">
                    <div className="activity-dot" style={{ background: a.type === "SUCCESS" ? "var(--dash-success)" : a.type === "WARNING" ? "var(--dash-warning)" : a.type === "ERROR" ? "var(--dash-danger)" : "var(--dash-info)" }} />
                    <div className="activity-content">
                      <div className="activity-title">{a.title}: {a.message}</div>
                      <div className="activity-time">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {isManualBookingOpen && (
        <NewBookingPanel 
          onClose={() => setIsManualBookingOpen(false)}
          onSuccess={() => {
            setIsManualBookingOpen(false);
            fetchDashboardData();
            fetchRecentActivity();
          }}
        />
      )}
    </>
  );
}

// ─── Shared Components ─────────────────────────

function StatCard({ label, value, sub, iconBg, icon, delta, deltaDir }: any) {
  return (
    <div className="dash-card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div className="stat-icon-wrap" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        {delta && (
          <span className={`stat-delta ${deltaDir}`}>
            {deltaDir === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
        <span className="stat-sub">{sub}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: "rgba(212,160,23,0.1)", color: "#eab308", label: "Pending" },
    CONFIRMED: { bg: "rgba(74,159,212,0.1)", color: "#38bdf8", label: "Confirmed" },
    CHECKED_IN: { bg: "rgba(76,175,114,0.1)", color: "#4ade80", label: "Checked In" },
    CHECKED_OUT: { bg: "rgba(255,255,255,0.05)", color: "#94a3b8", label: "Checked Out" },
    CANCELLED: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", label: "Cancelled" },
  };
  const cfg = map[status] || map.PENDING;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color, padding: "4px 8px", borderRadius: 12, fontSize: "0.7rem", fontWeight: 600,
    }}>
      {cfg.label}
    </span>
  );
}

// ─── Icons ─────────────────────────────────────
function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function BlockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
function CalendarCheckIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="m9 16 2 2 4-4" /></svg>;
}
function BookingIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14h6" /><path d="M9 18h6" /><path d="M9 10h.01" /></svg>;
}
function RevenueIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}
function OccupancyIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>;
}
