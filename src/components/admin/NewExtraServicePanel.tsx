import React, { useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import CustomConfirmDialog from "./CustomConfirmDialog";
import type { ServicePricingOptions, PricingDimension, ServicePricingTier } from "@/lib/pricing";

const PRESET_CATEGORIES = ["Food & Beverage", "Airport Transfer", "Destination Transfer", "Photography", "Ticketing"];

const DEFAULT_OPTIONS: ServicePricingOptions = {
  strategyType: "FLAT",
  flatPrice: 0,
};

export default function NewExtraServicePanel({ onClose, onSuccess, editData }: { onClose: () => void, onSuccess: () => void, editData?: any }) {
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ""});
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
    category: editData?.category || "Food & Beverage",
    minGuests: editData?.pricingOptions?.minGuests || "",
    maxCapacity: editData?.pricingOptions?.maxCapacity || "",
  });

  const [pricingOptions, setPricingOptions] = useState<ServicePricingOptions>(() => {
    if (editData?.pricingOptions) return editData.pricingOptions as ServicePricingOptions;
    // Migrate from old model
    if (editData?.pricingModel === "PER_PERSON") return { strategyType: "PER_PERSON", adultRate: editData.basePrice, childRate: 0 };
    if (editData?.pricingModel === "PER_KM") return { strategyType: "PER_KM", baseRate: editData.basePrice, perKmRate: editData.perKmRate ?? 0 };
    return { strategyType: "FLAT", flatPrice: editData?.basePrice ?? 0 };
  });

  // Compute legacy basePrice and pricingModel from options
  const computeLegacy = (opts: ServicePricingOptions) => {
    if (opts.strategyType === "FLAT") return { basePrice: opts.flatPrice ?? 0, pricingModel: "FLAT_RATE", perKmRate: null };
    if (opts.strategyType === "PER_PERSON") return { basePrice: opts.adultRate ?? 0, pricingModel: "PER_PERSON", perKmRate: null };
    if (opts.strategyType === "PER_KM") return { basePrice: opts.baseRate ?? 0, pricingModel: "PER_KM", perKmRate: opts.perKmRate ?? 0 };
    if (opts.strategyType === "TIERED_OPTIONS") {
      const tiers = opts.tiers ?? [];
      const min = tiers.length > 0 ? Math.min(...tiers.map(t => t.price)) : 0;
      return { basePrice: min, pricingModel: "FLAT_RATE", perKmRate: null };
    }
    return { basePrice: 0, pricingModel: "FLAT_RATE", perKmRate: null };
  };

  const updateOptions = (patch: Partial<ServicePricingOptions>) => {
    setPricingOptions(prev => ({ ...prev, ...patch }));
  };

  // Dimension helpers
  const addDimension = () => {
    const dims = [...(pricingOptions.dimensions ?? [])];
    dims.push({ label: "", key: `dim_${dims.length}`, options: [] });
    updateOptions({ dimensions: dims });
  };
  const updateDimension = (i: number, patch: Partial<PricingDimension>) => {
    const dims = [...(pricingOptions.dimensions ?? [])];
    dims[i] = { ...dims[i], ...patch };
    updateOptions({ dimensions: dims });
  };
  const removeDimension = (i: number) => {
    const dims = [...(pricingOptions.dimensions ?? [])];
    dims.splice(i, 1);
    updateOptions({ dimensions: dims });
  };

  // Tier helpers
  const addTier = () => {
    const tiers = [...(pricingOptions.tiers ?? [])];
    const dims = pricingOptions.dimensions ?? [];
    const conditions: Record<string, string> = {};
    dims.forEach(d => { if (d.options.length > 0) conditions[d.key] = d.options[0]; });
    tiers.push({ label: "", conditions, price: 0 });
    updateOptions({ tiers });
  };
  const updateTier = (i: number, patch: Partial<ServicePricingTier>) => {
    const tiers = [...(pricingOptions.tiers ?? [])];
    tiers[i] = { ...tiers[i], ...patch };
    updateOptions({ tiers });
  };
  const removeTier = (i: number) => {
    const tiers = [...(pricingOptions.tiers ?? [])];
    tiers.splice(i, 1);
    updateOptions({ tiers });
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

      const legacy = computeLegacy(pricingOptions);
      const updatedPricingOptions = {
        ...pricingOptions,
        minGuests: formData.minGuests ? parseInt(formData.minGuests.toString(), 10) : null,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity.toString(), 10) : null,
      };

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        ...legacy,
        pricingOptions: updatedPricingOptions,
        images: uploadedUrls,
      };

      const url = editData ? `/api/admin/extra-services/${editData.id}` : "/api/admin/extra-services";
      const method = editData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save extra service");
      onSuccess();
    } catch (err: any) {
      setErrorDialog({ isOpen: true, message: err.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '7px 10px' };

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
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{editData ? "Edit Service" : "New Extra Service"}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <form id="service-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label className="admin-label">Service Name</label>
              <input required type="text" className="admin-input"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Airport Pickup" />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea className="admin-input" rows={2}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description..." />
            </div>

            <div>
              <label className="admin-label">Category</label>
              {formData.category === "ADD_NEW" || !PRESET_CATEGORIES.includes(formData.category) ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input required autoFocus type="text" className="admin-input"
                    value={formData.category === "ADD_NEW" ? "" : formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="Custom category..." />
                  <button type="button" className="btn-ghost" style={{ padding: '8px 12px' }}
                    onClick={() => setFormData({...formData, category: "Food & Beverage"})}><X size={16} /></button>
                </div>
              ) : (
                <select className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {PRESET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option disabled>──────────</option>
                  <option value="ADD_NEW">+ Add New Category...</option>
                </select>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Min Guests (Optional)</label>
                <input type="number" min={1} className="admin-input"
                  value={formData.minGuests} onChange={e => setFormData({...formData, minGuests: e.target.value})}
                  placeholder="e.g. 1" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Max Capacity (Optional)</label>
                <input type="number" min={1} className="admin-input"
                  value={formData.maxCapacity} onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
                  placeholder="e.g. 3 for a car" />
              </div>
            </div>

            {/* ── PRICING OPTIONS BUILDER ── */}
            <div style={{ border: '1px solid var(--dash-border)', borderRadius: 12, padding: '16px', background: 'rgba(154,205,50,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                Pricing Options
              </div>

              {/* Strategy Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { value: "FLAT", label: "Flat Rate", desc: "One fixed price for any booking" },
                  { value: "PER_PERSON", label: "Per Person", desc: "Separate adult & child rates" },
                  { value: "PER_KM", label: "Per KM", desc: "Base charge plus per-km rate" },
                  { value: "TIERED_OPTIONS", label: "Tiered Options", desc: "Price matrix by selectable options (e.g. location + vehicle)" },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                    borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${pricingOptions.strategyType === opt.value ? 'rgba(154,205,50,0.4)' : 'var(--dash-border)'}`,
                    background: pricingOptions.strategyType === opt.value ? 'rgba(154,205,50,0.06)' : 'transparent',
                  }}>
                    <input type="radio" name="svcStrategy" value={opt.value}
                      checked={pricingOptions.strategyType === opt.value}
                      onChange={() => updateOptions({ strategyType: opt.value as any })}
                      style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--dash-muted)', marginTop: 1 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* FLAT */}
              {pricingOptions.strategyType === "FLAT" && (
                <div>
                  <label className="admin-label">Price ($)</label>
                  <input type="number" min={0} step={0.01} className="admin-input"
                    value={pricingOptions.flatPrice ?? 0}
                    onChange={e => updateOptions({ flatPrice: parseFloat(e.target.value) || 0 })} />
                </div>
              )}

              {/* PER_PERSON */}
              {pricingOptions.strategyType === "PER_PERSON" && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Adult Rate ($)</label>
                    <input type="number" min={0} step={0.01} className="admin-input"
                      value={pricingOptions.adultRate ?? 0}
                      onChange={e => updateOptions({ adultRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Child Rate ($)</label>
                    <input type="number" min={0} step={0.01} className="admin-input"
                      value={pricingOptions.childRate ?? 0}
                      onChange={e => updateOptions({ childRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              )}

              {/* PER_KM */}
              {pricingOptions.strategyType === "PER_KM" && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Base Charge ($)</label>
                    <input type="number" min={0} step={0.01} className="admin-input"
                      value={pricingOptions.baseRate ?? 0}
                      onChange={e => updateOptions({ baseRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-label">Per KM Rate ($)</label>
                    <input type="number" min={0} step={0.01} className="admin-input"
                      value={pricingOptions.perKmRate ?? 0}
                      onChange={e => updateOptions({ perKmRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              )}

              {/* TIERED_OPTIONS */}
              {pricingOptions.strategyType === "TIERED_OPTIONS" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Dimensions */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <label className="admin-label" style={{ margin: 0 }}>Dimensions (option selectors)</label>
                      <button type="button" onClick={addDimension}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid var(--dash-border)', color: 'var(--primary)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>
                        <Plus size={12} /> Add Dimension
                      </button>
                    </div>
                    {(pricingOptions.dimensions ?? []).map((dim, i) => (
                      <div key={i} style={{ border: '1px solid var(--dash-border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <input type="text" className="admin-input" style={inputStyle} placeholder="Label (e.g. Pickup Location)"
                            value={dim.label} onChange={e => updateDimension(i, { label: e.target.value })} />
                          <input type="text" className="admin-input" style={inputStyle} placeholder="Key (e.g. location)"
                            value={dim.key} onChange={e => updateDimension(i, { key: e.target.value.replace(/\s/g,'_').toLowerCase() })} />
                          <button type="button" onClick={() => removeDimension(i)}
                            style={{ background: 'none', border: 'none', color: 'var(--dash-danger)', cursor: 'pointer', padding: '0 4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--dash-muted)', display: 'block', marginBottom: 4 }}>Options (comma-separated)</label>
                          <input type="text" className="admin-input" style={inputStyle}
                            placeholder="e.g. Colombo, Mattala, Galle"
                            value={dim.options.join(", ")}
                            onChange={e => updateDimension(i, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                        </div>
                      </div>
                    ))}
                    {(pricingOptions.dimensions ?? []).length === 0 && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', textAlign: 'center', padding: '8px 0' }}>Add dimensions to define selectable options.</p>
                    )}
                  </div>

                  {/* Price Tiers */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <label className="admin-label" style={{ margin: 0 }}>Price Tiers</label>
                      <button type="button" onClick={addTier}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid var(--dash-border)', color: 'var(--primary)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>
                        <Plus size={12} /> Add Tier
                      </button>
                    </div>
                    {(pricingOptions.tiers ?? []).map((tier, i) => (
                      <div key={i} style={{ border: '1px solid var(--dash-border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                          <input type="text" className="admin-input" style={{ ...inputStyle, flex: 1 }}
                            placeholder='Label (e.g. "Colombo → Yala, Van")'
                            value={tier.label} onChange={e => updateTier(i, { label: e.target.value })} />
                          <input type="number" min={0} step={0.01} className="admin-input" style={{ ...inputStyle, width: 100 }}
                            placeholder="Price ($)"
                            value={tier.price} onChange={e => updateTier(i, { price: parseFloat(e.target.value) || 0 })} />
                          <button type="button" onClick={() => removeTier(i)}
                            style={{ background: 'none', border: 'none', color: 'var(--dash-danger)', cursor: 'pointer', padding: '0 4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {/* Condition selectors per dimension */}
                        {(pricingOptions.dimensions ?? []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(pricingOptions.dimensions ?? []).map(dim => (
                              dim.options.length > 0 && (
                                <div key={dim.key}>
                                  <label style={{ fontSize: '0.72rem', color: 'var(--dash-muted)', display: 'block', marginBottom: 3 }}>{dim.label}</label>
                                  <select className="admin-input" style={{ ...inputStyle, fontSize: '0.8rem' }}
                                    value={tier.conditions[dim.key] ?? dim.options[0]}
                                    onChange={e => updateTier(i, { conditions: { ...tier.conditions, [dim.key]: e.target.value } })}>
                                    {dim.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {(pricingOptions.tiers ?? []).length === 0 && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', textAlign: 'center', padding: '8px 0' }}>Add price tiers for each combination of options.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="admin-label">Service Images (Max 5)</label>
              <input type="file" multiple accept="image/*" className="admin-input"
                onChange={e => {
                  if (e.target.files) {
                    const selected = Array.from(e.target.files);
                    if (selected.length > 5) { setErrorDialog({ isOpen: true, message: "Max 5 images." }); return; }
                    setFiles(selected);
                  }
                }} />
              {files.length > 0 && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--dash-muted)' }}>{files.length} file(s) selected</div>}
            </div>

          </form>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" form="service-form" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spinner" /> : (editData ? "Save Changes" : "Create Service")}
          </button>
        </div>
      </div>

      <CustomConfirmDialog
        isOpen={errorDialog.isOpen} title="Error" message={errorDialog.message}
        onConfirm={() => setErrorDialog({ isOpen: false, message: "" })}
        onCancel={() => setErrorDialog({ isOpen: false, message: "" })}
        confirmText="OK" showCancel={false} />
    </div>
  );
}
