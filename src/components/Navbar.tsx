"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-logo-group">
          <Image src="/logo.png" alt="Yala Diary Logo" width={100} height={40} priority className="header-logo-img" />
        </div>
        
        <div className={`nav-overlay ${isOpen ? "open" : ""}`}>
          <nav className="main-nav">
            <a href="#" className="nav-link" onClick={() => setIsOpen(false)}>The Experience</a>
            <a href="#" className="nav-link" onClick={() => setIsOpen(false)}>Wildlife</a>
            <a href="#" className="nav-link" onClick={() => setIsOpen(false)}>Journal</a>
          </nav>
        </div>
        
        <div className="header-actions">
          <button className="nav-book-btn">Book Safari</button>
          <button 
            className={`hamburger ${isOpen ? "active" : ""}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
