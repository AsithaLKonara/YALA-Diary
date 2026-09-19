import React from "react";
import Image from "next/image";

const IMAGES = [
  "/images/hero/1.jpeg",
  "/images/hero/2.jpg",
  "/images/hero/3.jpg",
  "/images/hero/4.jpg",
  "/images/hero/5.jpg",
  "/images/hero/6.jpg",
];

export default function Gallery() {
  return (
    <section className="gallery-section section-padding">
      <div className="gallery-header">
        <h2 className="section-title">Yala Stories</h2>
        <a href="#" className="gallery-link">Follow the Wild →</a>
      </div>
      <div className="gallery-masonry">
        {IMAGES.map((src, idx) => (
          <div key={idx} className={`gallery-item item-${idx}`}>
            <Image src={src} alt="Yala Story" fill className="gallery-img" />
          </div>
        ))}
      </div>
    </section>
  );
}
