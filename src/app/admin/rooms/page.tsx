"use client";

import React, { useState } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { MOCK_ROOMS } from "@/app/admin/data";

type Filter = "all" | "available" | "occupied" | "maintenance";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Rooms" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
];

export default function RoomsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? MOCK_ROOMS : MOCK_ROOMS.filter((r) => r.status === filter);

  const counts = {
    available: MOCK_ROOMS.filter((r) => r.status === "available").length,
    occupied: MOCK_ROOMS.filter((r) => r.status === "occupied").length,
    maintenance: MOCK_ROOMS.filter((r) => r.status === "maintenance").length,
  };

  return (
    <>
      <AdminTopbar title="Rooms" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Room Inventory</h1>
            <p>{MOCK_ROOMS.length} rooms total — {counts.occupied} occupied, {counts.available} available, {counts.maintenance} maintenance</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-primary">Add Room</button>
          </div>
        </div>

        {/* Summary stat chips */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className="btn-ghost"
              onClick={() => setFilter(opt.value)}
              style={{
                background: filter === opt.value ? "var(--dash-accent-dim)" : undefined,
                color: filter === opt.value ? "var(--dash-accent)" : undefined,
                borderColor: filter === opt.value ? "var(--dash-accent)" : undefined,
              }}
            >
              {opt.label}
              {opt.value !== "all" && (
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  {counts[opt.value as keyof typeof counts]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="rooms-grid">
          {filtered.map((room) => (
            <div key={room.id} className="room-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div className="room-number">{room.number}</div>
                <span className={`status-badge ${room.status}`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
              <div className="room-type">{room.type}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 10 }}>
                Capacity: {room.capacity} guests
              </div>

              {room.currentGuest && (
                <div style={{
                  background: "var(--dash-surface-2)",
                  borderRadius: 4,
                  padding: "8px 10px",
                  marginBottom: 8,
                }}>
                  <div className="room-guest-name">{room.currentGuest}</div>
                  <div className="room-checkout">Check-out: {room.checkOut}</div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div className="room-price">${room.pricePerNight}/night</div>
                <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: "0.72rem" }}>
                  {room.status === "maintenance" ? "Mark Available" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
