import React from 'react';
import Image from 'next/image';
import { X, CheckCircle, Plus } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

export default function ExtraServiceModal({ 
  service, 
  onClose,
  onSelect 
}: { 
  service: any; 
  onClose: () => void;
  onSelect: () => void;
}) {
  const { formatPrice } = useCurrency();
  const image = service.images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
  const features = service.features || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '600px', backgroundColor: '#0a110d',
        borderRadius: '16px', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
          borderRadius: '50%', width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image src={image} alt={service.name} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a110d 0%, transparent 100%)" }} />
          <div style={{ position: 'absolute', bottom: 20, left: 30, right: 30 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff' }}>{service.name}</h2>
          </div>
        </div>

        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
          {service.description ? (
            <div 
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 30 }}
              dangerouslySetInnerHTML={{ __html: service.description }} 
            />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 30 }}>
              Enhance your safari experience with this premium add-on.
            </p>
          )}

          {features && features.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 16, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>Highlights</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: 30 }}>
                {features.map((f: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 15 }}>
          <button onClick={() => { onSelect(); onClose(); }} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Plus size={20} /> Select Add-on
          </button>
        </div>
      </div>
    </div>
  );
}
