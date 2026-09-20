"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();

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
          <span className="logo-main">YALA DIARY</span>
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
          <div className="nav-lang-currency">
            <span>EN</span>
            <span className="lang-divider">|</span>
            <select
              className="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="LKR">LKR</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
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
            <div className="mobile-currency-row">
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>CURRENCY</span>
              <select
                className="mobile-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="LKR">LKR (Rs)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            <div className="mobile-divider"></div>
            <Link href="/book" className="mobile-book-btn" onClick={() => setIsOpen(false)}>BOOK YOUR SAFARI</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
