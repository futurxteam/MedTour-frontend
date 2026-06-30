// src/pages/Doctors.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicDoctors, getDoctorPhotoUrl } from "../api/api";
import "./styles/Doctors.css";
import "./styles/DoctorsSkeleton.css";

const DoctorsSkeleton = () => (
  <div className="skeleton-grid">
    {Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="skeleton-doc-card">
        <div className="skeleton-row-top">
          <div className="skeleton-avatar-circle shimmer-bg" />
          <div className="skeleton-pill-badge shimmer-bg" />
        </div>
        <div className="skeleton-line title shimmer-bg" />
        <div className="skeleton-line subtitle shimmer-bg" />
        <div className="skeleton-line hosp shimmer-bg" />
        <div className="skeleton-pills-row">
          <div className="skeleton-pill-item shimmer-bg" />
          <div className="skeleton-pill-item shimmer-bg" />
          <div className="skeleton-pill-item shimmer-bg" />
        </div>
        <div className="skeleton-line bottom-lang shimmer-bg" />
      </div>
    ))}
  </div>
);

export default function Doctors() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter conditions states
  const [searchName, setSearchName] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [experienceLimit, setExperienceLimit] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    document.title = "Doctors | MedTour Kerala";

    const fetchAllDoctors = async () => {
      try {
        const res = await getPublicDoctors();
        setDoctorsList(res.data || []);
      } catch (err) {
        console.error("Failed to load public doctors list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDoctors();
  }, [i18n.language]);

  // Extract unique hospital names and specialties for select dropdowns
  const uniqueHospitals = useMemo(() => {
    const set = new Set();
    doctorsList.forEach(d => {
      if (d.hospital?.hospitalName?.en) {
        set.add(d.hospital.hospitalName.en);
      }
    });
    return Array.from(set).sort();
  }, [doctorsList]);

  const uniqueSpecialties = useMemo(() => {
    const set = new Set();
    doctorsList.forEach(d => {
      (d.specialties || []).forEach(spec => {
        if (spec.name?.en) set.add(spec.name.en);
      });
    });
    return Array.from(set).sort();
  }, [doctorsList]);

  const uniqueCities = useMemo(() => {
    const set = new Set();
    doctorsList.forEach(d => {
      if (d.city) set.add(d.city);
    });
    return Array.from(set).sort();
  }, [doctorsList]);

  // Memoized filter results
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      // 1. Name search
      if (searchName && !doc.fullName?.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      // 2. Hospital filter
      if (selectedHospital && doc.hospital?.hospitalName?.en !== selectedHospital) {
        return false;
      }
      // 3. Specialty filter
      if (selectedSpecialty && !doc.specialties?.some(s => s.name?.en === selectedSpecialty)) {
        return false;
      }
      // 4. City filter
      if (selectedCity && doc.city !== selectedCity) {
        return false;
      }
      // 5. Experience years filter
      if (experienceLimit) {
        const expNum = parseInt(experienceLimit, 10);
        if (doc.experienceYears < expNum) {
          return false;
        }
      }
      return true;
    });
  }, [doctorsList, searchName, selectedHospital, selectedSpecialty, selectedCity, experienceLimit]);

  return (
    <div className="doctors-root">
      <Header />

      <div className="container">
        {/* Hero Section */}
        <section className="doctors-hero">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our <span>Medical Experts</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with internationally experienced specialists across Kerala's leading hospitals.
          </motion.p>
        </section>

        {/* Sticky Filters bar */}
        <div className="filters-sticky-bar">
          <div className="filters-wrapper">
            <div className="search-input-wrap">
              <span className="search-icon-inside">🔍</span>
              <input
                type="text"
                placeholder="Search by doctor name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="filter-select-wrap">
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
              >
                <option value="">All Hospitals</option>
                {uniqueHospitals.map(hosp => (
                  <option key={hosp} value={hosp}>{hosp}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {uniqueSpecialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                value={experienceLimit}
                onChange={(e) => setExperienceLimit(e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Grid / Empty State */}
        {loading ? (
          <DoctorsSkeleton />
        ) : filteredDoctors.length === 0 ? (
          <motion.div
            className="doctors-empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>No doctors found.</h3>
            <p>Try changing your filters or searching for something else.</p>
          </motion.div>
        ) : (
          <motion.div
            className="doctors-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doc) => {
                const docName = doc.fullName;
                const hospitalNameResolved = doc.hospital ? (doc.hospital.hospitalName[i18n.language] || doc.hospital.hospitalName.en) : "";

                return (
                  <motion.div
                    key={doc._id}
                    className="doctor-card-premium"
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(13, 148, 136, 0.12)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="card-top-flex">
                      <div className="avatar-wrapper-circle">
                        {doc.avatar ? (
                          <img
                            src={getDoctorPhotoUrl(doc._id)}
                            alt={docName}
                            loading="lazy"
                          />
                        ) : (
                          <div className="avatar-fallback">👤</div>
                        )}
                      </div>
                      <button
                        className="book-badge-btn"
                        onClick={() => navigate(`/book/doctor/${doc._id}`)}
                      >
                        Book
                      </button>
                    </div>

                    <div className="doc-meta-info">
                      <h2>{docName}</h2>
                      <p className="designation">{doc.designation}</p>
                      
                      {hospitalNameResolved && (
                        <div className="hospital-tag-line">
                          <span>🏥</span> {hospitalNameResolved}
                        </div>
                      )}
                    </div>

                    <div className="specialty-pills-wrap">
                      {(doc.specialties || []).slice(0, 3).map((spec, idx) => (
                        <span key={spec._id || idx} className="specialty-pill-item">
                          {spec.name[i18n.language] || spec.name.en}
                        </span>
                      ))}
                      {doc.specialties?.length > 3 && (
                        <span className="specialty-pill-item plus">
                          +{doc.specialties.length - 3} more
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 700, marginBottom: "16px" }}>
                      🎓 {doc.experienceYears} Years Experience
                    </div>

                    <div className="lang-tags-flex">
                      {(doc.languages || []).map((lang, idx) => (
                        <span key={idx} className="lang-tag-item">
                          {lang}
                        </span>
                      ))}
                    </div>

                    <div className="card-actions-bottom">
                      <button
                        className="view-profile-btn-premium"
                        onClick={() => navigate(`/doctor/${doc._id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
