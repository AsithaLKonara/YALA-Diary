"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { useParams, useRouter } from "next/navigation";

export default function ConfigureHotelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Yala Form State
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [distance, setDistance] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/admin/hotels/${id}`);
        const json = await res.json();
        if (res.ok && json.hotel) {
          setHotel(json.hotel);
          setCategory(json.hotel.category || "");
          setDescription(json.hotel.description || "");
          setDistance(json.hotel.distanceFromYala ? json.hotel.distanceFromYala.toString() : "");
          setActive(json.hotel.active || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          description,
          distanceFromYala: distance,
          active
        })
      });
      if (res.ok) {
        alert("Hotel configuration saved!");
        router.push("/admin/hotels");
      } else {
        alert("Failed to save configuration");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <>
      <AdminTopbar title={`Configure: ${hotel.name}`} />
      <div className="admin-content" style={{ maxWidth: 900 }}>

        <div className="dash-grid-2">
          
          {/* Yala Configuration Form */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Yala Configuration</h3>
            </div>
            <form onSubmit={handleSave} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="Budget">Budget</option>
                  <option value="Comfort">Comfort</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="form-group">
                <label>Distance from Yala (km)</label>
                <input 
                  type="number" step="0.1" className="form-input" 
                  value={distance} onChange={e => setDistance(e.target.value)} 
                  placeholder="e.g. 2.5"
                />
              </div>

              <div className="form-group">
                <label>Custom SEO Description</label>
                <textarea 
                  className="form-input" style={{ minHeight: 100 }}
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Override provider description for better SEO..."
                />
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <input 
                  type="checkbox" id="active"
                  checked={active} onChange={e => setActive(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="active" style={{ cursor: "pointer", fontWeight: 600 }}>
                  Publish Hotel (Make visible to customers)
                </label>
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--dash-border)" }}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Configuration"}
                </button>
              </div>

            </form>
          </div>

          {/* Provider Sync Data (Read-only) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Provider Data (Read-only)</h3>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 4 }}>External ID</div>
                <div style={{ fontFamily: "monospace" }}>{hotel.externalId}</div>
              </div>
              
              <div>
                <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 4 }}>Raw Facilities</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {hotel.facilities?.map((f: string, i: number) => (
                    <span key={i} style={{ background: "var(--dash-bg)", padding: "4px 8px", borderRadius: 4, fontSize: "0.8rem" }}>{f}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 8 }}>Imported Room Types</div>
                {hotel.roomTypes?.map((rt: any) => (
                  <div key={rt.id} style={{ background: "var(--dash-bg)", padding: 12, borderRadius: 6, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                      <span>{rt.name}</span>
                      <span>${rt.pricePerNight}</span>
                    </div>
                    <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>
                      Max Cap: {rt.maxCapacity} • Rate Plans: {rt.ratePlans?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
