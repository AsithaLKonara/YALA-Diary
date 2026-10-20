import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, CheckCircle, Plus, Minus, Utensils, Check } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { cleanRichText } from '@/lib/sanitizeHtml';
import type { ServicePricingOptions, MenuItemOption } from '@/lib/pricing';

export interface ExtraServiceModalProps {
  service: any;
  totalGuests: number;
  initialMenuSelections?: Record<string, number>;
  initialDimensionSelections?: Record<string, string>;
  isSelected?: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    selectedMenus?: Record<string, number>;
    selectedOptions?: Record<string, string>;
    totalPrice: number;
    summaryText: string;
  }) => void;
  onRemove?: () => void;
}

export default function ExtraServiceModal({ 
  service, 
  totalGuests = 1,
  initialMenuSelections = {},
  initialDimensionSelections = {},
  isSelected = false,
  onClose,
  onConfirm,
  onRemove
}: ExtraServiceModalProps) {
  const { formatPrice } = useCurrency();
  const image = service.images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
  const features = service.features || [];

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pricingOptions = service.pricingOptions as ServicePricingOptions | null;
  const menus: MenuItemOption[] = pricingOptions?.menus || [];
  const isMenuPackage = pricingOptions?.strategyType === "MENU_OPTIONS" || menus.length > 0;
  const dimensions = pricingOptions?.dimensions || [];
  const hasDimensions = pricingOptions?.strategyType === "TIERED_OPTIONS" && dimensions.length > 0;

  // State for menu counts
  const [menuCounts, setMenuCounts] = useState<Record<string, number>>(() => {
    if (initialMenuSelections && Object.keys(initialMenuSelections).length > 0) {
      return initialMenuSelections;
    }
    // If brand new selection for a menu package, initialize first menu with totalGuests
    if (isMenuPackage && menus.length > 0) {
      return { [menus[0].id]: totalGuests };
    }
    return {};
  });

  // State for dimension selections (if any)
  const [selectedDims, setSelectedDims] = useState<Record<string, string>>(() => {
    if (initialDimensionSelections && Object.keys(initialDimensionSelections).length > 0) {
      return initialDimensionSelections;
    }
    const defaults: Record<string, string> = {};
    dimensions.forEach(d => {
      if (d.options.length > 0) defaults[d.key] = d.options[0];
    });
    return defaults;
  });

  const totalOrders = Object.values(menuCounts).reduce((sum, count) => sum + (count || 0), 0);

  // Calculate live price
  let totalPrice = 0;
  let summaryText = "";

  if (isMenuPackage) {
    menus.forEach(m => {
      const count = menuCounts[m.id] || 0;
      if (count > 0) {
        totalPrice += m.price * count;
      }
    });
    const summaryParts = menus
      .filter(m => (menuCounts[m.id] || 0) > 0)
      .map(m => `${menuCounts[m.id]}× ${m.name}`);
    summaryText = summaryParts.join(", ");
  } else if (pricingOptions?.strategyType === "PER_PERSON") {
    const adultRate = pricingOptions.adultRate ?? service.basePrice ?? 0;
    totalPrice = (adultRate * totalGuests);
    summaryText = `${totalGuests} guest(s)`;
  } else if (hasDimensions) {
    const tiers = pricingOptions?.tiers ?? [];
    const matched = tiers.find(t => 
      Object.entries(t.conditions).every(([k, v]) => selectedDims[k] === v)
    );
    totalPrice = matched ? matched.price : (service.basePrice ?? 0);
    summaryText = Object.values(selectedDims).join(", ");
  } else {
    totalPrice = service.basePrice ?? 0;
    summaryText = "Flat Rate";
  }

  const handleIncrement = (menuId: string) => {
    setMenuCounts(prev => ({
      ...prev,
      [menuId]: (prev[menuId] || 0) + 1
    }));
  };

  const handleDecrement = (menuId: string) => {
    setMenuCounts(prev => {
      const current = prev[menuId] || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [menuId]: current - 1
      };
    });
  };

  const handleMatchGuestCount = () => {
    if (menus.length === 0) return;
    setMenuCounts({ [menus[0].id]: totalGuests });
  };

  const handleConfirm = () => {
    onConfirm({
      selectedMenus: isMenuPackage ? menuCounts : undefined,
      selectedOptions: hasDimensions ? selectedDims : undefined,
      totalPrice,
      summaryText
    });
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '640px', backgroundColor: '#0a110d',
        border: '1px solid rgba(154,205,50,0.25)',
        borderRadius: '16px', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          borderRadius: '50%', width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          <X size={18} />
        </button>

        {/* Hero Header */}
        <div style={{ position: 'relative', width: '100%', height: '180px' }}>
          <Image src={image} alt={service.name} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a110d 0%, rgba(10,17,13,0.4) 70%, transparent 100%)" }} />
          <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24 }}>
            <span style={{
              display: 'inline-block', background: 'rgba(154,205,50,0.15)',
              border: '1px solid rgba(154,205,50,0.35)', color: 'var(--primary)',
              borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6
            }}>
              {service.category || "Extra Service"}
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              {service.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Description */}
          {service.description ? (
            <div 
              className="rich-text"
              style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: 20 }}
              dangerouslySetInnerHTML={{ __html: cleanRichText(service.description) }} 
            />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: 20 }}>
              Enhance your safari experience with this premium add-on.
            </p>
          )}

          {/* ── FOOD & BEVERAGE MENU SELECTION SECTION ── */}
          {isMenuPackage && (
            <div style={{
              marginBottom: 24, padding: '16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Utensils size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Select Menus & Guest Portions
                  </h3>
                </div>

                {/* Match indicator pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                  background: totalOrders === totalGuests ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  border: `1px solid ${totalOrders === totalGuests ? 'rgba(34, 197, 94, 0.35)' : 'rgba(234, 179, 8, 0.35)'}`,
                  color: totalOrders === totalGuests ? '#4ade80' : '#facc15'
                }}>
                  {totalOrders === totalGuests ? (
                    <>
                      <Check size={12} strokeWidth={3} />
                      <span>{totalOrders} of {totalGuests} guests matched</span>
                    </>
                  ) : (
                    <span>{totalOrders} orders selected ({totalGuests} guests)</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                  Adjust how many portions of each menu option your group needs.
                </p>
                {menus.length > 0 && totalOrders !== totalGuests && (
                  <button 
                    type="button" 
                    onClick={handleMatchGuestCount}
                    style={{
                      background: 'none', border: 'none', color: 'var(--primary)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
                    }}>
                    Reset to {totalGuests} guests
                  </button>
                )}
              </div>

              {/* Menu List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {menus.map((menu) => {
                  const count = menuCounts[menu.id] || 0;
                  return (
                    <div 
                      key={menu.id} 
                      style={{
                        padding: '14px 16px', borderRadius: 10,
                        border: `1px solid ${count > 0 ? 'rgba(154,205,50,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        background: count > 0 ? 'rgba(154,205,50,0.05)' : 'rgba(0,0,0,0.3)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{menu.name}</span>
                          <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>
                            {formatPrice(menu.price)} <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/ portion</span>
                          </span>
                        </div>
                        {menu.description && (
                          <div 
                            className="menu-inclusions-content"
                            style={{ 
                              marginTop: 6,
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere'
                            }}
                            dangerouslySetInnerHTML={{ __html: cleanRichText(menu.description) }}
                          />
                        )}
                      </div>

                      {/* - / + Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleDecrement(menu.id)}
                          disabled={count <= 0}
                          aria-label={`Decrease ${menu.name}`}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: count > 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                            color: count > 0 ? '#fff' : 'rgba(255,255,255,0.2)',
                            cursor: count > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        
                        <span style={{
                          minWidth: 28, textAlign: 'center',
                          fontWeight: 700, fontSize: '1rem',
                          color: count > 0 ? 'var(--primary)' : 'rgba(255,255,255,0.5)'
                        }}>
                          {count}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleIncrement(menu.id)}
                          aria-label={`Increase ${menu.name}`}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: '1px solid rgba(154,205,50,0.3)',
                            background: 'rgba(154,205,50,0.15)',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DIMENSION SELECTION (Non-menu tiered options) ── */}
          {hasDimensions && (
            <div style={{
              marginBottom: 24, padding: '16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 12 }}>Options</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {dimensions.map(dim => (
                  <div key={dim.key}>
                    <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>
                      {dim.label}
                    </label>
                    <select
                      value={selectedDims[dim.key] || ""}
                      onChange={e => setSelectedDims({ ...selectedDims, [dim.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 8,
                        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff', fontSize: '0.9rem', outline: 'none'
                      }}
                    >
                      {dim.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {features && features.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 12, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 6 }}>
                Highlights
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {features.map((f: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isMenuPackage ? `Total (${totalOrders} order${totalOrders !== 1 ? 's' : ''})` : 'Total Price'}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(totalPrice)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {isSelected && onRemove && (
              <button 
                type="button" 
                onClick={() => { onRemove(); onClose(); }}
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '0.88rem' }}
              >
                Remove
              </button>
            )}
            <button 
              type="button" 
              onClick={handleConfirm}
              disabled={isMenuPackage && totalOrders === 0}
              className="btn-primary" 
              style={{
                padding: '10px 22px', fontSize: '0.92rem',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: (isMenuPackage && totalOrders === 0) ? 0.5 : 1,
                cursor: (isMenuPackage && totalOrders === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSelected ? "Update Selection" : "+ Add to Safari"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
