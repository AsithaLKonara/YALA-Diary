"use client";

import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";

interface GuestSettingsFormProps {
  initialName: string;
  initialEmail: string;
  hasPassword: boolean;
}

export default function GuestSettingsForm({ initialName, initialEmail, hasPassword }: GuestSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/guest/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && <div style={{ padding: 12, background: "rgba(224,82,82,0.12)", color: "var(--dash-danger)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: 6, fontSize: "0.85rem" }}>{error}</div>}
      {success && <div style={{ padding: 12, background: "rgba(76,175,114,0.12)", color: "var(--dash-success)", border: "1px solid rgba(76,175,114,0.3)", borderRadius: 6, fontSize: "0.85rem" }}>{success}</div>}

      <div>
        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>Full Name</label>
        <div style={{ position: "relative" }}>
          <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dash-muted)" }} />
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-filter-input" 
            style={{ width: "100%", paddingLeft: 36 }} 
            required 
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>Email Address</label>
        <div style={{ position: "relative" }}>
          <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dash-muted)" }} />
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-filter-input" 
            style={{ width: "100%", paddingLeft: 36 }} 
            required 
          />
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--dash-border)", paddingTop: 20, marginTop: 10 }}>
        <h4 style={{ fontSize: "0.9rem", color: "var(--dash-text)", marginBottom: 16, fontWeight: 500 }}>Change Password</h4>
        
        {hasPassword && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>Current Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dash-muted)" }} />
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-filter-input" 
                style={{ width: "100%", paddingLeft: 36 }} 
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>New Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dash-muted)" }} />
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="admin-filter-input" 
              style={{ width: "100%", paddingLeft: 36 }} 
              placeholder={hasPassword ? "New Password" : "Set a password"}
            />
          </div>
        </div>

        {newPassword && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--dash-muted)", marginBottom: 8 }}>Confirm New Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dash-muted)" }} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-filter-input" 
                style={{ width: "100%", paddingLeft: 36 }} 
                required
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
