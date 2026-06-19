import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const WhoWeAre = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="about-section who-we-are" ref={ref}>
      <div className="about-container">
        <div className="who-grid">
          {/* Left: Text */}
          <motion.div
            className="who-text"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="about-label">Our Story</div>
            <h2 className="about-section-title">
              More Than a Medical Platform —<br />
              <span className="about-accent">A Healing Ecosystem</span>
            </h2>
            <p className="about-body-text">
              Founded over a decade ago, Medtour was born from a simple conviction:
              every person deserves access to world-class healthcare, regardless of
              where they live. We saw patients travelling thousands of miles with no
              guide, no translator, no hand to hold — and we changed that.
            </p>
            <p className="about-body-text">
              Today, we are Kerala's most trusted medical tourism facilitator —
              connecting international patients with accredited hospitals, renowned
              specialists, and the warmth of God's Own Country. From inquiry to
              recovery, every step is managed with precision and care.
            </p>

            <div className="who-trust-pillars">
              {[
                { icon: "🏅", label: "10+ Years", desc: "Of trusted service" },
                { icon: "🌍", label: "Global Reach", desc: "Patients from 30+ countries" },
                { icon: "🤝", label: "End-to-End", desc: "Complete care packages" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="trust-pill"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                >
                  <span className="trust-pill-icon">{item.icon}</span>
                  <div>
                    <div className="trust-pill-label">{item.label}</div>
                    <div className="trust-pill-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="who-visual"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="who-image-stack">
              <div className="who-img-main">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                  alt="Medical care"
                />
              </div>
              <div className="who-img-secondary">
                <img
                  src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80"
                  alt="Kerala nature"
                />
              </div>
              <div className="who-floating-card">
                <div className="who-floating-icon">⭐</div>
                <div>
                  <div className="who-floating-num">4.9/5</div>
                  <div className="who-floating-sub">Patient Rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
