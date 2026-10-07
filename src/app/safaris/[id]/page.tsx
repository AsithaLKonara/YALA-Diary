import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, CalendarDays, MapPin } from "lucide-react";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await SafariPackageService.getPackageById(id);
  if (!pkg) return { title: "Package Not Found | Yala Diary" };
  
  const pkgUrl = `${siteConfig.url}/safaris/${pkg.id}`;
  const pkgImage = pkg.images?.[0] || siteConfig.ogImage;

  return {
    title: pkg.name,
    description: `Experience the ${pkg.name} safari at Yala National Park.`,
    alternates: { canonical: pkgUrl },
    openGraph: {
      title: pkg.name,
      description: `Experience the ${pkg.name} safari at Yala National Park.`,
      url: pkgUrl,
      images: [{ url: pkgImage }],
    }
  };
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await SafariPackageService.getPackageById(id);

  if (!pkg) {
    notFound();
  }

  const heroImage = pkg.images?.[0] || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.name,
    "image": heroImage,
    "description": `Experience the wild with our premium ${pkg.type.toLowerCase().replace('_', ' ')} safari in Yala National Park.`,
    "brand": {
      "@type": "Brand",
      "name": siteConfig.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/safaris/${pkg.id}`,
      "priceCurrency": "USD",
      "price": pkg.basePrice,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <JsonLd data={productJsonLd} />
      {/* Hero Section */}
      <section style={{ position: "relative", width: "100%", height: "65vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image 
            src={heroImage} 
            alt={pkg.name} 
            fill 
            style={{ objectFit: "cover" }} 
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)" }}></div>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px", maxWidth: "900px", margin: "0 auto", marginTop: "80px" }}>
          <span style={{ 
            display: "inline-block", padding: "6px 16px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.2)", 
            borderRadius: "30px", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", 
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" 
          }}>
            {pkg.type.replace('_', ' ')}
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, marginBottom: "20px", lineHeight: 1.1 }}>
            {pkg.name}
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "rgba(255,255,255,0.8)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
            Experience the wild with our premium {pkg.type.toLowerCase().replace('_', ' ')} safari in Yala National Park.
          </p>
        </div>
      </section>

      {/* Sticky Overview Bar */}
      <div style={{ 
        position: "sticky", top: "70px", zIndex: 40, background: "rgba(10, 17, 13, 0.85)", backdropFilter: "blur(16px)", 
        borderBottom: "1px solid rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "20px 0"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", gap: "30px", fontSize: "0.95rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
              <Clock size={18} color="var(--primary)" />
              <span>{pkg.startTime} - {pkg.endTime}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
              <CalendarDays size={18} color="var(--primary)" />
              <span>Daily Departures</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                Starting From
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)" }}>
                ${pkg.basePrice} <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/ {pkg.pricingType === "PER_PERSON" ? "person" : "jeep"}</span>
              </div>
            </div>
            <Link href={`/book?packageId=${pkg.id}`} className="nav-book-btn" style={{ padding: "14px 32px", fontSize: "1rem", background: "#fff", color: "#000", border: "none" }}>
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px", display: "flex", flexWrap: "wrap", gap: "60px" }}>
        
        {/* Main Column */}
        <div style={{ flex: "1 1 600px", display: "flex", flexDirection: "column", gap: "60px" }}>
          
          {/* About */}
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: "30px", height: "2px", background: "var(--primary)", display: "inline-block" }}></span>
              Experience Overview
            </h2>
            {pkg.description ? (
              <div 
                style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "1.1rem" }}
                dangerouslySetInnerHTML={{ __html: pkg.description }} 
              />
            ) : (
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                Embark on an unforgettable journey through Yala National Park. This {pkg.type.toLowerCase().replace('_', ' ')} adventure is carefully designed to maximize your chances of witnessing Sri Lanka's iconic wildlife, including leopards, elephants, and exotic birds in their natural habitat. Guided by our expert trackers, every moment is tailored to offer you a spectacular and safe wild encounter.
              </p>
            )}
          </div>

          {/* Inclusions */}
          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ width: "30px", height: "2px", background: "var(--primary)", display: "inline-block" }}></span>
                What's Included
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
                {pkg.inclusions.map((inclusion, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <CheckCircle color="var(--primary)" size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.5 }}>{inclusion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Services */}
          {pkg.extraServices && pkg.extraServices.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ width: "30px", height: "2px", background: "var(--primary)", display: "inline-block" }}></span>
                Available Enhancements
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {pkg.extraServices.map(service => (
                  <div key={service.id} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden" }}>
                    <div style={{ height: "140px", position: "relative", background: "#111" }}>
                      {service.images?.[0] && (
                        <Image src={service.images[0]} alt={service.name} fill style={{ objectFit: "cover", opacity: 0.6 }} />
                      )}
                      <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "4px", color: "var(--primary)", border: "1px solid rgba(154,205,50,0.2)" }}>
                        {service.category}
                      </div>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px" }}>{service.name}</h4>
                      {service.description ? (
                        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: service.description }} />
                      ) : (
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          Enhance your safari experience.
                        </p>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                        <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>${service.basePrice} <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{service.pricingModel.replace('_', ' ')}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "30px", borderRadius: "16px", position: "sticky", top: "180px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "20px" }}>Good to Know</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", listStyle: "none" }}>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <MapPin color="var(--primary)" size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ lineHeight: 1.5 }}>Pickup available from hotels in Tissamaharama, Yala, and Kirinda.</span>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Clock color="var(--primary)" size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ lineHeight: 1.5 }}>Please be ready 15 minutes before your scheduled start time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {pkg.images && pkg.images.length > 1 && (
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 100px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "30px", height: "2px", background: "var(--primary)", display: "inline-block" }}></span>
            Gallery
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {pkg.images.map((img, idx) => (
              <div key={idx} style={{ position: "relative", height: idx === 0 ? "416px" : "200px", gridColumn: idx === 0 ? "span 2" : "span 1", gridRow: idx === 0 ? "span 2" : "span 1", borderRadius: "12px", overflow: "hidden" }}>
                <Image src={img} alt={`Gallery ${idx}`} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
}
