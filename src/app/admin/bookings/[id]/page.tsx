import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { MOCK_BOOKINGS, BookingStatus } from "@/app/admin/data";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", checked_in: "Checked In",
  checked_out: "Checked Out", cancelled: "Cancelled",
};

const TIMELINE_STEPS: { status: BookingStatus; label: string }[] = [
  { status: "pending",     label: "Booking Created" },
  { status: "confirmed",   label: "Confirmed" },
  { status: "checked_in",  label: "Checked In" },
  { status: "checked_out", label: "Checked Out" },
];

const STATUS_ORDER: BookingStatus[] = ["pending", "confirmed", "checked_in", "checked_out"];

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = MOCK_BOOKINGS.find((b) => b.id === id);
  if (!booking) notFound();

  const currentStep = STATUS_ORDER.indexOf(booking.status);

  return (
    <>
      <AdminTopbar title={`Booking ${booking.ref}`} />
      <div className="admin-content">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: "0.85rem", color: "var(--dash-muted)" }}>
          <Link href="/admin/bookings" style={{ color: "var(--dash-muted)", textDecoration: "none" }}>Bookings</Link>
          <span>/</span>
          <span style={{ color: "var(--dash-text)" }}>{booking.ref}</span>
        </div>

        <div className="admin-page-header">
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {booking.ref}
              <span className={`status-badge ${booking.status}`}>{STATUS_LABEL[booking.status]}</span>
            </h1>
            <p>Created {new Date(booking.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-ghost"><PrintIcon /> Print Voucher</button>
            {booking.status === "pending" && (
              <button className="btn-primary"><CheckIcon /> Confirm Booking</button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <button className="btn-danger"><XIcon /> Cancel</button>
            )}
          </div>
        </div>

        <div className="booking-detail-grid">
          {/* Left Column */}
          <div>
            {/* Guest Info */}
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-title">Guest Information</span>
              </div>
              <div className="detail-card-body">
                <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value">{booking.guestName}</span></div>
                <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{booking.guestEmail}</span></div>
                <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{booking.guestPhone}</span></div>
                <div className="detail-row"><span className="detail-label">Country</span><span className="detail-value">{booking.guestCountry}</span></div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-title">Booking Details</span>
              </div>
              <div className="detail-card-body">
                <div className="detail-row"><span className="detail-label">Room</span><span className="detail-value">{booking.room} — {booking.roomType}</span></div>
                <div className="detail-row"><span className="detail-label">Check-in</span><span className="detail-value">{booking.checkIn}</span></div>
                <div className="detail-row"><span className="detail-label">Check-out</span><span className="detail-value">{booking.checkOut}</span></div>
                <div className="detail-row"><span className="detail-label">Nights</span><span className="detail-value">{booking.nights}</span></div>
                <div className="detail-row"><span className="detail-label">Adults</span><span className="detail-value">{booking.adults}</span></div>
                <div className="detail-row"><span className="detail-label">Children</span><span className="detail-value">{booking.children}</span></div>
                {booking.promoCode && (
                  <div className="detail-row"><span className="detail-label">Promo Code</span><span className="detail-value" style={{ color: "var(--dash-accent)" }}>{booking.promoCode}</span></div>
                )}
              </div>
            </div>

            {/* Add-ons */}
            {booking.addOns.length > 0 && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <span className="detail-card-title">Add-on Services</span>
                </div>
                <div className="detail-card-body">
                  {booking.addOns.map((addon, i) => (
                    <div key={i} className="detail-row">
                      <span className="detail-label">✓ {addon}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <span className="detail-card-title">Special Requests</span>
                </div>
                <div className="detail-card-body">
                  <p style={{ fontSize: "0.875rem", color: "var(--dash-text)", lineHeight: 1.6 }}>
                    {booking.specialRequests}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Revenue Summary */}
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-title">Revenue Summary</span>
              </div>
              <div className="detail-card-body">
                <div className="detail-row"><span className="detail-label">Room ({booking.nights} nights)</span><span className="detail-value">${booking.revenue.toLocaleString()}</span></div>
                <div className="detail-row"><span className="detail-label">Add-ons</span><span className="detail-value">—</span></div>
                <div className="detail-row" style={{ borderBottom: "none" }}>
                  <span className="detail-label" style={{ fontWeight: 600, color: "var(--dash-text)" }}>Total</span>
                  <span className="detail-value" style={{ fontSize: "1.1rem", color: "var(--dash-accent)" }}>${booking.revenue.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 12, padding: "8px 0", borderTop: "1px solid var(--dash-border)" }}>
                  <div className="detail-row"><span className="detail-label">Payment Status</span>
                    <span className="status-badge confirmed">Paid</span>
                  </div>
                  <div className="detail-row"><span className="detail-label">Currency</span><span className="detail-value">{booking.currency}</span></div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-title">Booking Timeline</span>
              </div>
              <div className="detail-card-body">
                <div className="timeline">
                  {booking.status === "cancelled" ? (
                    <>
                      <div className="timeline-item">
                        <div className="timeline-dot filled" />
                        <div>
                          <div className="timeline-text">Booking Created</div>
                          <div className="timeline-date">{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot" style={{ background: "var(--dash-danger)", borderColor: "var(--dash-danger)" }} />
                        <div>
                          <div className="timeline-text" style={{ color: "var(--dash-danger)" }}>Cancelled</div>
                          <div className="timeline-date">Guest cancelled</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    TIMELINE_STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <div key={step.status} className="timeline-item">
                          <div className={`timeline-dot ${done ? "filled" : ""}`} />
                          <div>
                            <div className="timeline-text" style={{ color: done ? "var(--dash-text)" : "var(--dash-muted)" }}>
                              {step.label}
                            </div>
                            <div className="timeline-date">
                              {i === 0 ? new Date(booking.createdAt).toLocaleDateString() : done ? "Completed" : "Pending"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PrintIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}
function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
