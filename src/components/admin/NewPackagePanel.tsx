import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import CustomConfirmDialog from "./CustomConfirmDialog";

export default function NewPackagePanel({ onClose, onSuccess, editData }: { onClose: () => void, onSuccess: () => void, editData?: any }) {
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ""});
  const [files, setFiles] = useState<File[]>([]);
  const [availableExtras, setAvailableExtras] = useState<any[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    editData?.extraServices ? editData.extraServices.map((e: any) => e.id) : []
  );
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    type: editData?.type || "MORNING",
    startTime: editData?.startTime || "06:00",
    endTime: editData?.endTime || "12:00",
    basePrice: editData?.basePrice || 0,
    pricingType: editData?.pricingType || "PER_PERSON",
    inclusions: editData?.inclusions?.join(", ") || "",
  });

  useEffect(() => {
    if (editData && editData.extraServices) {
      setSelectedExtras(editData.extraServices.map((e: any) => e.id));
    }
  }, [editData]);

  useEffect(() => {
    fetch("/api/admin/extra-services")
      .then(res => res.json())
      .then(data => {
        if (data.services) setAvailableExtras(data.services);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrls: string[] = editData?.images || [];

      if (files.length > 0) {
        const uploadData = new FormData();
        files.forEach(f => uploadData.append("images", f));
        
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData
        });
        
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Failed to upload images");
        }
        
        const uploadResult = await uploadRes.json();
        // append new images to existing ones, or replace them based on preference. Let's just append for now up to 5, or replace if we don't have a way to delete specific ones. Let's replace for simplicity if new files are uploaded.
        uploadedUrls = uploadResult.urls || [];
      }

      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        inclusions: formData.inclusions.split(",").map((s: string) => s.trim()).filter(Boolean),
        images: uploadedUrls,
        extraServiceIds: selectedExtras
      };

      const url = editData ? `/api/admin/safari-packages/${editData.id}` : "/api/admin/safari-packages";
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save package");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorDialog({ isOpen: true, message: err.message || "Failed to save package" });
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

            <div>
              <label className="admin-label">Package Images (Max 5)</label>
              <input type="file" multiple accept="image/*" className="admin-input" 
                onChange={e => {
                  if (e.target.files) {
                    const selected = Array.from(e.target.files);
                    if (selected.length > 5) {
                      setErrorDialog({ isOpen: true, message: "You can only upload up to 5 images." });
                      return;
                    }
                    setFiles(selected);
                  }
                }} 
              />
              {files.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--dash-muted)' }}>
                  {files.length} file(s) selected
                </div>
              )}
            </div>

            {availableExtras.length > 0 && (
              <div>
                <label className="admin-label">Available Extra Services</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {availableExtras.map(ext => (
                    <label key={ext.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--dash-text)' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedExtras.includes(ext.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtras([...selectedExtras, ext.id]);
                          } else {
                            setSelectedExtras(selectedExtras.filter(id => id !== ext.id));
                          }
                        }}
                      />
                      {ext.name} (${ext.basePrice} / {ext.pricingModel.replace('_', ' ')})
                    </label>
                  ))}
                </div>
              </div>
            )}

          </form>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" form="package-form" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spinner" /> : (editData ? "Save Changes" : "Create Package")}
          </button>
        </div>

      </div>

      <CustomConfirmDialog
        isOpen={errorDialog.isOpen}
        title="Error"
        message={errorDialog.message}
        onConfirm={() => setErrorDialog({ isOpen: false, message: "" })}
        onCancel={() => setErrorDialog({ isOpen: false, message: "" })}
        confirmText="OK"
        showCancel={false}
      />
    </div>
  );
}
