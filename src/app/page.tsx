import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import "./sections.css";

const TrustBar = dynamic(() => import("@/components/sections/TrustBar"));
const WhyYala = dynamic(() => import("@/components/sections/WhyYala"));
const SafariExperiences = dynamic(() => import("@/components/sections/SafariExperiences"));
const Wildlife = dynamic(() => import("@/components/sections/Wildlife"));
const JourneyTimeline = dynamic(() => import("@/components/sections/JourneyTimeline"));
const WhyBookUs = dynamic(() => import("@/components/sections/WhyBookUs"));
const Gallery = dynamic(() => import("@/components/sections/Gallery"));
const Reviews = dynamic(() => import("@/components/sections/Reviews"));
const ExploreYala = dynamic(() => import("@/components/sections/ExploreYala"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const FinalConversion = dynamic(() => import("@/components/sections/FinalConversion"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyYala />
      <SafariExperiences />
      <Wildlife />
      <JourneyTimeline />
      <WhyBookUs />
      <Gallery />
      <Reviews />
      <ExploreYala />
      <FAQ />
      <FinalConversion />
      <Footer />
    </>
  );
}
