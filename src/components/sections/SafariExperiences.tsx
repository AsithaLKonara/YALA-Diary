"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

export default function SafariExperiences({ packages }: { packages?: any[] }) {
  const { formatPrice } = useCurrency();
  const displayPackages = packages || [];

  const isScrollable = displayPackages.length > 4;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScrollable) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isScrollable]);

  if (displayPackages.length === 0) {
    return null;
  }

  return (
    <section className="experiences-section section-padding">
      <div className="experiences-header" style={!isScrollable ? { textAlign: 'center' } : {}}>
        <h2 className="section-title">Safari Experiences</h2>
      </div>
      <div
        className={`experiences-grid ${isScrollable ? 'no-scrollbar' : ''}`}
        ref={scrollRef}
        style={{
          display: 'flex',
          justifyContent: isScrollable ? 'flex-start' : 'center',
          flexWrap: isScrollable ? 'nowrap' : 'wrap',
          overflowX: isScrollable ? 'auto' : 'visible',
          gap: isScrollable ? '0' : '2px',
          width: '100%'
        }}
      >
        {displayPackages.map((exp: any, idx: number) => {
          const image = exp.images?.[0] || exp.image || "/images/assets/leapords/519f7d6a-069a-4628-8711-2dd4b07647bc.jpg";
          const title = exp.name || exp.title;
          const desc = exp.type ? `Experience the wild during the ${exp.type.toLowerCase()}.` : exp.desc;
          const duration = exp.startTime && exp.endTime ? `${exp.startTime} - ${exp.endTime}` : exp.duration;

          return (
            <div
              key={exp.id || idx}
              className="experience-card"
              style={{
                backgroundImage: `url(${image})`,
                flexShrink: 0,
                width: isScrollable ? '300px' : '400px',
                maxWidth: '100%',
                flexGrow: isScrollable ? 0 : 0
              }}
            >
              <div className="experience-overlay">
                <div className="experience-content">
                  <h3>{title}</h3>
                  {exp.description ? (
                    <div style={{ fontSize: '0.9rem', marginBottom: '15px', color: 'rgba(255,255,255,0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                  ) : (
                    <p>{desc}</p>
                  )}
                  <div className="experience-meta">
                    <span>{duration}</span>
                    <span>From {formatPrice(exp.basePrice || exp.price)}</span>
                  </div>
                  <Link href={`/safaris/${exp.id || 'default'}`} className="view-btn" style={{ display: 'inline-block' }}>View Safari →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
