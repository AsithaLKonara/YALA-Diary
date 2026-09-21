"use client";

import React from "react";
import CinematicScroll from "../ui/CinematicScroll";

export default function WhyYala() {
  return (
    <section className="why-yala" style={{ overflow: 'hidden' }}>
      
      {/* Section 1: Animation Left, Text Right */}
      <CinematicScroll 
        frameCount={147} 
        framePath={(index) => `/frames/0921/frame_${String(index).padStart(3, '0')}.webp`} 
        title="What is a Safari?"
        reverse={false}
      >
        <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          A safari is more than just a journey into the wild—it&apos;s a profound connection with nature. It&apos;s the thrill of tracking apex predators through dense foliage, the serene beauty of a golden sunset over untamed landscapes, and the unforgettable experience of witnessing majestic creatures in their natural habitat. 
        </p>
        <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginTop: '16px' }}>
          When you embark on a Yala safari, you aren&apos;t just an observer; you become part of an ancient ecosystem where every rustle of leaves and distant call tells a story of survival and wild beauty.
        </p>
      </CinematicScroll>

      {/* Section 2: Text Left, Animation Right */}
      <CinematicScroll 
        frameCount={150} 
        framePath={(index) => `/frames/0921_2/frame_${String(index).padStart(3, '0')}.webp`} 
        title="The Benefits of the Wild"
        reverse={true}
        bgColor="#030303"
      >
        <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          Stepping out of the concrete jungle and into the wild offers unparalleled benefits for the mind and soul. The immersive silence, broken only by the sounds of nature, provides a perfect escape from modern life.
        </p>
        <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginTop: '16px' }}>
          Beyond the breathtaking photographic opportunities, a safari fosters a deep appreciation for conservation and the delicate balance of our planet. It&apos;s a chance to unplug, recharge, and return home with a newfound perspective on the world.
        </p>
      </CinematicScroll>

    </section>
  );
}
