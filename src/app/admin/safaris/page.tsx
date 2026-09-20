import React from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { MOCK_SAFARIS } from "@/app/admin/data";

export default function SafarisPage() {
  const dates = [...new Set(MOCK_SAFARIS.map((s) => s.date))].sort();

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
            <button className="btn-primary">Add Slot</button>
          </div>
        </div>

        {dates.map((date) => {
          const daySlots = MOCK_SAFARIS.filter((s) => s.date === date);
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
                            width: `${pct}%`,
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

                      {slot.guests.length > 0 && (
                        <div style={{ marginTop: 12, fontSize: "0.8rem" }}>
                          <div style={{ color: "var(--dash-muted)", marginBottom: 4 }}>Guests:</div>
                          {slot.guests.map((g, i) => (
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
        })}
      </div>
    </>
  );
}
