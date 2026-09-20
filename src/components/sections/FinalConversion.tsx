import React from "react";
import Image from "next/image";

export default function FinalConversion() {
  return (
    <section className="final-conversion">
      <div className="final-bg">
        <Image src="/images/assets/elephants/pexels-max-zhang-2164054577-39586335.jpg" alt="Yala Safari" fill sizes="100vw" className="final-img" />
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
