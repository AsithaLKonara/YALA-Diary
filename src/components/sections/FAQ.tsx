"use client";

import React, { useState } from "react";

const FAQS = [
  { q: "When is the best time to visit Yala?", a: "The best time to visit is between February and July when the water levels are low, bringing animals into the open." },
  { q: "How long is a safari?", a: "Morning and afternoon safaris last about 4 hours. Full-day safaris last from sunrise to sunset." },
  { q: "Can I book a private jeep?", a: "Yes, we highly recommend private jeeps for a more tailored and comfortable experience." },
  { q: "Do you provide hotel pickup?", a: "We provide pickup from hotels in Yala, Tissamaharama, and Kirinda areas." },
  { q: "What should I bring?", a: "Bring sunglasses, sunscreen, a hat, neutral-colored clothing, and a good camera." },
  { q: "Can children join the safari?", a: "Yes, children of all ages are welcome, but be prepared for a bumpy ride." },
  { q: "What happens if the park is closed?", a: "Yala usually closes for a month in September for maintenance. We offer alternative safaris like Bundala during this time." },
  { q: "How does cancellation work?", a: "Free cancellation up to 48 hours before your scheduled safari." },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq-section section-padding">
      <div className="faq-container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openIdx === idx ? "open" : ""}`} onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span className="faq-icon">{openIdx === idx ? "−" : "+"}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
