import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  return (
    <section className="about-cta-section" ref={ref}>
      {/* Background orbs */}
      <div className="cta-orb cta-orb-1" />
      <div className="cta-orb cta-orb-2" />

      <div className="about-container cta-inner">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="about-label" style={{ color: "#5eead4" }}>
            Ready to Begin?
          </div>
          <h2 className="cta-headline">
            Start Your Healing Journey Today
          </h2>
          <p className="cta-subtext">
            Join over 1,000 patients who chose Medtour for world-class healthcare
            with the warmth of Kerala. Your journey to recovery starts with a
            single conversation.
          </p>

          <div className="cta-actions">
            <motion.button
              className="cta-btn-primary"
              onClick={() => navigate("/contact")}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              📞 Contact Us
            </motion.button>
            <motion.button
              className="cta-btn-outline"
              onClick={() => navigate("/services")}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              View Packages →
            </motion.button>
          </div>

          {/* Trust indicators */}
          <div className="cta-trust-row">
            {[
              "✓ Free Consultation",
              "✓ No Hidden Fees",
              "✓ 24/7 Support",
              "✓ Trusted by 1000+ Patients",
            ].map((item, i) => (
              <motion.span
                key={i}
                className="cta-trust-item"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
