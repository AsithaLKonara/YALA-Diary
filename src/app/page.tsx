import nextDynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";
import "./sections.css";
import { siteConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};
const TrustBar = nextDynamic(() => import("@/components/sections/TrustBar"));
const WhyYala = nextDynamic(() => import("@/components/sections/WhyYala"));
const SafariExperiences = nextDynamic(() => import("@/components/sections/SafariExperiences"));
const Wildlife = nextDynamic(() => import("@/components/sections/Wildlife"));
const JourneyTimeline = nextDynamic(() => import("@/components/sections/JourneyTimeline"));
const WhyBookUs = nextDynamic(() => import("@/components/sections/WhyBookUs"));
const Gallery = nextDynamic(() => import("@/components/sections/Gallery"));
const Reviews = nextDynamic(() => import("@/components/sections/Reviews"));
const ExploreYala = nextDynamic(() => import("@/components/sections/ExploreYala"));
const FAQ = nextDynamic(() => import("@/components/sections/FAQ"));
const FinalConversion = nextDynamic(() => import("@/components/sections/FinalConversion"));
const Footer = nextDynamic(() => import("@/components/Footer"));
const FloatingWhatsApp = nextDynamic(() => import("@/components/ui/FloatingWhatsApp"));

export default async function Home() {
  const activePackages = await SafariPackageService.listActivePackages();

  return (
    <>
      <Hero />
      <TrustBar />
      <WhyYala />
      <SafariExperiences packages={activePackages} />
      <Wildlife />
      <JourneyTimeline />
      <WhyBookUs />
      <Gallery />
      <Reviews />
      <ExploreYala />
      <FAQ />
      <FinalConversion />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
