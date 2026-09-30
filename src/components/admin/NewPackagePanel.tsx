import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function NewPackagePanel({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "MORNING",
    startTime: "06:00",
    endTime: "12:00",
    basePrice: 0,
    pricingType: "PER_PERSON",
    inclusions: "", // comma separated
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        inclusions: formData.inclusions.split(",").map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch("/api/admin/safari-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create package");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-side-panel-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div className="admin-side-panel" onClick={e => e.stopPropagation()} style={{
        width: '400px', backgroundColor: 'var(--dash-bg)', 
        height: '100%', borderLeft: '1px solid var(--dash-border)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>New Safari Package</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <form id="package-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label className="admin-label">Package Name</label>
              <input required type="text" className="admin-input" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Premium Morning Safari" />
            </div>

            <div>
              <label className="admin-label">Type</label>
              <select className="admin-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="MORNING">Morning</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="FULL_DAY">Full Day</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Start Time</label>
                <input required type="time" className="admin-input" 
                  value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">End Time</label>
                <input required type="time" className="admin-input" 
                  value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Base Price ($)</label>
                <input required type="number" min="0" step="0.01" className="admin-input" 
                  value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Pricing Type</label>
                <select className="admin-input" value={formData.pricingType} onChange={e => setFormData({...formData, pricingType: e.target.value})}>
                  <option value="PER_PERSON">Per Person</option>
                  <option value="PER_JEEP">Per Jeep</option>
                </select>
              </div>
            </div>

            <div>
              <label className="admin-label">Inclusions (comma separated)</label>
              <textarea className="admin-input" rows={4}
                value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})}
                placeholder="Licensed tracker, Free hotel pickup, Herbal Tea..." />
            </div>

          </form>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" form="package-form" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spinner" /> : "Create Package"}
          </button>
        </div>

      </div>
    </div>
  );
}
