import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicHospitals } from "../api/api";
import "./styles/Hospitals.css";

const HospitalsSkeleton = () => (
  <div className="skeleton-grid">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="skeleton-hosp-card">
        <div className="skeleton-image shimmer-bg" />
        <div className="skeleton-content">
          <div className="skeleton-line title shimmer-bg" />
          <div className="skeleton-line subtitle shimmer-bg" />
          <div className="skeleton-pills-row">
            <div className="skeleton-pill-item shimmer-bg" />
            <div className="skeleton-pill-item shimmer-bg" />
            <div className="skeleton-pill-item shimmer-bg" />
          </div>
          <div className="skeleton-line bottom-btn shimmer-bg" />
        </div>
      </div>
    ))}
  </div>
);

export default function Hospitals() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchName, setSearchName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  useEffect(() => {
    document.title = "Hospitals | MedTour Kerala";

    const fetchAllHospitals = async () => {
      try {
        const res = await getPublicHospitals();
        setHospitalsList(res.data.hospitals || []);
      } catch (err) {
        console.error("Failed to load public hospitals list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllHospitals();
  }, [i18n.language]);

  // Extract unique cities and specialties for filter selects
  const uniqueCities = useMemo(() => {
    const set = new Set();
    hospitalsList.forEach(h => {
      if (h.city) set.add(h.city);
    });
    return Array.from(set).sort();
  }, [hospitalsList]);

  const uniqueSpecialties = useMemo(() => {
    const set = new Set();
    hospitalsList.forEach(h => {
      (h.specialties || []).forEach(spec => {
        if (spec.name) set.add(spec.name);
      });
    });
    return Array.from(set).sort();
  }, [hospitalsList]);

  // Filtered list
  const filteredHospitals = useMemo(() => {
    return hospitalsList.filter(h => {
      // 1. Search Name
      if (searchName && !h.hospitalName?.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      // 2. City
      if (selectedCity && h.city !== selectedCity) {
        return false;
      }
      // 3. Specialty
      if (selectedSpecialty && !h.specialties?.some(spec => spec.name === selectedSpecialty)) {
        return false;
      }
      return true;
    });
  }, [hospitalsList, searchName, selectedCity, selectedSpecialty]);

  return (
    <div className="hospitals-root">
      <Header />

      <div className="container">
        {/* Hero Section */}
        <section className="hospitals-hero">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discovery: <span>Top Rated Hospitals</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kerala's medical hub features infrastructure at par with Western standards. Explore our diamond-tier partners.
          </motion.p>
        </section>

        {/* Sticky Filters bar */}
        <div className="filters-sticky-bar">
          <div className="filters-wrapper">
            <div className="search-input-wrap">
              <span className="search-icon-inside">🔍</span>
              <input
                type="text"
                placeholder="Search by hospital name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
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
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {uniqueSpecialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <HospitalsSkeleton />
        ) : filteredHospitals.length === 0 ? (
          <motion.div
            className="hospitals-empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>No hospitals found.</h3>
            <p>Try changing your filters or searching for something else.</p>
          </motion.div>
        ) : (
          <motion.div
            className="hospitals-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredHospitals.map((hosp) => {
                const coverImage = hosp.photos?.[0]?.url || hosp.avatar || null;

                return (
                  <motion.div
                    key={hosp._id}
                    className="hospital-card-premium"
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.12)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="hospital-card-image-wrap">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={hosp.hospitalName}
                          className="hospital-cover-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="hospital-image-fallback">🏥</div>
                      )}
                      <div className="rating-badge">★ 4.9 Rating</div>
                    </div>

                    <div className="hospital-card-body">
                      <h2>{hosp.hospitalName}</h2>
                      <div className="hospital-location-row">
                        <span>📍</span> {hosp.city}, {hosp.country || "India"}
                      </div>

                      <div className="hospital-specialties-pills">
                        {(hosp.specialties || []).slice(0, 3).map((spec, idx) => (
                          <span key={spec._id || idx} className="specialty-pill-item">
                            {spec.name}
                          </span>
                        ))}
                        {hosp.specialties?.length > 3 && (
                          <span className="specialty-pill-item plus">
                            +{hosp.specialties.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="hospital-card-desc">
                        Premier medical facility offering world-class healthcare services.
                      </div>

                      <div className="hospital-card-actions">
                        <button
                          className="view-hospital-btn"
                          onClick={() => navigate(`/hospital/${hosp._id}`)}
                        >
                          View Full Hospital Profile
                        </button>
                      </div>
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
