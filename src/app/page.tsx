import Hero from "@/components/Hero";
import TrustBar from "@/components/sections/TrustBar";
import WhyYala from "@/components/sections/WhyYala";
import SafariExperiences from "@/components/sections/SafariExperiences";
import Wildlife from "@/components/sections/Wildlife";
import JourneyTimeline from "@/components/sections/JourneyTimeline";
import WhyBookUs from "@/components/sections/WhyBookUs";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import ExploreYala from "@/components/sections/ExploreYala";
import FAQ from "@/components/sections/FAQ";
import FinalConversion from "@/components/sections/FinalConversion";
import Footer from "@/components/Footer";
import "./sections.css";

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
