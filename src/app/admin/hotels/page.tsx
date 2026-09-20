"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    try {
      const res = await fetch("/api/admin/hotels");
      const json = await res.json();
      if (res.ok) setHotels(json.hotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/integrations/siteminder/sync", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to sync");
      alert(`Sync completed. Imported/Updated ${json.syncedCount} properties.`);
      fetchHotels();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <AdminTopbar title="Hotel Catalog" />
      <div className="admin-content">
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Properties</h2>
          <button onClick={handleSync} disabled={syncing} className="btn-primary">
            {syncing ? "Syncing..." : "Run Provider Sync"}
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: 16, borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>Category</th>
                <th>Rooms</th>
                <th>Status</th>
                <th>Provider ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading...</td></tr>
              ) : hotels.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center" }}>No hotels found. Run sync to import.</td></tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{hotel.name}</div>
                      <div className="muted">{hotel.address}</div>
                    </td>
                    <td>{hotel.category || <span className="muted">Uncategorized</span>}</td>
                    <td>{hotel.roomTypes?.length || 0} Types</td>
                    <td>
                      <span style={{
                        background: hotel.active ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                        color: hotel.active ? "#4ade80" : "#ef4444",
                        padding: "4px 8px", borderRadius: 12, fontSize: "0.7rem", fontWeight: 600
                      }}>
                        {hotel.active ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="muted" style={{ fontSize: "0.8rem" }}>{hotel.externalId || "N/A"}</td>
                    <td>
                      <Link href={`/admin/hotels/${hotel.id}`} className="btn-ghost" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        Configure
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
