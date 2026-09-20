"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2, X } from "lucide-react";
import NewBookingPanel from "@/components/admin/NewBookingPanel";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [guestBookings, setGuestBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [showNewBooking, setShowNewBooking] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guests");
      const data = await res.json();
      if (data.guests) setGuests(data.guests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openGuestPanel = async (guest: any) => {
    setSelectedGuest(guest);
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/admin/guests/${encodeURIComponent(guest.email)}/bookings`);
      const data = await res.json();
      if (data.bookings) setGuestBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return guests;
    const q = search.toLowerCase();
    return guests.filter(
      (g) =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.country && g.country.toLowerCase().includes(q))
    );
  }, [search, guests]);

  return (
    <>
      <AdminTopbar title="Guests" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Guests</h1>
            <p>{guests.length} registered guests</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost">Export CSV</button>
            <button onClick={() => setShowNewBooking(true)} className="btn-primary">Add Guest via Booking</button>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <div className="admin-table-toolbar">
            <div className="admin-filters">
              <div className="admin-topbar-search" style={{ minWidth: 260 }}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search guests by name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Bookings</th>
                  <th>Total Spend</th>
                  <th>Last Stay</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                      <Loader2 size={24} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--dash-muted)" }}>
                      No guests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "var(--dash-accent-dim)",
                            color: "var(--dash-accent)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.75rem", flexShrink: 0
                          }}>
                            {g.name ? g.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{g.name}</div>
                            <div className="muted">{g.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{g.phone || "—"}</td>
                      <td>{g.country || "—"}</td>
                      <td style={{ textAlign: "center", fontWeight: 500 }}>{g.totalBookings}</td>
                      <td style={{ fontWeight: 600 }}>${g.totalSpend.toLocaleString()}</td>
                      <td className="muted">{g.lastStay ? new Date(g.lastStay).toLocaleDateString() : "—"}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => openGuestPanel(g)} className="row-action-btn">View</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="admin-table-footer">
              <span className="admin-table-count">Showing {filtered.length} guests</span>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel Overlay */}
      {selectedGuest && (
        <div 
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9998,
            display: "flex",
            justifyContent: "flex-end",
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setSelectedGuest(null)}
        >
          <div 
            style={{
              width: "100%", maxWidth: 450,
              background: "var(--dash-surface)",
              height: "100%",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.2)",
              borderLeft: "1px solid var(--dash-border)",
              padding: 30,
              overflowY: "auto",
              position: "relative",
              animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button 
              onClick={() => setSelectedGuest(null)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "var(--dash-muted)", cursor: "pointer" }}
            >
              <X size={24} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 30, marginTop: 10 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--dash-accent-dim)", color: "var(--dash-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "1.5rem"
              }}>
                {selectedGuest.name ? selectedGuest.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{selectedGuest.name}</h2>
                <div style={{ color: "var(--dash-muted)" }}>{selectedGuest.email}</div>
              </div>
            </div>

            <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dash-muted)", marginBottom: 15 }}>CRM Metrics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 30 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 8 }}>
                <div style={{ color: "var(--dash-muted)", fontSize: "0.75rem", marginBottom: 5 }}>Lifetime Spend</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>${selectedGuest.totalSpend.toLocaleString()}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 8 }}>
                <div style={{ color: "var(--dash-muted)", fontSize: "0.75rem", marginBottom: 5 }}>Total Stays</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{selectedGuest.totalBookings}</div>
              </div>
            </div>

            <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dash-muted)", marginBottom: 15 }}>Contact Details</h3>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 8, marginBottom: 30, fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span className="muted">Phone</span>
                <span>{selectedGuest.phone || "Not provided"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Country</span>
                <span>{selectedGuest.country || "Not provided"}</span>
              </div>
            </div>

            <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dash-muted)", marginBottom: 15 }}>Booking History</h3>
            {loadingBookings ? (
              <div style={{ textAlign: "center", padding: 20 }}><Loader2 className="spinner" /></div>
            ) : guestBookings.length === 0 ? (
              <div style={{ color: "var(--dash-muted)", fontSize: "0.875rem" }}>No booking history found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {guestBookings.map((b) => (
                  <Link href={`/admin/bookings/${b.id}`} key={b.id} style={{ display: "block", background: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 8, textDecoration: "none", color: "inherit", border: "1px solid transparent", transition: "border 0.2s" }} className="hover-border-accent">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontWeight: 600, color: "var(--primary)" }}>{b.ref}</span>
                      <span style={{ fontSize: "0.75rem", padding: "2px 6px", borderRadius: 4, background: b.status === 'CONFIRMED' ? 'rgba(76,175,114,0.1)' : 'rgba(255,255,255,0.1)', color: b.status === 'CONFIRMED' ? 'var(--dash-success)' : 'inherit' }}>
                        {b.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", marginBottom: 5 }}>
                      {new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--dash-muted)" }}>
                      <span>{b.roomType?.name}</span>
                      <span>${b.totalRevenue.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global styles for animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .hover-border-accent:hover { border-color: rgba(154, 205, 50, 0.4) !important; }
      `}} />

      {showNewBooking && (
        <NewBookingPanel
          onClose={() => setShowNewBooking(false)}
          onSuccess={() => {
            setShowNewBooking(false);
            fetchGuests();
          }}
        />
      )}
    </>
  );
}

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,253,248,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
