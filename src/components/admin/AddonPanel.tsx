"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface AddonPanelProps {
  onClose: () => void;
  onSuccess: () => void;
  addon?: any | null; // If provided, we are in Edit mode
}

export default function AddonPanel({ onClose, onSuccess, addon }: AddonPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "SAFARI",
    price: 0,
    active: true,
    description: ""
  });

  useEffect(() => {
    if (addon) {
      setFormData({
        name: addon.name || "",
        category: addon.category || "SAFARI",
        price: addon.price || 0,
        active: addon.active ?? true,
        description: addon.description || ""
      });
    }
  }, [addon]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const url = addon ? `/api/admin/settings/addons/${addon.id}` : "/api/admin/settings/addons";
      const method = addon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save Add-on");
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!addon) return;
    if (!confirm("Are you sure you want to delete this Add-on Service?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings/addons/${addon.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete Add-on");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9998,
        display: "flex",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: "100%", maxWidth: 500,
          background: "var(--dash-surface)",
          height: "100%",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.2)",
          borderLeft: "1px solid var(--dash-border)",
          padding: 30,
          overflowY: "auto",
          position: "relative",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "var(--dash-muted)", cursor: "pointer" }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: "1.5rem", marginBottom: 5 }}>{addon ? "Edit Add-on Service" : "New Add-on Service"}</h2>
        <p style={{ color: "var(--dash-muted)", marginBottom: 30 }}>Configure a service that guests can add to their bookings.</p>

        <form onSubmit={handleSubmit}>
          
          <div className="form-grid" style={{ marginBottom: 40 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Service Name *</label>
              <input type="text" className="form-input" required placeholder="e.g. AM Safari" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" required value={formData.category} onChange={e => handleChange("category", e.target.value)}>
                <option value="SAFARI">Safari</option>
                <option value="FOOD">Food & Beverage</option>
                <option value="SPA">Spa & Wellness</option>
                <option value="TRANSPORT">Transport</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (USD) *</label>
              <input type="number" min="0" step="0.01" className="form-input" required value={formData.price} onChange={e => handleChange("price", parseFloat(e.target.value))} />
            </div>
            
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Description (Optional)</label>
              <textarea className="form-input" placeholder="Detailed description of the service..." value={formData.description} onChange={e => handleChange("description", e.target.value)} rows={3} />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="activeToggle" checked={formData.active} onChange={e => handleChange("active", e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--dash-accent)" }} />
              <label htmlFor="activeToggle" style={{ cursor: "pointer", fontWeight: 500 }}>Active (Available for booking)</label>
            </div>
          </div>

          {error && <div style={{ color: "var(--dash-danger)", marginBottom: 20 }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {addon && (
                <button type="button" className="btn-ghost" onClick={handleDelete} style={{ color: "var(--dash-danger)" }} disabled={loading}>
                  Delete
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 15 }}>
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {loading && <Loader2 size={16} className="spinner" />}
                {addon ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>

        </form>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}} />
    </div>
  );
}
