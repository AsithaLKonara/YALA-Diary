"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";
import NewSafariSlotPanel from "@/components/admin/NewSafariSlotPanel";

export default function SafarisPage() {
  const [safaris, setSafaris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSlot, setShowNewSlot] = useState(false);

  useEffect(() => {
    fetchSafaris();
  }, []);

  const fetchSafaris = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/safaris");
      const data = await res.json();
      if (data.safaris) setSafaris(data.safaris);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dates = [...new Set(safaris.map((s) => s.date))].sort();

  return (
    <>
      <AdminTopbar title="Safari Slots" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Safari Schedule</h1>
            <p>Manage AM &amp; PM safari slots and capacity</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost">Print Schedule</button>
            <button onClick={() => setShowNewSlot(true)} className="btn-primary">Add Slot</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Loader2 size={32} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
          </div>
        ) : dates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--dash-muted)" }}>
            No safari slots scheduled. Click "Add Slot" to create one.
          </div>
        ) : (
          dates.map((date) => {
            const daySlots = safaris.filter((s) => s.date === date);
            const dateObj = new Date(date);
            const formatted = dateObj.toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });
            return (
              <div key={date} style={{ marginBottom: 28 }}>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 400,
                  color: "var(--dash-muted)",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--dash-border)",
                }}>
                  {formatted}
                </h2>
                <div className="safari-grid">
                  {daySlots.map((slot) => {
                    const pct = Math.round((slot.booked / slot.capacity) * 100);
                    const full = slot.booked >= slot.capacity;
                    return (
                      <div key={slot.id} className={`safari-slot-card ${full ? "safari-capacity-full" : ""}`}>
                        <div className="safari-slot-header">
                          <div className="safari-slot-name">{slot.slot === "AM" ? "🌅 Morning Safari" : "🌇 Afternoon Safari"}</div>
                          <span className={slot.slot === "AM" ? "safari-slot-am" : "safari-slot-pm"}>{slot.slot}</span>
                        </div>

                        <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>
                          Guide: {slot.guide}
                        </div>

                        <div className="safari-capacity-bar">
                          <div
                            className="safari-capacity-fill"
                            style={{
                              width: `${Math.min(100, pct)}%`,
                              background: full ? "var(--dash-danger)" : "var(--dash-accent)",
                            }}
                          />
                        </div>

                        <div className="safari-slot-meta" style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{slot.booked}/{slot.capacity} seats</span>
                          <span style={{ color: full ? "var(--dash-danger)" : "var(--dash-success)" }}>
                            {full ? "Full" : `${slot.capacity - slot.booked} available`}
                          </span>
                        </div>

                        {slot.guests && slot.guests.length > 0 && (
                          <div style={{ marginTop: 12, fontSize: "0.8rem" }}>
                            <div style={{ color: "var(--dash-muted)", marginBottom: 4 }}>Guests:</div>
                            {slot.guests.map((g: string, i: number) => (
                              <div key={i} style={{ color: "var(--dash-text)", padding: "2px 0" }}>
                                · {g}
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                          <button className="btn-ghost" style={{ fontSize: "0.72rem", padding: "4px 10px" }}>Edit</button>
                          <button className="btn-danger" style={{ fontSize: "0.72rem", padding: "4px 10px" }}>Cancel</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewSlot && (
        <NewSafariSlotPanel
          onClose={() => setShowNewSlot(false)}
          onSuccess={() => {
            setShowNewSlot(false);
            fetchSafaris();
          }}
        />
      )}
    </>
  );
}
