"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyYala() {
  return (
    <section className="why-yala section-padding" style={{ overflow: 'hidden' }}>
      {/* Section 1: Image Left, Text Right */}
      <div className="why-yala-grid" style={{ alignItems: 'center', marginBottom: '120px' }}>
        <motion.div 
          className="why-yala-image-container"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Image 
            src="/images/assets/ChatGPT Image Sep 21, 2026, 01_29_45 PM.png" 
            alt="What is a safari" 
            fill 
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="why-yala-image"
            style={{ borderRadius: '12px', objectFit: 'contain' }}
          />
        </motion.div>
        
        <motion.div 
          className="why-yala-content"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>What is a Safari?</h2>
          <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
            A safari is more than just a journey into the wild—it&apos;s a profound connection with nature. It&apos;s the thrill of tracking apex predators through dense foliage, the serene beauty of a golden sunset over untamed landscapes, and the unforgettable experience of witnessing majestic creatures in their natural habitat. 
          </p>
          <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginTop: '16px' }}>
            When you embark on a Yala safari, you aren&apos;t just an observer; you become part of an ancient ecosystem where every rustle of leaves and distant call tells a story of survival and wild beauty.
          </p>
        </motion.div>
      </div>

      {/* Section 2: Text Left, Image Right */}
      <div className="why-yala-grid why-yala-grid-reverse" style={{ alignItems: 'center' }}>
        <motion.div 
          className="why-yala-content"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>The Benefits of the Wild</h2>
          <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
            Stepping out of the concrete jungle and into the wild offers unparalleled benefits for the mind and soul. The immersive silence, broken only by the sounds of nature, provides a perfect escape from modern life.
          </p>
          <p className="section-desc" style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginTop: '16px' }}>
            Beyond the breathtaking photographic opportunities, a safari fosters a deep appreciation for conservation and the delicate balance of our planet. It&apos;s a chance to unplug, recharge, and return home with a newfound perspective on the world.
          </p>
        </motion.div>

        <motion.div 
          className="why-yala-image-container"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Image 
            src="/images/assets/ChatGPT Image Sep 21, 2026, 01_19_44 PM.png" 
            alt="Benefits of safari" 
            fill 
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="why-yala-image"
            style={{ borderRadius: '12px', objectFit: 'contain' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
