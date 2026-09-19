"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "./Hero.css";

const SLIDES = [
  { id: 1, src: "/images/hero/1.jpeg" },
  { id: 2, src: "/images/hero/2.jpg" },
  { id: 3, src: "/images/hero/3.jpg" },
  { id: 4, src: "/images/hero/4.jpg" },
  { id: 5, src: "/images/hero/5.jpg" },
  { id: 6, src: "/images/hero/6.jpg" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentIndex];

  return (
    <div className="hero-section">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="hero-bg-wrapper"
        >
          <Image
            src={slide.src}
            alt="Hero Background"
            fill
            priority
            unoptimized={true}
            className="hero-bg-image"
          />
          <div className="hero-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="hero-content">
        <div className="hero-content-inner">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hero-eyebrow"
          >
            YALA NATIONAL PARK &middot; SRI LANKA
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hero-headline"
          >
            Wild Sri Lanka,<br />Unfiltered.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="hero-desc"
          >
            Step into the realm of the leopard. Experience raw nature and breathtaking landscapes in Sri Lanka&apos;s most iconic wilderness.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="hero-ctas"
          >
            <button className="cta-primary glass-btn">Book Your Safari</button>
            <button className="cta-secondary glass-btn-outline">Explore Yala</button>
          </motion.div>
        </div>

        <div className="hero-controls">
          <div className="slider-indicators">
            <span className="current-slide">0{currentIndex + 1}</span>
            <span className="total-slides">/0{SLIDES.length}</span>
          </div>
          <div className="slider-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
