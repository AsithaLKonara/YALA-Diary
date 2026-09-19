import React from "react";

const WILDLIFE = [
  { name: "Leopard", image: "/images/hero/1.jpeg" },
  { name: "Elephant", image: "/images/hero/2.jpg" },
  { name: "Crocodile", image: "/images/hero/3.jpg" },
  { name: "Peacock", image: "/images/hero/4.jpg" },
  { name: "Deer", image: "/images/hero/5.jpg" },
  { name: "Buffalo", image: "/images/hero/6.jpg" },
];

export default function Wildlife() {
  return (
    <section className="wildlife-section section-padding">
      <div className="wildlife-header">
        <h2 className="massive-title">
          <span className="block">COME FOR THE LEOPARD.</span>
          <span className="block text-muted">STAY FOR EVERYTHING ELSE.</span>
        </h2>
      </div>
      <div className="wildlife-gallery-container">
        <div className="wildlife-gallery">
          {WILDLIFE.map((animal, idx) => (
            <div key={idx} className="wildlife-card" style={{ backgroundImage: `url(${animal.image})` }}>
              <div className="wildlife-overlay">
                <h3>{animal.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
