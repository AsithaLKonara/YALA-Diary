import React, { useState } from "react";
import { X, Loader2, Globe, Users } from "lucide-react";

export default function TicketPanel({ 
  onClose, 
  onSuccess, 
  editData 
}: { 
  onClose: () => void; 
  onSuccess: () => void; 
  editData?: any; 
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    category: editData?.category || "FOREIGN",
    type: editData?.type || "MORNING",
    adultPrice: editData?.adultPrice || 0,
    childPrice: editData?.childPrice || 0,
    fixedPrice: editData?.fixedPrice || 0,
    isActive: editData?.isActive !== undefined ? editData.isActive : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editData ? `/api/admin/tickets/${editData.id}` : "/api/admin/tickets";
      const method = editData ? "PUT" : "POST";
      
      const payload = {
        name: formData.name,
        category: formData.category,
        type: formData.type,
        adultPrice: Number(formData.adultPrice) || 0,
        childPrice: formData.category === "FOREIGN" ? (Number(formData.childPrice) || 0) : 0,
        fixedPrice: formData.category === "LOCAL" ? (Number(formData.fixedPrice) || 0) : 0,
        isActive: formData.isActive,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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

  const isLocal = formData.category === "LOCAL";

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
        {/* Panel Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{editData ? 'Edit Entrance Ticket' : 'New Entrance Ticket'}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', margin: '4px 0 0' }}>
              Configure ticket tariffs for Foreign tourists and Local residents
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Panel Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <form id="ticket-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Audience / Category Selector */}
            <div>
              <label className="admin-label">Visitor Audience Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "FOREIGN" })}
                  style={{
                    padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    border: `1px solid ${!isLocal ? 'var(--primary)' : 'var(--dash-border)'}`,
                    background: !isLocal ? 'rgba(154,205,50,0.1)' : 'rgba(0,0,0,0.2)',
                    color: !isLocal ? 'var(--primary)' : 'var(--dash-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Globe size={18} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: !isLocal ? '#fff' : 'inherit' }}>Foreign Visitors</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>Adult & Child prices</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "LOCAL" })}
                  style={{
                    padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    border: `1px solid ${isLocal ? 'var(--primary)' : 'var(--dash-border)'}`,
                    background: isLocal ? 'rgba(154,205,50,0.1)' : 'rgba(0,0,0,0.2)',
                    color: isLocal ? 'var(--primary)' : 'var(--dash-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Users size={18} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isLocal ? '#fff' : 'inherit' }}>Local Residents</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>Fixed + Per person</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Ticket Name */}
            <div>
              <label className="admin-label">Ticket Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
                placeholder={isLocal ? "e.g. Block 1 (Palatupana) - Local Resident" : "e.g. Block 1 (Palatupana) - Half-day"}
                required
              />
            </div>

            {/* Time Range (Safari Package Type) */}
            <div>
              <label className="admin-label">Time Range (Safari Package Type)</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="admin-input"
                required
              >
                <option value="ALL">All Safari Types (Universal)</option>
                <option value="MORNING">Morning / Half-day</option>
                <option value="AFTERNOON">Afternoon / Half-day</option>
                <option value="FULL_DAY">Full Day</option>
                <option value="PRIVATE">Private</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--dash-muted)', marginTop: 4, display: 'block' }}>
                Select &quot;All Safari Types&quot; if this ticket applies to morning, afternoon, and full day safaris.
              </span>
            </div>

            {/* Pricing Inputs: Foreigners vs Locals */}
            {!isLocal ? (
              /* Foreign Visitors Pricing */
              <div style={{
                padding: '16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dash-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Foreign Visitor Rates
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                    USD ($)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Adult Price ($)</label>
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
                    <label className="admin-label">Child Price ($)</label>
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
              </div>
            ) : (
              /* Local Residents Pricing */
              <div style={{
                padding: '16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dash-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Local Resident Tariffs
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 600 }}>
                    LKR (Rs)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Fixed Payment per Safari (LKR)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number"
                        value={formData.fixedPrice}
                        onChange={e => setFormData({ ...formData, fixedPrice: Number(e.target.value) })}
                        className="admin-input"
                        min="0"
                        step="1"
                        placeholder="e.g. 1000"
                        required
                        style={{ paddingLeft: '50px' }}
                      />
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.78rem', color: 'var(--dash-muted)', fontWeight: 600 }}>
                        LKR
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--dash-muted)', marginTop: 4, display: 'block' }}>
                      Fixed vehicle/safari service fee
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Per Person Ticket Price (LKR)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number"
                        value={formData.adultPrice}
                        onChange={e => setFormData({ ...formData, adultPrice: Number(e.target.value) })}
                        className="admin-input"
                        min="0"
                        step="1"
                        placeholder="e.g. 180"
                        required
                        style={{ paddingLeft: '50px' }}
                      />
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.78rem', color: 'var(--dash-muted)', fontWeight: 600 }}>
                        LKR
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--dash-muted)', marginTop: 4, display: 'block' }}>
                      Price per resident guest
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Ticket Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="isActive" style={{ color: 'var(--dash-text)', fontSize: '0.92rem', cursor: 'pointer' }}>
                Active Ticket (Available for booking)
              </label>
            </div>
          </form>
        </div>

        {/* Panel Footer */}
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
