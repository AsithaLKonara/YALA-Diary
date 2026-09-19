import React from "react";

const PLACES = [
  { name: "Yala National Park", desc: "The core wildlife experience." },
  { name: "Tissamaharama", desc: "Ancient temples and serene lakes." },
  { name: "Kirinda", desc: "Rugged coastlines and history." },
  { name: "Yala Coast", desc: "Where the jungle meets the sea." },
  { name: "Lunugamvehera", desc: "Elephant corridors and quiet nature." },
];

export default function ExploreYala() {
  return (
    <section className="explore-section section-padding">
      <div className="explore-header">
        <h2 className="section-title">Explore Around Yala</h2>
      </div>
      <div className="explore-grid">
        {PLACES.map((p, idx) => (
          <div key={idx} className="explore-card">
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
