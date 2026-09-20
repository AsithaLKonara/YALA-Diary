"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, ChevronDown, Check } from "lucide-react";

interface Room {
  id: number;
  name: string;
  price: number;
  img: string;
  features: string[];
}

interface Addon {
  id: string;
  name: string;
  desc: string;
  price: number;
}

interface Guest {
  name: string;
  email: string;
  phone: string;
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
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    hotel: "Mahoora by Eco Team Yala",
    checkIn: "2026-09-20",
    checkOut: "2026-09-21",
    adults: 1,
    children: 0,
    room: null,
    addons: [],
    guest: { name: "", email: "", phone: "", requests: "" }
  });

  const updateData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
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

      {/* Steps Content */}
      <div className="wizard-content">
        {step === 1 && <Step1 data={bookingData} updateData={updateData} next={() => setStep(2)} />}
        {step === 2 && <Step2 data={bookingData} updateData={updateData} next={() => setStep(3)} back={() => setStep(1)} />}
        {step === 3 && <Step3 data={bookingData} updateData={updateData} next={() => setStep(4)} back={() => setStep(2)} />}
        {step === 4 && <Step4 data={bookingData} back={() => setStep(3)} />}
      </div>
    </div>
  );
}

interface StepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  next: () => void;
  back?: () => void;
}

function Step1({ data, updateData, next }: StepProps) {
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
              <option>Mahoora by Eco Team Yala</option>
              <option>Wild Coast Tented Lodge</option>
              <option>Leopard Trails Yala</option>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Room 1</h3>
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
        {data.children > 0 && (
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Child 1 Age</label>
            <select className="form-input">
              {[...Array(12)].map((_, i) => <option key={i}>{i} years</option>)}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.875rem' }}>+ Add Another Room</button>
        <div className="form-group" style={{ flex: '1', maxWidth: 300 }}>
          <input type="text" className="form-input" placeholder="Promo Code" />
        </div>
      </div>

      <div className="booking-actions" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={next}>Check Availability →</button>
      </div>
    </div>
  );
}

function Step2({ updateData, next, back }: StepProps) {
  const rooms: Room[] = [
    { id: 1, name: "Luxury Explorer Tent", price: 350, img: "/images/assets/hero/2147a00f-f329-4e74-8661-98ef719e1f42.jpg", features: ["Queen Bed", "En-suite Bathroom", "Jungle View"] },
    { id: 2, name: "Family Safari Suite", price: 550, img: "/images/assets/hero/pexels-gottapics-17892001.jpg", features: ["2 Bedrooms", "Private Deck", "Outdoor Shower"] },
  ];

  const handleSelect = (r: Room) => {
    updateData({ room: r });
    next();
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Select Your Tent</h2>
      <div className="room-grid">
        {rooms.map(r => (
          <div key={r.id} className="room-card">
            <div className="room-img-wrap">
              <Image src={r.img} alt={r.name} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="room-info">
              <h3 style={{ fontSize: '1.5rem', marginBottom: 10 }}>{r.name}</h3>
              <div className="room-features">
                {r.features.map((f, i) => <span key={i} className="room-feature"><Check size={14} color="var(--primary)"/> {f}</span>)}
              </div>
              <div className="room-price">${r.price} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ night</span></div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleSelect(r)}>Select Room</button>
            </div>
          </div>
        ))}
      </div>
      <div className="booking-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn-secondary" onClick={back}>← Back</button>
      </div>
    </div>
  );
}

function Step3({ data, updateData, next, back }: StepProps) {
  const addonsList: Addon[] = [
    { id: "safari", name: "Extra Full-Day Safari Drive", desc: "Private jeep with expert naturalist guide", price: 150 },
    { id: "lunch", name: "Bush Lunch Experience", desc: "Five-course meal served in the wilderness", price: 80 },
    { id: "transfer", name: "Airport Transfer (CMB)", desc: "Luxury SUV pickup from Colombo Airport", price: 200 },
  ];

  const toggleAddon = (addon: Addon) => {
    const exists = data.addons.find((a) => a.id === addon.id);
    if (exists) {
      updateData({ addons: data.addons.filter((a) => a.id !== addon.id) });
    } else {
      updateData({ addons: [...data.addons, addon] });
    }
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-title">Enhance Your Stay</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 30 }}>Add personalized services to make your safari unforgettable.</p>
      
      <div className="addon-list">
        {addonsList.map(a => {
          const isSelected = data.addons.find((ad) => ad.id === a.id);
          return (
            <div key={a.id} className={`addon-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddon(a)}>
              <div className="addon-info">
                <h4>{a.name}</h4>
                <p>{a.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <span className="addon-price">+${a.price}</span>
                <div style={{ width: 24, height: 24, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--primary)' : 'transparent' }}>
                  {isSelected && <Check size={16} color="#000" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="booking-actions">
        <button className="btn-secondary" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={next}>
          {data.addons.length > 0 ? "Add Selected & Continue" : "Skip & Continue"} →
        </button>
      </div>
    </div>
  );
}

function Step4({ data, back }: { data: BookingData, back: () => void }) {
  const roomPrice = data.room ? data.room.price : 0;
  const addonsTotal = data.addons.reduce((sum, a) => sum + a.price, 0);
  const total = roomPrice + addonsTotal;

  return (
    <div className="checkout-grid">
      <div className="booking-panel" style={{ marginBottom: 0 }}>
        <h2 className="booking-title">Guest Details</h2>
        
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="e.g. David Attenborough" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="david@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ display: 'flex' }}>
              <select className="form-input" style={{ width: '100px', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0 }}>
                <option>+1</option>
                <option>+44</option>
                <option>+61</option>
              </select>
              <input type="tel" className="form-input" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} placeholder="000 000 0000" />
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Special Requests</label>
            <textarea className="form-input" rows={4} placeholder="Dietary requirements, celebrations..." style={{ resize: 'vertical' }}></textarea>
          </div>
        </div>

        <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="terms" style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
          <label htmlFor="terms" style={{ color: 'rgba(255,255,255,0.7)' }}>I accept the <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Terms & Conditions</a></label>
        </div>

        <div className="booking-actions">
          <button className="btn-secondary" onClick={back}>← Back</button>
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
          <span>Guests</span>
          <span style={{ color: '#fff' }}>{data.adults} Adults, {data.children} Child</span>
        </div>
        
        <div style={{ margin: '25px 0', borderTop: '1px dashed rgba(255,255,255,0.2)' }}></div>
        
        <div className="summary-row">
          <span style={{ color: '#fff', fontWeight: 600 }}>{data.room?.name || "Tent"}</span>
          <span style={{ color: '#fff' }}>${roomPrice}</span>
        </div>

        {data.addons.map((a) => (
          <div className="summary-row" key={a.id} style={{ fontSize: '0.875rem' }}>
            <span>{a.name}</span>
            <span>${a.price}</span>
          </div>
        ))}

        <div className="summary-total">
          <span>Total</span>
          <span>${total}</span>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: 30, padding: '20px', fontSize: '1.125rem' }}>Complete Booking</button>
      </div>
    </div>
  );
}
