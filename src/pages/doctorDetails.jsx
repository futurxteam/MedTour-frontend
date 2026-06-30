import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicDoctorById, getDoctorPhotoUrl } from "../api/api";
import "./styles/DoctorProfile.css";

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocProfile = async () => {
      try {
        setLoading(true);
        const res = await getPublicDoctorById(doctorId);
        setDoctor(res.data.doctor);
        setRelatedDoctors(res.data.relatedDoctors || []);
        if (res.data.doctor) {
          document.title = `${res.data.doctor.name} | MedTour Kerala`;
        }
      } catch (err) {
        console.error("Failed to load doctor profile details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocProfile();
  }, [doctorId, i18n.language]);

  if (loading) {
    return (
      <div className="doctor-profile-root">
        <Header />
        <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
          <div className="loader-spinner"></div>
          <h2>Loading Specialist Profile...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-root">
        <Header />
        <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
          <h2>Doctor Profile Not Found</h2>
          <button onClick={() => navigate("/doctors")} className="view-profile-btn-premium" style={{ width: "auto", marginTop: "20px" }}>
            Back to Doctors Directory
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="doctor-profile-root">
      <Header />

      <div className="container">
        {/* Profile Hero Header */}
        <div className="profile-hero-section">
          <div className="hero-aura-light" />
          <div className="profile-hero-grid">
            <div className="profile-avatar-hero-container">
              {doctor.hasPhoto ? (
                <img src={getDoctorPhotoUrl(doctor._id)} alt={doctor.name} />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
            </div>

            <div className="profile-main-meta">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {doctor.name}
              </motion.h1>
              <span className="designation">{doctor.designation}</span>

              <div className="meta-badges-row">
                <span className="meta-badge-tag highlight">🎓 {doctor.experience} Years Experience</span>
                <span className="meta-badge-tag accent">💰 Consultation: ₹{doctor.consultationFee}</span>
              </div>

              <div className="profile-actions-hero">
                <button
                  className="book-badge-btn"
                  onClick={() => navigate(`/book/doctor/${doctor._id}`)}
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                >
                  Book Consultation
                </button>
                <button
                  className="view-profile-btn-premium"
                  onClick={() => navigate("/doctors")}
                  style={{ padding: "14px 32px", fontSize: "1rem", background: "rgba(255,255,255,0.05)", color: "white", borderColor: "rgba(255,255,255,0.2)" }}
                >
                  Back to Directory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed profile layout columns */}
        <div className="profile-content-columns-grid">
          {/* Main Info */}
          <div>
            <div className="profile-card-section-box">
              <h2>Biography</h2>
              <p>{doctor.bio}</p>
            </div>

            <div className="profile-card-section-box">
              <h2>Education & Training</h2>
              <ul className="icon-bullets-list">
                {(doctor.education || []).map((edu, idx) => (
                  <li key={idx}>
                    <span className="bullet-icon">🎓</span> {edu}
                  </li>
                ))}
              </ul>
            </div>

            <div className="profile-card-section-box">
              <h2>Areas of Expertise</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                {(doctor.specialties || []).map((spec, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "10px 24px",
                      background: "#f0fdfa",
                      borderRadius: "100px",
                      fontWeight: 700,
                      color: "#0d9488",
                      fontSize: "0.9rem",
                      border: "1px solid rgba(13, 148, 136, 0.15)"
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {doctor.surgeries?.length > 0 && (
              <div className="profile-card-section-box">
                <h2>Available Surgeries & Operations</h2>
                <ul className="icon-bullets-list">
                  {doctor.surgeries.map((surg, idx) => (
                    <li key={idx}>
                      <span className="bullet-icon">⚡</span> {surg}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.awards?.length > 0 && (
              <div className="profile-card-section-box">
                <h2>Awards & Recognition</h2>
                <ul className="icon-bullets-list">
                  {doctor.awards.map((award, idx) => (
                    <li key={idx}>
                      <span className="bullet-icon">🏆</span> {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.memberships?.length > 0 && (
              <div className="profile-card-section-box">
                <h2>Professional Memberships</h2>
                <ul className="icon-bullets-list">
                  {doctor.memberships.map((member, idx) => (
                    <li key={idx}>
                      <span className="bullet-icon">🤝</span> {member}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky-profile-sidebar">
              {doctor.hospital && (
                <div className="hospital-details-card">
                  <h3>Hospital Information</h3>
                  <div className="hospital-mini-info-flex">
                    <div style={{ fontSize: "2rem" }}>🏥</div>
                    <div className="hospital-meta-text">
                      <h4>{doctor.hospital.name}</h4>
                      <p>📍 {doctor.hospital.city}, {doctor.hospital.country}</p>
                    </div>
                  </div>
                  <button
                    className="view-profile-btn-premium"
                    style={{ marginTop: "24px", width: "100%" }}
                    onClick={() => navigate(`/hospital/${doctor.hospital._id}`)}
                  >
                    View Hospital Profile
                  </button>
                </div>
              )}

              <div className="hospital-details-card">
                <h3>Languages Spoken</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                  {(doctor.languages || []).map((lang, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "6px 16px",
                        background: "#f1f5f9",
                        borderRadius: "8px",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "0.85rem",
                        border: "1px solid #cbd5e1"
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {relatedDoctors.length > 0 && (
                <div className="hospital-details-card">
                  <h3>Related Doctors</h3>
                  <div className="related-docs-list" style={{ marginTop: "16px" }}>
                    {relatedDoctors.map((relDoc) => (
                      <div
                        key={relDoc._id}
                        className="related-doc-mini-card"
                        onClick={() => navigate(`/doctor/${relDoc._id}`)}
                      >
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <div className="related-avatar-circle">
                            {relDoc.hasPhoto ? (
                              <img src={getDoctorPhotoUrl(relDoc._id)} alt={relDoc.name} />
                            ) : (
                              <span>👤</span>
                            )}
                          </div>
                          <div className="related-doc-details">
                            <h4>{relDoc.name}</h4>
                            <p>{relDoc.designation}</p>
                          </div>
                        </div>
                        <span style={{ color: "#0d9488", fontWeight: "bold" }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

