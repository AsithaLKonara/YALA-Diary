"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { MOCK_BOOKINGS, BookingStatus } from "@/app/admin/data";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => {
      const matchSearch =
        !search ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.ref.toLowerCase().includes(search.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

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
            <Link href="/admin/bookings/new" className="btn-primary">
              <PlusIcon /> New Booking
            </Link>
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
              <input
                type="date"
                className="admin-filter-input"
                placeholder="Check-in from"
              />
              <input
                type="date"
                className="admin-filter-input"
                placeholder="Check-in to"
              />
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
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Nights</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "var(--dash-muted)" }}>
                      No bookings match your filters.
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
                        <div>{b.room}</div>
                        <div className="muted">{b.roomType}</div>
                      </td>
                      <td>{b.checkIn}</td>
                      <td>{b.checkOut}</td>
                      <td style={{ textAlign: "center" }}>{b.nights}</td>
                      <td style={{ textAlign: "center" }}>{b.adults + b.children}</td>
                      <td>
                        <StatusBadge status={b.status} label={STATUS_LABEL[b.status]} />
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {b.status === "cancelled" ? (
                          <span className="muted">—</span>
                        ) : (
                          `$${b.revenue.toLocaleString()}`
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          <Link href={`/admin/bookings/${b.id}`} className="row-action-btn">View</Link>
                          {b.status === "pending" && (
                            <button className="row-action-btn" style={{ color: "var(--dash-success)", borderColor: "rgba(76,175,114,0.3)" }}>
                              Confirm
                            </button>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <button className="row-action-btn" style={{ color: "var(--dash-danger)", borderColor: "rgba(224,82,82,0.3)" }}>
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
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`status-badge ${status}`}>{label}</span>;
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
