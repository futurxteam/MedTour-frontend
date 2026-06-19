import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./styles/Contact.css";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    {
      icon: "📞",
      title: "Call Us Anytime",
      content: "+91 92071 96093",
      link: "tel:+919207196093"
    },
    {
      icon: "📧",
      title: "Email Support",
      content: "medtour@gmail.com",
      link: "mailto:medtour@gmail.com"
    },
    {
      icon: "📍",
      title: "Visit Our Office",
      content: (
        <>
          Mamson Royal Building, Service Road<br />
          Edappally, Kochi, Kerala
        </>
      ),
      link: "https://maps.google.com"
    }
  ];

  return (
    <div className="contact-root">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-orb" />
        <div className="about-container contact-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="contact-label">Get in Touch</span>
            <h1 className="contact-hero-title">
              We're Here to <span className="about-accent">Help You Heal</span>
            </h1>
            <p className="contact-hero-subtitle">
              Have questions about treatments, hospitals, or travel? Our team is available 24/7 
               to guide you through every step of your medical journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="about-container contact-main" ref={ref}>
        <div className="contact-grid">
          {/* Info Column */}
          <div className="contact-info-stack">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                className="contact-info-card"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="info-icon-wrap">{info.icon}</div>
                <h3 className="info-title">{info.title}</h3>
                <p className="info-content">
                  {typeof info.content === "string" ? (
                    <a href={info.link}>{info.content}</a>
                  ) : (
                    info.content
                  )}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Form Column */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="form-title">Send a Message</h2>
            <p className="form-subtitle">Fill out the form below and we'll get back to you within 2-4 hours.</p>
            
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-input-wrap">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-input-wrap">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              <div className="form-input-wrap">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-input-wrap">
                <label>Subject</label>
                <input type="text" placeholder="Inquiry about Treatment" required />
              </div>
              <div className="form-input-wrap form-group-full">
                <label>How can we help?</label>
                <textarea rows="5" placeholder="Tell us more about your medical needs..." required />
              </div>
              <div className="form-group-full">
                <button type="submit" className="form-submit-btn">
                  Send Message Now →
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      {/* Map Section */}
      <section className="about-container contact-map-section">
        <motion.div 
          className="map-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <iframe 
            className="iframe-map"
            title="Medtour Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.558384217145!2d76.3056345750033!3d10.0318538901004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d46695240c9%3A0xe6792ed715b74465!2sService%20Rd%2C%20Edappally%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1712567293741!5m2!1sen!2sin" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-overlay">
            <h3 className="map-title">Headquarters</h3>
            <p className="map-address">
              Mamson Royal building, Service road,<br /> 
              Edappally, Kochi, Kerala - 682024
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
