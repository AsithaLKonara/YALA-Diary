import React from "react";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";

const Wildlife = dynamic(() => import("@/components/sections/Wildlife"));
const JourneyTimeline = dynamic(() => import("@/components/sections/JourneyTimeline"));
const FinalConversion = dynamic(() => import("@/components/sections/FinalConversion"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function SafariPage() {
  return (
    <>
      <PageHero 
        title="The Ultimate Safari" 
        subtitle="Unparalleled wildlife encounters in the heart of Sri Lanka."
        image="/images/assets/leapords/3.jpg"
      />
      
      {/* Intro section */}
      <section className="section-padding" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem' }}>A Pristine Wilderness</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
          Yala National Park boasts one of the highest leopard densities in the world. Our expert naturalists and custom-designed jeeps ensure that your safari is not just a drive, but an immersive expedition into the wild.
        </p>
      </section>

      <Wildlife />
      <JourneyTimeline />
      <FinalConversion />
      <Footer />
    </>
  );
}
