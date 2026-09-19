import React from "react";

const STEPS = [
  { step: "01", title: "Choose Your Safari", desc: "Select your date and experience." },
  { step: "02", title: "Meet Your Guide", desc: "Hotel pickup or meeting point." },
  { step: "03", title: "Enter Yala", desc: "Begin your wildlife adventure." },
  { step: "04", title: "Experience the Wild", desc: "Return with memories, photographs and stories." },
];

export default function JourneyTimeline() {
  return (
    <section className="journey-section section-padding">
      <h2 className="section-title text-center">Your Journey</h2>
      <div className="timeline-container">
        {STEPS.map((s, idx) => (
          <React.Fragment key={idx}>
            <div className="timeline-step">
              <span className="step-number">{s.step}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
            {idx < STEPS.length - 1 && <div className="timeline-connector">↓</div>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
