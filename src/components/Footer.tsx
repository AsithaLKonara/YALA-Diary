import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer" style={{ position: 'relative', overflow: 'hidden' }}>
      <Image 
        src="/images/assets/leapords/3.jpg" 
        alt="Footer Background" 
        fill 
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: 0 }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-container">
        <div className="footer-brand">
          <Image src="/logo.png" alt="Yala Diary Logo" width={120} height={60} className="footer-logo-img" />
          <p className="footer-brand-desc">Wild Sri Lanka, Unfiltered. Experience the apex predators in their natural habitat.</p>
        </div>
        
        <div className="footer-nav">
          <h4 className="footer-heading">Explore</h4>
          <div className="footer-links">
            <a href="#">Safari Experiences</a>
            <a href="#">About Yala</a>
            <a href="#">Gallery</a>
            <a href="#">FAQ</a>
          </div>
        </div>

        <div className="footer-nav">
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-links">
            <a href="#">Bookings & Inquiries</a>
            <a href="#">WhatsApp</a>
            <a href="#">Location</a>
            <a href="#">Email</a>
          </div>
        </div>
        
        <div className="footer-action">
          <h4 className="footer-heading">Ready for the wild?</h4>
          <button className="book-btn-outline">Book Your Safari</button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Yala Diary. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      </div>
    </footer>
  );
}
