"use client";

import React, { useState } from "react";
import { Loader2, X } from "lucide-react";

interface NewSafariSlotPanelProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewSafariSlotPanel({ onClose, onSuccess }: NewSafariSlotPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    slotType: "AM",
    capacity: 6,
    guide: ""
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/safaris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create safari slot");
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
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

        <h2 style={{ fontSize: "1.5rem", marginBottom: 5 }}>New Safari Slot</h2>
        <p style={{ color: "var(--dash-muted)", marginBottom: 30 }}>Provision a new safari capacity block for guests to book.</p>

        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginBottom: 15, color: "var(--dash-accent)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Schedule Details</h3>
          <div className="form-grid" style={{ marginBottom: 40 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" required value={formData.date} onChange={e => handleChange("date", e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Slot Type *</label>
              <select className="form-input" required value={formData.slotType} onChange={e => handleChange("slotType", e.target.value)}>
                <option value="AM">AM (Morning)</option>
                <option value="PM">PM (Afternoon)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Capacity (Seats) *</label>
              <input type="number" min="1" max="20" className="form-input" required value={formData.capacity} onChange={e => handleChange("capacity", parseInt(e.target.value))} />
            </div>
            
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Assigned Guide (Optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Asitha" value={formData.guide} onChange={e => handleChange("guide", e.target.value)} />
            </div>
          </div>

          {error && <div style={{ color: "var(--dash-danger)", marginBottom: 20 }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 15 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {loading && <Loader2 size={16} className="spinner" />}
              Create Slot
            </button>
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
