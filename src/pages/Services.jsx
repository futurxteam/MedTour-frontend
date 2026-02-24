import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Home.css";
import "./styles/Services.css";
import Avatar from "../components/Avatar";
import DoctorBooking from "../components/DoctorBooking";

import {
  getPublicSurgeriesMenu,
  getPublicSurgeriesBySpecialty,
  getPublicDoctorsBySurgery,
  sendEnquiryOtp,
  verifyOtpAndCreateEnquiry,
  getCountries,
  getCitiesByCountry,
  getDoctorPhotoUrl,
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
    country: "",
    city: "",
    phoneCode: "+91",
    phoneNumber: "",
    medicalProblem: "",
    ageOrDob: "",
    otp: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [bookingStep, setBookingStep] = useState(1); // 1: Details/Calendar, 2: Form/OTP

  /* ===========================
     FETCH SPECIALTIES (PUBLIC)
  =========================== */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [menuRes, countriesRes] = await Promise.all([
          getPublicSurgeriesMenu(),
          getCountries(),
        ]);
        setMenuData(menuRes.data || {});
        setCountries(countriesRes.data.countries || []);
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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
    if (viewingDoctor) {
      setViewingDoctor(null);
      setBookingStep(1);
      setSelectedDate("");
    } else if (selectedSurgery) {
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
  const handleCountryChange = async (e) => {
    const countryName = e.target.value;

    if (countryName === "Other") {
      setEnquiryForm({
        ...enquiryForm,
        country: "Other",
        phoneCode: "+",
        city: "",
      });
      setCities([]);
      return;
    }

    const country = countries.find((c) => c.name === countryName);

    if (!country) {
      setEnquiryForm({ ...enquiryForm, country: "", city: "", phoneCode: "+91" });
      setCities([]);
      return;
    }

    setEnquiryForm({
      ...enquiryForm,
      country: country.name,
      phoneCode: country.phoneCode || "+91",
      city: "",
    });

    if (country.hasCities) {
      setLoadingCities(true);
      try {
        const res = await getCitiesByCountry(country.code);
        setCities(res.data.cities || []);
      } catch (err) {
        console.error("Failed to fetch cities", err);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  const handleGetQuote = (doctor) => {
    setViewingDoctor(doctor);
    setBookingStep(1);
    setSelectedDate("");
    setEnquiryForm({
      patientName: "",
      country: "",
      otherCountry: "",
      city: "",
      phoneCode: "+91",
      phoneNumber: "",
      medicalProblem: "",
      ageOrDob: "",
    });
    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    if (!enquiryForm.patientName || !enquiryForm.country || !enquiryForm.phoneNumber || !enquiryForm.ageOrDob) {
      alert("Please fill all required fields");
      return;
    }
    const fullPhone = `${enquiryForm.phoneCode}${enquiryForm.phoneNumber}`;
    await sendEnquiryOtp({ phone: fullPhone });
    setOtpSent(true);
  };

  const handleSubmitEnquiry = async () => {
    if (enquiryForm.otp !== "123") {
      alert("Invalid OTP. Use 123");
      return;
    }

    const fullPhone = `${enquiryForm.phoneCode}${enquiryForm.phoneNumber}`;
    await verifyOtpAndCreateEnquiry({
      patientName: enquiryForm.patientName,
      phone: fullPhone,
      otp: enquiryForm.otp,
      country: enquiryForm.country === "Other" ? enquiryForm.otherCountry : enquiryForm.country,
      city: enquiryForm.city,
      medicalProblem: enquiryForm.medicalProblem,
      ageOrDob: enquiryForm.ageOrDob,
      specialtyId: selectedSpecialty.id,
      surgeryId: selectedSurgery._id,
      doctorId: viewingDoctor._id,
      consultationDate: selectedDate,
      source: "services",
    });

    alert("Booking enquiry submitted! Our assistant will contact you shortly.");
    setViewingDoctor(null);
    setBookingStep(1);
    setSelectedDate("");
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
                    setViewingDoctor(null);
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
                  <div className="surgery-meta">
                    <p className="surgery-duration">⏱ {surgery.duration}</p>
                    <p className="starting-price">
                      Starting from <span>₹{surgery.globalSurgeryId?.minimumCost?.toLocaleString() || surgery.cost?.toLocaleString()}</span>
                    </p>
                  </div>
                  <p className="surgery-description">{surgery.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ===========================
              DOCTORS VIEW
          =========================== */}
          {selectedSurgery && !viewingDoctor && (
            <div className="services-grid">
              {doctors.map((doc) => (
                <div key={doc._id} className="service-card doctor" onClick={() => handleGetQuote(doc)}>
                  <div className="doctor-avatar">
                    {doc.hasPhoto ? (
                      <img src={getDoctorPhotoUrl(doc._id || doc.id)} alt={doc.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      "👨‍⚕️"
                    )}
                  </div>
                  <h3>{doc.name}</h3>
                  <p className="doctor-designation">{doc.designation}</p>
                  <p className="doctor-about-snippet">
                    {doc.about ? `${doc.about.substring(0, 100)}...` : "Experienced specialist dedicated to patient care."}
                  </p>

                  <button className="book-btn">
                    View & Book
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ===========================
              DOCTOR DETAILS & BOOKING
          =========================== */}
          {viewingDoctor && (
            <DoctorBooking
              doctor={viewingDoctor}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              bookingStep={bookingStep}
              setBookingStep={setBookingStep}
              enquiryForm={enquiryForm}
              setEnquiryForm={setEnquiryForm}
              countries={countries}
              cities={cities}
              loadingCities={loadingCities}
              onSendOtp={handleSendOtp}
              onSubmit={handleSubmitEnquiry}
            />
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
