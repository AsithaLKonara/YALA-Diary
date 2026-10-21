import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import "@/app/sections.css";
import "../privacy-policy/privacy.css";

const Footer = dynamic(() => import("@/components/Footer"));

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service governing your use of Yala Diary's safari booking platform and services.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 21, 2025";

  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="Please read these terms carefully before booking your safari experience."
        image="/images/assets/leapords/3.jpg"
      />

      <section className="legal-page section-padding">
        <div className="legal-container">

          <p className="legal-meta">Last updated: {lastUpdated}</p>

          <div className="legal-intro">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the <strong>Yala Diary</strong> website
              and booking services. By accessing our platform or making a booking, you agree to be
              bound by these Terms. Please read them carefully.
            </p>
          </div>

          <div className="legal-toc">
            <h2 className="legal-toc-title">Contents</h2>
            <ol className="legal-toc-list">
              <li><a href="#acceptance">Acceptance of Terms</a></li>
              <li><a href="#services">Our Services</a></li>
              <li><a href="#bookings">Bookings & Payments</a></li>
              <li><a href="#cancellations">Cancellations & Refunds</a></li>
              <li><a href="#conduct">Guest Conduct</a></li>
              <li><a href="#liability">Limitation of Liability</a></li>
              <li><a href="#intellectual-property">Intellectual Property</a></li>
              <li><a href="#governing-law">Governing Law</a></li>
              <li><a href="#changes">Changes to Terms</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ol>
          </div>

          <div className="legal-sections">

            <div className="legal-section" id="acceptance">
              <h2 className="legal-section-title">
                <span className="legal-section-num">01</span>
                Acceptance of Terms
              </h2>
              <p className="legal-body">
                By using the Yala Diary website or booking any of our services, you confirm that you
                are at least <strong>18 years of age</strong> and have the legal capacity to enter into
                these Terms. If you are booking on behalf of a group, you accept these Terms on behalf
                of all participants.
              </p>
            </div>

            <div className="legal-section" id="services">
              <h2 className="legal-section-title">
                <span className="legal-section-num">02</span>
                Our Services
              </h2>
              <p className="legal-body">
                Yala Diary provides safari experiences, wildlife photography tours, guided excursions,
                and related eco-tourism services at Yala National Park, Sri Lanka. We reserve the right
                to modify, suspend, or discontinue any service at any time with reasonable notice.
              </p>
              <div className="legal-card">
                <h3>Service Scope</h3>
                <ul>
                  <li>Morning and evening safari jeep rides within Yala National Park</li>
                  <li>Guided wildlife photography sessions</li>
                  <li>Customized group and private safari packages</li>
                  <li>Transfer and logistics coordination (where offered)</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="bookings">
              <h2 className="legal-section-title">
                <span className="legal-section-num">03</span>
                Bookings & Payments
              </h2>
              <div className="legal-grid-2">
                <div className="legal-highlight-card">
                  <span className="legal-icon">✅</span>
                  <strong>Confirmation</strong>
                  <p>Bookings are confirmed only upon receipt of a written confirmation from Yala Diary via email or WhatsApp.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">💳</span>
                  <strong>Payment</strong>
                  <p>A deposit or full payment may be required at the time of booking. Payment methods accepted are outlined during checkout.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">💰</span>
                  <strong>Pricing</strong>
                  <p>All prices are listed in USD unless stated otherwise and are subject to change without notice prior to booking confirmation.</p>
                </div>
                <div className="legal-highlight-card">
                  <span className="legal-icon">📋</span>
                  <strong>Accuracy</strong>
                  <p>You are responsible for providing accurate guest details, contact information, and any special requirements at the time of booking.</p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="cancellations">
              <h2 className="legal-section-title">
                <span className="legal-section-num">04</span>
                Cancellations & Refunds
              </h2>
              <div className="legal-card">
                <h3>Cancellation by Guest</h3>
                <ul>
                  <li><strong>More than 14 days before:</strong> Full refund minus a 10% processing fee.</li>
                  <li><strong>7–14 days before:</strong> 50% refund of the total booking amount.</li>
                  <li><strong>Less than 7 days:</strong> No refund. The full amount is forfeited.</li>
                  <li><strong>No-show:</strong> No refund. The full amount is forfeited.</li>
                </ul>
              </div>
              <div className="legal-card">
                <h3>Cancellation by Yala Diary</h3>
                <p>
                  We reserve the right to cancel or reschedule safaris due to extreme weather, park
                  closures, or force majeure events. In such cases, we will offer a full refund or
                  alternative date. We are not liable for any consequential losses (e.g., flights, hotels).
                </p>
              </div>
            </div>

            <div className="legal-section" id="conduct">
              <h2 className="legal-section-title">
                <span className="legal-section-num">05</span>
                Guest Conduct
              </h2>
              <p className="legal-body">
                All guests are expected to respect the wildlife, environment, and other visitors during
                safari activities. Yala Diary reserves the right to remove any guest from a safari without
                refund if their conduct is deemed disruptive, dangerous, or contrary to park regulations.
              </p>
              <div className="legal-card">
                <h3>Prohibited Conduct</h3>
                <ul>
                  <li>Leaving the safari vehicle without guide permission</li>
                  <li>Feeding, disturbing, or approaching wildlife</li>
                  <li>Littering or damaging natural vegetation</li>
                  <li>Using flash photography on animals</li>
                  <li>Excessive noise that disrupts wildlife or other guests</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="liability">
              <h2 className="legal-section-title">
                <span className="legal-section-num">06</span>
                Limitation of Liability
              </h2>
              <p className="legal-body">
                Safari activities inherently involve contact with wild animals and nature. By booking
                with Yala Diary, you acknowledge and accept these risks. To the fullest extent permitted
                by law, Yala Diary shall not be liable for:
              </p>
              <div className="legal-card">
                <ul>
                  <li>Personal injury, illness, or death arising from safari activities</li>
                  <li>Loss, theft, or damage to personal property</li>
                  <li>Failure to spot specific wildlife (sightings are never guaranteed)</li>
                  <li>Delays or changes due to weather, park conditions, or circumstances beyond our control</li>
                </ul>
              </div>
              <p className="legal-body" style={{ marginTop: '1rem' }}>
                We strongly recommend that all guests obtain comprehensive <strong>travel insurance</strong> covering
                medical emergencies, trip cancellations, and personal liability before their safari.
              </p>
            </div>

            <div className="legal-section" id="intellectual-property">
              <h2 className="legal-section-title">
                <span className="legal-section-num">07</span>
                Intellectual Property
              </h2>
              <p className="legal-body">
                All content on the Yala Diary website — including text, photographs, videos, logos,
                and design elements — is the property of Yala Diary or its content licensors and is
                protected by applicable intellectual property laws. You may not reproduce, distribute,
                or use our content without prior written permission.
              </p>
            </div>

            <div className="legal-section" id="governing-law">
              <h2 className="legal-section-title">
                <span className="legal-section-num">08</span>
                Governing Law
              </h2>
              <p className="legal-body">
                These Terms are governed by and construed in accordance with the laws of the
                <strong> Democratic Socialist Republic of Sri Lanka</strong>. Any disputes arising
                under these Terms shall be subject to the exclusive jurisdiction of the courts of
                Sri Lanka.
              </p>
            </div>

            <div className="legal-section" id="changes">
              <h2 className="legal-section-title">
                <span className="legal-section-num">09</span>
                Changes to Terms
              </h2>
              <p className="legal-body">
                We reserve the right to update or modify these Terms at any time. Changes will be
                effective immediately upon posting to our website. Your continued use of our services
                after changes are posted constitutes your acceptance of the revised Terms. We encourage
                you to review this page periodically.
              </p>
            </div>

            <div className="legal-section" id="contact">
              <h2 className="legal-section-title">
                <span className="legal-section-num">10</span>
                Contact Us
              </h2>
              <p className="legal-body">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="legal-contact-card">
                <div className="legal-contact-row">
                  <span>📧</span>
                  <a href="mailto:info@yaladiary.com">info@yaladiary.com</a>
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
