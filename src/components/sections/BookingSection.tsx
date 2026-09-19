import React from "react";

export default function BookingSection() {
  return (
    <section className="booking-section section-padding">
      <div className="booking-container glass">
        <h2 className="booking-title">Choose Your Safari</h2>
        
        <div className="booking-tabs">
          <button className="tab active">Morning</button>
          <button className="tab">Afternoon</button>
          <button className="tab">Full Day</button>
        </div>

        <form className="booking-form">
          <div className="form-group">
            <label>Date</label>
            <input type="text" defaultValue="20 September 2026" className="booking-input" />
          </div>
          
          <div className="form-group">
            <label>Guests</label>
            <input type="text" defaultValue="2 Adults" className="booking-input" />
          </div>
          
          <div className="form-group">
            <label>Safari Type</label>
            <input type="text" defaultValue="Private Jeep" className="booking-input" />
          </div>
          
          <div className="form-group">
            <label>Pickup</label>
            <input type="text" defaultValue="Yala / Tissamaharama / Nearby Hotel" className="booking-input" />
          </div>
          
          <button type="submit" className="booking-submit">Check Availability →</button>
        </form>
      </div>
    </section>
  );
}
