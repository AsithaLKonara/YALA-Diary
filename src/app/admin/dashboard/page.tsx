import React from "react";
import AdminTopbar from "@/components/admin/Topbar";
import Link from "next/link";
import { MOCK_BOOKINGS, MOCK_ROOMS } from "@/app/admin/data";

// ─── Derived stats from mock data ───────────────
const activeBookings = MOCK_BOOKINGS.filter(
  (b) => b.status === "confirmed" || b.status === "checked_in"
).length;

const todayCheckins = MOCK_BOOKINGS.filter(
  (b) => b.checkIn === new Date().toISOString().split("T")[0]
).length;

const monthRevenue = MOCK_BOOKINGS.filter((b) => b.status !== "cancelled")
  .reduce((sum, b) => sum + b.revenue, 0);

const occupiedRooms = MOCK_ROOMS.filter((r) => r.status === "occupied").length;
const occupancyPct = Math.round((occupiedRooms / MOCK_ROOMS.length) * 100);

const upcomingBookings = MOCK_BOOKINGS.filter(
  (b) => b.status === "pending" || b.status === "confirmed"
).slice(0, 5);

const ACTIVITY = [
  { color: "var(--dash-success)", title: "Hiroshi Tanaka checked in — Room 105", time: "2 hours ago" },
  { color: "var(--dash-info)",    title: "New booking YD-2026-0006 by Sarah Mitchell", time: "4 hours ago" },
  { color: "var(--dash-accent)",  title: "Booking YD-2026-0001 confirmed", time: "Yesterday, 14:32" },
  { color: "var(--dash-danger)",  title: "Booking YD-2026-0007 cancelled by guest", time: "Yesterday, 09:15" },
  { color: "var(--dash-success)", title: "Elena Vasquez checked out — Room 102", time: "2 days ago" },
];

export default function DashboardPage() {
  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="admin-content">

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link href="/admin/bookings/new" className="btn-primary">
            <PlusIcon /> New Booking
          </Link>
          <button className="btn-ghost">
            <BlockIcon /> Block Room
          </button>
          <button className="btn-ghost">
            <DownloadIcon /> Export Report
          </button>
        </div>

        {/* KPI Stat Cards */}
        <div className="stat-grid">
          <StatCard
            label="Today's Check-ins"
            value={todayCheckins.toString()}
            sub="Arriving today"
            iconBg="var(--dash-accent-dim)"
            icon={<CalendarCheckIcon />}
            delta="+2"
            deltaDir="up"
          />
          <StatCard
            label="Active Bookings"
            value={activeBookings.toString()}
            sub="Confirmed + Checked In"
            iconBg="rgba(74,159,212,0.12)"
            icon={<BookingIcon />}
            delta="+5"
            deltaDir="up"
          />
          <StatCard
            label="Month Revenue"
            value={`$${(monthRevenue / 1000).toFixed(1)}k`}
            sub="Sep 2026"
            iconBg="rgba(76,175,114,0.12)"
            icon={<RevenueIcon />}
            delta="+12%"
            deltaDir="up"
          />
          <StatCard
            label="Occupancy Rate"
            value={`${occupancyPct}%`}
            sub={`${occupiedRooms} of ${MOCK_ROOMS.length} rooms`}
            iconBg="rgba(212,160,23,0.12)"
            icon={<OccupancyIcon />}
            delta="-3%"
            deltaDir="down"
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
                  {upcomingBookings.map((b) => (
                    <tr key={b.id}>
                      <td><Link href={`/admin/bookings/${b.id}`} className="ref-link">{b.ref}</Link></td>
                      <td>
                        <div>{b.guestName}</div>
                        <div className="muted">{b.guestCountry}</div>
                      </td>
                      <td>
                        <div>{b.room}</div>
                        <div className="muted">{b.roomType}</div>
                      </td>
                      <td>{b.checkIn}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
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
              {ACTIVITY.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color }} />
                  <div className="activity-content">
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Snapshot */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Room Status Snapshot</span>
            <Link href="/admin/rooms" className="btn-ghost" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>
              Manage Rooms
            </Link>
          </div>
          <div className="dash-card-body">
            <div className="rooms-grid">
              {MOCK_ROOMS.map((room) => (
                <div key={room.id} className="room-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="room-number">{room.number}</div>
                    <StatusBadge status={room.status} />
                  </div>
                  <div className="room-type">{room.type}</div>
                  {room.currentGuest && (
                    <>
                      <div className="room-guest-name">{room.currentGuest}</div>
                      <div className="room-checkout">Out: {room.checkOut}</div>
                    </>
                  )}
                  <div className="room-price">${room.pricePerNight}/night</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Shared sub-components ──────────────────────

function StatCard({ label, value, sub, iconBg, icon, delta, deltaDir }: {
  label: string; value: string; sub: string; iconBg: string;
  icon: React.ReactNode; delta: string; deltaDir: "up" | "down";
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon" style={{ background: iconBg }}>{icon}</div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span className={`stat-delta ${deltaDir}`}>{delta}</span>
        <span className="stat-card-sub">{sub}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label: Record<string, string> = {
    pending: "Pending", confirmed: "Confirmed", checked_in: "Checked In",
    checked_out: "Checked Out", cancelled: "Cancelled",
    available: "Available", occupied: "Occupied", maintenance: "Maintenance",
    AVAILABLE: "Available", OCCUPIED: "Occupied", MAINTENANCE: "Maintenance",
  };
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      {label[status] ?? status}
    </span>
  );
}

// ─── Inline icons ────────────────────────────────
function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function BlockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function CalendarCheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>;
}
function BookingIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dash-info)" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>;
}
function RevenueIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dash-success)" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
function OccupancyIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dash-warn)" strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
}
