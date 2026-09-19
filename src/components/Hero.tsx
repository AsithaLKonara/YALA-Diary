"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "./Hero.css";

const SLIDES = [
  {
    id: 1,
    src: "/images/hero/1.jpeg",
  },
  {
    id: 2,
    src: "/images/hero/2.jpg",
  },
  {
    id: 3,
    src: "/images/hero/3.jpg",
  },
  {
    id: 4,
    src: "/images/hero/4.jpg",
  },
  {
    id: 5,
    src: "/images/hero/5.jpg",
  },
  {
    id: 6,
    src: "/images/hero/6.jpg",
  },
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
        {/* Frame 1 - Left Side */}
        <div className="hero-frame hero-frame-left">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="huge-text solid-text"
          >
            YALA
          </motion.h1>
        </div>

        {/* Frame 2 - Right Side */}
        <div className="hero-frame hero-frame-right">
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="huge-text outline-text"
          >
            DIARY
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="subtitle-floating"
          >
            SRI LANKAN WILDLIFE
          </motion.div>

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
    </div>
  );
}
