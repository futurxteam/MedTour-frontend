import React from "react";
import "./styles/Home.css";

export default function Contact() {
  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>

          <div className="services-grid">
            <div className="service-card">
              <h3>📞 Phone</h3>
              <p>+91 98765 43210</p>
            </div>

            <div className="service-card">
              <h3>📧 Email</h3>
              <p>support@medtour.com</p>
            </div>

            <div className="service-card">
              <h3>📍 Address</h3>
              <p>
                MedTour Healthcare<br />
                Kochi, Kerala, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
