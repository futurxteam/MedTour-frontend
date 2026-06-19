import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Video, Plane, Stethoscope, BedDouble, Home } from "lucide-react";

const stepsData = [
  {
    title: "Online Consultation",
    desc: "Connect with our medical experts via video call to discuss your condition, share reports, and receive a preliminary treatment plan.",
    icon: Video,
    color: "#1e3a5f",
  },
  {
    title: "Travel Planning",
    desc: "We assist with medical visas, flight bookings, and arrange airport transfers for a seamless arrival in Kerala.",
    icon: Plane,
    color: "#14b8a6",
  },
  {
    title: "Hospital Treatment",
    desc: "Receive world-class medical care at our partner JCI/NABH accredited hospitals with dedicated international patient coordinators.",
    icon: Stethoscope,
    color: "#1e3a5f",
  },
  {
    title: "Recovery in Kerala",
    desc: "Recuperate in a serene environment. Choose from luxury hotels, Ayurveda resorts, or peaceful backwater retreats.",
    icon: BedDouble,
    color: "#f59e0b",
  },
  {
    title: "Return Home",
    desc: "Fly back safely with all medical records. We provide continuous post-treatment follow-up consultations online.",
    icon: Home,
    color: "#22c55e",
  },
];

/* ── Individual Step Row ─────────────────────────────── */
const StepRow = ({ step, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0; // even → card on left, odd → card on right
  const Icon = step.icon;

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -70 : 70 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.4 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.15, ease: "backOut" },
    },
  };

  return (
    <div className="journey-row" ref={ref}>
      {/* LEFT SIDE */}
      <div className="journey-side journey-left">
        {isLeft && (
          <motion.div
            className="journey-card"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3 className="journey-card-title">
              Step {index + 1}: {step.title}
            </h3>
            <p className="journey-card-desc">{step.desc}</p>
          </motion.div>
        )}
      </div>

      {/* CENTER — icon on the line */}
      <div className="journey-center">
        <motion.div
          className="journey-icon-circle"
          style={{ backgroundColor: step.color }}
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Icon size={22} color="#fff" strokeWidth={1.8} />
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="journey-side journey-right">
        {!isLeft && (
          <motion.div
            className="journey-card"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3 className="journey-card-title">
              Step {index + 1}: {step.title}
            </h3>
            <p className="journey-card-desc">{step.desc}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ── Section ─────────────────────────────────────────── */
const JourneySection = () => {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section className="about-section journey-section">
      <div className="about-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">Patient Journey</div>
          <h2 className="about-section-title">
            Your Path to{" "}
            <span className="about-accent">Complete Healing</span>
          </h2>
          <p className="about-section-desc">
            Five carefully orchestrated steps — from first contact to full
            recovery.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="journey-timeline">
          {/* Vertical line */}
          <div className="journey-vline" />

          {stepsData.map((step, i) => (
            <StepRow key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
