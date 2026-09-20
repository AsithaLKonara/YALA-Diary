"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";
import AddonPanel from "@/components/admin/AddonPanel";

const ROOM_TYPES = [
  { id: "rt1", name: "Deluxe Tent", capacity: 2, price: 495, rooms: 5 },
  { id: "rt2", name: "Family Chalet", capacity: 4, price: 750, rooms: 2 },
  { id: "rt3", name: "Premium Suite", capacity: 3, price: 770, rooms: 3 },
  { id: "rt4", name: "Luxury Villa", capacity: 6, price: 1200, rooms: 1 },
];

const CATEGORY_LABELS: Record<string, string> = {
  SAFARI: "Safari",
  FOOD: "Food & Beverage",
  SPA: "Spa & Wellness",
  TRANSPORT: "Transport",
  OTHER: "Other",
};

export default function SettingsPage() {
  // Hotel Profile State
  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyCancellation, setNotifyCancellation] = useState(true);
  const [notifyCheckIn, setNotifyCheckIn] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Add-on Services State
  const [addons, setAddons] = useState<any[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);
  const [togglingAddonId, setTogglingAddonId] = useState<string | null>(null);
  const [addonPanelOpen, setAddonPanelOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<any | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchAddons();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/hotel");
      const data = await res.json();
      if (data.profile) {
        setHotelName(data.profile.hotelName || "");
        setAddress(data.profile.address || "");
        setPhone(data.profile.phone || "");
        setEmail(data.profile.email || "");
        setWebsite(data.profile.website || "");
        setCheckInTime(data.profile.checkInTime || "");
        setCheckOutTime(data.profile.checkOutTime || "");
        setNotifyNewBooking(data.profile.notifyNewBooking ?? true);
        setNotifyCancellation(data.profile.notifyCancellation ?? true);
        setNotifyCheckIn(data.profile.notifyCheckIn ?? true);
        setNotifyPayment(data.profile.notifyPayment ?? true);
      }
    } catch (err) {
      console.error(err);
      setProfileError("Failed to load hotel profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddons = async () => {
    setAddonsLoading(true);
    try {
      const res = await fetch("/api/admin/settings/addons");
      const data = await res.json();
      if (data.addons) setAddons(data.addons);
    } catch (err) {
      console.error(err);
    } finally {
      setAddonsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setProfileError("");
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/settings/hotel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          hotelName, address, phone, email, website, checkInTime, checkOutTime,
          notifyNewBooking, notifyCancellation, notifyCheckIn, notifyPayment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAddon = async (addon: any) => {
    setTogglingAddonId(addon.id);
    try {
      const res = await fetch(`/api/admin/settings/addons/${addon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !addon.active })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update addon");
      // Optimistic UI update
      setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, active: !a.active } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingAddonId(null);
    }
  };

  const openCreatePanel = () => {
    setEditingAddon(null);
    setAddonPanelOpen(true);
  };

  const openEditPanel = (addon: any) => {
    setEditingAddon(addon);
    setAddonPanelOpen(true);
  };

  const handleAddonSuccess = () => {
    setAddonPanelOpen(false);
    setEditingAddon(null);
    fetchAddons();
  };

  return (
    <>
      <AdminTopbar title="Settings" />
      <div className="admin-content" style={{ maxWidth: 900 }}>
        <div className="admin-page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage hotel profile, room types, and services</p>
          </div>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {saving && <Loader2 size={16} className="spinner" />}
            {saveSuccess ? "Saved Successfully!" : "Save Changes"}
          </button>
        </div>

        {profileError && <div style={{ color: "var(--dash-danger)", marginBottom: 20 }}>{profileError}</div>}

        {/* Hotel Profile */}
        <div className="detail-card settings-section">
          <div className="detail-card-header">
            <span className="detail-card-title">Hotel Profile</span>
          </div>
          <div className="detail-card-body">
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Loader2 className="spinner" style={{ color: "var(--primary)" }} />
              </div>
            ) : (
              <div className="settings-form-grid">
                <div className="form-group">
                  <label>Hotel Name</label>
                  <input className="form-input" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Reservations Email</label>
                  <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Check-in Time</label>
                  <input className="form-input" type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Check-out Time</label>
                  <input className="form-input" type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Types */}
        <div className="settings-section">
          <div className="settings-section-title">Room Types</div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Max Capacity</th>
                  <th>Price / Night</th>
                  <th>Rooms</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ROOM_TYPES.map((rt) => (
                  <tr key={rt.id}>
                    <td style={{ fontWeight: 500 }}>{rt.name}</td>
                    <td>{rt.capacity} guests</td>
                    <td style={{ fontWeight: 600 }}>${rt.price}</td>
                    <td>{rt.rooms}</td>
                    <td>
                      <div className="row-actions">
                        <button className="row-action-btn">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-on Services */}
        <div className="settings-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="settings-section-title" style={{ marginBottom: 0 }}>Add-on Services</div>
            <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "6px 16px" }} onClick={openCreatePanel}>
              + Add Service
            </button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addonsLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 30 }}>
                      <Loader2 size={20} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
                    </td>
                  </tr>
                ) : addons.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "var(--dash-muted)" }}>
                      No Add-on Services found. Click "+ Add Service" to create one.
                    </td>
                  </tr>
                ) : (
                  addons.map((addon) => (
                    <tr key={addon.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{addon.name}</div>
                        {addon.description && (
                          <div style={{ fontSize: "0.75rem", color: "var(--dash-muted)", marginTop: 2 }}>{addon.description}</div>
                        )}
                      </td>
                      <td className="muted">{CATEGORY_LABELS[addon.category] || addon.category}</td>
                      <td style={{ fontWeight: 600 }}>${addon.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${addon.active ? "confirmed" : "checked_out"}`}>
                          {addon.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="row-action-btn" onClick={() => openEditPanel(addon)}>Edit</button>
                          <button
                            className="row-action-btn"
                            style={{ color: addon.active ? "var(--dash-danger)" : "var(--dash-success)" }}
                            onClick={() => handleToggleAddon(addon)}
                            disabled={togglingAddonId === addon.id}
                          >
                            {togglingAddonId === addon.id
                              ? "..."
                              : addon.active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="detail-card">
          <div className="detail-card-header"><span className="detail-card-title">Notification Preferences</span></div>
          <div className="detail-card-body">
            {[
              { label: "New Booking Notification", desc: "Get notified when a new booking is created", state: notifyNewBooking, setter: setNotifyNewBooking },
              { label: "Booking Cancellation", desc: "Alert when a guest cancels a booking", state: notifyCancellation, setter: setNotifyCancellation },
              { label: "Check-in Reminder", desc: "Reminder 24 hours before guest arrival", state: notifyCheckIn, setter: setNotifyCheckIn },
              { label: "Payment Received", desc: "Confirmation when payment is processed", state: notifyPayment, setter: setNotifyPayment },
            ].map((pref, i) => (
              <div key={i} className="detail-row" style={{ alignItems: "flex-start", paddingTop: 12, paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "var(--dash-text)", fontWeight: 500 }}>{pref.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>{pref.desc}</div>
                </div>
                <ToggleSwitch checked={pref.state} onChange={pref.setter} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-on Side Panel */}
      {addonPanelOpen && (
        <AddonPanel
          addon={editingAddon}
          onClose={() => { setAddonPanelOpen(false); setEditingAddon(null); }}
          onSuccess={handleAddonSuccess}
        />
      )}
    </>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
      aria-pressed={checked}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: checked ? "var(--dash-accent)" : "var(--dash-surface-2)",
        border: "1px solid var(--dash-border)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: checked ? 20 : 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: checked ? "#0a110d" : "rgba(255,255,255,0.4)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}
