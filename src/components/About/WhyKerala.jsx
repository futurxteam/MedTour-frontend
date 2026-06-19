import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const whyPoints = [
  {
    icon: "🏥",
    title: "World-Class Healthcare",
    desc: "Kerala hospitals are NABH & JCI accredited, with specialists trained at the world's top medical institutions.",
  },
  {
    icon: "💰",
    title: "Dramatically Affordable",
    desc: "Save 60–80% compared to US, UK, or Gulf pricing — with no compromise in quality of care.",
  },
  {
    icon: "🌿",
    title: "Recovery in Paradise",
    desc: "Recover surrounded by Kerala's serene backwaters, pristine beaches and Ayurvedic wellness tradition.",
  },
  {
    icon: "🗺️",
    title: "Seamless Experience",
    desc: "English-fluent staff, established infrastructure, and a strong international patient community.",
  },
];

const destinations = [
  {
    name: "Kochi",
    icon: "🏙️",
    desc: "Medical hub with world-class hospitals",
    img: "https://images.unsplash.com/photo-1590577258580-828aacee17a5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Thiruvananthapuram",
    icon: "🏞️",
    desc: "Capital city with premier institutions",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kozhikode",
    icon: "🌊",
    desc: "Coastal healing & Ayurveda retreats",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Munnar",
    icon: "⛰️",
    desc: "Hill station recovery escapes",
    img: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=600&q=80",
  },
];

const WhyKerala = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });





  return (
    <section className="about-section why-kerala" ref={ref}>
      {/* Decorative organic shapes */}
      <div className="why-kerala-shape why-shape-1" />
      <div className="why-kerala-shape why-shape-2" />

      <div className="about-container">
        <motion.div
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">Why Kerala?</div>
          <h2 className="about-section-title">
            God's Own Country,{" "}
            <span className="about-accent">World's Best Care</span>
          </h2>
          <p className="about-section-desc">
            Kerala uniquely combines medical excellence with natural beauty — making
            it the world's most complete destination for healing.
          </p>
        </motion.div>

        {/* Why Points — Staggered Flex */}
        <div className="why-points-flex">
          {whyPoints.map((point, i) => (
            <motion.div
              key={i}
              className="why-point-bubble"
              initial={{ opacity: 0, scale: 0.8, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "backOut" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="why-bubble-inner">
                <div className="why-point-icon">{point.icon}</div>
                <h3 className="why-point-title">{point.title}</h3>
                <p className="why-point-desc">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Destinations */}
        <motion.div
          className="destinations-label"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="about-label" style={{ marginBottom: "1.5rem" }}>
            Top Destinations
          </div>
        </motion.div>

        <div className="destinations-grid">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              className="destination-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.55 + i * 0.1 }}
              whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
            >
              <img src={dest.img} alt={dest.name} className="destination-img" />
              <div className="destination-overlay">
                <div className="destination-icon">{dest.icon}</div>
                <div className="destination-name">{dest.name}</div>
                <div className="destination-desc">{dest.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKerala;
