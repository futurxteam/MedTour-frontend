import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    icon: "🔬",
    title: "Medical Specializations & Surgeries",
    desc: "Access to Kerala's finest specialists in Cardiology, Oncology, Orthopedics, Neurology, Ayurveda, and 10+ more disciplines — at a fraction of Western costs.",
    tags: ["Cardiology", "Oncology", "Orthopedics", "Ayurveda"],
    color: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a620, #0d948820)",
  },
  {
    icon: "✈️",
    title: "End-to-End Travel Support",
    desc: "From airport pickup to hotel bookings, visa assistance and local logistics — we handle it all so you can focus entirely on your health.",
    tags: ["Visa Assist", "Airport Transfer", "Hotel Booking"],
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f120, #818cf820)",
  },
  {
    icon: "🗣️",
    title: "Certified Translator Services",
    desc: "Multilingual patient coordinators fluent in Arabic, Russian, French, and more — ensuring zero communication barriers throughout your journey.",
    tags: ["Arabic", "Russian", "French", "German"],
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b20, #fbbf2420)",
  },
  {
    icon: "🌴",
    title: "Kerala Tourism Packages",
    desc: "Combine healing with discovery — experience Kerala's backwaters, hill stations, and Ayurvedic resorts during your recovery period.",
    tags: ["Backwaters", "Hill Stations", "Ayurvedic Spa"],
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e20, #4ade8020)",
  },
];

const ServiceCard = ({ service, delay, isInView }) => (
  <motion.div
    className="service-card-about"
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ y: -10, transition: { duration: 0.25 } }}
    style={{ "--card-color": service.color, "--card-gradient": service.gradient }}
  >
    <div className="service-card-glow" />
    <div className="service-icon-about">{service.icon}</div>
    <h3 className="service-title-about">{service.title}</h3>
    <p className="service-desc-about">{service.desc}</p>
    <div className="service-tags">
      {service.tags.map((tag, i) => (
        <span key={i} className="service-tag">{tag}</span>
      ))}
    </div>
    <div className="service-card-arrow">→</div>
  </motion.div>
);

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="about-section services-about" ref={ref}>
      <div className="about-container">
        <motion.div
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">What We Offer</div>
          <h2 className="about-section-title">
            Everything You Need,{" "}
            <span className="about-accent">In One Place</span>
          </h2>
          <p className="about-section-desc">
            We designed Medtour to be your single point of contact for every aspect
            of your medical travel experience.
          </p>
        </motion.div>

        <div className="services-about-grid">
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              service={s}
              delay={i * 0.12}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
