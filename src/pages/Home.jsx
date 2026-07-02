// src/pages/Home.jsx

import React, { useState, useEffect, useRef } from "react";
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
import pediatricsImg from "../components/Home/images/Pediatrics.jpg";
import generalMedicineImg from "../components/Home/images/generalmedicine.jpg";
import gynecologyImg from "../components/Home/images/gynecology.jpg";
import nephrologyImg from "../components/Home/images/nephrology.jpg";
import ophthalmologyImg from "../components/Home/images/ophthalmology.jpg";
import orthospineImg from "../components/Home/images/orthospine.jpg";
import plasticSurgeryImg from "../components/Home/images/plasticsurgery.jpg";
import radiationImg from "../components/Home/images/radiation.jpg";
import radiologyImg from "../components/Home/images/radiology.jpg";
import hematologyImg from "../components/Home/images/heametology.jpg";

// Specialty Images replaced with local high-quality professional photos

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState({});
  const [activeDept, setActiveDept] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null); // Will store {name, img}
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  // Ref to debounce hover-close so the gap between label and dropdown doesn't dismiss it
  const closeTimerRef = useRef(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveDept(null);
    }, 120);
  };

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
      setActiveDept(null);
    };
    window.addEventListener("scroll", handleScroll);

    const closeDropdown = (e) => {
      // Only close when the click is outside the department bar area
      if (
        e.target.closest(".dept-wrapper") ||
        e.target.closest(".dept-dropdown")
      ) {
        return;
      }
      setActiveDept(null);
    };
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [i18n.language]);

  const translateDept = (name) => {
    return t(`depts.${name}`, name);
  };

  const handleShowDropdown = (e, deptName) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownCoords({
      top: rect.bottom,
      left: rect.left,
    });
    setActiveDept(deptName);
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
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  cancelClose();
                  handleShowDropdown(e, deptName);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 768) scheduleClose();
              }}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.stopPropagation();
                  if (activeDept === deptName) {
                    setActiveDept(null);
                  } else {
                    handleShowDropdown(e, deptName);
                  }
                }
              }}
            >
              <span className="dept-item">
                {translateDept(deptName)}
                <span className="arrow" style={{ marginLeft: '4px', opacity: 0.5 }}>▾</span>
              </span>

              {activeDept === deptName && menuData[deptName]?.surgeries && (
                <div
                  className="dept-dropdown"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "fixed",
                    top: `${dropdownCoords.top}px`,
                    left: `${dropdownCoords.left}px`,
                    marginTop: "8px"
                  }}
                >
                  {menuData[deptName].surgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="dept-item-child"
                      onClick={() => {
                        cancelClose();
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
                "Pediatrics": pediatricsImg,
                "Ophthalmology": ophthalmologyImg,
                "General Medicine": generalMedicineImg,
                "Nephrology": nephrologyImg,
                "Orthospine": orthospineImg,
                // Robotic Gynecology - all variants
                "Robotic gynecology": gynecologyImg,
                "Robotic Gynecology": gynecologyImg,
                "robotic gynecology": gynecologyImg,
                "Gynecology": gynecologyImg,
                "Gynaecology": gynecologyImg,
                "Robotic Gynaecology": gynecologyImg,
                "Robotic gynaecology": gynecologyImg,
                // Plastic Surgery
                "Plastic Surgery": plasticSurgeryImg,
                "Plastic surgery": plasticSurgeryImg,
                // Radiation / Radiation Oncology - all variants
                "Radiation Oncology": radiationImg,
                "Radiation oncology": radiationImg,
                "Radiation": radiationImg,
                "radiation": radiationImg,
                // Interventional Radiology / Radiology - all variants
                "Radiology": radiologyImg,
                "radiology": radiologyImg,
                "Interventional Radiology": radiologyImg,
                "Interventional radiology": radiologyImg,
                "interventional radiology": radiologyImg,
                // Haematology - all variants
                "Hematology": hematologyImg,
                "Haematology": hematologyImg,
                "haematology": hematologyImg,
                "Haemato Oncology": hematologyImg,
                "Haematology and Haemato Oncology": hematologyImg,
                "Haematology and Haemato oncology": hematologyImg,
                "Haematology & Haemato Oncology": hematologyImg,
                "Haemato-Oncology": hematologyImg,
              };
              // First try exact match, then case-insensitive partial match
              const exactMatch = specialtyImages[deptName];
              const looseMatch = !exactMatch
                ? Object.entries(specialtyImages).find(([key]) =>
                    deptName.toLowerCase().includes(key.toLowerCase()) ||
                    key.toLowerCase().includes(deptName.toLowerCase())
                  )?.[1]
                : null;
              const imgUrl = exactMatch || looseMatch || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80";

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