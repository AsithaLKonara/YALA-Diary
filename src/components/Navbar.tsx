"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle scroll for transparent-to-glass navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo Group */}
        <Link href="/" className="header-logo-group">
          <span className="logo-main">YALA</span>
          <span className="logo-sub">NATIONAL PARK</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link href="#safari" className="nav-link">Safari</Link>
          <Link href="#experiences" className="nav-link">Experiences</Link>
          <Link href="#explore" className="nav-link">Explore Yala</Link>
          <Link href="#about" className="nav-link">About</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions">
          <span className="nav-lang">EN</span>
          <Link href="/book" className="nav-book-btn">BOOK NOW</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`nav-overlay ${isOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <span className="logo-main">YALA</span>
          </div>

          <nav className="mobile-nav">
            <Link href="#safari" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Safari</Link>
            <Link href="#experiences" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Experiences</Link>
            <Link href="#explore" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Explore Yala</Link>
            <Link href="#about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="#contact" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>

          <div className="mobile-menu-footer">
            <div className="mobile-divider"></div>
            <Link href="/book" className="mobile-book-btn" onClick={() => setIsOpen(false)}>BOOK YOUR SAFARI</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
