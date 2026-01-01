import React from "react";
import "./styles/Home.css";

export default function Services() {
  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Medical Services</h2>

          <div className="services-grid">
            {[
              ["Proctology", "Advanced treatment for piles, fissures & fistulas."],
              ["Orthopedics", "Joint replacement & bone care treatments."],
              ["Gynecology", "Women’s health & maternity care."],
              ["Urology", "Kidney, bladder & urinary treatments."],
              ["ENT", "Ear, nose & throat specialist services."],
              ["Cosmetic Surgery", "Aesthetic & reconstructive procedures."]
            ].map(([title, desc]) => (
              <div key={title} className="service-card">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
