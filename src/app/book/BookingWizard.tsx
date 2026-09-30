"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, ChevronDown, Check, Loader2, Info } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useSession } from "next-auth/react";

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
}

export default function BookingWizard() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    adults: 1,
    children: 0,
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
      {step < 5 && (
        <div className="booking-progress">
          {[
            { num: 1, label: "Reservations" },
            { num: 2, label: "Select Safari" },
            { num: 3, label: "Enhance Safari" },
            { num: 4, label: "Checkout" }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`step-indicator ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}>
                <div className={`step-number ${step >= s.num ? "step-active-bg" : ""}`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < 3 && <div className="step-connector" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Steps Content */}
      <div className="wizard-content">
        {step === 1 && <Step1 data={bookingData} updateData={updateData} next={() => setStep(2)} />}
        {step === 2 && <Step2 data={bookingData} updateData={updateData} next={() => setStep(3)} back={() => setStep(1)} availablePackages={availablePackages} setAvailablePackages={setAvailablePackages} />}
        {step === 3 && <Step3 data={bookingData} updateData={updateData} next={() => setStep(4)} back={() => setStep(2)} />}
        {step === 4 && <Step4 data={bookingData} updateData={updateData} back={() => setStep(3)} next={() => setStep(5)} />}
        {step === 5 && <Step5 />}
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
          <div className="input-with-icon">
            <Calendar size={18} className="input-icon" />
            <input 
              type="date" 
              className="form-input" 
              value={data.checkIn} 
              onChange={(e) => updateData({ checkIn: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Check Out</label>
          <div className="input-with-icon">
            <Calendar size={18} className="input-icon" />
            <input 
              type="date" 
              className="form-input" 
              value={data.checkOut} 
              onChange={(e) => updateData({ checkOut: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="room-box">
        <div className="room-box-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Guest Requirements</h3>
          <Users size={20} color="var(--primary)" />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Adults</label>
            <input 
              type="number" 
              min="1" 
              className="form-input" 
              value={data.adults} 
              onChange={(e) => updateData({ adults: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Children (0-11 years)</label>
            <input 
              type="number" 
              min="0" 
              className="form-input" 
              value={data.children} 
              onChange={(e) => updateData({ children: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="booking-actions" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={next} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

  useEffect(() => {
    if (availablePackages.length === 0) {
      setSearchLoading(true);
      fetch("/api/booking/packages")
        .then(res => res.json())
        .then(json => {
          if (json.packages) setAvailablePackages(json.packages);
        })
        .catch(err => setError("Failed to load packages."))
        .finally(() => setSearchLoading(false));
    }
  }, [availablePackages.length, setAvailablePackages]);

  const handleSelect = (pkg: SafariPackage) => {
    updateData({ safariPackage: pkg, addons: [] }); // Reset addons on package change
    next();
  };

  return (
    <div className="booking-panel booking-sidebar-layout">
      
      {/* Sidebar Filters */}
      <div className="booking-sidebar">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 600 }}>Your Details</h3>
        
        <div className="form-group">
          <label className="form-label">Safari Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={data.checkIn} 
            onChange={(e) => updateData({ checkIn: e.target.value })}
            style={{ fontSize: '0.9rem' }}
          />
        </div>
        
        <h4 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>Guests</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Adults</label>
            <input 
              type="number" 
              min="1" 
              className="form-input" 
              value={data.adults} 
              onChange={(e) => updateData({ adults: parseInt(e.target.value) || 1 })}
              style={{ fontSize: '0.9rem' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Children</label>
            <input 
              type="number" 
              min="0" 
              className="form-input" 
              value={data.children} 
              onChange={(e) => updateData({ children: parseInt(e.target.value) || 0 })}
              style={{ fontSize: '0.9rem' }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
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
            {availablePackages.map((pkg: SafariPackage) => {
              const image = pkg.images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
              return (
                <div key={pkg.id} className="room-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="room-img-wrap" style={{ height: '200px' }}>
                    <Image src={image} alt={pkg.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="room-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 5 }}>{pkg.name}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: 15 }}>
                      {pkg.startTime} - {pkg.endTime}
                    </div>
                    <div className="room-features" style={{ marginBottom: 15, flex: 1 }}>
                      {pkg.inclusions?.slice(0, 3).map((f: string, i: number) => (
                        <span key={i} className="room-feature"><Check size={14} color="var(--primary)"/> {f}</span>
                      ))}
                      {pkg.inclusions?.length > 3 && (
                        <span className="room-feature" style={{ color: 'rgba(255,255,255,0.5)' }}>+{pkg.inclusions.length - 3} more</span>
                      )}
                    </div>
                    <div className="room-price" style={{ marginBottom: 15 }}>
                      {formatPrice(pkg.basePrice)} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ {pkg.pricingType === "PER_PERSON" ? "person" : "jeep"}</span>
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }} 
                      onClick={() => handleSelect(pkg)}
                    >
                      Select Safari
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
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

  useEffect(() => {
    setLoading(true);
    fetch("/api/booking/addons")
      .then(res => res.json())
      .then(json => {
        if (json.addons) setAvailableAddons(json.addons);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleAddon = (addon: ExtraService) => {
    const exists = data.addons.find((a: any) => a.id === addon.id);
    if (exists) {
      updateData({ addons: data.addons.filter((a: any) => a.id !== addon.id) });
    } else {
      updateData({ addons: [...data.addons, addon] });
    }
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Enhance Your Safari</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 30 }}>Add personalized services for your {data.safariPackage?.name || "safari"}.</p>
      
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <Loader2 size={32} className="spinner" style={{ margin: '0 auto', color: 'var(--primary)' }} />
        </div>
      ) : availableAddons.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
          <p>No extra services available.</p>
        </div>
      ) : (
        <div className="addon-list">
          {availableAddons.map((a: any) => {
            const isSelected = data.addons.find((ad: any) => ad.id === a.id);
            return (
              <div key={a.id} className={`addon-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddon(a)}>
                <div className="addon-info">
                  <h4>{a.name}</h4>
                  <p>{a.description}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 4, display: 'inline-block' }}>{a.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <span className="addon-price">+{formatPrice(a.basePrice)} <span style={{fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)'}}>/{a.pricingModel.replace('_', ' ')}</span></span>
                  <div style={{ width: 24, height: 24, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--primary)' : 'transparent' }}>
                    {isSelected && <Check size={16} color="#000" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="booking-actions">
        <button className="btn-secondary" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={next}>
          {data.addons.length > 0 ? "Add Selected & Continue" : "Skip & Continue"} →
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 4: Checkout
// -----------------------------------------------------------------------------
function Step4({ data, updateData, back, next }: any) {
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  // Calculate pricing based on logic
  const safariPrice = data.safariPackage?.pricingType === "PER_PERSON" 
    ? (data.safariPackage.basePrice * (data.adults + data.children))
    : (data.safariPackage?.basePrice || 0);

  let addonsTotal = 0;
  data.addons.forEach((a: ExtraService) => {
    if (a.pricingModel === "PER_PERSON") addonsTotal += (a.basePrice * (data.adults + data.children));
    else addonsTotal += a.basePrice; // Flat rate or Per KM (ignoring km for now)
  });

  const total = safariPrice + addonsTotal;

  const handleSubmit = async () => {
    if (!data.guest.name || !data.guest.email) {
      setError("Please fill in your name and email.");
      return;
    }
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
          basePrice: a.basePrice
        })),
        guest: data.guest,
        userId,
        safariPrice,
        totalPrice: total
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create booking");

      next(); // Go to success page
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
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. David Attenborough" 
              value={data.guest.name}
              onChange={(e) => updateData({ guest: { ...data.guest, name: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="david@example.com" 
              value={data.guest.email}
              onChange={(e) => updateData({ guest: { ...data.guest, email: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-input" 
              placeholder="+1 000 000 0000" 
              value={data.guest.phone}
              onChange={(e) => updateData({ guest: { ...data.guest, phone: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. United Kingdom" 
              value={data.guest.country}
              onChange={(e) => updateData({ guest: { ...data.guest, country: e.target.value } })}
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Special Requests</label>
            <textarea 
              className="form-input" 
              rows={4} 
              placeholder="Dietary requirements, celebrations..." 
              style={{ resize: 'vertical' }}
              value={data.guest.requests}
              onChange={(e) => updateData({ guest: { ...data.guest, requests: e.target.value } })}
            ></textarea>
          </div>
        </div>

        {error && <div style={{ color: "var(--dash-danger)", marginTop: 20 }}>{error}</div>}

        <div className="booking-actions">
          <button className="btn-secondary" onClick={back} disabled={loading}>← Back</button>
        </div>
      </div>

      <div className="summary-panel">
        <h3 style={{ fontSize: '1.5rem', marginBottom: 25, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Booking Summary</h3>
        
        <div className="summary-row">
          <span>Safari Date</span>
          <span style={{ color: '#fff' }}>{data.checkIn}</span>
        </div>
        <div className="summary-row">
          <span>Guests</span>
          <span style={{ color: '#fff' }}>{data.adults} Adults, {data.children} Child</span>
        </div>
        
        <div style={{ margin: '25px 0', borderTop: '1px dashed rgba(255,255,255,0.2)' }}></div>
        
        <div className="summary-row">
          <span style={{ color: '#fff', fontWeight: 600 }}>{data.safariPackage?.name}</span>
          <span style={{ color: '#fff' }}>{formatPrice(safariPrice)}</span>
        </div>
        {data.safariPackage && (
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '-10px', marginBottom: '15px' }}>
            {data.safariPackage.startTime} - {data.safariPackage.endTime}
          </div>
        )}

        {data.addons.map((a: any) => {
          const addonCost = a.pricingModel === "PER_PERSON" ? (a.basePrice * (data.adults + data.children)) : a.basePrice;
          return (
            <div className="summary-row" key={a.id} style={{ fontSize: '0.875rem' }}>
              <span>{a.name} <span style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem'}}>({a.pricingModel.replace('_', ' ')})</span></span>
              <span>{formatPrice(addonCost)}</span>
            </div>
          )
        })}

        <div className="summary-total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: 30, padding: '20px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={handleSubmit}
          disabled={loading}
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
function Step5() {
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
