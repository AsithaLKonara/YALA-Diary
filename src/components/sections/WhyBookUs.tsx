import React from "react";

const REASONS = [
  {
    title: "Local Knowledge",
    desc: "Guides who know Yala beyond the tourist routes."
  },
  {
    title: "Responsible Wildlife Tourism",
    desc: "Respecting the park and its animals."
  },
  {
    title: "Flexible Experiences",
    desc: "Private and shared safari options."
  },
  {
    title: "Simple Booking",
    desc: "Book your safari without complicated arrangements."
  }
];

export default function WhyBookUs() {
  return (
    <section className="why-book-section section-padding">
      <div className="why-book-header">
        <h2 className="section-title">Why Book With Us?</h2>
      </div>
      <div className="why-book-grid">
        {REASONS.map((r, idx) => (
          <div key={idx} className="reason-card">
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
