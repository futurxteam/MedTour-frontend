import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Home.css";
import "./styles/Services.css";
import Avatar from "../components/Avatar";

import {
  getPublicSurgeriesMenu,
  getPublicSurgeriesBySpecialty,
  getPublicDoctorsBySurgery,
} from "../api/api";

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ===========================
     STATE
  =========================== */
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [surgeries, setSurgeries] = useState([]);

  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [selectedPart, setSelectedPart] = useState(null);

  /* ===========================
     FETCH SPECIALTIES (PUBLIC)
  =========================== */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getPublicSurgeriesMenu();
        setMenuData(res.data || {});
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /* ===========================
     HANDLE INCOMING STATE (NAV)
  =========================== */
  useEffect(() => {
    if (location.state?.specialtyId) {
      handleSpecialtyClick(location.state.specialtyId, location.state.specialtyName);

      if (location.state.preSelectedSurgery) {
        handleSurgeryClick(location.state.preSelectedSurgery);
      }
    }
  }, [location.state]);

  /* ===========================
     HANDLERS
  =========================== */
  const handleSpecialtyClick = async (specialtyId, specialtyName) => {
    setSelectedSpecialty({ id: specialtyId, name: specialtyName });
    setSelectedSurgery(null);
    setDoctors([]);
    setSurgeries([]);

    try {
      const res = await getPublicSurgeriesBySpecialty(specialtyId);
      setSurgeries(res.data.surgeries || []);
    } catch (err) {
      console.error("Failed to load surgeries", err);
    }
  };

  const handleSurgeryClick = async (surgery) => {
    setSelectedSurgery(surgery);
    setDoctors([]);

    try {
      const res = await getPublicDoctorsBySurgery(surgery._id);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("Failed to load doctors", err);
    }
  };

  const handleBack = () => {
    if (selectedSurgery) {
      setSelectedSurgery(null);
      setDoctors([]);
    } else if (selectedSpecialty) {
      setSelectedSpecialty(null);
      setSurgeries([]);
    }
  };

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">
            {selectedSurgery ? selectedSurgery.surgeryName : (selectedSpecialty ? selectedSpecialty.name : "Our Medical Services")}
          </h2>

          {loading && <p className="loading-text">Loading services...</p>}

          <div className="services-nav-container">
            <span
              onClick={() => navigate("/")}
              className="services-nav-home"
            >
              🌐 Home
            </span>

            {(selectedSpecialty || selectedSurgery) && (
              <>
                <span onClick={handleBack} className="services-back">
                  ← Back
                </span>
                <span
                  onClick={() => {
                    setSelectedSpecialty(null);
                    setSelectedSurgery(null);
                    setSurgeries([]);
                    setDoctors([]);
                  }}
                  className="services-back"
                >
                  🏠 Services Home
                </span>
              </>
            )}
          </div>

          {/* ===========================
              SPECIALTIES VIEW
          =========================== */}
          {!selectedSpecialty && (
            <div className="services-grid">
              {Object.entries(menuData).map(
                ([specialtyName, specialtyData]) => (
                  <div
                    key={specialtyData._id}
                    className="service-card"
                    onClick={() =>
                      handleSpecialtyClick(specialtyData._id, specialtyName)
                    }
                  >
                    <h3>{specialtyName}</h3>

                    <ul className="specialty-surgeries-list">
                      {Array.isArray(specialtyData.surgeries) &&
                        specialtyData.surgeries.slice(0, 4).map((surgery, index) => (
                          <li key={surgery.id || index} className="surgery-list-item">
                            {typeof surgery === "string" ? surgery : surgery.name}
                          </li>
                        ))}
                    </ul>

                    {Array.isArray(specialtyData.surgeries) && specialtyData.surgeries.length > 4 && (
                      <p className="more-text">
                        +{specialtyData.surgeries.length - 4} more
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* ===========================
              SURGERIES VIEW
          =========================== */}
          {selectedSpecialty && !selectedSurgery && (
            <div className="services-grid">
              {surgeries.length === 0 && <p>No surgeries found for this specialty.</p>}
              {surgeries.map((surgery) => (
                <div
                  key={surgery._id}
                  className="service-card"
                  onClick={() => handleSurgeryClick(surgery)}
                >
                  <h3>{surgery.surgeryName}</h3>
                  <p>Duration: {surgery.duration}</p>
                  <p className="surgery-cost">Est. Cost: ₹ {surgery.cost}</p>
                </div>
              ))}
            </div>
          )}

          {/* ===========================
              DOCTORS VIEW
          =========================== */}
          {selectedSurgery && (
            <div className="services-grid">
              {doctors.length === 0 && (
                <p className="no-doctors-text">
                  No doctors available for this surgery at the moment.
                </p>
              )}

              {doctors.map((doc) => (
                <div key={doc._id} className="service-card doctor">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <h3>{doc.name}</h3>
                  <p>Specialist Surgeon</p>
                  <p className="doctor-email">{doc.email}</p>
                </div>
              ))}
            </div>
          )}

          {/* ===========================
              AVATAR
          =========================== */}
          {!selectedSpecialty && (
            <>
              <br />
              <h3 className="avatar-header">Or Select in Avatar</h3>
              <div className="avatar-container">
                <Avatar onSelect={(part) => setSelectedPart(part)} />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
