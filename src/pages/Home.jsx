// src/pages/Home.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { surgeryData } from "./data"; // ✅ Import real data
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Home.css";
import heroDoctor from "../assets/hero-doctor.png";

// ✅ Dynamic departments with sub-items (common conditions/treatments)
const departments = [
  {
    name: "Proctology",
    id: "proctology",
    items: ["Piles (Hemorrhoids)", "Anal Fissure", "Anal Fistula", "Pilonidal Sinus"],
  },
  {
    name: "Laparoscopy",
    id: "laparoscopy",
    items: ["Hernia Repair", "Gallbladder Removal", "Appendectomy", "Hiatal Hernia"],
  },
  {
    name: "Gynaecology",
    id: "gynaecology",
    items: ["Hysterectomy", "Fibroid Removal", "Ovarian Cysts", "Endometriosis"],
  },
  {
    name: "ENT",
    id: "ent",
    items: ["Sinus Surgery (FESS)", "Tonsillectomy", "Septoplasty", "Tympanoplasty"],
  },
  {
    name: "Urology",
    id: "urology",
    items: ["Kidney Stones (PCNL/URS)", "Prostate Surgery (TURP)", "Bladder Tumors", "Vasectomy"],
  },
  {
    name: "Vascular",
    id: "vascular",
    items: ["Varicose Veins", "Deep Vein Thrombosis", "Aneurysm Repair", "Peripheral Bypass"],
  },
  {
    name: "Aesthetics",
    id: "aesthetics",
    items: ["Liposuction", "Rhinoplasty", "Breast Augmentation", "Facelift"],
  },
  {
    name: "Orthopedics",
    id: "orthopedics",
    items: ["Knee Replacement", "Hip Replacement", "ACL Reconstruction", "Spine Surgery"],
  },
  {
    name: "Ophthalmology",
    id: "ophthalmology",
    items: ["Cataract Surgery", "LASIK", "Glaucoma Treatment", "Retina Surgery"],
  },
  {
    name: "Fertility",
    id: "fertility",
    items: ["IVF", "IUI", "ICSI", "Egg Freezing", "Male Infertility"],
  },
  {
    name: "Weight Loss",
    id: "weight-loss",
    items: ["Gastric Sleeve", "Gastric Bypass", "Gastric Balloon", "Revisional Surgery"],
  },
  {
    name: "Dermatology",
    id: "dermatology",
    items: ["Acne Treatment", "Skin Cancer Removal", "Laser Therapy", "Hair Restoration"],
  },
];

export default function Home() {
  const [activeDept, setActiveDept] = useState(null);
  const navigate = useNavigate();

  const handleDeptClick = (id) => {
    navigate(`/surgery/${id}`);
  };

  return (
    <>
      <Header />

      {/* ================= DYNAMIC DEPARTMENT BAR ================= */}
      <div className="department-bar">
        <div className="department-scroll">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="dept-wrapper"
              onMouseEnter={() => setActiveDept(dept.name)}
              onMouseLeave={() => setActiveDept(null)}
            >
              <span
                className="dept-item"
                onClick={() => handleDeptClick(dept.id)}
                style={{ cursor: "pointer" }}
              >
                {dept.name}
                <span className="arrow">▾</span>
              </span>

              {activeDept === dept.name && (
                <div className="dept-dropdown">
                  {dept.items.map((item) => (
                    <div
                      key={item}
                      className="dept-item-child"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating when clicking sub-item
                        handleDeptClick(dept.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="hero-section kerala-hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              Rooted in Kerala.
              <br />
              Built for Your Well-Being.
            </h1>
            <p>
              Trusted doctors. Transparent care.
              Modern medicine with Kerala’s compassion.
            </p>
            <div className="hero-actions">
              <button className="primary-btn">Consult a Doctor</button>
              <button className="secondary-btn">Explore Treatments</button>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your Home page (Specialities, Services, etc.) remains unchanged */}
      {/* You can keep the Specialities section as previously updated or this one */}

      {/* Example: Keep your updated Specialities section here */}
      <section className="departments-section specialities-section">
        <div className="specialities-overlay"></div>
        <div className="container specialities-content">
          <h2 className="section-title">Our Specialities</h2>
          <div className="departments-grid">
            {surgeryData.map((service) => (
              <div
                key={service.id}
                className="dept-card"
                onClick={() => navigate(`/surgery/${service.id}`)}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
                }}
              >
                <div className="dept-info">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services, Trust, Dashboard Access sections remain the same */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Care designed around you</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Doctor Consultations</h3>
              <p>Talk to experienced doctors who listen carefully, explain patiently, and guide you honestly.</p>
            </div>
            <div className="service-card">
              <h3>Surgeries & Treatments</h3>
              <p>Clear guidance on procedures, costs, and recovery — so you can decide without pressure or confusion.</p>
            </div>
            <div className="service-card">
              <h3>Diagnostics & Ongoing Care</h3>
              <p>From accurate tests to long-term follow-ups, we help you stay informed and supported.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container trust-box">
          <p>Trusted by patients who value clarity, compassion, and honest medical guidance.</p>
        </div>
      </section>

      <section className="dashboard-access">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div className="dashboard-access-grid">
            <a href="/dashboard/user" className="dashboard-access-card">
              <h3>User Dashboard</h3>
              <p>View appointments, treatments, and medical history</p>
            </a>
            <a href="/dashboard/doctor" className="dashboard-access-card">
              <h3>Doctor Dashboard</h3>
              <p>Manage patients, schedules, and consultations</p>
            </a>
            <a href="/dashboard/pa" className="dashboard-access-card">
              <h3>PA Dashboard</h3>
              <p>Assist patients and coordinate medical services</p>
            </a>
            <a href="/dashboard/admin" className="dashboard-access-card">
              <h3>Admin Dashboard</h3>
              <p>Control platform data, users, and operations</p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}