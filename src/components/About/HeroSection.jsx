import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="about-hero">
      {/* Parallax Background */}
      <div className="about-hero-bg" />
      <div className="about-hero-overlay" />

      {/* Floating orbs */}
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />

      <div className="about-hero-content">
        <motion.div
          className="about-hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          🌿 Kerala, India · Trusted Since 2014
        </motion.div>

        <motion.h1
          className="about-hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          Transforming Healthcare
          <br />
          <span className="about-hero-highlight">Journeys Across Borders</span>
        </motion.h1>

        <motion.p
          className="about-hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Medtour bridges the gap between world-class medical care and seamless travel —
          connecting international patients with Kerala's finest hospitals for treatments
          that heal without compromise.
        </motion.p>

        <motion.div
          className="about-hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <button
            className="about-btn-primary"
            onClick={() => navigate("/services")}
          >
            Explore Treatments
            <span className="about-btn-arrow">→</span>
          </button>
          <button
            className="about-btn-glass"
            onClick={() => navigate("/contact")}
          >
            Get Started
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="about-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="about-scroll-dot" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
