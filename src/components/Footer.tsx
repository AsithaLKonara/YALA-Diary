import React from "react";
import Image from "next/image";
import Link from "next/link";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/>
  </svg>
);

export default function Footer() {
  const fbUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "#";
  const igUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#";
  const ttUrl = process.env.NEXT_PUBLIC_TIKTOK_URL ?? "#";

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
            <Image src="/logo.png" alt="Yala Diary Logo" width={240} height={240} className="footer-logo-img" style={{ maxWidth: '50%', width: 'auto', height: 'auto' }} />
            <p className="footer-brand-desc">Wild Sri Lanka, Unfiltered. Experience the apex predators in their natural habitat.</p>

            {/* Social Icons */}
            <div className="footer-social">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={ttUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <h4 className="footer-heading">Explore</h4>
            <div className="footer-links">
              <a href="/#safari-experiences">Safari Experiences</a>
              <a href="/#about">About Yala</a>
              <a href="/#gallery">Gallery</a>
              <a href="/#faq">FAQ</a>
            </div>
          </div>

          <div className="footer-nav">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-links">
              <a href="/#contact">Bookings &amp; Inquiries</a>
              <a href="https://wa.me/94727176663" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="https://maps.google.com/?q=Yala+National+Park,+Sri+Lanka" target="_blank" rel="noopener noreferrer">Location</a>
              <a href="mailto:theyaladiary@gmail.com">Email</a>
            </div>
          </div>

          <div className="footer-action">
            <h4 className="footer-heading">Ready for the wild?</h4>
            <Link href="/book" className="book-btn-outline" style={{ display: 'inline-block', textAlign: 'center', padding: '12px 24px', border: '1px solid #fff', borderRadius: '4px' }}>Book Your Safari</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Yala Diary. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
