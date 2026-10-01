"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, ChevronDown, Check, Loader2, Info, AlertTriangle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { RATES } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { calculateSafariPrice, getDisplayMinPrice, getDisplayMinPriceLabel, calculateServicePrice } from "@/lib/pricing";
import type { SafariPricingRules, ServicePricingOptions } from "@/lib/pricing";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import PackageDetailsModal from "./PackageDetailsModal";
import ExtraServiceModal from "./ExtraServiceModal";

interface ExtraService {
  id: string;
  name: string;
  description: string;
  price: number;
  basePrice: number;
  pricingModel: string;
}

interface SafariPackage {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  pricingType: string;
  inclusions: string[];
  images: string[];
  extraServices: ExtraService[];
}

interface Guest {
  name: string;
  email: string;
  phone: string;
  country: string;
  requests: string;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  safariPackage: SafariPackage | null;
  addons: ExtraService[];
  guest: Guest;
  entranceTicketType?: "SELF_ARRANGED" | "COMPANY_PROVIDED";
  entranceTicketBlock?: string;
  entranceTicketDuration?: string;
  entranceTicketPrice?: number;
}

export default function BookingWizard() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    adults: "" as unknown as number,
    children: "" as unknown as number,
    safariPackage: null,
    addons: [],
    guest: { name: "", email: "", phone: "", country: "", requests: "" }
  });

  useEffect(() => {
    // Check if packageId is in URL to pre-select, but we fetch it in Step 2 so we will handle that there
    if (session?.user) {
      setBookingData(prev => ({
        ...prev,
        guest: {
          ...prev.guest,
          name: session.user?.name || "",
          email: session.user?.email || "",
        }
      }));
    }
  }, [session]);

  const [availablePackages, setAvailablePackages] = useState<SafariPackage[]>([]);

  const updateData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      {step < 6 && (
        <div className="booking-progress">
          {[
            { num: 1, label: "Reservations" },
            { num: 2, label: "Select Safari" },
            { num: 3, label: "Enhance Safari" },
            { num: 4, label: "Tickets" },
            { num: 5, label: "Checkout" }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`step-indicator ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}>
                <div className={`step-number ${step >= s.num ? "step-active-bg" : ""}`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < 4 && <div className="step-connector" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Steps Content */}
      <div className="wizard-content">
        {step === 1 && <Step1 data={bookingData} updateData={updateData} next={() => setStep(2)} />}
        {step === 2 && <Step2 data={bookingData} updateData={updateData} next={() => setStep(3)} back={() => setStep(1)} availablePackages={availablePackages} setAvailablePackages={setAvailablePackages} />}
        {step === 3 && <Step3 data={bookingData} updateData={updateData} next={() => setStep(4)} back={() => setStep(2)} />}
        {step === 4 && <Step4 data={bookingData} updateData={updateData} next={() => setStep(5)} back={() => setStep(3)} />}
        {step === 5 && <Step5 data={bookingData} updateData={updateData} back={() => setStep(4)} next={() => setStep(6)} />}
        {step === 6 && <Step6 />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 1: Search Availability
// -----------------------------------------------------------------------------
function Step1({ data, updateData, next }: any) {
  return (
    <div className="booking-panel">
      <h2 className="booking-title">Reservations</h2>
      
      <div style={{ background: "rgba(154, 205, 50, 0.1)", border: "1px solid rgba(154, 205, 50, 0.3)", borderRadius: "8px", padding: "16px", marginBottom: "30px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <Info color="var(--primary)" size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ color: "var(--primary)", fontWeight: 600, marginBottom: "4px" }}>Accommodation Booking Coming Soon</h4>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
            We are currently integrating with local hotels and lodges. For now, you can proceed to book your Safari Experiences directly.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Place</label>
          <div className="input-with-icon">
            <MapPin size={18} className="input-icon" />
            <input type="text" className="form-input" value="Yala National Park" disabled style={{ opacity: 0.7 }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Check In / Safari Date</label>
          <CustomDatePicker 
            value={data.checkIn} 
            onChange={(val) => updateData({ checkIn: val })} 
            placeholder="Select Safari Date"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Check Out</label>
          <CustomDatePicker 
            value={data.checkOut} 
            onChange={(val) => updateData({ checkOut: val })} 
            placeholder="Select Checkout Date"
          />
        </div>
      </div>

      <div className="room-box">
        <div className="room-box-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Guest Requirements</h3>
          <Users size={20} color="var(--primary)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Adults</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '54px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <button type="button" onClick={() => updateData({ adults: Math.max(1, (parseInt(data.adults as any) || 1) - 1) })} style={{ width: '45px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>-</button>
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.adults === "" ? "" : data.adults} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); updateData({ adults: raw === "" ? "" : parseInt(raw) }); }} style={{ flex: 1, height: '100%', minWidth: 0, background: 'transparent', border: 'none', textAlign: 'center', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <button type="button" onClick={() => updateData({ adults: (parseInt(data.adults as any) || 1) + 1 })} style={{ width: '45px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>+</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Children (0-13 years)</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '54px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <button type="button" onClick={() => updateData({ children: Math.max(0, (parseInt(data.children as any) || 0) - 1) })} style={{ width: '45px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>-</button>
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.children === "" ? "" : data.children} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); updateData({ children: raw === "" ? "" : parseInt(raw) }); }} style={{ flex: 1, height: '100%', minWidth: 0, background: 'transparent', border: 'none', textAlign: 'center', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <button type="button" onClick={() => updateData({ children: (parseInt(data.children as any) || 0) + 1 })} style={{ width: '45px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-actions" style={{ justifyContent: 'flex-end' }}>
        <button 
          className="btn-primary" 
          onClick={next} 
          disabled={data.adults === "" || !data.adults}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          Next: Choose Safari →
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 2: Select Safari
// -----------------------------------------------------------------------------
function Step2({ data, updateData, next, back, availablePackages, setAvailablePackages }: any) {
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPricing, setExpandedPricing] = useState<string | null>(null);
  const [selectedPackageModal, setSelectedPackageModal] = useState<any>(null);

  useEffect(() => {
    if (availablePackages.length === 0) {
      setSearchLoading(true);
      fetch("/api/booking/packages")
        .then(res => res.json())
        .then(json => { if (json.packages) setAvailablePackages(json.packages); })
        .catch(() => setError("Failed to load packages."))
        .finally(() => setSearchLoading(false));
    }
  }, [availablePackages.length, setAvailablePackages]);

  const handleSelect = (pkg: SafariPackage) => {
    updateData({ safariPackage: pkg, addons: [] });
    next();
  };

  // Calculate price for a package based on current guest count
  const getPriceInfo = (pkg: any) => {
    const rules = pkg.pricingRules as any;
    if (!rules) {
      // Fallback to legacy
      const price = pkg.pricingType === "PER_PERSON"
        ? pkg.basePrice * (data.adults + data.children)
        : pkg.basePrice;
      return { 
        totalPrice: price, 
        lines: [{ label: pkg.pricingType === "PER_PERSON" ? `${data.adults + data.children} guests × $${pkg.basePrice}` : `Flat jeep rate × $${pkg.basePrice}`, amount: price }], 
        valid: true, 
        validationError: undefined 
      };
    }
    return calculateSafariPrice(rules, data.adults, data.children);
  };

  return (
    <div className="booking-panel booking-sidebar-layout">
      {/* Sidebar */}
      <div className="booking-sidebar">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 600 }}>Your Details</h3>

        <div className="form-group">
          <label className="form-label">Safari Date</label>
          <CustomDatePicker 
            value={data.checkIn} 
            onChange={(val) => updateData({ checkIn: val })} 
            placeholder="Select Safari Date"
          />
        </div>

        <h4 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>Guests</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Adults</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '42px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
              <button type="button" onClick={() => updateData({ adults: Math.max(1, (parseInt(data.adults as any) || 1) - 1) })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>-</button>
              <input type="text" inputMode="numeric" pattern="[0-9]*" style={{ flex: 1, height: '100%', minWidth: 0, background: 'transparent', border: 'none', textAlign: 'center', color: 'var(--dash-text)', outline: 'none', fontSize: '0.9rem', width: '100%' }} value={data.adults === "" ? "" : data.adults} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); updateData({ adults: raw === "" ? "" : parseInt(raw) }); }} />
              <button type="button" onClick={() => updateData({ adults: (parseInt(data.adults as any) || 1) + 1 })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>+</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Children (0-13 yrs)</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '42px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
              <button type="button" onClick={() => updateData({ children: Math.max(0, (parseInt(data.children as any) || 0) - 1) })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>-</button>
              <input type="text" inputMode="numeric" pattern="[0-9]*" style={{ flex: 1, height: '100%', minWidth: 0, background: 'transparent', border: 'none', textAlign: 'center', color: 'var(--dash-text)', outline: 'none', fontSize: '0.9rem', width: '100%' }} value={data.children === "" ? "" : data.children} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); updateData({ children: raw === "" ? "" : parseInt(raw) }); }} />
              <button type="button" onClick={() => updateData({ children: (parseInt(data.children as any) || 0) + 1 })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>+</button>
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Jeeps (Private)</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '42px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', width: '100%' }}>
              <button type="button" onClick={() => updateData({ jeeps: Math.max(Math.max(1, Math.ceil(((parseInt(data.adults as any) || 1) + (parseInt(data.children as any) || 0)) / 6)), data.jeeps - 1) })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>-</button>
              <input type="text" inputMode="numeric" pattern="[0-9]*" style={{ flex: 1, height: '100%', minWidth: 0, background: 'transparent', border: 'none', textAlign: 'center', color: 'var(--dash-text)', outline: 'none', fontSize: '0.9rem', width: '100%' }} value={data.jeeps} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); updateData({ jeeps: Math.max(1, parseInt(raw) || 1) }); }} />
              <button type="button" onClick={() => updateData({ jeeps: data.jeeps + 1 })} style={{ width: '36px', height: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', color: 'var(--dash-text)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>+</button>
            </div>
          </div>
        </div>

        {/* Live price hint */}
        <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 8, background: 'rgba(154,205,50,0.07)', border: '1px solid rgba(154,205,50,0.2)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
          Prices update live based on your guest count. Click <strong style={{ color: 'var(--primary)' }}>"See Breakdown"</strong> on any card.
        </div>

        <div style={{ marginTop: '24px' }}>
          <button className="btn-secondary" onClick={back} style={{ width: '100%', padding: '10px' }}>← Back to step 1</button>
        </div>
      </div>

      {/* Main Content (Packages Grid) */}
      <div className="booking-main-content">
        <h2 className="booking-title" style={{ marginTop: 0 }}>Select Safari Package</h2>
        {error && <div style={{ color: "var(--dash-danger)", marginBottom: 20 }}>{error}</div>}

        {searchLoading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Loader2 size={32} className="spinner" style={{ margin: '0 auto', color: 'var(--primary)' }} />
          </div>
        ) : availablePackages.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
            <p>No safari packages currently available.</p>
          </div>
        ) : (
          <div className="room-grid">
            {availablePackages.filter((pkg: any) => {
              const rules = pkg.pricingRules as any;
              if (!rules) return true;
              const totalGuests = data.adults + data.children;
              return totalGuests >= rules.minGuests && totalGuests <= rules.maxCapacity;
            }).map((pkg: any) => {
              const image = pkg.images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
              const priceInfo = getPriceInfo(pkg);
              const rules = pkg.pricingRules as any;
              const isPriceExpanded = expandedPricing === pkg.id;
              return (
                <div key={pkg.id} className="room-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="room-img-wrap" style={{ height: '200px' }}>
                    <Image src={image} alt={pkg.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="room-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 5 }}>{pkg.name}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                      {pkg.startTime} – {pkg.endTime}
                    </div>
                    <div className="room-features" style={{ marginBottom: 12, flex: 1 }}>
                      {pkg.inclusions?.slice(0, 3).map((f: string, i: number) => (
                        <span key={i} className="room-feature"><Check size={14} color="var(--primary)"/> {f}</span>
                      ))}
                      {pkg.inclusions?.length > 3 && (
                        <span className="room-feature" style={{ color: 'rgba(255,255,255,0.5)' }}>+{pkg.inclusions.length - 3} more</span>
                      )}
                    </div>

                    {/* Capacity hint */}
                    {rules && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                        {rules.minGuests} – {rules.maxCapacity} guests · {rules.strategyType === 'PRIVATE_FLAT' ? 'Private Jeep' : rules.strategyType === 'GROUP_TIERED' ? 'Group Pack' : 'Per Person'}
                      </div>
                    )}

                    {/* Price Display */}
                    <div style={{ marginBottom: 10 }}>
                      {priceInfo.valid ? (
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {formatPrice(priceInfo.totalPrice)}
                          <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>total</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'var(--dash-danger)' }}>{priceInfo.validationError}</div>
                      )}

                      {/* Breakdown toggle */}
                      {priceInfo.valid && priceInfo.lines.length > 0 && (
                        <button
                          onClick={() => setExpandedPricing(isPriceExpanded ? null : pkg.id)}
                          style={{ background: 'none', border: 'none', color: 'rgba(154,205,50,0.7)', fontSize: '0.75rem', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline' }}>
                          {isPriceExpanded ? 'Hide' : 'See'} breakdown
                        </button>
                      )}

                      {/* Price Breakdown */}
                      {isPriceExpanded && (
                        <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {priceInfo.lines.map((line, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '3px 0', color: 'rgba(255,255,255,0.7)' }}>
                              <span>{line.label}</span>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{line.amount === 0 ? 'Free' : `$${line.amount.toFixed(2)}`}</span>
                            </div>
                          ))}
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>{formatPrice(priceInfo.totalPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                      <button
                        className="btn-secondary"
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}
                        onClick={() => setSelectedPackageModal(pkg)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-primary"
                        disabled={!priceInfo.valid}
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', opacity: priceInfo.valid ? 1 : 0.4 }}
                        onClick={() => priceInfo.valid && handleSelect(pkg)}
                      >
                        {priceInfo.valid ? 'Select' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedPackageModal && (
        <PackageDetailsModal 
          pkg={selectedPackageModal} 
          onClose={() => setSelectedPackageModal(null)} 
          onSelect={() => {
            const rules = selectedPackageModal.pricingRules as any;
            const valid = !rules || calculateSafariPrice(rules, data.adults, data.children).valid;
            if (valid) handleSelect(selectedPackageModal);
          }} 
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 3: Addons
// -----------------------------------------------------------------------------
function Step3({ data, updateData, next, back }: any) {
  const { formatPrice } = useCurrency();
  const [availableAddons, setAvailableAddons] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedServiceModal, setSelectedServiceModal] = useState<any>(null);

  // Local state for dropdown selections: addonId -> { dimensionKey: selectedValue }
  const [addonSelections, setAddonSelections] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/booking/addons")
      .then(res => res.json())
      .then(json => {
        if (json.addons) {
          setAvailableAddons(json.addons);
          // Initialize defaults for TIERED_OPTIONS
          const initialSelections: Record<string, Record<string, string>> = {};
          json.addons.forEach((a: any) => {
            const opts = a.pricingOptions as ServicePricingOptions | null;
            if (opts?.strategyType === "TIERED_OPTIONS" && opts.dimensions) {
              const def: Record<string, string> = {};
              opts.dimensions.forEach(d => { if (d.options.length > 0) def[d.key] = d.options[0]; });
              initialSelections[a.id] = def;
            }
          });
          // Override with any already selected in data.addons
          data.addons.forEach((sel: any) => {
            if (sel.selectedOptions) {
              initialSelections[sel.id] = { ...initialSelections[sel.id], ...sel.selectedOptions };
            }
          });
          setAddonSelections(initialSelections);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOptionChange = (addonId: string, dimKey: string, val: string) => {
    setAddonSelections(prev => {
      const nextState = { ...prev, [addonId]: { ...prev[addonId], [dimKey]: val } };
      
      // If this addon is currently selected, update it in the global data too
      const existingIdx = data.addons.findIndex((a: any) => a.id === addonId);
      if (existingIdx >= 0) {
        const updatedAddons = [...data.addons];
        updatedAddons[existingIdx] = { ...updatedAddons[existingIdx], selectedOptions: nextState[addonId] };
        updateData({ addons: updatedAddons });
      }
      
      return nextState;
    });
  };

  const toggleAddon = (addon: any, validPrice: boolean) => {
    if (!validPrice) return; // Don't allow selecting if options don't map to a price
    const exists = data.addons.find((a: any) => a.id === addon.id);
    if (exists) {
      updateData({ addons: data.addons.filter((a: any) => a.id !== addon.id) });
    } else {
      updateData({ addons: [...data.addons, { ...addon, selectedOptions: addonSelections[addon.id] }] });
    }
  };

  const selectedCount = data.addons.length;

  return (
    <div className="booking-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="booking-title" style={{ marginBottom: 6 }}>Enhance Your Safari</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Personalize your <strong style={{ color: 'var(--primary)' }}>{data.safariPackage?.name || "safari"}</strong> with optional add-ons.
          </p>
        </div>
        {selectedCount > 0 && (
          <div style={{
            background: 'rgba(154,205,50,0.12)', border: '1px solid rgba(154,205,50,0.3)',
            borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem',
            color: 'var(--primary)', fontWeight: 600, flexShrink: 0
          }}>
            {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={32} className="spinner" style={{ margin: '0 auto', color: 'var(--primary)' }} />
        </div>
      ) : availableAddons.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No extra services available.</p>
        </div>
      ) : (
        <div>
          {(() => {
            const validAddons = availableAddons.filter((a: any) => {
              const totalGuests = (data.adults || 0) + (data.children || 0);
              const opts = a.pricingOptions || {};
              if (opts.minGuests && totalGuests < opts.minGuests) return false;
              if (opts.maxCapacity && totalGuests > opts.maxCapacity) return false;
              return true;
            });
            
            const grouped = validAddons.reduce((acc: Record<string, any[]>, a: any) => {
              const cat = a.category || "Other";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(a);
              return acc;
            }, {});

            return Object.entries(grouped).map(([category, addons]) => (
              <div key={category} style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'rgba(255,255,255,0.9)', textTransform: 'capitalize' }}>{category}</h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {addons.map((a: any) => {
            const isSelected = !!data.addons.find((ad: any) => ad.id === a.id);
            const image = a.images?.[0] || null;
            
            // Calculate live price
            const opts = a.pricingOptions as ServicePricingOptions | null;
            let displayPrice = 0;
            let pricingLabel = "";
            let isValid = true;
            
            if (opts) {
              const breakdown = calculateServicePrice(opts, data.adults, data.children, addonSelections[a.id]);
              displayPrice = breakdown.totalPrice;
              isValid = breakdown.valid;
              if (opts.strategyType === "PER_PERSON") pricingLabel = "total (per person rates)";
              else if (opts.strategyType === "PER_KM") pricingLabel = "+ per km";
              else if (opts.strategyType === "TIERED_OPTIONS") pricingLabel = "total";
              else pricingLabel = "flat rate";
            } else {
              // Legacy
              displayPrice = a.pricingModel === "PER_PERSON" ? a.basePrice * (data.adults + data.children) : a.basePrice;
              pricingLabel = a.pricingModel === "PER_PERSON" ? "total" : "flat rate";
            }

            const hasDimensions = opts?.strategyType === "TIERED_OPTIONS" && opts.dimensions && opts.dimensions.length > 0;

            return (
              <div
                key={a.id}
                style={{
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: isSelected ? 'rgba(154,205,50,0.06)' : 'rgba(0,0,0,0.25)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 0 0 1px rgba(154,205,50,0.3), 0 8px 24px rgba(154,205,50,0.1)' : 'none',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {/* Image Area - clickable to toggle */}
                <div 
                  onClick={() => toggleAddon(a, isValid)}
                  style={{ position: 'relative', height: 160, background: '#111', overflow: 'hidden', cursor: isValid ? 'pointer' : 'not-allowed' }}>
                  {image ? (
                    <Image src={image} alt={a.name} fill style={{ objectFit: 'cover', opacity: isSelected ? 0.8 : 0.55, transition: 'opacity 0.25s' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.5rem', opacity: 0.3 }}>✦</div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                  
                  <div style={{
                    position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '3px 10px',
                    fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', textTransform: 'uppercase'
                  }}>{a.category}</div>
                  
                  <div style={{
                    position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: 6,
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.3)'}`,
                    background: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isSelected && <Check size={14} color="#000" strokeWidth={3} />}
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div onClick={() => toggleAddon(a, isValid)} style={{ cursor: isValid ? 'pointer' : 'not-allowed', flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6, color: '#fff' }}>{a.name}</h4>
                    {a.description && (
                      <p style={{
                        fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, marginBottom: 14,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{a.description}</p>
                    )}
                  </div>

                  {/* Dimension Selectors (if any) */}
                  {hasDimensions && (
                    <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {opts!.dimensions!.map(dim => (
                        <div key={dim.key}>
                          <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{dim.label}</label>
                          <select 
                            style={{ 
                              width: '100%', padding: '6px 10px', borderRadius: 6, 
                              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                              color: '#fff', fontSize: '0.85rem', outline: 'none' 
                            }}
                            value={addonSelections[a.id]?.[dim.key] || ""}
                            onChange={(e) => handleOptionChange(a.id, dim.key, e.target.value)}
                          >
                            {dim.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & Add Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div onClick={() => toggleAddon(a, isValid)} style={{ cursor: isValid ? 'pointer' : 'not-allowed' }}>
                      {isValid ? (
                        <>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {formatPrice(displayPrice)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                            / {pricingLabel}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--dash-danger)' }}>Select options to view price</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedServiceModal(a); }}
                        style={{
                          fontSize: '0.78rem', fontWeight: 600, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.2s'
                        }}>
                        Details
                      </button>
                      <button 
                        onClick={() => toggleAddon(a, isValid)}
                        disabled={!isValid}
                        style={{
                          fontSize: '0.78rem', fontWeight: 600, padding: '5px 12px', borderRadius: 20, cursor: isValid ? 'pointer' : 'not-allowed',
                          background: isSelected ? 'rgba(154,205,50,0.15)' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                          border: `1px solid ${isSelected ? 'rgba(154,205,50,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          transition: 'all 0.2s', opacity: isValid ? 1 : 0.5
                        }}>
                        {isSelected ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {selectedServiceModal && (
        <ExtraServiceModal 
          service={selectedServiceModal} 
          onClose={() => setSelectedServiceModal(null)} 
          onSelect={() => {
            const isSelected = data.addons.some((add: any) => add.id === selectedServiceModal.id);
            if (!isSelected) {
              const opts = selectedServiceModal.pricingOptions as ServicePricingOptions | null;
              const isValid = !opts?.dimensions || opts.dimensions.every((d: any) => addonSelections[selectedServiceModal.id]?.[d.key]);
              toggleAddon(selectedServiceModal, isValid);
            }
          }} 
        />
      )}

      <div className="booking-actions" style={{ marginTop: 30 }}>
        <button className="btn-secondary" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={next}>
          {selectedCount > 0 ? `Add ${selectedCount} Service${selectedCount !== 1 ? 's' : ''} & Continue` : "Skip & Continue"} →
        </button>
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// STEP 4: Tickets
// -----------------------------------------------------------------------------
function Step4({ data, updateData, back, next }: any) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      setLoadingTickets(true);
      try {
        const res = await fetch("/api/booking/tickets");
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTickets(false);
      }
    }
    fetchTickets();
  }, []);

  const handleSelectType = (option: "SELF_ARRANGED" | "COMPANY_PROVIDED") => {
    updateData({ 
      entranceTicketType: option,
      entranceTicketId: undefined, 
      entranceTicketPrice: undefined
    });
  };

  const handleSelectTicket = (ticketId: string) => {
    const tkt = tickets.find(t => t.id === ticketId);
    if (tkt) {
      const price = (tkt.adultPrice * data.adults) + (tkt.childPrice * data.children);
      updateData({
        entranceTicketId: ticketId,
        entranceTicketPrice: price
      });
    }
  };

  return (
    <div className="booking-panel booking-sidebar-layout">
      {/* Sidebar Details */}
      <div className="booking-sidebar">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 600 }}>Your Details</h3>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Safari Date</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{data.checkIn}</div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Guests</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{data.adults} Adults, {data.children} Children</div>
        </div>
        {data.safariPackage && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Selected Safari</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{data.safariPackage.name}</div>
          </div>
        )}
      </div>

      <div className="booking-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff' }}>Park Entrance Tickets</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 5 }}>All visitors require an entrance ticket for Yala National Park.</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 30 }}>
          <div 
            onClick={() => handleSelectType("SELF_ARRANGED")}
            style={{ 
              padding: 20, 
              border: `1px solid ${data.entranceTicketType === "SELF_ARRANGED" ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`, 
              borderRadius: 8, 
              marginBottom: 15, 
              cursor: 'pointer',
              background: data.entranceTicketType === "SELF_ARRANGED" ? 'rgba(154,205,50,0.1)' : 'rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>I will book my own tickets</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>You can book directly on the official DWC website.</p>
              </div>
              {data.entranceTicketType === "SELF_ARRANGED" && <Check size={24} color="var(--primary)" />}
            </div>
            {data.entranceTicketType === "SELF_ARRANGED" && (
              <div style={{ marginTop: 15, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}>
                Please ensure you book your tickets for the correct date and time at <a href="https://share.google/3hZua4Q3xppfHezYL" target="_blank" style={{ color: 'var(--primary)' }}>the official ticketing portal</a>
              </div>
            )}
          </div>

          <div 
            onClick={() => handleSelectType("COMPANY_PROVIDED")}
            style={{ 
              padding: 20, 
              border: `1px solid ${data.entranceTicketType === "COMPANY_PROVIDED" ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`, 
              borderRadius: 8, 
              cursor: 'pointer',
              background: data.entranceTicketType === "COMPANY_PROVIDED" ? 'rgba(154,205,50,0.1)' : 'rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Arrange tickets for me</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>We'll purchase the official park tickets on your behalf. (Cost will be added to your final bill)</p>
              </div>
              {data.entranceTicketType === "COMPANY_PROVIDED" && <Check size={24} color="var(--primary)" />}
            </div>

            {data.entranceTicketType === "COMPANY_PROVIDED" && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {loadingTickets ? (
                  <p style={{ color: 'var(--dash-muted)' }}>Loading available tickets...</p>
                ) : tickets.filter(t => !data.safariPackage || t.type === data.safariPackage.type).length === 0 ? (
                  <p style={{ color: 'var(--dash-muted)' }}>No tickets available for this safari time range right now.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: 5 }}>Select your ticket block:</p>
                    {tickets.filter(t => !data.safariPackage || t.type === data.safariPackage.type).map(tkt => (
                      <div 
                        key={tkt.id}
                        onClick={(e) => { e.stopPropagation(); handleSelectTicket(tkt.id); }}
                        style={{
                          padding: 15,
                          border: `1px solid ${data.entranceTicketId === tkt.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 6,
                          background: data.entranceTicketId === tkt.id ? 'rgba(154,205,50,0.2)' : 'rgba(0,0,0,0.2)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <input 
                            type="radio" 
                            checked={data.entranceTicketId === tkt.id} 
                            readOnly 
                            style={{ accentColor: 'var(--primary)', width: 18, height: 18, cursor: 'pointer' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 500 }}>{tkt.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                              Adult: LKR {tkt.adultPrice} × {data.adults} | Child: LKR {tkt.childPrice} × {data.children}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          LKR {((tkt.adultPrice * data.adults) + (tkt.childPrice * data.children)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <button className="btn-secondary" onClick={back}>Back</button>
          <button 
            className="btn-primary" 
            onClick={next}
            disabled={!data.entranceTicketType || (data.entranceTicketType === "COMPANY_PROVIDED" && !data.entranceTicketId)}
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 5: Checkout (formerly Step4)
// -----------------------------------------------------------------------------
// --- Step 5: Checkout (formerly Step4) ---
function Step5({ data, updateData, back, next }: any) {
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  // ── Safari price using engine ──
  const safariPriceInfo = (() => {
    const rules = data.safariPackage?.pricingRules as SafariPricingRules | null;
    if (!rules) {
      const price = data.safariPackage?.pricingType === "PER_PERSON"
        ? (data.safariPackage.basePrice * (data.adults + data.children))
        : (data.safariPackage?.basePrice || 0);
      return { totalPrice: price, lines: [{ label: "Safari Package", amount: price }], valid: true };
    }
    return calculateSafariPrice(rules, data.adults, data.children);
  })();

  // ── Addon prices using engine ──
  const addonBreakdowns = data.addons.map((a: any) => {
    const opts = a.pricingOptions as ServicePricingOptions | null;
    if (!opts) {
      const price = a.pricingModel === "PER_PERSON" ? (a.basePrice * (data.adults + data.children)) : a.basePrice;
      return { addon: a, totalPrice: price, lines: [{ label: a.name, amount: price }], valid: true };
    }
    const breakdown = calculateServicePrice(opts, data.adults, data.children, a.selectedOptions);
    return { addon: a, ...breakdown };
  });

  const addonsTotal = addonBreakdowns.reduce((sum: number, b: any) => sum + (b.valid ? b.totalPrice : 0), 0);
  const ticketTotal = data.entranceTicketType === "COMPANY_PROVIDED" ? (data.entranceTicketPrice || 0) : 0;
  const governmentTax = (ticketTotal * 0.18) + 10;
  const total = (safariPriceInfo.valid ? safariPriceInfo.totalPrice : 0) + addonsTotal + ticketTotal + governmentTax;

  const handleSubmit = async () => {
    if (!data.guest.name || !data.guest.email) { setError("Please fill in your name and email."); return; }
    setLoading(true);
    setError("");
    try {
      const userId = (session?.user as any)?.id || null;
      const payload = {
        isSafariOnly: true,
        safariPackageId: data.safariPackage?.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        addons: data.addons.map((a: any) => ({
          id: a.id,
          pricingModel: a.pricingModel,
          basePrice: a.basePrice,
          selectedOptions: a.selectedOptions,
        })),
        guest: data.guest,
        userId,
        safariPrice: safariPriceInfo.totalPrice,
        totalPrice: total,
        entranceTicketType: data.entranceTicketType,
        entranceTicketId: data.entranceTicketId,
        entranceTicketPrice: data.entranceTicketPrice,
        pricingSnapshot: {
          safari: safariPriceInfo,
          addons: addonBreakdowns.map((b: any) => ({ id: b.addon.id, name: b.addon.name, price: b.totalPrice, lines: b.lines })),
          ticket: {
            type: data.entranceTicketType,
            id: data.entranceTicketId,
            price: data.entranceTicketPrice
          }
        },
      };
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create booking");
      
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      } else {
        next();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-grid">
      <div className="booking-panel" style={{ marginBottom: 0 }}>
        <h2 className="booking-title">Guest Details</h2>
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Full Name *</label>
            <input type="text" className="form-input" placeholder="e.g. David Attenborough"
              value={data.guest.name} onChange={(e) => updateData({ guest: { ...data.guest, name: e.target.value } })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" className="form-input" placeholder="david@example.com"
              value={data.guest.email} onChange={(e) => updateData({ guest: { ...data.guest, email: e.target.value } })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="+1 000 000 0000"
              value={data.guest.phone} onChange={(e) => updateData({ guest: { ...data.guest, phone: e.target.value } })} />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input type="text" className="form-input" placeholder="e.g. United Kingdom"
              value={data.guest.country} onChange={(e) => updateData({ guest: { ...data.guest, country: e.target.value } })} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Special Requests</label>
            <textarea className="form-input" rows={4} placeholder="Dietary requirements, celebrations..."
              style={{ resize: 'vertical' }} value={data.guest.requests}
              onChange={(e) => updateData({ guest: { ...data.guest, requests: e.target.value } })} />
          </div>
        </div>
        {error && <div style={{ color: "var(--dash-danger)", marginTop: 20 }}>{error}</div>}
        <div className="booking-actions">
          <button className="btn-secondary" onClick={back} disabled={loading}>← Back</button>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="summary-panel">
        <h3 style={{ fontSize: '1.5rem', marginBottom: 25, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Booking Summary</h3>

        <div className="summary-row">
          <span>Safari Date</span>
          <span style={{ color: '#fff' }}>{data.checkIn}</span>
        </div>
        <div className="summary-row">
          <span>Guests</span>
          <span style={{ color: '#fff' }}>{data.adults} Adult{data.adults !== 1 ? 's' : ''}{data.children > 0 ? `, ${data.children} Child${data.children !== 1 ? 'ren' : ''}` : ''}</span>
        </div>

        <div style={{ margin: '20px 0', borderTop: '1px dashed rgba(255,255,255,0.15)' }} />

        {/* Safari Package */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff', marginBottom: 6 }}>
            <span>{data.safariPackage?.name}</span>
            <span>{formatPrice(safariPriceInfo.totalPrice)}</span>
          </div>
          {safariPriceInfo.lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', padding: '2px 0 2px 12px' }}>
              <span>{line.label}</span>
              <span>{line.amount === 0 ? 'Free' : `$${line.amount.toFixed(2)}`}</span>
            </div>
          ))}
        </div>

        {/* Park Entrance Tickets */}
        {data.entranceTicketType && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#ddd', fontWeight: 500, marginBottom: 4 }}>
              <span>Park Entrance Ticket ({data.entranceTicketType === "COMPANY_PROVIDED" ? 'Company Provided' : 'Self Arranged'})</span>
              <span>{data.entranceTicketType === "COMPANY_PROVIDED" ? formatPrice(data.entranceTicketPrice || 0) : '—'}</span>
            </div>
          </div>
        )}

        {/* Add-ons */}
        {addonBreakdowns.map((b: any) => (
          <div key={b.addon.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#ddd', fontWeight: 500, marginBottom: 4 }}>
              <span>{b.addon.name}</span>
              <span>{b.valid ? formatPrice(b.totalPrice) : '—'}</span>
            </div>
            {b.addon.selectedOptions && Object.entries(b.addon.selectedOptions).map(([k, v]: any) => (
              <div key={k} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', padding: '1px 0 1px 12px' }}>{k}: {v}</div>
            ))}
            {b.lines?.length > 1 && b.lines.map((line: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', padding: '1px 0 1px 12px' }}>
                <span>{line.label}</span><span>${line.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Government Tax */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#ddd', fontWeight: 500, marginBottom: 4 }}>
            <span>Government Tax</span>
            <span>{formatPrice(governmentTax)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', padding: '1px 0 1px 12px', display: 'flex', flexDirection: 'column' }}>
            {data.entranceTicketType === "COMPANY_PROVIDED" && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Entrance Ticket Tax (18%)</span>
                <span>{formatPrice(ticketTotal * 0.18)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fixed Service Tax</span>
              <span>$10.00</span>
            </div>
          </div>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: 30, padding: '20px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={handleSubmit} disabled={loading}
        >
          {loading && <Loader2 size={18} className="spinner" />}
          Complete Booking
        </button>
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// STEP 5: Success
// -----------------------------------------------------------------------------
// --- Step 6: Confirmation (formerly Step5) ---
function Step6() {
  return (
    <div className="booking-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(154, 205, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Check size={40} color="var(--primary)" />
      </div>
      <h2 className="booking-title" style={{ fontSize: '2.5rem', marginBottom: 15 }}>Safari Confirmed!</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: 500, margin: '0 auto 30px' }}>
        Thank you for choosing Yala Diary. We have received your safari reservation and will send a confirmation email shortly.
      </p>
      <button className="btn-primary" onClick={() => window.location.href = '/'}>Return to Home</button>
    </div>
  );
}
