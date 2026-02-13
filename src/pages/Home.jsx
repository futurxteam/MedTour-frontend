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
    <div className="home-root">
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
              <span className="dept-item">
                {deptName}
                <span className="arrow" style={{ marginLeft: '4px', opacity: 0.5 }}>▾</span>
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

      {/* ================= HERO SECTION ================= */}
      <section className="hero-wrapper">
        <div className="hero-aura-1"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-tagline">
              <span className="dot"></span>
              Kerala's #1 Medical Travel Platform
            </div>
            <h1>
              Global Healthcare, <br />
              <span>Rooted in Kerala</span>
            </h1>
            <p>
              Experience world-class medical treatments blended with the healing serenity of God's Own Country. We bridge the gap between you and excellence.
            </p>

            <div className="hero-enquiry-wrapper">
              <HomepageEnquiryBox />
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
            {Object.entries(menuData || {}).slice(0, 6).map(([deptName, deptData], index) => (
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
                {/* Dynamic Unsplash images for high quality */}
                <img src={`https://images.unsplash.com/photo-${index === 0 ? '1576091160550-217359f4ecf8' : index === 1 ? '1631815589968-fdb09a223b1e' : index === 2 ? '1579684385127-1ef15d508118' : index === 3 ? '1599443015574-be5fe8a05783' : index === 4 ? '1551601651-2a8555f1a136' : '1584362917165-526a968579e8'}?auto=format&fit=crop&w=600&q=80`} alt={deptName} />
                <div className="speciality-overlay">
                  <h3>{deptName}</h3>
                  <p>{deptData.surgeries?.length || 0} Treatments Available</p>
                </div>
              </div>
            ))}
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

      {/* ================= QUICK ACCESS / DASHBOARDS ================= */}
      <section className="container">
        <div className="section-head">
          <h2>Platform Portals</h2>
          <p>Seamless access for every stakeholder in the healthcare ecosystem.</p>
        </div>

        <div className="dashboard-grid">
          <a href="/dashboard/user" className="access-card">
            <h3>Patients Portal</h3>
            <p>Track your medical journey and reports.</p>
          </a>
          <a href="/dashboard/doctor" className="access-card">
            <h3>Doctor's Desk</h3>
            <p>Manage consultations and surgeries.</p>
          </a>
          <a href="/dashboard/pa" className="access-card">
            <h3>Assistant Hub</h3>
            <p>Coordinate patient travels and care.</p>
          </a>
          <a href="/dashboard/admin" className="access-card">
            <h3>Admin Control</h3>
            <p>Oversee platform operations and security.</p>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}