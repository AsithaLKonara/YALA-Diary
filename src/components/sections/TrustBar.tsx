import React from "react";

export default function TrustBar() {
  return (
    <section className="trust-bar section-padding">
      <div className="trust-container">
        <div className="trust-item">
          <span className="trust-stars">★★★★★</span>
          <span className="trust-text">4.9/5</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">Local Safari Experts</div>
        <div className="trust-divider" />
        <div className="trust-item">Private & Shared Safaris</div>
        <div className="trust-divider" />
        <div className="trust-item">Hotel Pickup Available</div>
        <div className="trust-divider" />
        <div className="trust-item">Secure Booking</div>
      </div>
    </section>
  );
}
