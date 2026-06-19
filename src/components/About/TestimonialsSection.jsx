import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Ahmed Al-Rashidi",
    country: "Kuwait",
    flag: "🇰🇼",
    treatment: "Cardiac Bypass Surgery",
    rating: 5,
    text: "Medtour changed my life. From the moment I landed in Kochi to my discharge, every detail was handled with extraordinary care. The surgery cost me 70% less than Dubai, and the quality was simply outstanding. My coordinator was available 24/7 — I never felt alone.",
    avatar: "A",
    color: "#14b8a6",
  },
  {
    name: "Fatima Al-Zahra",
    country: "UAE",
    flag: "🇦🇪",
    treatment: "Knee Replacement",
    rating: 5,
    text: "I was nervous about travelling for surgery, but Medtour made it seamless. The translator service was invaluable — I never had a communication issue. I even got to experience the Kerala backwaters during recovery. Absolutely recommend!",
    avatar: "F",
    color: "#6366f1",
  },
  {
    name: "James O'Brien",
    country: "Ireland",
    flag: "🇮🇪",
    treatment: "Spine Surgery",
    rating: 5,
    text: "Waited 18 months in Ireland for spine surgery. Medtour had me in the operating room in 3 weeks. The hospital was world-class, the doctors were exceptional, and the aftercare package was incredible. Kerala itself is magical.",
    avatar: "J",
    color: "#f59e0b",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="about-section testimonials-section" ref={ref}>
      <div className="about-container">
        <motion.div
          className="about-section-head"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="about-label">Patient Stories</div>
          <h2 className="about-section-title">
            Voices That <span className="about-accent">Trust Medtour</span>
          </h2>
          <p className="about-section-desc">
            Real experiences from real patients — from across the world.
          </p>
        </motion.div>

        <motion.div
          className="testimonials-carousel"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="testimonial-card-main"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
            >
              {/* Quote mark */}
              <div className="testimonial-quote-mark">"</div>

              <p className="testimonial-text">{testimonials[current].text}</p>

              {/* Stars */}
              <div className="testimonial-stars">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>

              {/* Author */}
              <div className="testimonial-author">
                <div
                  className="author-avatar"
                  style={{ backgroundColor: testimonials[current].color }}
                >
                  {testimonials[current].avatar}
                </div>
                <div className="author-info">
                  <div className="author-name">
                    {testimonials[current].name}{" "}
                    <span className="author-flag">{testimonials[current].flag}</span>
                  </div>
                  <div className="author-meta">
                    {testimonials[current].country} · {testimonials[current].treatment}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="testimonial-controls">
            <button className="testimonial-nav-btn" onClick={prev} aria-label="Previous">
              ←
            </button>
            <div className="testimonial-indicators">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`testimonial-dot ${current === i ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <button className="testimonial-nav-btn" onClick={next} aria-label="Next">
              →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
