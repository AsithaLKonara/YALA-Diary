import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function NewExtraServicePanel({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Food & Beverage",
    pricingModel: "FLAT_RATE",
    basePrice: 0,
    perKmRate: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        perKmRate: formData.pricingModel === "PER_KM" ? Number(formData.perKmRate) : null,
      };

      const res = await fetch("/api/admin/extra-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create extra service");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create extra service");
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
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>New Extra Service</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <form id="service-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label className="admin-label">Service Name</label>
              <input required type="text" className="admin-input" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Sri Lankan Lunch" />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea className="admin-input" rows={2}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the service..." />
            </div>

            <div>
              <label className="admin-label">Category</label>
              {formData.category === "ADD_NEW" || !["Food & Beverage", "Airport Transfer", "Destination Transfer", "Photography", "Ticketing"].includes(formData.category) ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input required autoFocus type="text" className="admin-input" 
                    value={formData.category === "ADD_NEW" ? "" : formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="Type custom category name..." />
                  <button type="button" className="btn-ghost" 
                    style={{ padding: '8px 12px' }}
                    onClick={() => setFormData({...formData, category: "Food & Beverage"})}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <select className="admin-input" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Food & Beverage">Food &amp; Beverage</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                  <option value="Destination Transfer">Destination Transfer</option>
                  <option value="Photography">Photography</option>
                  <option value="Ticketing">Ticketing</option>
                  <option disabled>──────────</option>
                  <option value="ADD_NEW">+ Add New Category...</option>
                </select>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Pricing Model</label>
                <select className="admin-input" value={formData.pricingModel} onChange={e => setFormData({...formData, pricingModel: e.target.value})}>
                  <option value="FLAT_RATE">Flat Rate</option>
                  <option value="PER_PERSON">Per Person</option>
                  <option value="PER_KM">Per KM</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Base Price ($)</label>
                <input required type="number" min="0" step="0.01" className="admin-input" 
                  value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} />
              </div>
            </div>

            {formData.pricingModel === "PER_KM" && (
              <div>
                <label className="admin-label">Per KM Rate ($)</label>
                <input required type="number" min="0" step="0.01" className="admin-input" 
                  value={formData.perKmRate} onChange={e => setFormData({...formData, perKmRate: parseFloat(e.target.value)})} />
              </div>
            )}

          </form>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" form="service-form" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spinner" /> : "Create Service"}
          </button>
        </div>

      </div>
    </div>
  );
}
