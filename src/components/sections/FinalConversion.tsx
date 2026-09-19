import React from "react";
import Image from "next/image";

export default function FinalConversion() {
  return (
    <section className="final-conversion">
      <div className="final-bg">
        <Image src="/images/hero/1.jpeg" alt="Yala Safari" fill className="final-img" />
        <div className="final-overlay" />
      </div>
      <div className="final-content">
        <h2 className="huge-title">Your Wild Side Is Waiting.</h2>
        <p className="final-desc">Choose your date. We&apos;ll take care of the rest.</p>
        <button className="final-book-btn">Book Your Safari →</button>
      </div>
    </section>
  );
}
