import React from "react";

const WILDLIFE = [
  { name: "Leopard", image: "/images/assets/leapords/02cc3670-8eb1-4a03-a375-01f05fc46e3b.jpg" },
  { name: "Elephant", image: "/images/assets/elephants/a38ef9ac-b5c2-4639-a881-501a7af3dd87.jpg" },
  { name: "Crocodile", image: "/images/assets/Crokadile/2147a00f-f329-4e74-8661-98ef719e1f42.jpg" },
  { name: "Peacock", image: "/images/assets/peacock/f95d8964-1bfa-4218-91ad-49e779db237e.jpg" },
  { name: "Deer", image: "/images/assets/deer/47ffc001-c54f-4b1b-8217-44d9f175fc4c.jpg" },
  { name: "Monkey", image: "/images/assets/Monkeys/pexels-kichu98-34059235.jpg" },
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
