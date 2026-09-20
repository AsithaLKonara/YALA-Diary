"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { MOCK_GUESTS } from "@/app/admin/data";

export default function GuestsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return MOCK_GUESTS;
    const q = search.toLowerCase();
    return MOCK_GUESTS.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.country.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <AdminTopbar title="Guests" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Guests</h1>
            <p>{MOCK_GUESTS.length} registered guests</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost">Export CSV</button>
            <button className="btn-primary">Add Guest</button>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <div className="admin-table-toolbar">
            <div className="admin-filters">
              <div className="admin-topbar-search" style={{ minWidth: 260 }}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search guests…"
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
                {filtered.length === 0 ? (
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
                            {g.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{g.name}</div>
                            <div className="muted">{g.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{g.phone}</td>
                      <td>{g.country}</td>
                      <td style={{ textAlign: "center" }}>{g.totalBookings}</td>
                      <td style={{ fontWeight: 600 }}>${g.totalSpend.toLocaleString()}</td>
                      <td className="muted">{g.lastStay}</td>
                      <td>
                        <div className="row-actions">
                          <Link href={`/admin/guests/${g.id}`} className="row-action-btn">View</Link>
                          <Link href={`/admin/bookings/new?guest=${g.id}`} className="row-action-btn">Book</Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="admin-table-footer">
            <span className="admin-table-count">{filtered.length} guests</span>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,253,248,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
