import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const StatCard = ({ icon, value, suffix, label, desc, delay, started }) => {
  const count = useCounter(value, 2000, started);

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 50 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      <div className="stat-icon-wrap">{icon}</div>
      <div className="stat-value">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-desc">{desc}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    {
      icon: "🏆",
      value: 10,
      suffix: "+",
      label: "Years of Excellence",
      desc: "Decades of trust built one patient at a time",
    },
    {
      icon: "🧑‍⚕️",
      value: 1000,
      suffix: "+",
      label: "Patients Served",
      desc: "International patients treated across Kerala",
    },
    {
      icon: "🏥",
      value: 25,
      suffix: "+",
      label: "Hospital Partners",
      desc: "Accredited hospitals across the state",
    },
    {
      icon: "🌍",
      value: 30,
      suffix: "+",
      label: "Countries Served",
      desc: "A truly global patient community",
    },
  ];

  return (
    <section className="about-section stats-section" ref={ref}>
      {/* Background pattern */}
      <div className="stats-bg-pattern" />

      <div className="about-container">
        <motion.div
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">Our Impact</div>
          <h2 className="about-section-title">
            Numbers That Tell Our <span className="about-accent">Story</span>
          </h2>
          <p className="about-section-desc">
            A decade of dedication, measured in lives improved and patients cared for.
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 0.12} started={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
