import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">YALA</h2>
        </div>
        
        <div className="footer-links">
          <a href="#">Safari Experiences</a>
          <a href="#">About Yala</a>
          <a href="#">Gallery</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>
        
        <div className="footer-action">
          <button className="book-btn">Book Your Safari</button>
        </div>
        
        <div className="footer-contact">
          <a href="#">WhatsApp</a>
          <a href="#">Location</a>
          <a href="#">Email</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Yala Diary. All rights reserved.</p>
      </div>
    </footer>
  );
}
