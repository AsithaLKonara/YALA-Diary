import React from "react";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";

const SafariExperiences = dynamic(() => import("@/components/sections/SafariExperiences"));
const FinalConversion = dynamic(() => import("@/components/sections/FinalConversion"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function ExperiencesPage() {
  return (
    <>
      <PageHero 
        title="Curated Experiences" 
        subtitle="Designed to immerse you in the untamed beauty of Yala."
        image="/images/assets/hero/pexels-gottapics-17892001.jpg"
      />
      
      {/* Intro section */}
      <section className="section-padding" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem' }}>Tailored to Your Desires</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
          Whether you seek the golden hour light for photography, a full-day deep dive into the jungle, or a private romantic bush dinner under the stars, our experiences are meticulously crafted to exceed your expectations.
        </p>
      </section>

      <SafariExperiences />
      
      <FinalConversion />
      <Footer />
    </>
  );
}
