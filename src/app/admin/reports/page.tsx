"use client";

import React, { useState } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { MONTHLY_REVENUE, OCCUPANCY_DATA, MOCK_BOOKINGS } from "@/app/admin/data";
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

const BOOKING_SOURCE = [
  { name: "Direct", value: 42 },
  { name: "Online Agent", value: 31 },
  { name: "Travel Agent", value: 18 },
  { name: "Walk-in", value: 9 },
];

const NATIONALITY_DATA = [
  { country: "UK", guests: 8 },
  { country: "France", guests: 6 },
  { country: "Germany", guests: 5 },
  { country: "Australia", guests: 5 },
  { country: "Japan", guests: 4 },
  { country: "India", guests: 4 },
  { country: "USA", guests: 3 },
];

const PIE_COLORS = ["#9acd32", "#4a9fd4", "#4caf72", "#d4a017"];

export default function ReportsPage() {
  const [range, setRange] = useState<"monthly" | "weekly">("monthly");
  const totalRevenue = MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const avgOccupancy = Math.round(OCCUPANCY_DATA.reduce((s, d) => s + d.rate, 0) / OCCUPANCY_DATA.length);
  const confirmedBookings = MOCK_BOOKINGS.filter((b) => b.status !== "cancelled").length;

  return (
    <>
      <AdminTopbar title="Reports" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Reports &amp; Analytics</h1>
            <p>Apr – Sep 2026 overview</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost">Export PDF</button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">Total Revenue (6 mo)</span></div>
            <div className="stat-card-value">${(totalRevenue / 1000).toFixed(0)}k</div>
            <span className="stat-delta up">+18% YoY</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">Avg Occupancy</span></div>
            <div className="stat-card-value">{avgOccupancy}%</div>
            <span className="stat-delta up">+5% vs last year</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">Total Bookings</span></div>
            <div className="stat-card-value">{confirmedBookings}</div>
            <span className="stat-delta up">+22% growth</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">Cancellation Rate</span></div>
            <div className="stat-card-value">
              {Math.round((MOCK_BOOKINGS.filter((b) => b.status === "cancelled").length / MOCK_BOOKINGS.length) * 100)}%
            </div>
            <span className="stat-delta down">+2% vs last month</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="dash-card" style={{ marginBottom: 20 }}>
          <div className="dash-card-header">
            <span className="dash-card-title">Revenue Trend</span>
            <div style={{ display: "flex", gap: 8 }}>
              {(["monthly", "weekly"] as const).map((r) => (
                <button
                  key={r}
                  className="btn-ghost"
                  style={{
                    padding: "4px 12px",
                    fontSize: "0.75rem",
                    background: range === r ? "var(--dash-accent-dim)" : undefined,
                    color: range === r ? "var(--dash-accent)" : undefined,
                  }}
                  onClick={() => setRange(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
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
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#9acd32" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy + Sources */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div className="dash-card">
            <div className="dash-card-header"><span className="dash-card-title">Occupancy Rate</span></div>
            <div className="dash-card-body" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OCCUPANCY_DATA} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }}
                    formatter={(v: number) => [`${v}%`, "Occupancy"]}
                  />
                  <Bar dataKey="rate" fill="rgba(154,205,50,0.35)" radius={[3, 3, 0, 0]}>
                    {OCCUPANCY_DATA.map((_, i) => (
                      <Cell key={i} fill={i === OCCUPANCY_DATA.length - 1 ? "#9acd32" : "rgba(154,205,50,0.3)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header"><span className="dash-card-title">Booking Sources</span></div>
            <div className="dash-card-body" style={{ height: 240, display: "flex", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={BOOKING_SOURCE} cx="40%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {BOOKING_SOURCE.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "rgba(244,253,248,0.7)" }} />
                  <Tooltip
                    contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }}
                    formatter={(v: number) => [`${v}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Nationality Bar */}
        <div className="dash-card">
          <div className="dash-card-header"><span className="dash-card-title">Top Guest Nationalities</span></div>
          <div className="dash-card-body" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NATIONALITY_DATA} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(244,253,248,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fill: "rgba(244,253,248,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f4fdf8" }} />
                <Bar dataKey="guests" fill="rgba(154,205,50,0.4)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
