import React from "react";
import Image from "next/image";
import "./PageHero.css";

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export default function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Image 
        src={image}
        alt={title}
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />
      <div className="page-hero-overlay"></div>
      <div className="page-hero-content">
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
