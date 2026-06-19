import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/About/HeroSection";
import WhoWeAre from "../components/About/WhoWeAre";
import StatsSection from "../components/About/StatsSection";
import ServicesSection from "../components/About/ServicesSection";
import WhyKerala from "../components/About/WhyKerala";
import NetworkSection from "../components/About/NetworkSection";
import JourneySection from "../components/About/JourneySection";
import TestimonialsSection from "../components/About/TestimonialsSection";
import CTASection from "../components/About/CTASection";
import "./styles/About.css";

export default function About() {
  return (
    <div className="about-root">
      <Header />
      <HeroSection />
      <WhoWeAre />
      <StatsSection />
      <ServicesSection />
      <WhyKerala />
      <NetworkSection />
      <JourneySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
