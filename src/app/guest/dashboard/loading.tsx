import React from "react";
import { Loader2 } from "lucide-react";

export default function GuestDashboardLoading() {
  return (
    <div className="admin-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--dash-muted)" }}>
        <Loader2 size={40} className="spinner" style={{ margin: "0 auto 16px", color: "var(--primary)" }} />
        <p style={{ fontSize: "1.1rem" }}>Loading your dashboard...</p>
      </div>
    </div>
  );
}
