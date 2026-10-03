import React, { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import CustomConfirmDialog from "./CustomConfirmDialog";
import type { SafariPricingRules, GroupTier } from "@/lib/pricing";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const DEFAULT_RULES: SafariPricingRules = {
  strategyType: "PER_PERSON_WITH_CHILD",
  adultRate: 0,
  childRate: 0,
  childFreeBelow: 0,
  maxCapacity: 6,
  minGuests: 1,
};

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
    description: editData?.description || "",
    type: editData?.type || "MORNING",
    startTime: editData?.startTime || "06:00",
    endTime: editData?.endTime || "12:00",
    inclusions: editData?.inclusions?.join(", ") || "",
  });

  // Advanced pricing rules state
  const [pricingRules, setPricingRules] = useState<SafariPricingRules>(() => {
    if (editData?.pricingRules) return editData.pricingRules as SafariPricingRules;
    return DEFAULT_RULES;
  });

  useEffect(() => {
    if (editData?.extraServices) {
      setSelectedExtras(editData.extraServices.map((e: any) => e.id));
    }
  }, [editData]);

  useEffect(() => {
    fetch("/api/admin/extra-services")
      .then(res => res.json())
      .then(data => { if (data.services) setAvailableExtras(data.services); })
      .catch(console.error);
  }, []);

  // Compute display basePrice from rules for backward compat
  const computeBasePrice = (rules: SafariPricingRules): number => {
    if (rules.strategyType === "PRIVATE_FLAT") return rules.privateRate ?? 0;
    if (rules.strategyType === "GROUP_TIERED") {
      const tiers = rules.tiers ?? [];
      return tiers.length > 0 ? Math.min(...tiers.map(t => t.jeepPrice)) : 0;
    }
    return rules.adultRate ?? 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedUrls: string[] = editData?.images || [];
      if (files.length > 0) {
        const uploadData = new FormData();
        files.forEach(f => uploadData.append("images", f));
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || "Upload failed");
        uploadedUrls = (await uploadRes.json()).urls || [];
      }

      const basePrice = computeBasePrice(pricingRules);
      const payload = {
        ...formData,
        basePrice,
        pricingType: pricingRules.strategyType === "PRIVATE_FLAT" ? "PER_JEEP" : "PER_PERSON",
        pricingRules,
        minGuests: pricingRules.minGuests,
        maxCapacity: pricingRules.maxCapacity,
        inclusions: formData.inclusions.split(",").map((s: string) => s.trim()).filter(Boolean),
        images: uploadedUrls,
        extraServiceIds: selectedExtras
      };

      const url = editData ? `/api/admin/safari-packages/${editData.id}` : "/api/admin/safari-packages";
      const method = editData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save package");
      onSuccess();
    } catch (err: any) {
      setErrorDialog({ isOpen: true, message: err.message || "Failed to save package" });
    } finally {
      setLoading(false);
    }
  };

  const updateRules = (patch: Partial<SafariPricingRules>) => {
    setPricingRules(prev => ({ ...prev, ...patch }));
  };

  const addTier = () => {
    const existingTiers = pricingRules.tiers ?? [];
    const lastMax = existingTiers.length > 0 ? existingTiers[existingTiers.length - 1].maxGuests : 0;
    updateRules({ tiers: [...existingTiers, { minGuests: lastMax + 1, maxGuests: lastMax + 2, jeepPrice: 0 }] });
  };

  const updateTier = (index: number, patch: Partial<GroupTier>) => {
    const tiers = [...(pricingRules.tiers ?? [])];
    tiers[index] = { ...tiers[index], ...patch };
    updateRules({ tiers });
  };

  const removeTier = (index: number) => {
    const tiers = [...(pricingRules.tiers ?? [])];
    tiers.splice(index, 1);
    updateRules({ tiers });
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 100,
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '700px', backgroundColor: '#0d1f14',
        height: '100%', borderLeft: '1px solid var(--dash-border)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{editData ? "Edit Package" : "New Safari Package"}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <form id="package-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Basic Info */}
            <div>
              <label className="admin-label">Package Name</label>
              <input required type="text" className="admin-input"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Premium Morning Safari" />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '4px' }}>
                <style>{`
                  .quill-custom .ql-container {
                    min-height: 180px;
                    resize: vertical;
                    overflow-y: auto;
                  }
                `}</style>
                <ReactQuill 
                  className="quill-custom"
                  theme="snow" 
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                />
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <label className="admin-label">Inclusions (comma separated)</label>
              <textarea className="admin-input" rows={3}
                value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})}
                placeholder="Licensed tracker, Free hotel pickup, Herbal Tea..." />
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

            {/* ── PRICING STRATEGY BUILDER ── */}
            <div style={{ border: '1px solid var(--dash-border)', borderRadius: 12, padding: '16px', background: 'rgba(154,205,50,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                Pricing Strategy
              </div>

              {/* Strategy Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { value: "PER_PERSON_WITH_CHILD", label: "Per Person + Child Rate", desc: "Set separate adult & child prices" },
                  { value: "GROUP_TIERED", label: "Group Tiered (Jeep Pack)", desc: "Different flat jeep price by group size" },
                  { value: "PRIVATE_FLAT", label: "Private Flat Rate", desc: "One fixed jeep buyout price" },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                    borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${pricingRules.strategyType === opt.value ? 'rgba(154,205,50,0.4)' : 'var(--dash-border)'}`,
                    background: pricingRules.strategyType === opt.value ? 'rgba(154,205,50,0.06)' : 'transparent',
                  }}>
                    <input type="radio" name="strategy" value={opt.value}
                      checked={pricingRules.strategyType === opt.value}
                      onChange={() => updateRules({ strategyType: opt.value as any, tiers: opt.value === "GROUP_TIERED" ? (pricingRules.tiers ?? [{ minGuests: 1, maxGuests: 2, jeepPrice: 0 }]) : undefined })}
                      style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dash-text)' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--dash-muted)', marginTop: 1 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Capacity */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="admin-label">Min Guests</label>
                  <input type="number" min={1} max={20} className="admin-input"
                    value={pricingRules.minGuests}
                    onChange={e => updateRules({ minGuests: parseInt(e.target.value) || 1 })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="admin-label">Max Capacity</label>
                  <input type="number" min={1} max={20} className="admin-input"
                    value={pricingRules.maxCapacity}
                    onChange={e => updateRules({ maxCapacity: parseInt(e.target.value) || 6 })} />
                </div>
              </div>

              {/* PER_PERSON_WITH_CHILD fields */}
              {pricingRules.strategyType === "PER_PERSON_WITH_CHILD" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Adult Rate ($)</label>
                      <input type="number" min={0} step={0.01} className="admin-input"
                        value={pricingRules.adultRate ?? 0}
                        onChange={e => updateRules({ adultRate: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Child Rate ($)</label>
                      <input type="number" min={0} step={0.01} className="admin-input"
                        value={pricingRules.childRate ?? 0}
                        onChange={e => updateRules({ childRate: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Children Free Below Age (0 = none free)</label>
                    <input type="number" min={0} max={18} className="admin-input"
                      value={pricingRules.childFreeBelow ?? 0}
                      onChange={e => updateRules({ childFreeBelow: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              )}

              {/* GROUP_TIERED fields */}
              {pricingRules.strategyType === "GROUP_TIERED" && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label className="admin-label" style={{ margin: 0 }}>Pricing Tiers (by Guest Count)</label>
                    <button type="button" onClick={addTier}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid var(--dash-border)', color: 'var(--primary)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>
                      <Plus size={12} /> Add Tier
                    </button>
                  </div>
                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 6, fontSize: '0.72rem', color: 'var(--dash-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <span>Min Pax</span><span>Max Pax</span><span>Jeep Price ($)</span><span />
                  </div>
                  {(pricingRules.tiers ?? []).map((tier, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                      <input type="number" min={1} className="admin-input" style={{ padding: '7px 10px' }}
                        value={tier.minGuests} onChange={e => updateTier(i, { minGuests: parseInt(e.target.value) || 1 })} />
                      <input type="number" min={1} className="admin-input" style={{ padding: '7px 10px' }}
                        value={tier.maxGuests} onChange={e => updateTier(i, { maxGuests: parseInt(e.target.value) || 1 })} />
                      <input type="number" min={0} step={0.01} className="admin-input" style={{ padding: '7px 10px' }}
                        value={tier.jeepPrice} onChange={e => updateTier(i, { jeepPrice: parseFloat(e.target.value) || 0 })} />
                      <button type="button" onClick={() => removeTier(i)}
                        style={{ background: 'none', border: 'none', color: 'var(--dash-danger)', cursor: 'pointer', padding: '0 4px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(pricingRules.tiers ?? []).length === 0 && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', textAlign: 'center', padding: '12px 0' }}>Click "Add Tier" to define pricing bands.</p>
                  )}
                  
                  {/* Extra person rule for tiered pricing */}
                  <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--dash-border)', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dash-text)', marginBottom: 8 }}>Extra Guests (Exceeding max tier)</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label className="admin-label" style={{ fontSize: '0.7rem' }}>Extra Person Rate ($)</label>
                        <input type="number" min={0} step={0.01} className="admin-input" placeholder="0.00"
                          value={pricingRules.extraPersonRate ?? ""}
                          onChange={e => updateRules({ extraPersonRate: parseFloat(e.target.value) || undefined })} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="admin-label" style={{ fontSize: '0.7rem' }}>Max Extra Guests</label>
                        <input type="number" min={1} step={1} className="admin-input" placeholder="e.g. 1"
                          value={pricingRules.maxExtraCount ?? ""}
                          onChange={e => updateRules({ maxExtraCount: parseInt(e.target.value) || undefined })} />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--dash-muted)', marginTop: 6, lineHeight: 1.4 }}>
                      If the group size exceeds the highest tier's max pax, this rate applies per extra person.
                    </p>
                  </div>
                </div>
              )}

              {/* PRIVATE_FLAT fields */}
              {pricingRules.strategyType === "PRIVATE_FLAT" && (
                <div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Private Jeep Rate ($)</label>
                      <input type="number" min={0} step={0.01} className="admin-input"
                        value={pricingRules.privateRate ?? 0}
                        onChange={e => updateRules({ privateRate: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Included Capacity (pax)</label>
                      <input type="number" min={1} className="admin-input" placeholder="e.g. 6"
                        value={pricingRules.baseCapacity ?? ""}
                        onChange={e => updateRules({ baseCapacity: parseInt(e.target.value) || undefined })} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Extra Person Rate ($)</label>
                      <input type="number" min={0} step={0.01} className="admin-input" placeholder="0.00"
                        value={pricingRules.extraPersonRate ?? ""}
                        onChange={e => updateRules({ extraPersonRate: parseFloat(e.target.value) || undefined })} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-label">Max Extra Guests</label>
                      <input type="number" min={1} step={1} className="admin-input" placeholder="e.g. 1"
                        value={pricingRules.maxExtraCount ?? ""}
                        onChange={e => updateRules({ maxExtraCount: parseInt(e.target.value) || undefined })} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--dash-muted)', marginTop: 6 }}>
                    Fixed price covers up to Included Capacity. Extra Person Rate applies for guests above Included Capacity up to Max Capacity.
                  </p>
                </div>
              )}
            </div>



            {/* Images */}
            <div>
              <label className="admin-label">Package Images (Max 5)</label>
              <input type="file" multiple accept="image/*" className="admin-input"
                onChange={e => {
                  if (e.target.files) {
                    const selected = Array.from(e.target.files);
                    if (selected.length > 5) { setErrorDialog({ isOpen: true, message: "You can only upload up to 5 images." }); return; }
                    setFiles(selected);
                  }
                }} />
              {files.length > 0 && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--dash-muted)' }}>{files.length} file(s) selected</div>}
            </div>

            {/* Extra Services */}
            {availableExtras.length > 0 && (
              <div>
                <label className="admin-label">Available Extra Services</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {availableExtras.map(ext => (
                    <label key={ext.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--dash-text)' }}>
                      <input type="checkbox"
                        checked={selectedExtras.includes(ext.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedExtras([...selectedExtras, ext.id]);
                          else setSelectedExtras(selectedExtras.filter(id => id !== ext.id));
                        }} />
                      {ext.name} (from ${ext.basePrice})
                    </label>
                  ))}
                </div>
              </div>
            )}

          </form>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" form="package-form" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spinner" /> : (editData ? "Save Changes" : "Create Package")}
          </button>
        </div>
      </div>

      <CustomConfirmDialog
        isOpen={errorDialog.isOpen} title="Error" message={errorDialog.message}
        onConfirm={() => setErrorDialog({ isOpen: false, message: "" })}
        onCancel={() => setErrorDialog({ isOpen: false, message: "" })}
        confirmText="OK" showCancel={false}
      />
    </div>
  );
}
