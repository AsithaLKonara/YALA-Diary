import React from "react";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";

const WhyYala = dynamic(() => import("@/components/sections/WhyYala"));
const WhyBookUs = dynamic(() => import("@/components/sections/WhyBookUs"));
const Reviews = dynamic(() => import("@/components/sections/Reviews"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function AboutPage() {
  return (
    <>
      <PageHero 
        title="Our Story" 
        subtitle="Dedicated to conservation, community, and unforgettable experiences."
        image="/images/assets/hero/ad0f6c96-9754-4b2b-9ea9-346a82559470.jpg"
      />
      
      {/* Intro section */}
      <section className="section-padding" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem' }}>Pioneering Eco-Tourism</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
          Yala Diary was founded on a deep respect for the wild. We believe that true luxury lies in harmony with nature, and every safari we guide is a step toward preserving this magnificent ecosystem for generations to come.
        </p>
      </section>

      <WhyYala />
      <WhyBookUs />
      
      <div style={{ marginTop: '60px' }}>
        <Reviews />
      </div>

      <Footer />
    </>
  );
}
