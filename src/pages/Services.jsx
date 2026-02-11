import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Home.css";
import "./styles/Services.css";
import Avatar from "../components/Avatar";

import {
  getPublicSurgeriesMenu,
  getPublicSurgeriesBySpecialty,
  getPublicDoctorsBySurgery,
  sendEnquiryOtp,
  verifyOtpAndCreateEnquiry,

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
     ENQUIRY / OTP STATE
  =========================== */
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [enquiryForm, setEnquiryForm] = useState({
    patientName: "",
    phone: "",
    contactMode: "call",
    otp: "",
  });

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
      handleSpecialtyClick(
        location.state.specialtyId,
        location.state.specialtyName
      );

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
     ENQUIRY HANDLERS
  =========================== */
  const handleGetQuote = (doctor) => {
    setSelectedDoctor(doctor);
    setShowQuoteModal(true);
    setOtpSent(false);
    setEnquiryForm({
      patientName: "",
      phone: "",
      contactMode: "call",
      otp: "",
    });
  };

  const handleSendOtp = async () => {
    await sendEnquiryOtp({ phone: enquiryForm.phone });
    setOtpSent(true);
  };

  const handleSubmitEnquiry = async () => {
    if (enquiryForm.otp !== "123") {
      alert("Invalid OTP. Use 123");
      return;
    }

    await verifyOtpAndCreateEnquiry({
      patientName: enquiryForm.patientName,
      phone: enquiryForm.phone,
      otp: enquiryForm.otp,
      contactMode: enquiryForm.contactMode,
      specialtyId: selectedSpecialty.id,
      surgeryId: selectedSurgery._id,
      doctorId: selectedDoctor._id,
    });

    alert("Our assistant will contact you shortly");
    setShowQuoteModal(false);
  };

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">
            {selectedSurgery
              ? selectedSurgery.surgeryName
              : selectedSpecialty
                ? selectedSpecialty.name
                : "Our Medical Services"}
          </h2>

          {loading && <p className="loading-text">Loading services...</p>}

          <div className="services-nav-container">
            <span onClick={() => navigate("/")} className="services-nav-home">
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
                      handleSpecialtyClick(
                        specialtyData._id,
                        specialtyName
                      )
                    }
                  >
                    <h3>{specialtyName}</h3>

                    <ul className="specialty-surgeries-list">
                      {specialtyData.surgeries
                        ?.slice(0, 4)
                        .map((surgery, index) => (
                          <li key={surgery.id || index}>
                            {typeof surgery === "string"
                              ? surgery
                              : surgery.name}
                          </li>
                        ))}
                    </ul>

                    {specialtyData.surgeries?.length > 4 && (
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
              {surgeries.map((surgery) => (
                <div
                  key={surgery._id}
                  className="service-card"
                  onClick={() => handleSurgeryClick(surgery)}
                >
                  <h3>{surgery.surgeryName}</h3>
                  <p>Duration: {surgery.duration}</p>
                  <p className="surgery-description">{surgery.description}</p>                </div>
              ))}
            </div>
          )}

          {/* ===========================
              DOCTORS VIEW
          =========================== */}
          {selectedSurgery && (
            <div className="services-grid">
              {doctors.map((doc) => (
                <div key={doc._id} className="service-card doctor">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <h3>{doc.name}</h3>
                  <p>Specialist Surgeon</p>

                  <button onClick={() => handleGetQuote(doc)}>
                    Get Free Quote
                  </button>
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

      {/* ===========================
          QUOTE MODAL
      =========================== */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Get Free Quote</h3>

            <input
              placeholder="Your Name"
              value={enquiryForm.patientName}
              onChange={(e) =>
                setEnquiryForm({
                  ...enquiryForm,
                  patientName: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              value={enquiryForm.phone}
              onChange={(e) =>
                setEnquiryForm({
                  ...enquiryForm,
                  phone: e.target.value,
                })
              }
            />

            <select
              value={enquiryForm.contactMode}
              onChange={(e) =>
                setEnquiryForm({
                  ...enquiryForm,
                  contactMode: e.target.value,
                })
              }
            >
              <option value="call">Call</option>
              <option value="message">Message</option>
            </select>

            {!otpSent ? (
              <button onClick={handleSendOtp}>Send OTP</button>
            ) : (
              <>
                <input
                  placeholder="Enter OTP (123)"
                  value={enquiryForm.otp}
                  onChange={(e) =>
                    setEnquiryForm({
                      ...enquiryForm,
                      otp: e.target.value,
                    })
                  }
                />
                <button onClick={handleSubmitEnquiry}>
                  Submit Enquiry
                </button>
              </>
            )}

            <button onClick={() => setShowQuoteModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
