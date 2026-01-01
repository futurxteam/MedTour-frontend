import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Home.css";
import heroDoctor from "../assets/hero-doctor.png";

const departments = [
  {
    name: "Proctology",
    items: ["Piles", "Fissure", "Fistula", "Pilonidal Sinus"],
  },
  {
    name: "Laparoscopy",
    items: ["Hernia", "Appendix", "Gallstones"],
  },
  {
    name: "Gynaecology",
    items: ["PCOS", "Fibroids", "Pregnancy Care"],
  },
  {
    name: "ENT",
    items: ["Sinus", "Tonsils", "Ear Infection"],
  },
  {
    name: "Urology",
    items: ["Kidney Stones", "Enlarged Prostate"],
  },
  {
    name: "Orthopedics",
    items: ["Knee Replacement", "ACL Tear", "Shoulder Pain"],
  },
  {
    name: "Aesthetics",
    items: ["Hair Transplant", "Laser Hair Removal"],
  },
  {
    name: "Fertility",
    items: ["IVF", "IVF ICSI"],
  },
];

export default function Home() {
  const [activeDept, setActiveDept] = useState(null);

  return (
    <>
      <Header />

      {/* ================= DEPARTMENT BAR ================= */}
      <div className="department-bar">
        <div className="department-scroll">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className="dept-wrapper"
              onMouseEnter={() => setActiveDept(dept.name)}
              onMouseLeave={() => setActiveDept(null)}
            >
              <span className="dept-item">
                {dept.name}
                <span className="arrow">▾</span>
              </span>

              {activeDept === dept.name && (
                <div className="dept-dropdown">
                  {dept.items.map((item) => (
                    <div key={item} className="dept-item-child">
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
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              Healthcare that treats you like a person,
              <br />
              not a case number.
            </h1>

            <p>
              Speak to trusted doctors, understand your options clearly,
              and make confident healthcare decisions with transparency
              and care.
            </p>

            <button className="primary-btn">
              Talk to a doctor
            </button>
          </div>

          <div className="hero-image">
            <img
              src={heroDoctor}
              alt="Doctor speaking empathetically with patient"
            />
          </div>
        </div>
      </section>

      {/* ================= DEPARTMENTS ================= */}
<section className="departments-section">
  <div className="container">
    <h2 className="section-title">Our Specialities</h2>

    <div className="departments-grid">
      {[
        {
          title: "Proctology",
          desc: "Specialised & advanced treatment for anorectal diseases.",
          img: "/images/proctology.jpg",
        },
        {
          title: "Laparoscopy",
          desc: "Keyhole surgery for abdominal and pelvic disorders.",
          img: "/images/laparoscopy.jpg",
        },
        {
          title: "Gynaecology",
          desc: "Treatment of diseases related to female reproductive organs.",
          img: "/images/gynaecology.jpg",
        },
        {
          title: "ENT",
          desc: "Treatment of ear, nose and throat disorders.",
          img: "/images/ent.jpg",
        },
        {
          title: "Urology",
          desc: "Surgical care for urinary and kidney problems.",
          img: "/images/urology.jpg",
        },
        {
          title: "Orthopedics",
          desc: "Bone, joint and musculoskeletal treatments.",
          img: "/images/orthopedics.jpg",
        },
        {
          title: "Aesthetics",
          desc: "Cosmetic and reconstructive procedures.",
          img: "/images/aesthetics.jpg",
        },
        {
          title: "Fertility",
          desc: "Advanced fertility & IVF treatments.",
          img: "/images/fertility.jpg",
        },
      ].map((item, index) => (
        <div className="dept-card" key={index}>
          <img src={item.img} alt={item.title} />
          <div className="dept-info">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* ================= SERVICES ================= */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Care designed around you</h2>

          <div className="services-grid">
            <div className="service-card">
              <h3>Doctor Consultations</h3>
              <p>
                Talk to experienced doctors who listen carefully,
                explain patiently, and guide you honestly.
              </p>
            </div>

            <div className="service-card">
              <h3>Surgeries & Treatments</h3>
              <p>
                Clear guidance on procedures, costs, and recovery —
                so you can decide without pressure or confusion.
              </p>
            </div>

            <div className="service-card">
              <h3>Diagnostics & Ongoing Care</h3>
              <p>
                From accurate tests to long-term follow-ups,
                we help you stay informed and supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="trust-section">
        <div className="container trust-box">
          <p>
            Trusted by patients who value clarity, compassion,
            and honest medical guidance.
          </p>
        </div>
      </section>
      {/* ================= DASHBOARD ACCESS ================= */}
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
