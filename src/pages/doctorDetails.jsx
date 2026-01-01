import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/Home.css";
import { surgeryData } from "./data";

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // Find doctor across all services
  const doctor = surgeryData
    .flatMap((service) => service.doctors)
    .find((doc) => doc.id === doctorId);

  if (!doctor) {
    return (
      <div className="home-root">
        <section className="services-section">
          <div className="container">
            <h2 className="section-title">Doctor Not Found</h2>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          {/* Doctor Header */}
          <h2 className="section-title">{doctor.name}</h2>

          <div className="service-card" style={{ maxWidth: "700px" }}>
            <p><b>Specialization:</b> {doctor.specialization}</p>
            <p><b>Experience:</b> {doctor.experience}</p>
            <p><b>Qualifications:</b> {doctor.qualifications}</p>
            <p><b>Hospital:</b> {doctor.hospital}</p>
            <p><b>Rating:</b> ⭐ {doctor.rating}</p>
            <p><b>Availability:</b> {doctor.availability}</p>

            <p style={{ marginTop: "15px", color: "#555" }}>
              {doctor.about}
            </p>

            {/* Actions */}
            <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
              <button
                className="service-card"
                style={{
                  background: "#0077cc",
                  color: "#fff",
                  cursor: "pointer",
                  border: "none",
                  padding: "10px 18px",
                }}
                onClick={() => alert("Appointment booking coming soon")}
              >
                Book Appointment
              </button>

              <button
                className="service-card"
                style={{
                  background: "#f1f5f9",
                  cursor: "pointer",
                  border: "none",
                  padding: "10px 18px",
                }}
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
