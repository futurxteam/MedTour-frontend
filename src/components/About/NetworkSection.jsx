import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const hospitals = [
  { name: "Amrita Institute of Medical Sciences", city: "Kochi", abbr: "AIMS" },
  { name: "Aster Medcity", city: "Kochi", abbr: "AST" },
  { name: "KIMS Hospital", city: "Thiruvananthapuram", abbr: "KIMS" },
  { name: "Baby Memorial Hospital", city: "Kozhikode", abbr: "BMH" },
  { name: "Lakeshore Hospital", city: "Kochi", abbr: "LKS" },
  { name: "PVS Hospital", city: "Kochi", abbr: "PVS" },
  { name: "Malabar Institute of Medical Sciences", city: "Kozhikode", abbr: "MIMS" },
  { name: "Rajagiri Hospital", city: "Kochi", abbr: "RJG" },
];

const NetworkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="about-section network-section" ref={ref}>
      <div className="about-container">
        <motion.div
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">Our Network</div>
          <h2 className="about-section-title">
            Partnered with Kerala's{" "}
            <span className="about-accent">Finest Hospitals</span>
          </h2>
          <p className="about-section-desc">
            Every hospital in our network is carefully vetted for accreditation,
            specialist quality, and international patient facilities.
          </p>
        </motion.div>

        {/* Accreditation Banner */}
        <motion.div
          className="accreditation-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {["NABH Accredited", "JCI Certified", "ISO 9001", "Kerala Tourism Partner"].map((badge, i) => (
            <div key={i} className="accreditation-badge">
              <span className="acc-check">✓</span> {badge}
            </div>
          ))}
        </motion.div>

        {/* Hospital Cards */}
        <div className="hospital-cards-grid">
          {hospitals.map((h, i) => (
            <motion.div
              key={i}
              className="hospital-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="hospital-abbr-badge">{h.abbr}</div>
              <div className="hospital-card-info">
                <div className="hospital-name">{h.name}</div>
                <div className="hospital-city">
                  <span className="hospital-pin">📍</span> {h.city}
                </div>
              </div>
              <div className="hospital-verified">
                <span>✓</span> Verified Partner
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="network-note"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          + 15 more partner hospitals across Kerala
        </motion.p>
      </div>
    </section>
  );
};

export default NetworkSection;
