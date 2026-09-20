import React from "react";
import Image from "next/image";

const PLACES = [
  {
    name: "Yala National Park",
    desc: "The core wildlife experience.",
    img: "/images/assets/locations/yala-national-park.jpg",
  },
  {
    name: "Tissamaharama",
    desc: "Ancient temples and serene lakes.",
    img: "/images/assets/locations/tissamaharama.jpg",
  },
  {
    name: "Kirinda",
    desc: "Rugged coastlines and history.",
    img: "/images/assets/locations/kirinda.webp",
  },
  {
    name: "Yala Coast",
    desc: "Where the jungle meets the sea.",
    img: "/images/assets/locations/yala-coast.jpg",
  },
  {
    name: "Lunugamvehera",
    desc: "Elephant corridors and quiet nature.",
    img: "/images/assets/locations/lunugamwehera.jpg",
  },
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
            <Image
              src={p.img}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="explore-card-img"
              style={{ objectFit: "cover" }}
            />
            <div className="explore-card-overlay" />
            <div className="explore-card-content">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
