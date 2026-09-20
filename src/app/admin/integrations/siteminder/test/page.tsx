"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";

export default function SiteMinderTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runTest = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/integrations/siteminder/test");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to connect");
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <>
      <AdminTopbar title="SiteMinder Channels Plus Sandbox" />
      <div className="admin-content" style={{ maxWidth: 800 }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Connection Health</h2>
          <button onClick={runTest} disabled={loading} className="btn-primary">
            {loading ? "Testing..." : "Refresh Connection"}
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: 16, borderRadius: 8, marginBottom: 20 }}>
            <strong>Connection Failed:</strong> {error}
          </div>
        )}

        {data && (
          <div className="dash-grid-2">
            
            <div className="dash-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.9rem", color: "var(--dash-muted)", marginBottom: 12 }}>Status Overview</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Connection</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: data.status === "Connected" ? "#4ade80" : "#ef4444" }}>
                    {data.status === "Connected" ? "✓ Connected" : "✗ Disconnected"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Target Environment</div>
                  <div style={{ fontSize: "1rem" }}>{data.providerUrl}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Availability Engine</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#4ade80" }}>✓ {data.availabilityStatus}</div>
                </div>
              </div>
            </div>

            <div className="dash-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.9rem", color: "var(--dash-muted)", marginBottom: 12 }}>Inventory Sandbox</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Properties</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{data.propertiesCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Rooms</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{data.roomsCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>Rate Plans</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{data.ratePlansCount}</div>
                </div>
              </div>
            </div>

            <div className="dash-card" style={{ padding: 20, gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: "0.9rem", color: "var(--dash-muted)", marginBottom: 12 }}>Last Diagnostic Request</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", fontSize: "0.85rem", background: "var(--dash-bg)", padding: 12, borderRadius: 6 }}>
                <div><strong style={{ color: "var(--dash-muted)" }}>Timestamp:</strong> {new Date(data.lastRequest).toLocaleString()}</div>
                <div><strong style={{ color: "var(--dash-muted)" }}>Response:</strong> <span style={{ color: "#4ade80" }}>{data.lastResponse}</span></div>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
