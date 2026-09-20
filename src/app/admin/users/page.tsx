"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create user form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STAFF");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole })
      });
      const data = await res.json();

      if (res.ok) {
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("STAFF");
        setShowAddForm(false);
        fetchUsers();
      } else {
        setFormError(data.error || "Failed to create user");
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AdminTopbar title="Users" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>System Users</h1>
            <p>Manage administrator and staff accounts</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "+ Add User"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="admin-table-wrapper" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                    <option value="GUEST">Guest</option>
                  </select>
                </div>
              </div>
              {formError && <div style={{ color: "var(--dash-danger)", marginTop: 10 }}>{formError}</div>}
              <div style={{ marginTop: 20 }}>
                <button type="submit" className="btn-primary" disabled={formLoading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {formLoading && <Loader2 size={16} className="spinner" />}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-wrapper">
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                      <Loader2 size={24} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--dash-muted)" }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name || "Unknown"}</td>
                      <td className="muted">{u.email}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{ 
                            background: "transparent", 
                            border: "1px solid rgba(255,255,255,0.2)", 
                            color: "#fff", 
                            padding: "4px 8px", 
                            borderRadius: 4 
                          }}
                        >
                          <option value="ADMIN" style={{ color: "#000" }}>Admin</option>
                          <option value="STAFF" style={{ color: "#000" }}>Staff</option>
                          <option value="GUEST" style={{ color: "#000" }}>Guest</option>
                        </select>
                      </td>
                      <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="row-action-btn" 
                          onClick={() => handleDeleteUser(u.id)}
                          style={{ color: "var(--dash-danger)", borderColor: "rgba(224,82,82,0.3)" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
