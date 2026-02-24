// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { surgeryData } from "./data";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Home.css";
import "./styles/Services.css";
import { getPublicSurgeriesMenu } from "../api/api";
import HomepageEnquiryBox from "../components/HomepageEnquiryBox";
import CareStories from "../components/Home/CareStories";
import ExpertOpinions from "../components/Home/ExpertOpinions";
import HospitalDemo from "../components/Home/HospitalDemo";
import DestinationsComparison from "../components/Home/DestinationsComparison";
import CommonProcedures from "../components/Home/CommonProcedures";
import LowestQuotes from "../components/Home/LowestQuotes";
import NewsletterSignup from "../components/Home/NewsletterSignup";
import "./styles/HomeExpansion.css";
import heroBg from "../components/Home/images/background.png";

// Import Specialty Images
import ayurvedaImg from "../components/Home/images/ayurveda.png";
import cardiologyImg from "../components/Home/images/cardiology.png";
import gastrologyImg from "../components/Home/images/gastrology.png";
import headNeckImg from "../components/Home/images/head_and_neck.png";
import neurologyImg from "../components/Home/images/neurology.png";
import oncologyImg from "../components/Home/images/oncology.png";
import orthoImg from "../components/Home/images/ortho.png";
import pmrImg from "../components/Home/images/PMR.png";
import urologyImg from "../components/Home/images/urology.png";

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

    const closeDropdown = () => setActiveDept(null);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="home-root">
      <Header />

      {/* ================= DYNAMIC DEPARTMENT BAR ================= */}
      <div className="department-bar">
        <div className="department-scroll">
          {Object.keys(menuData || {}).map((deptName) => (
            <div
              key={deptName}
              className={`dept-wrapper ${activeDept === deptName ? 'active' : ''}`}
              onMouseEnter={() => {
                if (window.innerWidth > 1024) setActiveDept(deptName);
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 1024) setActiveDept(null);
              }}
              onClick={(e) => {
                if (window.innerWidth <= 1024) {
                  e.stopPropagation();
                  setActiveDept(activeDept === deptName ? null : deptName);
                }
              }}
            >
              <span className="dept-item">
                {deptName}
                <span className="arrow" style={{ marginLeft: '4px', opacity: 0.5 }}>▾</span>
              </span>

              {activeDept === deptName && menuData[deptName]?.surgeries && (
                <div className="dept-dropdown" onClick={(e) => e.stopPropagation()}>
                  {menuData[deptName].surgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="dept-item-child"
                      onClick={() => {
                        setActiveDept(null);
                        navigate("/services", {
                          state: {
                            specialtyId: menuData[deptName]._id,
                            specialtyName: deptName,
                            preSelectedSurgery: { _id: surgery.id, surgeryName: surgery.name }
                          }
                        });
                      }}
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

      {/* ================= HERO SECTION ================= */}
      <section
        className="hero-wrapper"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div className="hero-aura-1"></div>
        <div className="container hero-container">
          <div className="hero-flex-layout">
            <div className="hero-text-content">
              <div className="hero-tagline">
                <span className="dot"></span>
                Kerala's #1 Medical Travel Platform
              </div>
              <h1>
                Global Healthcare, <br />
                <span>Rooted in Kerala</span>
              </h1>
            </div>

            <div className="hero-form-content">
              <div className="hero-enquiry-wrapper">
                <HomepageEnquiryBox />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KERALA BRAND BAR ================= */}
      <div className="brand-bar">
        <div className="container">
          <div className="brand-scroll">
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>NABH ACCREDITED</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>JCI ACCREDITED</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>ISO CERTIFIED</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>KERALA TOURISM</span>
          </div>
        </div>
      </div>

      <div className="kasavu-divider"></div>

      {/* ================= FEATURES SECTION ================= */}
      <section className="container" style={{ padding: '120px 0 0' }}>
        <div className="section-head">
          <h2>Redefining Medical Care</h2>
          <p>We provide a seamless journey from consultation to full recovery.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-box">👨‍⚕️</div>
            <h3>Expert Specialists</h3>
            <p>Access the top 1% of surgeons and medical practitioners in Kerala, handpicked for your specific needs.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">🛡️</div>
            <h3>End-to-End Support</h3>
            <p>From visa assistance to post-surgery rehabilitation, our dedicated PAs handle everything for you.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">🌿</div>
            <h3>Ayurvedic Healing</h3>
            <p>Complement your modern surgical treatment with traditional Ayurvedic recovery protocols in serene resorts.</p>
          </div>
        </div>
      </section>

      {/* ================= SPECIALITIES SECTION ================= */}
      <section className="specialities-section">
        <div className="container">
          <div className="section-head">
            <h2>Our Specialities</h2>
            <p>World-class expertise across multiple medical disciplines.</p>
          </div>

          <div className="specialities-grid">
            {Object.entries(menuData || {}).map(([deptName, deptData]) => {
              const specialtyImages = {
                "Ayurveda": ayurvedaImg,
                "Cardiology": cardiologyImg,
                "Gastroenterology": gastrologyImg,
                "Gastrology": gastrologyImg,
                "Neurology": neurologyImg,
                "Neurosurgery": neurologyImg,
                "Oncology": oncologyImg,
                "Orthopedics": orthoImg,
                "Orthopedic": orthoImg,
                "PMR": pmrImg,
                "Physiotherapy": pmrImg,
                "Pediatrics": "https://images.unsplash.com/photo-1622907409477-742a12a514d2?auto=format&fit=crop&w=600&q=80",
                "Urology": urologyImg,
                "ENT": headNeckImg,
                "Head and Neck": headNeckImg,
                "Head & Neck": headNeckImg,
                "Ophthalmology": "https://images.unsplash.com/photo-1580256081112-e49377338b7f?auto=format&fit=crop&w=600&q=80",
                "Dentistry": "https://images.unsplash.com/photo-1588776814546-1ffcf4722e99?auto=format&fit=crop&w=600&q=80",
                "Gynecology": "https://images.unsplash.com/photo-1516574187841-693018f54744?auto=format&fit=crop&w=600&q=80",
                "General Surgery": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80",
                "Dermatology": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80"
              };

              const imgUrl = specialtyImages[deptName] || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={deptData._id}
                  className="speciality-card"
                  onClick={() =>
                    navigate("/services", {
                      state: {
                        specialtyId: deptData._id,
                        specialtyName: deptName,
                      }
                    })
                  }
                >
                  <img src={imgUrl} alt={deptName} />
                  <div className="speciality-overlay">
                    <div className="speciality-info">
                      <h3>{deptName}</h3>
                      <p>{deptData.surgeries?.length || 0} Treatments</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TRUST BANNER ================= */}
      <section className="container">
        <div className="trust-banner">
          <h2>"Excellence is not a skill, it is an attitude. <br /> In Kerala, it's our heritage."</h2>
          <p style={{ opacity: 0.8, fontSize: '18px' }}>— Trusted by 10,000+ International Patients</p>
        </div>
      </section>

      {/* ================= NEW EXPANSION SECTIONS ================= */}
      <CareStories />
      <ExpertOpinions />
      <HospitalDemo />
      <DestinationsComparison />
      <CommonProcedures />
      <LowestQuotes />
      <NewsletterSignup />



      <Footer />
    </div>
  );
}