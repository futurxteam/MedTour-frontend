// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { surgeryData } from "./data"; // ✅ Import real data
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Home.css";
import "./styles/Services.css";
import heroDoctor from "../assets/hero-doctor.png";
import { getPublicSurgeriesMenu } from "../api/api";
import HomepageEnquiryBox from "../components/HomepageEnquiryBox";
// ✅ Dynamic departments with sub-items (common conditions/treatments)


export default function Home() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState({});
  const [activeDept, setActiveDept] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await getPublicSurgeriesMenu();
        setMenuData(res.data);
      } catch (err) {
        console.error("Failed to load menu", err);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <>
      <Header />

      {/* ================= DYNAMIC DEPARTMENT BAR ================= */}
      <div className="department-bar">
        <div className="department-scroll">
          {Object.keys(menuData || {}).map((deptName) => (
            <div
              key={deptName}
              className="dept-wrapper"
              onMouseEnter={() => setActiveDept(deptName)}
              onMouseLeave={() => setActiveDept(null)}
            >
              <span className="dept-item" style={{ cursor: "pointer" }}>
                {deptName}
                <span className="arrow">▾</span>
              </span>

              {activeDept === deptName && menuData[deptName]?.surgeries && (
                <div className="dept-dropdown">
                  {menuData[deptName].surgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="dept-item-child"
                      onClick={() =>
                        navigate("/services", {
                          state: {
                            specialtyId: menuData[deptName]._id,
                            specialtyName: deptName,
                            preSelectedSurgery: { _id: surgery.id, surgeryName: surgery.name }
                          }
                        })
                      }
                    >
                      {surgery.name}
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
              Kerala's Most Trusted Medical Travel Assistance Platform
            </p>

            {/* Social proof icons/stats shown in image could go here */}
            <div className="hero-stats">
              <div className="stats-images">
                <img src="https://i.pravatar.cc/40?img=1" alt="p1" />
                <img src="https://i.pravatar.cc/40?img=2" alt="p2" />
                <img src="https://i.pravatar.cc/40?img=3" alt="p3" />
                <img src="https://i.pravatar.cc/40?img=4" alt="p4" />
                <img src="https://i.pravatar.cc/40?img=5" alt="p5" />
              </div>
              <div className="stats-text">
                <b>10,000+</b> Patients Assisted Since 2016
              </div>
            </div>

            <div className="hero-rating">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" className="google-logo" />
              <span className="rating-score">4.7</span>
              <span className="rating-stars">★★★★★</span>
            </div>
          </div>

          <div className="hero-form-container">
            <HomepageEnquiryBox />
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
              <p>Clear guidance on procedures and recovery — so you can decide without pressure or confusion.</p>
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