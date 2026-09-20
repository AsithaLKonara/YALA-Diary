import React from "react";
import Image from "next/image";

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
    <section className="why-book-section section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      <Image 
        src="/images/assets/deer/47ffc001-c54f-4b1b-8217-44d9f175fc4c.jpg" 
        alt="Why Book Us Background" 
        fill 
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: 0 }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
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
      </div>
    </section>
  );
}
