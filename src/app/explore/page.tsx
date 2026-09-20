import React from "react";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";

const ExploreYala = dynamic(() => import("@/components/sections/ExploreYala"));
const Gallery = dynamic(() => import("@/components/sections/Gallery"));
const FinalConversion = dynamic(() => import("@/components/sections/FinalConversion"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function ExplorePage() {
  return (
    <>
      <PageHero 
        title="Explore The Park" 
        subtitle="A landscape as diverse as its inhabitants."
        image="/images/assets/hero/2147a00f-f329-4e74-8661-98ef719e1f42.jpg"
      />
      
      {/* Intro section */}
      <section className="section-padding" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem' }}>A Thriving Ecosystem</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
          Spanning dense jungles, arid plains, and sweeping coastlines, Yala National Park is a sanctuary of breathtaking biodiversity. Discover the distinct blocks, varied ecosystems, and the intricate balance of nature.
        </p>
      </section>

      <ExploreYala />
      
      <div style={{ marginTop: '40px' }}>
        <Gallery />
      </div>

      <FinalConversion />
      <Footer />
    </>
  );
}
