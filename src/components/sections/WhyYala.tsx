import React from "react";
import Image from "next/image";

export default function WhyYala() {
  return (
    <section className="why-yala section-padding">
      <div className="why-yala-grid">
        <div className="why-yala-content">
          <h2 className="section-title">More Than a Safari.</h2>
          <p className="section-desc">
            Yala is where the dense jungle meets the wild ocean. It&apos;s a place of raw, untamed beauty, offering one of the highest leopard densities in the world. Experience a cinematic journey through Sri Lanka&apos;s most iconic wilderness.
          </p>
          <ul className="why-yala-list">
            <li><span className="icon">🐆</span> Leopards</li>
            <li><span className="icon">🐘</span> Elephants</li>
            <li><span className="icon">🦚</span> Wildlife</li>
            <li><span className="icon">🌊</span> Wild Coast</li>
          </ul>
        </div>
        <div className="why-yala-image-container">
          <Image 
            src="/images/hero/3.jpg" 
            alt="Yala Leopard" 
            fill 
            className="why-yala-image"
          />
        </div>
      </div>
    </section>
  );
}
