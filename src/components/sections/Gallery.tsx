import React from "react";
import Image from "next/image";

const IMAGES = [
  "/images/assets/leapords/40b9c466-0e48-45d2-905a-6db1190d9a66.jpg",
  "/images/assets/elephants/pexels-leefinvrede-18463828.jpg",
  "/images/assets/Birds/93745e42-735c-4481-a771-b81e7199dd9e.jpg",
  "/images/assets/deer/910ca771-6819-4df7-b9f5-5b7addfb5643.jpg",
  "/images/assets/peacock/pexels-rajukhanp-4920602.jpg",
  "/images/assets/Fox/cf2e3ecc-dd5e-49dd-bd3a-54fdbad81af0.jpg",
  "/images/assets/leapords/3.jpg",
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
            <Image src={src} alt="Yala Story" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="gallery-img" />
          </div>
        ))}
      </div>
    </section>
  );
}
