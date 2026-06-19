// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import SpecialityModal from "../components/SpecialityModal";

import ayurvedaImg from "../components/Home/images/ayurveda.png";
import cardiologyImg from "../components/Home/images/Cardiology.jpg";
import gastrologyImg from "../components/Home/images/gastrology.png";
import oncologyImg from "../components/Home/images/Oncology.jpg";
import orthoImg from "../components/Home/images/ortho.jpg";
import pmrImg from "../components/Home/images/PMR.jpg";
import urologyImg from "../components/Home/images/urology.png";
import headNeckImg from "../components/Home/images/head_and_neck.png";

// Specialty Images replaced with local high-quality professional photos

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState({});
  const [activeDept, setActiveDept] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null); // Will store {name, img}

  const [scrolled, setScrolled] = useState(false);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const closeDropdown = () => setActiveDept(null);
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [i18n.language]);

  const translateDept = (name) => {
    return t(`depts.${name}`, name);
  };

  return (
    <div className="home-root">
      <Header />

      {/* ================= DYNAMIC DEPARTMENT BAR ================= */}
      <div className={`department-bar ${scrolled ? 'scrolled' : ''}`}>
        <div className="department-scroll">
          {Object.keys(menuData || {}).map((deptName) => (
            <div
              key={deptName}
              className={`dept-wrapper ${activeDept === deptName ? 'active' : ''}`}
              onMouseEnter={() => {
                if (window.innerWidth > 768) setActiveDept(deptName);
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 768) setActiveDept(null);
              }}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.stopPropagation();
                  setActiveDept(activeDept === deptName ? null : deptName);
                }
              }}
            >
              <span className="dept-item">
                {translateDept(deptName)}
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
          backgroundImage: `
linear-gradient(
  90deg,
  rgba(5, 30, 45, 0.9) 0%,
  rgba(5, 30, 45, 0.75) 35%,
  rgba(5, 30, 45, 0.4) 60%,
  rgba(5, 30, 45, 0.1) 100%
),
url(https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop)
`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div className="hero-aura-1"></div>
        <div className="container hero-container">
          <div className="hero-flex-layout">
            <div className="hero-text-content">
              <div className="hero-premium-pill">
                {t('hero.subtitle')}
              </div>
              <h1 dangerouslySetInnerHTML={{ __html: t('hero.title').replace('Kerala', `<span>${t('common.kerala', 'Kerala')}</span>`) }}></h1>
              <p>{t('hero.desc')}</p>

              <div className="hero-actions">
                <button className="btn-primary" onClick={() => navigate("/services")}>
                  <i className="calendar-icon">📅</i> {t('hero.plan_btn')}
                </button>
                <button className="btn-glass" onClick={() => navigate("/contact")}>
                  <i className="chat-icon">💬</i> {t('hero.talk_btn')}
                </button>
              </div>
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
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>{t('common.nabh', 'NABH ACCREDITED')}</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>{t('common.jci', 'JCI ACCREDITED')}</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>{t('common.iso', 'ISO CERTIFIED')}</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>{t('common.tourism', 'KERALA TOURISM')}</span>
          </div>
        </div>
      </div>

      <div className="kasavu-divider"></div>



      {/* ================= NEW EXPANSION SECTIONS ================= */}
      <CareStories />
      <ExpertOpinions />

      {/* ================= SPECIALITIES SECTION ================= */}
      <section className="specialities-section">
        <div className="container">
          <div className="section-head">
            <h2>{t('homepage.specialities_title')}</h2>
            <p>{t('homepage.specialities_desc')}</p>
          </div>

          <div className="specialities-grid">
            {Object.entries(menuData || {}).map(([deptName, deptData], index) => {
              const specialtyImages = {
                "Ayurveda": ayurvedaImg,
                "Cardiology": cardiologyImg,
                "Gastrology": gastrologyImg,
                "Gastroenterology": gastrologyImg,
                "Neurosurgery": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
                "Neurology": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
                "Oncology": oncologyImg,
                "Orthopedic": orthoImg,
                "Orthopedics": orthoImg,
                "PMR": pmrImg,
                "pmr": pmrImg,
                "Physiotherapy": pmrImg,
                "Urology": urologyImg,
                "urology": urologyImg,
                "Wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
                "ENT": headNeckImg,
                "Head and Neck": headNeckImg,
                "Head & Neck": headNeckImg,
                "Head and neck": headNeckImg,
                "Pediatrics": "https://images.unsplash.com/photo-1622907409477-742a12a514d2?auto=format&fit=crop&w=600&q=80",
              };

              const imgUrl = specialtyImages[deptName] || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={deptData._id}
                  className="speciality-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedDept({ name: deptName, img: imgUrl })}
                >
                  <img src={imgUrl} alt={deptName} />
                  <div className="speciality-overlay">
                    <div className="speciality-info">
                      <h3>{translateDept(deptName)}</h3>
                      <p>{t('homepage.treatments_count', { count: deptData.surgeries?.length || 0 })}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HospitalDemo />
      <DestinationsComparison />
      <CommonProcedures />
      <LowestQuotes />
      <NewsletterSignup />



      <Footer />

      {selectedDept && (
        <SpecialityModal
          deptName={selectedDept.name}
          deptData={menuData[selectedDept.name]}
          imgUrl={selectedDept.img}
          onClose={() => setSelectedDept(null)}
        />
      )}
    </div>
  );
}