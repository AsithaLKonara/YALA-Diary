import React from "react";
import Link from "next/link";
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
      
      {/* Comprehensive Intro section */}
      <section className="section-padding" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Overview */}
        <div style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>A World-Renowned Wildlife Sanctuary</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
            Yala National Park is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. Spanning dense jungles, arid plains, and sweeping coastlines, it is a sanctuary of breathtaking biodiversity. Yala is globally renowned for its exceptional density of Sri Lankan leopards, making it one of the best places on Earth to spot these elusive predators in the wild.
          </p>
        </div>

        {/* The Wildlife */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>Iconic Wildlife</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
              The park is home to 44 varieties of mammal and 215 bird species. Alongside the famous leopards, you can witness majestic herds of Sri Lankan elephants, the secretive sloth bear, water buffaloes, and various species of deer. The park's wetlands and lagoons are a haven for water birds, including painted storks, pelicans, and the vibrant Indian peafowl.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>Rich Heritage</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
              Designated as a wildlife sanctuary in 1900 and a national park in 1938, Yala's history extends far beyond its modern conservation efforts. The area boasts ancient civilizations dating back to the Indo-Aryan periods, with the revered Sithulpawwa rock temple and Magul Vihara serving as prominent pilgrimage sites nestled within the wilderness.
            </p>
          </div>
        </div>

        {/* The Safari Experience */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>The Safari Experience</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Divided into five blocks (with two main blocks, Ruhuna and Kumana, open to the public), Yala offers an unforgettable adventure. Whether you embark on the crisp early morning drives as the jungle awakens, or the golden hour evening safaris when predators begin their prowl, every visit promises a unique spectacle.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
             <Link href="/book" className="cta-primary glass-btn">Book a Safari</Link>
             <Link href="/safari" className="cta-secondary glass-btn-outline">Safari Packages</Link>
          </div>
        </div>

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
