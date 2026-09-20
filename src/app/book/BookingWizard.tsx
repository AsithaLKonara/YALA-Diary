"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, ChevronDown, Check, Loader2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useSession } from "next-auth/react";

interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  maxCapacity: number;
  availableRooms: number;
  img?: string;
  features?: string[];
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Guest {
  name: string;
  email: string;
  phone: string;
  country: string;
  requests: string;
}

interface BookingData {
  hotel: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room: Room | null;
  addons: Addon[];
  guest: Guest;
}

export default function BookingWizard() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    hotel: "Yala Diary",
    checkIn: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    adults: 1,
    children: 0,
    room: null,
    addons: [],
    guest: { name: "", email: "", phone: "", country: "", requests: "" }
  });

  useEffect(() => {
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

  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);

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
            { num: 2, label: "Select Room" },
            { num: 3, label: "Enhance Stay" },
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
        {step === 1 && <Step1 data={bookingData} updateData={updateData} next={() => setStep(2)} setAvailableRooms={setAvailableRooms} />}
        {step === 2 && <Step2 data={bookingData} updateData={updateData} next={() => setStep(3)} back={() => setStep(1)} availableRooms={availableRooms} />}
        {step === 3 && <Step3 data={bookingData} updateData={updateData} next={() => setStep(4)} back={() => setStep(2)} availableAddons={availableAddons} setAvailableAddons={setAvailableAddons} />}
        {step === 4 && <Step4 data={bookingData} updateData={updateData} back={() => setStep(3)} next={() => setStep(5)} />}
        {step === 5 && <Step5 />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 1: Search Availability
// -----------------------------------------------------------------------------
function Step1({ data, updateData, next, setAvailableRooms }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/booking/availability?checkIn=${data.checkIn}&checkOut=${data.checkOut}&adults=${data.adults}&children=${data.children}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch availability");
      
      // Inject some mock images/features based on name for now
      const roomsWithAssets = json.available.map((r: any) => {
        let img = "/images/assets/hero/pexels-gottapics-17892001.jpg";
        if (r.name.toLowerCase().includes("tent")) img = "/images/assets/hero/2147a00f-f329-4e74-8661-98ef719e1f42.jpg";
        return {
          ...r,
          img,
          features: ["Queen Bed", "En-suite Bathroom", "Jungle View"]
        };
      });

      setAvailableRooms(roomsWithAssets);
      next();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Reservations</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Place</label>
          <div className="input-with-icon">
            <MapPin size={18} className="input-icon" />
            <input type="text" className="form-input" value="Yala National Park" disabled style={{ opacity: 0.7 }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hotel</label>
          <div className="input-with-icon">
            <ChevronDown size={18} className="input-icon" style={{ left: 'auto', right: '16px' }} />
            <select 
              className="form-input" 
              value={data.hotel} 
              onChange={(e) => updateData({ hotel: e.target.value })}
              style={{ appearance: 'none' }}
            >
              <option value="Yala Diary">Yala Diary</option>
              <option value="Mahoora by Eco Team Yala">Mahoora by Eco Team Yala</option>
              <option value="Wild Coast Tented Lodge">Wild Coast Tented Lodge</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Check In</label>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Room Requirements</h3>
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

      {error && <div style={{ color: "var(--dash-danger)", marginTop: 10 }}>{error}</div>}

      <div className="booking-actions" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {loading && <Loader2 size={16} className="spinner" />}
          Check Availability →
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 2: Select Room
// -----------------------------------------------------------------------------
function Step2({ updateData, next, back, availableRooms }: any) {
  const { formatPrice } = useCurrency();

  const handleSelect = (r: Room) => {
    updateData({ room: r });
    next();
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Select Your Accommodation</h2>
      {availableRooms.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
          <p>No rooms available for these dates and guest counts.</p>
          <button className="btn-secondary" onClick={back} style={{ marginTop: 20 }}>Change Dates</button>
        </div>
      ) : (
        <div className="room-grid">
          {availableRooms.map((r: any) => (
            <div key={r.id} className="room-card">
              <div className="room-img-wrap">
                <Image src={r.img} alt={r.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="room-info">
                <h3 style={{ fontSize: '1.5rem', marginBottom: 10 }}>{r.name}</h3>
                <div className="room-features">
                  {r.features.map((f: string, i: number) => <span key={i} className="room-feature"><Check size={14} color="var(--primary)"/> {f}</span>)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
                  {r.availableRooms} rooms left
                </div>
                <div className="room-price">{formatPrice(r.pricePerNight)} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ night</span></div>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleSelect(r)}>Select Room</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="booking-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn-secondary" onClick={back}>← Back</button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 3: Addons
// -----------------------------------------------------------------------------
function Step3({ data, updateData, next, back, availableAddons, setAvailableAddons }: any) {
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableAddons.length === 0) {
      setLoading(true);
      fetch("/api/booking/addons")
        .then(res => res.json())
        .then(json => {
          if (json.addons) setAvailableAddons(json.addons);
        })
        .finally(() => setLoading(false));
    }
  }, [availableAddons, setAvailableAddons]);

  const toggleAddon = (addon: Addon) => {
    const exists = data.addons.find((a: any) => a.id === addon.id);
    if (exists) {
      updateData({ addons: data.addons.filter((a: any) => a.id !== addon.id) });
    } else {
      updateData({ addons: [...data.addons, addon] });
    }
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Enhance Your Stay</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 30 }}>Add personalized services to make your safari unforgettable.</p>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Loader2 className="spinner" size={32} /></div>
      ) : (
        <div className="addon-list">
          {availableAddons.map((a: any) => {
            const isSelected = data.addons.find((ad: any) => ad.id === a.id);
            return (
              <div key={a.id} className={`addon-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddon(a)}>
                <div className="addon-info">
                  <h4>{a.name}</h4>
                  <p>{a.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <span className="addon-price">+{formatPrice(a.price)}</span>
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

  const checkInDate = new Date(data.checkIn);
  const checkOutDate = new Date(data.checkOut);
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const roomPriceTotal = (data.room ? data.room.pricePerNight : 0) * nights;
  const addonsTotal = data.addons.reduce((sum: number, a: any) => sum + a.price, 0);
  const total = roomPriceTotal + addonsTotal;

  const handleSubmit = async () => {
    if (!data.guest.name || !data.guest.email) {
      setError("Please fill in your name and email.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (session?.user as any)?.id || null;
      
      const payload = {
        hotel: data.hotel,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        roomTypeId: data.room.id,
        addons: data.addons.map((a: any) => a.id),
        guest: data.guest,
        userId
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
          <span>Check In</span>
          <span style={{ color: '#fff' }}>{data.checkIn}</span>
        </div>
        <div className="summary-row">
          <span>Check Out</span>
          <span style={{ color: '#fff' }}>{data.checkOut}</span>
        </div>
        <div className="summary-row">
          <span>Nights</span>
          <span style={{ color: '#fff' }}>{nights}</span>
        </div>
        <div className="summary-row">
          <span>Guests</span>
          <span style={{ color: '#fff' }}>{data.adults} Adults, {data.children} Child</span>
        </div>
        
        <div style={{ margin: '25px 0', borderTop: '1px dashed rgba(255,255,255,0.2)' }}></div>
        
        <div className="summary-row">
          <span style={{ color: '#fff', fontWeight: 600 }}>{data.room?.name || "Tent"}</span>
          <span style={{ color: '#fff' }}>{formatPrice(roomPriceTotal)}</span>
        </div>

        {data.addons.map((a: any) => (
          <div className="summary-row" key={a.id} style={{ fontSize: '0.875rem' }}>
            <span>{a.name}</span>
            <span>{formatPrice(a.price)}</span>
          </div>
        ))}

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
      <h2 className="booking-title" style={{ fontSize: '2.5rem', marginBottom: 15 }}>Booking Confirmed!</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: 500, margin: '0 auto 30px' }}>
        Thank you for choosing Yala Diary. We have received your reservation and will send a confirmation email shortly.
      </p>
      <button className="btn-primary" onClick={() => window.location.href = '/'}>Return to Home</button>
    </div>
  );
}
