import React from "react";

const REVIEWS = [
  { name: "Sarah J.", country: "UK", text: "The most incredible wildlife experience. Seeing a leopard up close was breathtaking." },
  { name: "Mark T.", country: "USA", text: "Professional, knowledgeable guides. The private jeep made all the difference." },
  { name: "Elena R.", country: "Italy", text: "Absolutely stunning landscapes and so many elephants!" },
];

export default function Reviews() {
  return (
    <section className="reviews-section section-padding">
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
    </section>
  );
}
