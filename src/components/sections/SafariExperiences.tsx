"use client";

import React from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

const EXPERIENCES = [
  {
    title: "Morning Safari",
    desc: "Experience Yala at its most active.",
    duration: "6:00 AM - 10:00 AM",
    price: 45,
    image: "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg"
  },
  {
    title: "Afternoon Safari",
    desc: "Golden light and evening wildlife.",
    duration: "2:00 PM - 6:00 PM",
    price: 45,
    image: "/images/assets/elephants/elephant.jpg"
  },
  {
    title: "Full-Day Safari",
    desc: "A deeper exploration of the park.",
    duration: "6:00 AM - 6:00 PM",
    price: 85,
    image: "/images/assets/deer/pexels-isharakasthuriarachchi-26699207.jpg"
  },
  {
    title: "Private Safari",
    desc: "Your own jeep, guide and itinerary.",
    duration: "Flexible",
    price: 120,
    image: "/images/assets/leapords/71fe49a3-d244-451d-9489-494fb0c883d1.jpg"
  }
];

export default function SafariExperiences({ packages }: { packages?: any[] }) {
  const { formatPrice } = useCurrency();
  const displayPackages = packages && packages.length > 0 ? packages : EXPERIENCES;

  return (
    <section className="experiences-section section-padding">
      <div className="experiences-header">
        <h2 className="section-title">Safari Experiences</h2>
      </div>
      <div className="experiences-grid">
        {displayPackages.map((exp: any, idx: number) => {
          const image = exp.images?.[0] || exp.image || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
          const title = exp.name || exp.title;
          const desc = exp.type ? `Experience the wild during the ${exp.type.toLowerCase()}.` : exp.desc;
          const duration = exp.startTime && exp.endTime ? `${exp.startTime} - ${exp.endTime}` : exp.duration;
          
          return (
            <div key={exp.id || idx} className="experience-card" style={{ backgroundImage: `url(${image})` }}>
              <div className="experience-overlay">
                <div className="experience-content">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="experience-meta">
                    <span>{duration}</span>
                    <span>From {formatPrice(exp.basePrice || exp.price)}</span>
                  </div>
                  <Link href={`/safaris/${exp.id || 'default'}`} className="view-btn" style={{ display: 'inline-block' }}>View Safari →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
