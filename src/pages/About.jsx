import React from "react";
import "./styles/Home.css";

export default function About() {
  return (
    <div className="home-root">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>About Our Healthcare Platform</h1>
            <p>
              We connect patients with trusted doctors and modern healthcare
              services — transparently, safely, and efficiently.
            </p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Who We Are</h2>

          <div className="services-grid">
            <div className="service-card">
              <h3>Patient-First Care</h3>
              <p>
                We prioritize clarity, comfort, and trust in every medical
                journey.
              </p>
            </div>

            <div className="service-card">
              <h3>Verified Professionals</h3>
              <p>
                Our doctors and specialists are carefully verified and reviewed.
              </p>
            </div>

            <div className="service-card">
              <h3>End-to-End Support</h3>
              <p>
                From consultation to recovery, we’re with you at every step.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
