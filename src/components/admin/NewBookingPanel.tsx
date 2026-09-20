"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface NewBookingPanelProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewBookingPanel({ onClose, onSuccess }: NewBookingPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    hotel: "Yala Diary",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    adults: 1,
    children: 0,
    roomTypeId: "",
    selectedAddons: [] as string[],
    guest: {
      name: "",
      email: "",
      phone: "",
      country: "",
      requests: ""
    },
    status: "CONFIRMED",
    paymentStatus: "UNPAID"
  });

  useEffect(() => {
    fetch("/api/booking/addons")
      .then(res => res.json())
      .then(data => setAddons(data.addons || []))
      .catch(console.error);

    fetch(`/api/booking/availability?checkIn=2030-01-01&checkOut=2030-01-02&adults=1&children=0`)
      .then(res => res.json())
      .then(data => {
        if (data.available) setRoomTypes(data.available);
        if (data.available && data.available.length > 0) {
          setFormData(prev => ({ ...prev, roomTypeId: data.available[0].id }));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (field: string, value: any, isGuest = false) => {
    if (isGuest) {
      setFormData(prev => ({ ...prev, guest: { ...prev.guest, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => {
      const selected = prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId];
      return { ...prev, selectedAddons: selected };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          addons: formData.selectedAddons
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create booking");
      
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
          width: "100%", maxWidth: 600,
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

        <h2 style={{ fontSize: "1.5rem", marginBottom: 5 }}>Manual Booking</h2>
        <p style={{ color: "var(--dash-muted)", marginBottom: 30 }}>Bypasses public checks and provisions a guest profile.</p>

        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginBottom: 15, color: "var(--dash-accent)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guest Details</h3>
          <div className="form-grid" style={{ marginBottom: 30 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" required value={formData.guest.name} onChange={e => handleChange("name", e.target.value, true)} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" required value={formData.guest.email} onChange={e => handleChange("email", e.target.value, true)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={formData.guest.phone} onChange={e => handleChange("phone", e.target.value, true)} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input type="text" className="form-input" value={formData.guest.country} onChange={e => handleChange("country", e.target.value, true)} />
            </div>
          </div>

          <h3 style={{ marginBottom: 15, color: "var(--dash-accent)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reservation</h3>
          <div className="form-grid" style={{ marginBottom: 30 }}>
            <div className="form-group">
              <label className="form-label">Check In *</label>
              <input type="date" className="form-input" required value={formData.checkIn} onChange={e => handleChange("checkIn", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Check Out *</label>
              <input type="date" className="form-input" required value={formData.checkOut} onChange={e => handleChange("checkOut", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Adults</label>
              <input type="number" min="1" className="form-input" required value={formData.adults} onChange={e => handleChange("adults", parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Children</label>
              <input type="number" min="0" className="form-input" required value={formData.children} onChange={e => handleChange("children", parseInt(e.target.value))} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Room Type *</label>
              <select className="form-input" required value={formData.roomTypeId} onChange={e => handleChange("roomTypeId", e.target.value)}>
                <option value="" disabled>Select a room type...</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.name} (${rt.pricePerNight}/night)</option>
                ))}
              </select>
            </div>
          </div>

          <h3 style={{ marginBottom: 15, color: "var(--dash-accent)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Add-ons</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}>
            {addons.map(addon => (
              <div 
                key={addon.id} 
                onClick={() => handleAddonToggle(addon.id)}
                style={{ 
                  padding: "8px 12px", 
                  borderRadius: 6, 
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  border: formData.selectedAddons.includes(addon.id) ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)",
                  background: formData.selectedAddons.includes(addon.id) ? "rgba(154, 205, 50, 0.1)" : "transparent"
                }}
              >
                {addon.name} (+${addon.price})
              </div>
            ))}
            {addons.length === 0 && <span className="muted">No add-ons available</span>}
          </div>

          <h3 style={{ marginBottom: 15, color: "var(--dash-accent)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</h3>
          <div className="form-grid" style={{ marginBottom: 40 }}>
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select className="form-input" value={formData.status} onChange={e => handleChange("status", e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CHECKED_IN">Checked In</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select className="form-input" value={formData.paymentStatus} onChange={e => handleChange("paymentStatus", e.target.value)}>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>

          {error && <div style={{ color: "var(--dash-danger)", marginBottom: 20 }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 15 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {loading && <Loader2 size={16} className="spinner" />}
              Create Booking
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
