import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";
import "./privacy.css";

const Footer = dynamic(() => import("@/components/Footer"));

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Yala Diary collects, uses, and protects your personal information when you use our safari booking platform.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 21, 2025";

  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Here's how we handle your information."
        image="/images/assets/leapords/3.jpg"
      />

      <section className="legal-page section-padding">
        <div className="legal-container">

          <p className="legal-meta">Last updated: {lastUpdated}</p>

          <div className="legal-intro">
            <p>
              Welcome to <strong>Yala Diary</strong>. We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or make a
              safari booking with us.
            </p>
          </div>

          <div className="legal-toc">
            <h2 className="legal-toc-title">Contents</h2>
            <ol className="legal-toc-list">
              <li><a href="#information-we-collect">Information We Collect</a></li>
              <li><a href="#how-we-use">How We Use Your Information</a></li>
              <li><a href="#sharing">Sharing Your Information</a></li>
              <li><a href="#cookies">Cookies & Tracking</a></li>
              <li><a href="#data-retention">Data Retention</a></li>
              <li><a href="#your-rights">Your Rights</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#children">Children's Privacy</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ol>
          </div>

          <div className="legal-sections">

            <div className="legal-section" id="information-we-collect">
              <h2 className="legal-section-title">
                <span className="legal-section-num">01</span>
                Information We Collect
              </h2>
              <div className="legal-card">
                <h3>Personal Information You Provide</h3>
                <p>When you make a booking or contact us, we may collect:</p>
                <ul>
                  <li>Full name and contact details (email, phone number)</li>
                  <li>Billing and payment information</li>
                  <li>Travel dates and safari preferences</li>
                  <li>Number of guests and special requirements</li>
                  <li>Communications sent to us via email or WhatsApp</li>
                </ul>
              </div>
              <div className="legal-card">
                <h3>Automatically Collected Information</h3>
                <p>When you visit our site, we automatically collect:</p>
                <ul>
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on each page</li>
                  <li>Referring URLs and search terms</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="how-we-use">
              <h2 className="legal-section-title">
                <span className="legal-section-num">02</span>
                How We Use Your Information
              </h2>
              <p className="legal-body">We use the information we collect to:</p>
              <div className="legal-grid-2">
                <div className="legal-highlight-card">
                  <span className="legal-icon">🗓️</span>
                  <strong>Process Bookings</strong>
                  <p>Confirm and manage your safari reservations and send booking confirmations.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">💬</span>
                  <strong>Customer Support</strong>
                  <p>Respond to inquiries, resolve issues, and provide pre- and post-safari assistance.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">📩</span>
                  <strong>Communications</strong>
                  <p>Send trip reminders, updates, and relevant information about your safari experience.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">📊</span>
                  <strong>Improvements</strong>
                  <p>Analyze site usage to improve our platform, services, and user experience.</p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="sharing">
              <h2 className="legal-section-title">
                <span className="legal-section-num">03</span>
                Sharing Your Information
              </h2>
              <p className="legal-body">
                We do <strong>not sell, trade, or rent</strong> your personal information to third parties.
                We may share your information with:
              </p>
              <div className="legal-card">
                <ul>
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (payment processors, email services).</li>
                  <li><strong>Safari Guides & Partners:</strong> Operational staff who need your details to deliver your experience.</li>
                  <li><strong>Legal Compliance:</strong> Authorities where required by law, court order, or regulatory obligation.</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="cookies">
              <h2 className="legal-section-title">
                <span className="legal-section-num">04</span>
                Cookies & Tracking
              </h2>
              <p className="legal-body">
                We use cookies and similar tracking technologies to enhance your browsing experience.
                You can control cookie preferences through your browser settings. Disabling cookies may
                affect some functionality of our website.
              </p>
              <div className="legal-card">
                <h3>Types of Cookies We Use</h3>
                <ul>
                  <li><strong>Essential:</strong> Required for the website to function properly.</li>
                  <li><strong>Analytics:</strong> Help us understand how visitors interact with our site.</li>
                  <li><strong>Preference:</strong> Remember your settings and preferences.</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="data-retention">
              <h2 className="legal-section-title">
                <span className="legal-section-num">05</span>
                Data Retention
              </h2>
              <p className="legal-body">
                We retain your personal data only as long as necessary to fulfill the purposes outlined
                in this policy, or as required by applicable law. Booking records are typically retained
                for up to <strong>7 years</strong> for legal and financial compliance. You may request
                deletion of your data at any time by contacting us.
              </p>
            </div>

            <div className="legal-section" id="your-rights">
              <h2 className="legal-section-title">
                <span className="legal-section-num">06</span>
                Your Rights
              </h2>
              <p className="legal-body">Depending on your location, you may have the right to:</p>
              <div className="legal-grid-2">
                {[
                  { icon: "👁️", right: "Access", desc: "Request a copy of the personal data we hold about you." },
                  { icon: "✏️", right: "Correct", desc: "Request correction of inaccurate or incomplete data." },
                  { icon: "🗑️", right: "Delete", desc: "Request deletion of your personal data ('right to be forgotten')." },
                  { icon: "📤", right: "Portability", desc: "Receive your data in a machine-readable format." },
                  { icon: "🚫", right: "Object", desc: "Object to certain types of processing, including marketing." },
                  { icon: "⏸️", right: "Restrict", desc: "Request that we limit how we use your data." },
                ].map(({ icon, right, desc }) => (
                  <div className="legal-highlight-card" key={right}>
                    <span className="legal-icon">{icon}</span>
                    <strong>{right}</strong>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="legal-section" id="security">
              <h2 className="legal-section-title">
                <span className="legal-section-num">07</span>
                Security
              </h2>
              <p className="legal-body">
                We implement industry-standard security measures including SSL encryption, secure data
                storage, and restricted access controls to protect your personal information. However,
                no method of transmission over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            <div className="legal-section" id="children">
              <h2 className="legal-section-title">
                <span className="legal-section-num">08</span>
                Children's Privacy
              </h2>
              <p className="legal-body">
                Our services are not directed to children under 13 years of age. We do not knowingly
                collect personal information from children. If you believe a child has provided us
                personal information, please contact us immediately and we will delete it.
              </p>
            </div>

            <div className="legal-section" id="contact">
              <h2 className="legal-section-title">
                <span className="legal-section-num">09</span>
                Contact Us
              </h2>
              <p className="legal-body">
                If you have any questions or concerns about this Privacy Policy or how we handle your
                data, please reach out:
              </p>
              <div className="legal-contact-card">
                <div className="legal-contact-row">
                  <span>📧</span>
                  <a href="mailto:theyaladiary@gmail.com">theyaladiary@gmail.com</a>
                </div>
                <div className="legal-contact-row">
                  <span>📱</span>
                  <a href="https://wa.me/94727176663" target="_blank" rel="noopener noreferrer">
                    WhatsApp: +94 72 717 6663
                  </a>
                </div>
                <div className="legal-contact-row">
                  <span>📍</span>
                  <span>Yala National Park, Southern Province, Sri Lanka</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
