import React from "react";
import Image from "next/image";

const REVIEWS = [
  { name: "Sarah J.", country: "UK", text: "The most incredible wildlife experience. Seeing a leopard up close was breathtaking." },
  { name: "Mark T.", country: "USA", text: "Professional, knowledgeable guides. The private jeep made all the difference." },
  { name: "Elena R.", country: "Italy", text: "Absolutely stunning landscapes and so many elephants!" },
];

export default function Reviews() {
  return (
    <section className="reviews-section section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      <Image 
        src="/images/assets/elephants/elephant.jpg" 
        alt="Reviews Background" 
        fill 
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: 0 }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="reviews-header text-center">
          <h2 className="section-title">Our Yala memories, told by our guests.</h2>
        </div>
      
      <div className="featured-review">
        <p className="featured-quote">&quot;An unforgettable journey into the wild. The guides anticipated every animal movement, offering us the best photographic opportunities without disturbing nature.&quot;</p>
        <div className="review-meta">
          <strong>David & Emma</strong>
          <span>Australia • Full-Day Safari</span>
        </div>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((r, idx) => (
          <div key={idx} className="review-card">
            <p className="review-text">&quot;{r.text}&quot;</p>
            <div className="review-meta">
              <strong>{r.name}</strong>
              <span>{r.country}</span>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
