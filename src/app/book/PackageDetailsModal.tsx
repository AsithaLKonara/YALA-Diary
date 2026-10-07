import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, CheckCircle, Clock, CalendarDays } from 'lucide-react';


export default function PackageDetailsModal({ 
  pkg, 
  onClose,
  onSelect 
}: { 
  pkg: any; 
  onClose: () => void;
  onSelect: () => void;
}) {
  const heroImage = (pkg as any).images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
  const inclusions = (pkg as any).inclusions || [];

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '800px', backgroundColor: '#0a110d',
        borderRadius: '16px', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
          borderRadius: '50%', width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        {/* Hero */}
        <div style={{ position: 'relative', width: '100%', height: '250px' }}>
          <Image src={heroImage} alt={pkg.name} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a110d 0%, transparent 100%)" }} />
          <div style={{ position: 'absolute', bottom: 20, left: 30, right: 30 }}>
             <span style={{
                display: "inline-block", padding: "4px 12px", marginBottom: "10px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "30px", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", color: '#fff'
              }}>
                {pkg.type.replace('_', ' ')}
              </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#fff' }}>{pkg.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: "flex", gap: "30px", fontSize: "0.95rem", marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
              <Clock size={18} color="var(--primary)" />
              <span>{pkg.startTime} - {pkg.endTime}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
              <CalendarDays size={18} color="var(--primary)" />
              <span>Daily Departures</span>
            </div>
          </div>

          {pkg.description ? (
            <div 
              className="rich-text"
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 30 }}
              dangerouslySetInnerHTML={{ __html: pkg.description }} 
            />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 30 }}>
              Experience the wild with our premium {pkg.type.toLowerCase().replace('_', ' ')} safari in Yala National Park. This package includes a private jeep, an expert guide, and a curated itinerary designed to maximize your wildlife sightings.
            </p>
          )}

          {inclusions && inclusions.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 16, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>What's Included</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginBottom: 30 }}>
                {inclusions.map((inc: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: 1.4 }}>{inc}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <button onClick={() => { onSelect(); onClose(); }} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
            Select This Safari
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
