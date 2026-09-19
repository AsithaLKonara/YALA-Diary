import React from "react";

const EXPERIENCES = [
  {
    title: "Morning Safari",
    desc: "Experience Yala at its most active.",
    duration: "6:00 AM - 10:00 AM",
    price: "$45",
    image: "/images/hero/2.jpg"
  },
  {
    title: "Afternoon Safari",
    desc: "Golden light and evening wildlife.",
    duration: "2:00 PM - 6:00 PM",
    price: "$45",
    image: "/images/hero/4.jpg"
  },
  {
    title: "Full-Day Safari",
    desc: "A deeper exploration of the park.",
    duration: "6:00 AM - 6:00 PM",
    price: "$85",
    image: "/images/hero/5.jpg"
  },
  {
    title: "Private Safari",
    desc: "Your own jeep, guide and itinerary.",
    duration: "Flexible",
    price: "$120",
    image: "/images/hero/6.jpg"
  }
];

export default function SafariExperiences() {
  return (
    <section className="experiences-section section-padding">
      <div className="experiences-header">
        <h2 className="section-title">Safari Experiences</h2>
      </div>
      <div className="experiences-grid">
        {EXPERIENCES.map((exp, idx) => (
          <div key={idx} className="experience-card" style={{ backgroundImage: `url(${exp.image})` }}>
            <div className="experience-overlay">
              <div className="experience-content">
                <h3>{exp.title}</h3>
                <p>{exp.desc}</p>
                <div className="experience-meta">
                  <span>{exp.duration}</span>
                  <span>From {exp.price}</span>
                </div>
                <button className="view-btn">View Safari →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
