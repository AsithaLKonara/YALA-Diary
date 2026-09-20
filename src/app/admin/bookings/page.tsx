"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";
import NewBookingPanel from "@/components/admin/NewBookingPanel";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "CHECKED_OUT", label: "Checked Out" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked In",
  CHECKED_OUT: "Checked Out",
  CANCELLED: "Cancelled",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showNewBooking, setShowNewBooking] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        !search ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.ref.toLowerCase().includes(search.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, bookings]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <>
      <AdminTopbar title="Bookings" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Bookings</h1>
            <p>{filtered.length} total bookings</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost">
              <DownloadIcon /> Export CSV
            </button>
            <button onClick={() => setShowNewBooking(true)} className="btn-primary">
              <PlusIcon /> New Booking
            </button>
          </div>
        </div>

        <div className="admin-table-wrapper">
          {/* Toolbar */}
          <div className="admin-table-toolbar">
            <div className="admin-filters">
              <div className="admin-topbar-search" style={{ minWidth: 260 }}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search by name, ref, email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <select
                className="admin-filter-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>
                      <Loader2 size={24} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--dash-muted)" }}>
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link href={`/admin/bookings/${b.id}`} className="ref-link">
                          {b.ref}
                        </Link>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.guestName}</div>
                        <div className="muted">{b.guestCountry}</div>
                      </td>
                      <td>
                        <div>{b.room?.number || "Unassigned"}</div>
                        <div className="muted">{b.roomType?.name}</div>
                      </td>
                      <td>
                        <div>{new Date(b.checkIn).toLocaleDateString()}</div>
                        <div className="muted">to {new Date(b.checkOut).toLocaleDateString()}</div>
                      </td>
                      <td style={{ textAlign: "center" }}>{b.adults + b.children}</td>
                      <td>
                        <StatusBadge status={b.status} label={STATUS_LABEL[b.status] || b.status} />
                        <div style={{ fontSize: 10, marginTop: 4, color: "var(--dash-muted)" }}>{b.paymentStatus}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {b.status === "CANCELLED" ? (
                          <span className="muted">—</span>
                        ) : (
                          `$${b.totalRevenue.toLocaleString()}`
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          <Link href={`/admin/bookings/${b.id}`} className="row-action-btn">View</Link>
                          {b.status === "PENDING" && (
                            <button className="row-action-btn" onClick={() => handleUpdateStatus(b.id, "CONFIRMED")} style={{ color: "var(--dash-success)", borderColor: "rgba(76,175,114,0.3)" }}>
                              Confirm
                            </button>
                          )}
                          {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                            <button className="row-action-btn" onClick={() => handleUpdateStatus(b.id, "CANCELLED")} style={{ color: "var(--dash-danger)", borderColor: "rgba(224,82,82,0.3)" }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="admin-table-footer">
              <span className="admin-table-count">
                Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-ghost"
                  style={{ padding: "5px 12px", fontSize: "0.75rem" }}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="btn-ghost"
                    style={{
                      padding: "5px 10px",
                      fontSize: "0.75rem",
                      background: p === page ? "var(--dash-accent-dim)" : undefined,
                      color: p === page ? "var(--dash-accent)" : undefined,
                      borderColor: p === page ? "var(--dash-accent)" : undefined,
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn-ghost"
                  style={{ padding: "5px 12px", fontSize: "0.75rem" }}
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewBooking && (
        <NewBookingPanel
          onClose={() => setShowNewBooking(false)}
          onSuccess={() => {
            setShowNewBooking(false);
            fetchBookings();
          }}
        />
      )}
    </>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  // Map enum statuses to CSS classes (pending, confirmed, checked_in, checked_out, cancelled)
  const cls = status.toLowerCase();
  return <span className={`status-badge ${cls}`}>{label}</span>;
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,253,248,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
