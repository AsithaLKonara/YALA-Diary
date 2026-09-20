"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#9acd32", "#4a9fd4", "#4caf72", "#d4a017"];

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        return res.json();
      })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'Yala-Diary-Analytics-Report',
    pageStyle: `
      @page { size: landscape; margin: 20mm; }
      body { background: #0a110d; color: #f4fdf8; -webkit-print-color-adjust: exact; }
    `
  });

  return (
    <>
      <AdminTopbar title="Reports" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Reports &amp; Analytics</h1>
            <p>6-Month Business Overview</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost" onClick={() => handlePrint()} disabled={loading || !!error}>
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Loader2 size={32} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
          </div>
        ) : error ? (
          <div style={{ color: "var(--dash-danger)", padding: 20 }}>Error: {error}</div>
        ) : data && (
          <div ref={contentRef} style={{ padding: "1px" }}> {/* Added minimal padding for print safety */}
            {/* Summary stats */}
            <div className="stat-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card">
                <div className="stat-card-header"><span className="stat-card-label">Total Revenue (6 mo)</span></div>
                <div className="stat-card-value">${(data.kpis.totalRevenue / 1000).toFixed(1)}k</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header"><span className="stat-card-label">Avg Occupancy</span></div>
                <div className="stat-card-value">{data.kpis.avgOccupancy}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header"><span className="stat-card-label">Total Bookings</span></div>
                <div className="stat-card-value">{data.kpis.totalBookings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header"><span className="stat-card-label">Cancellation Rate</span></div>
                <div className="stat-card-value">{data.kpis.cancellationRate}%</div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="dash-card" style={{ marginBottom: 20 }}>
              <div className="dash-card-header">
                <span className="dash-card-title">Revenue Trend</span>
              </div>
              <div className="dash-card-body" style={{ height: 260 }}>
                {data.trends.revenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.trends.revenue} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9acd32" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#9acd32" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }}
                        formatter={(v: unknown) => [`$${(v as number).toLocaleString()}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#9acd32" strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--dash-muted)" }}>No revenue data</div>
                )}
              </div>
            </div>

            {/* Occupancy + Sources */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="dash-card">
                <div className="dash-card-header"><span className="dash-card-title">Occupancy Rate</span></div>
                <div className="dash-card-body" style={{ height: 240 }}>
                  {data.trends.occupancy.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.trends.occupancy} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }}
                          formatter={(v: unknown) => [`${v as number}%`, "Occupancy"]}
                        />
                        <Bar dataKey="rate" fill="rgba(154,205,50,0.35)" radius={[3, 3, 0, 0]}>
                          {data.trends.occupancy.map((_: any, i: number) => (
                            <Cell key={i} fill={i === data.trends.occupancy.length - 1 ? "#9acd32" : "rgba(154,205,50,0.3)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--dash-muted)" }}>No occupancy data</div>
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header"><span className="dash-card-title">Booking Sources</span></div>
                <div className="dash-card-body" style={{ height: 240, display: "flex", alignItems: "center" }}>
                  {data.sources.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.sources} cx="40%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                          {data.sources.map((_: any, i: number) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "rgba(244,253,248,0.7)" }} />
                        <Tooltip
                          contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }}
                          formatter={(v: unknown) => [`${v as number}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--dash-muted)", width: "100%" }}>No source data</div>
                  )}
                </div>
              </div>
            </div>

            {/* Nationality Bar */}
            <div className="dash-card">
              <div className="dash-card-header"><span className="dash-card-title">Top Guest Nationalities</span></div>
              <div className="dash-card-body" style={{ height: 220 }}>
                {data.nationalities.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.nationalities} layout="vertical" barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="country" tick={{ fill: "rgba(244,253,248,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }} />
                      <Bar dataKey="guests" fill="rgba(154,205,50,0.4)" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                   <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--dash-muted)" }}>No nationality data</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
