"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GuestDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="admin-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--dash-muted)", maxWidth: 400 }}>
        <AlertCircle size={48} style={{ margin: "0 auto 16px", color: "var(--dash-danger)" }} />
        <h2 style={{ fontSize: "1.5rem", color: "var(--dash-text)", marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ fontSize: "0.95rem", marginBottom: 24 }}>
          We encountered an issue loading your dashboard. Please try again.
        </p>
        <button 
          onClick={() => reset()}
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <RefreshCcw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}
