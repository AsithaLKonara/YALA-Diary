import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function TicketPanel({ onClose, onSuccess, editData }: { onClose: () => void, onSuccess: () => void, editData?: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    type: editData?.type || "MORNING",
    adultPrice: editData?.adultPrice || 0,
    childPrice: editData?.childPrice || 0,
    isActive: editData?.isActive !== undefined ? editData.isActive : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editData ? `/api/admin/tickets/${editData.id}` : "/api/admin/tickets";
      const method = editData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error("Failed to save ticket");
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 100,
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '560px', backgroundColor: '#0d1f14',
        height: '100%', borderLeft: '1px solid var(--dash-border)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{editData ? 'Edit Ticket' : 'New Ticket'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <form id="ticket-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="admin-label">Ticket Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
                placeholder="e.g. Block 1 (Palatupana) - Half-day"
                required
              />
            </div>

            <div>
              <label className="admin-label">Time Range (Safari Package Type)</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="admin-input"
                required
              >
                <option value="MORNING">Morning / Half-day</option>
                <option value="AFTERNOON">Afternoon / Half-day</option>
                <option value="FULL_DAY">Full Day</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Adult Price (LKR)</label>
                <input 
                  type="number"
                  value={formData.adultPrice}
                  onChange={e => setFormData({ ...formData, adultPrice: Number(e.target.value) })}
                  className="admin-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Child Price (LKR)</label>
                <input 
                  type="number"
                  value={formData.childPrice}
                  onChange={e => setFormData({ ...formData, childPrice: Number(e.target.value) })}
                  className="admin-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
              <label htmlFor="isActive" style={{ color: 'var(--dash-text)', fontSize: '0.9rem' }}>Active Ticket</label>
            </div>
          </form>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', background: '#0d1f14' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ticket-form"
            disabled={loading}
            className="btn-primary"
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            {loading && <Loader2 size={16} className="spinner" />}
            {editData ? 'Save Changes' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
