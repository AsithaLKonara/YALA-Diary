"use client";

import React, { useState, useEffect } from "react";
import { X, User, MapPin, Calendar, Users, CreditCard, CheckCircle, Package, Clock, Loader2, ChevronRight } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BookingEvent {
  id: string;
  status: string;
  action: string;
  note?: string;
  metadata?: any;
  createdAt: string;
}

interface FullBooking {
  id: string;
  ref: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  specialRequests?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  status: string;
  paymentStatus: string;
  roomRevenue: number;
  addOnRevenue: number;
  totalRevenue: number;
  safariBookings: {
    id: string;
    date: string;
    guests: number;
    entranceTicketType?: string;
    entranceTicketPrice?: number;
    entranceTicket?: {
      name: string;
      adultPrice: number;
      childPrice: number;
    };
    package: {
      name: string;
      type: string;
      startTime: string;
      endTime: string;
    };
  }[];
  serviceBookings: {
    id: string;
    quantity: number;
    totalPrice: number;
    service: {
      name: string;
      category: string;
      pricingModel: string;
    };
  }[];
  events: BookingEvent[];
}

// ─── Follow-up stages ──────────────────────────────────────────────────────────
const FOLLOWUP_STAGES = [
  { value: "CONFIRMED",      label: "Confirmed",       icon: "✓",  color: "var(--dash-success)" },
  { value: "PICKED_UP",     label: "Picked Up",       icon: "🚗", color: "#f59e0b" },
  { value: "TRIP_STARTED",  label: "Trip Started",    icon: "🦁", color: "#8b5cf6" },
  { value: "TRIP_COMPLETED", label: "Trip Completed", icon: "🎉", color: "#06b6d4" },
  { value: "CHECKED_OUT",   label: "Checked Out",     icon: "🏁", color: "var(--dash-muted)" },
  { value: "CANCELLED",     label: "Cancel Booking",  icon: "✕",  color: "var(--dash-danger)" },
];

const ACTION_OPTIONS = [
  { value: "ADMIN_NOTE",       label: "Add Note (No Status Change)" },
  { value: "STATUS_CHANGE",    label: "Change Status" },
];

// ─── Component ─────────────────────────────────────────────────────────────────
interface Props {
  bookingId: string | null;
  onClose: () => void;
  onStatusChange?: () => void;
}

export default function BookingSidePanel({ bookingId, onClose, onStatusChange }: Props) {
  const [booking, setBooking] = useState<FullBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Follow-up form state
  const [actionType, setActionType] = useState("ADMIN_NOTE");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setBooking(null);
    fetch(`/api/admin/bookings/${bookingId}`)
      .then(r => r.json())
      .then(data => {
        if (data.booking) setBooking(data.booking);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleSubmit = async () => {
    if (actionType === "STATUS_CHANGE" && !selectedStatus) {
      setError("Please select a status.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload: any = {
        action: actionType,
        note: note.trim() || undefined,
      };
      if (actionType === "STATUS_CHANGE") {
        payload.status = selectedStatus;
      }

      const res = await fetch(`/api/admin/bookings/${bookingId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save update.");

      // Refresh booking details
      const refreshed = await fetch(`/api/admin/bookings/${bookingId}`).then(r => r.json());
      if (refreshed.booking) setBooking(refreshed.booking);

      setNote("");
      setSelectedStatus("");
      setActionType("ADMIN_NOTE");
      onStatusChange?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)"
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(760px, 100vw)", zIndex: 201,
        background: "#0d1f14",
        borderLeft: "1px solid var(--dash-border)",
        display: "flex", flexDirection: "column", overflowY: "hidden",
        animation: "slideInRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--dash-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--dash-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              Booking Details
            </div>
            {booking && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)", margin: 0 }}>{booking.ref}</h2>
                <StatusBadgeFull status={booking.status} />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--dash-muted)", cursor: "pointer", padding: 8 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Loader2 size={32} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
            </div>
          ) : !booking ? (
            <p>Failed to load booking.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Guest Info */}
              <Section icon={<User size={16} />} title="Guest Information">
                <InfoRow label="Full Name" value={booking.guestName} />
                <InfoRow label="Email" value={booking.guestEmail} />
                <InfoRow label="Phone" value={booking.guestPhone || "—"} />
                <InfoRow label="Country" value={booking.guestCountry || "—"} />
                {booking.specialRequests && (
                  <div style={{
                    marginTop: "12px", padding: "12px", borderRadius: "8px",
                    background: "rgba(154,205,50,0.08)", border: "1px solid rgba(154,205,50,0.2)",
                    fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6
                  }}>
                    <strong style={{ color: "var(--primary)", display: "block", marginBottom: 4 }}>Special Requests</strong>
                    {booking.specialRequests}
                  </div>
                )}
              </Section>

              {/* Safari Itinerary */}
              {booking.safariBookings.length > 0 && (
                <Section icon={<Package size={16} />} title="Safari Itinerary">
                  {booking.safariBookings.map(sb => (
                    <div key={sb.id} style={{
                      padding: "12px", borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)", border: "1px solid var(--dash-border)"
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{sb.package.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)" }}>
                        {sb.package.type.replace("_", " ")} · {sb.package.startTime} – {sb.package.endTime}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)", marginTop: 4 }}>
                        Date: {new Date(sb.date).toLocaleDateString()} · Guests: {sb.guests}
                      </div>
                      {sb.entranceTicketType && (
                        <div style={{ fontSize: "0.8rem", color: "var(--dash-muted)", marginTop: 4 }}>
                          Tickets: <span style={{ color: sb.entranceTicketType === 'COMPANY_PROVIDED' ? 'var(--primary)' : '#fff' }}>
                            {sb.entranceTicketType === 'COMPANY_PROVIDED' ? 'Arranged by Company' : 'Self Arranged'}
                          </span>
                          {sb.entranceTicketType === 'COMPANY_PROVIDED' && sb.entranceTicket && (
                            <div style={{ marginTop: 6, padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ color: "#fff", marginBottom: 2 }}>{sb.entranceTicket.name}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>$ {sb.entranceTicket.adultPrice} (Adult) / $ {sb.entranceTicket.childPrice} (Child)</span>
                                <span style={{ color: "var(--primary)", fontWeight: 600 }}>Total: $ {sb.entranceTicketPrice?.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </Section>
              )}

              {/* Dates & Guests */}
              <Section icon={<Calendar size={16} />} title="Dates & Guests">
                <InfoRow label="Check-in" value={new Date(booking.checkIn).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} />
                <InfoRow label="Check-out" value={new Date(booking.checkOut).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} />
                <InfoRow label="Nights" value={`${booking.nights} night${booking.nights !== 1 ? "s" : ""}`} />
                <InfoRow label="Guests" value={`${booking.adults} adult${booking.adults !== 1 ? "s" : ""}${booking.children > 0 ? `, ${booking.children} children` : ""}`} />
              </Section>

              {/* Financial Summary */}
              <Section icon={<CreditCard size={16} />} title="Financial Summary">
                <InfoRow label="Base Safari" value={`$${booking.roomRevenue.toLocaleString()}`} />
                {booking.serviceBookings.map(sb => (
                  <InfoRow key={sb.id} label={sb.service.name} value={`$${sb.totalPrice.toLocaleString()}`} />
                ))}
                <div style={{ borderTop: "1px dashed var(--dash-border)", marginTop: 8, paddingTop: 8 }}>
                  <InfoRow
                    label="Total Revenue"
                    value={`$${booking.totalRevenue.toLocaleString()}`}
                    highlight
                  />
                  <InfoRow label="Payment" value={booking.paymentStatus} />
                </div>
              </Section>

              {/* Add-on Services */}
              {booking.serviceBookings.length > 0 && (
                <Section icon={<CheckCircle size={16} />} title="Extra Services">
                  {booking.serviceBookings.map(sb => (
                    <div key={sb.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--dash-border)", fontSize: "0.9rem" }}>
                      <div>
                        <span>{sb.service.name}</span>
                        <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--dash-muted)" }}>{sb.service.category}</span>
                      </div>
                      <span style={{ fontWeight: 600 }}>${sb.totalPrice}</span>
                    </div>
                  ))}
                </Section>
              )}

              {/* Follow-up Form */}
              <Section icon={<Clock size={16} />} title="Add Follow-up">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--dash-muted)", display: "block", marginBottom: 6 }}>Action Type</label>
                    <select
                      value={actionType}
                      onChange={e => setActionType(e.target.value)}
                      className="admin-input"
                    >
                      {ACTION_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {actionType === "STATUS_CHANGE" && (
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--dash-muted)", display: "block", marginBottom: 8 }}>New Status</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {FOLLOWUP_STAGES.map(stage => (
                          <button
                            key={stage.value}
                            onClick={() => setSelectedStatus(stage.value)}
                            style={{
                              padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                              border: `1px solid ${selectedStatus === stage.value ? stage.color : "var(--dash-border)"}`,
                              background: selectedStatus === stage.value ? `${stage.color}22` : "rgba(255,255,255,0.03)",
                              color: selectedStatus === stage.value ? stage.color : "var(--dash-text)",
                              fontSize: "0.85rem", fontWeight: 500, textAlign: "left",
                              display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                            }}
                          >
                            <span>{stage.icon}</span>
                            <span>{stage.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--dash-muted)", display: "block", marginBottom: 6 }}>
                      Note {actionType === "ADMIN_NOTE" ? "*" : "(Optional)"}
                    </label>
                    <textarea
                      className="admin-input"
                      rows={3}
                      placeholder={actionType === "ADMIN_NOTE" ? "Add a note about this booking..." : "e.g. Driver Kumara dispatched at 5:45 AM"}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {error && <p style={{ color: "var(--dash-danger)", fontSize: "0.85rem" }}>{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {submitting && <Loader2 size={14} className="spinner" />}
                    {actionType === "STATUS_CHANGE" ? "Update Status & Save" : "Save Note"}
                  </button>
                </div>
              </Section>

              {/* Activity Timeline */}
              <Section icon={<Clock size={16} />} title="Activity Timeline">
                {booking.events.length === 0 ? (
                  <p style={{ color: "var(--dash-muted)", fontSize: "0.85rem" }}>No events yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {booking.events.map((evt, i) => (
                      <div key={evt.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                        {/* Dot & line */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{
                            width: 10, height: 10, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                            background: getStatusColor(evt.status),
                            boxShadow: `0 0 8px ${getStatusColor(evt.status)}80`
                          }} />
                          {i < booking.events.length - 1 && (
                            <div style={{ width: 1, flex: 1, background: "var(--dash-border)", minHeight: 24, marginTop: 4 }} />
                          )}
                        </div>
                        {/* Content */}
                        <div style={{ paddingBottom: i < booking.events.length - 1 ? 20 : 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px",
                              borderRadius: 4, background: `${getStatusColor(evt.status)}22`,
                              color: getStatusColor(evt.status)
                            }}>
                              {evt.status.replace(/_/g, " ")}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--dash-muted)" }}>
                              {evt.action.replace(/_/g, " ")}
                            </span>
                          </div>
                          {evt.note && (
                            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", margin: "4px 0 2px", lineHeight: 1.5 }}>
                              {evt.note}
                            </p>
                          )}
                          <div style={{ fontSize: "0.72rem", color: "var(--dash-muted)", marginTop: 4 }}>
                            {new Date(evt.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            {evt.metadata?.addedBy && ` · by ${evt.metadata.addedBy}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--dash-border)", borderRadius: "12px", padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--primary)" }}>
        {icon}
        <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dash-muted)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.875rem" }}>
      <span style={{ color: "var(--dash-muted)" }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500, color: highlight ? "var(--primary)" : "var(--dash-text)" }}>{value}</span>
    </div>
  );
}

function StatusBadgeFull({ status }: { status: string }) {
  const color = getStatusColor(status);
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px",
      borderRadius: 20, border: `1px solid ${color}50`,
      background: `${color}15`, color,
      textTransform: "uppercase", letterSpacing: "0.08em"
    }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    CONFIRMED: "var(--dash-success)",
    CHECKED_IN: "#06b6d4",
    CHECKED_OUT: "var(--dash-muted)",
    PICKED_UP: "#f59e0b",
    TRIP_STARTED: "#8b5cf6",
    TRIP_COMPLETED: "#10b981",
    CANCELLED: "var(--dash-danger)",
    FAILED: "var(--dash-danger)",
    DRAFT: "var(--dash-muted)",
    PAYMENT_SUCCESS: "var(--dash-success)",
    CREATING_RESERVATION: "#f59e0b",
    PENDING_PAYMENT: "#f59e0b",
    ADMIN_NOTE: "var(--dash-muted)",
  };
  return map[status] || "var(--dash-muted)";
}
