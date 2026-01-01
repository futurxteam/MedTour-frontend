import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { surgeryData } from "./data";
import "./styles/Home.css"; // ✅ SAME CSS as Services

export default function SurgeryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const surgery = surgeryData.find((item) => item.id === id);

  if (!surgery) {
    return (
      <div className="home-root">
        <section className="services-section">
          <div className="container">
            <h2 className="section-title">Service Not Found</h2>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          {/* Surgery Title */}
          <h2 className="section-title">{surgery.title}</h2>
          <p style={{ maxWidth: "800px", marginBottom: "30px", color: "#555" }}>
            {surgery.description}
          </p>

          {/* Doctors */}
          <h3 className="section-title" style={{ fontSize: "22px" }}>
            Available Doctors
          </h3>

          <div className="services-grid">
            {surgery.doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="service-card"
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{doctor.name}</h3>
                <p><b>{doctor.specialization}</b></p>
                <p>{doctor.experience}</p>
                <p>{doctor.hospital}</p>
                <p>⭐ {doctor.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
