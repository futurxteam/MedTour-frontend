import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getDoctorPhotoUrl,
    sendEnquiryOtp,
    verifyOtpAndCreateEnquiry,
    getPublicDoctorById,
} from "../api/api";

export default function DoctorBooking({ doctor: doctorProp }) {
    const { doctorId } = useParams();

    /* =========================
       CORE STATE
    ========================= */
    const [doctor, setDoctor] = useState(doctorProp || null);
    const [loadingDoctor, setLoadingDoctor] = useState(!doctorProp);

    const [bookingStep, setBookingStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [currentViewMonth, setCurrentViewMonth] = useState(new Date());

    const [otpSent, setOtpSent] = useState(false);

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

    /* =========================
       LOAD DOCTOR (ROUTE MODE)
    ========================= */
    useEffect(() => {
        if (doctorProp) return;
        if (!doctorId) return;

        const fetchDoctor = async () => {
            try {
                const res = await getPublicDoctorById(doctorId);
                setDoctor(res.data.doctor);
            } catch (err) {
                console.error("Failed to load doctor", err);
            } finally {
                setLoadingDoctor(false);
            }
        };

        fetchDoctor();
    }, [doctorId, doctorProp]);

    if (loadingDoctor) return <p>Loading doctor…</p>;
    if (!doctor) return <p>Doctor not found</p>;

    /* =========================
       HANDLERS
    ========================= */
    const handleSendOtp = async () => {
        if (
            !enquiryForm.patientName ||
            !enquiryForm.phoneNumber ||
            !enquiryForm.ageOrDob
        ) {
            alert("Please fill required fields");
            return;
        }

        const fullPhone = `${enquiryForm.phoneCode}${enquiryForm.phoneNumber}`;
        await sendEnquiryOtp({ phone: fullPhone });
        setOtpSent(true);
    };

    const handleSubmit = async () => {
        if (enquiryForm.otp !== "123") {
            alert("Invalid OTP. Use 123");
            return;
        }

        const fullPhone = `${enquiryForm.phoneCode}${enquiryForm.phoneNumber}`;

        await verifyOtpAndCreateEnquiry({
            patientName: enquiryForm.patientName,
            phone: fullPhone,
            otp: enquiryForm.otp,
            doctorId: doctor._id,
            consultationDate: selectedDate,
            medicalProblem: enquiryForm.medicalProblem,
            ageOrDob: enquiryForm.ageOrDob,
            source: "doctor_direct",
        });

        alert("Booking enquiry submitted!");
    };

    /* =========================
       RENDER
    ========================= */
    if (bookingStep === 3) {
        return (
            <div className="booking-success-container">
                <div className="success-card">
                    <div className="success-icon">✓</div>
                    <h2>Booking Confirmed!</h2>
                    <p>Your enquiry for <strong>{doctor.name}</strong> has been received.</p>
                    <p className="subtext">A MedTour assistant will contact you shortly on <strong>{enquiryForm.phoneCode}{enquiryForm.phoneNumber}</strong>.</p>
                    <button onClick={() => window.location.href = '/'} className="btn btn-primary">Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-booking-wrapper">
            <div className="booking-card">
                {/* ================= LEFT: DOCTOR INFO ================= */}
                <div className="doctor-info-sidebar">
                    <div className="sticky-content">
                        <div className="doctor-avatar-hero">
                            {doctor.hasPhoto ? (
                                <img
                                    src={getDoctorPhotoUrl(doctor._id)}
                                    alt={doctor.name}
                                />
                            ) : (
                                <div className="avatar-placeholder">👨‍⚕️</div>
                            )}
                            <div className="experience-badge">{doctor.experience}+ Yrs</div>
                        </div>

                        <div className="doctor-meta">
                            <h1>{doctor.name}</h1>
                            <span className="designation-tag">{doctor.designation}</span>
                            <div className="fee-badge">Consultation Fee: ₹{doctor.consultationFee}</div>
                        </div>

                        <div className="doctor-details-grid">
                            <div className="detail-row">
                                <label>Bio</label>
                                <p>{doctor.about || "Clinical specialist dedicated to patient-centric care."}</p>
                            </div>
                            <div className="detail-row">
                                <label>Education</label>
                                <p>{doctor.qualifications || "Advanced Medical Degrees"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT: INTERACTION ================= */}
                <div className="booking-action-panel">
                    <div className="step-indicator">
                        <div className={`step-dot ${bookingStep >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${bookingStep >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    {bookingStep === 1 && (
                        <div className="booking-step-fade">
                            <h2 className="step-title">Choose your date</h2>
                            <p className="step-desc">Select a preferred day for your consultation</p>

                            <div className="premium-calendar">
                                <div className="calendar-nav">
                                    <button
                                        className="nav-arrow"
                                        onClick={() => {
                                            const prev = new Date(currentViewMonth);
                                            prev.setMonth(prev.getMonth() - 1);
                                            setCurrentViewMonth(prev);
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <span className="month-display">
                                        {currentViewMonth.toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <button
                                        className="nav-arrow"
                                        onClick={() => {
                                            const next = new Date(currentViewMonth);
                                            next.setMonth(next.getMonth() + 1);
                                            setCurrentViewMonth(next);
                                        }}
                                    >
                                        ›
                                    </button>
                                </div>

                                <div className="calendar-grid-header">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                                        <div key={d}>{d}</div>
                                    ))}
                                </div>

                                <div className="calendar-grid-body">
                                    {Array.from({
                                        length: new Date(
                                            currentViewMonth.getFullYear(),
                                            currentViewMonth.getMonth(),
                                            1
                                        ).getDay(),
                                    }).map((_, i) => (
                                        <div key={`e-${i}`} className="day empty"></div>
                                    ))}

                                    {Array.from({
                                        length: new Date(
                                            currentViewMonth.getFullYear(),
                                            currentViewMonth.getMonth() + 1,
                                            0
                                        ).getDate(),
                                    }).map((_, i) => {
                                        const day = i + 1;
                                        const dateObj = new Date(
                                            currentViewMonth.getFullYear(),
                                            currentViewMonth.getMonth(),
                                            day
                                        );
                                        const dateStr = dateObj.toISOString().split("T")[0];
                                        const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                                        const isSel = selectedDate === dateStr;

                                        return (
                                            <div
                                                key={day}
                                                className={`day ${isSel ? "selected" : ""} ${isPast ? "past" : ""}`}
                                                onClick={() => !isPast && setSelectedDate(dateStr)}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="selection-confirm-bar">
                                    <span>Selected: <b>{new Date(selectedDate).toDateString()}</b></span>
                                    <button onClick={() => setBookingStep(2)} className="btn btn-primary hero-btn">
                                        Next: Patient Details
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {bookingStep === 2 && (
                        <div className="booking-step-fade">
                            <button className="back-link" onClick={() => setBookingStep(1)}>← Change Date</button>
                            <h2 className="step-title">Patient Information</h2>
                            <p className="step-desc">Direct booking for {new Date(selectedDate).toDateString()}</p>

                            <div className="premium-form">
                                <div className="input-field">
                                    <input
                                        placeholder="Full Name"
                                        value={enquiryForm.patientName}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, patientName: e.target.value })}
                                    />
                                </div>

                                <div className="input-row">
                                    <div className="input-field">
                                        <input
                                            placeholder="Phone Number"
                                            value={enquiryForm.phoneNumber}
                                            onChange={(e) => setEnquiryForm({ ...enquiryForm, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-field">
                                        <input
                                            placeholder="Age / DOB"
                                            value={enquiryForm.ageOrDob}
                                            onChange={(e) => setEnquiryForm({ ...enquiryForm, ageOrDob: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="input-field">
                                    <textarea
                                        placeholder="Briefly describe the medical concern..."
                                        rows="4"
                                        value={enquiryForm.medicalProblem}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, medicalProblem: e.target.value })}
                                    />
                                </div>

                                {!otpSent ? (
                                    <button onClick={handleSendOtp} className="btn btn-primary hero-btn">
                                        Verify & Confirm
                                    </button>
                                ) : (
                                    <div className="otp-verification-box">
                                        <label>Verify OTP</label>
                                        <div className="otp-input-wrap">
                                            <input
                                                className="otp-field"
                                                placeholder="Enter 123"
                                                value={enquiryForm.otp}
                                                onChange={(e) => setEnquiryForm({ ...enquiryForm, otp: e.target.value })}
                                            />
                                            <button onClick={handleSubmit} className="btn btn-success">
                                                Confirm Booking
                                            </button>
                                        </div>
                                        <p className="otp-hint">Enter the test code 123 to proceed</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .doctor-booking-wrapper {
                    min-height: 100vh;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }

                .booking-card {
                    width: 100%;
                    max-width: 1100px;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
                    min-height: 600px;
                }

                /* SIDEBAR */
                .doctor-info-sidebar {
                    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    padding: 30px;
                    padding-bottom: 60px; /* Extra space to prevent cut-off at bottom */
                    overflow-y: auto;
                }

                .doctor-avatar-hero {
                    position: relative;
                    width: 90px;
                    height: 90px;
                    margin-bottom: 15px;
                }

                .doctor-avatar-hero img, .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                    object-fit: cover;
                    border: 3px solid rgba(255,255,255,0.1);
                }

                .avatar-placeholder {
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.2rem;
                }

                .experience-badge {
                    position: absolute;
                    bottom: -5px;
                    right: -5px;
                    background: #10b981;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 6px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
                }

                .doctor-meta h1 {
                    font-size: 1.3rem;
                    margin: 0 0 4px 0;
                    font-weight: 800;
                }

                .designation-tag {
                    display: inline-block;
                    background: rgba(255,255,255,0.08);
                    padding: 4px 10px;
                    border-radius: 30px;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    margin-bottom: 10px;
                }

                .fee-badge {
                   color: #10b981;
                   font-weight: 600;
                   font-size: 0.85rem;
                   margin-bottom: 20px;
                }

                .detail-row {
                    margin-bottom: 15px;
                }
                .detail-row label {
                    display: block;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.6rem;
                    color: #64748b;
                    margin-bottom: 4px;
                    font-weight: 700;
                }
                .detail-row p {
                    margin: 0;
                    line-height: 1.5;
                    color: #cbd5e1;
                    font-size: 0.85rem;
                }

                /* ACTION PANEL */
                .booking-action-panel {
                    padding: 30px 40px;
                    background: white;
                    overflow-y: auto;
                }

                .step-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .step-dot {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: #94a3b8;
                    font-size: 0.7rem;
                }
                .step-dot.active {
                    background: #0f172a;
                    color: white;
                }
                .step-line {
                    flex: 1;
                    height: 2px;
                    background: #f1f5f9;
                    max-width: 40px;
                }

                .step-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 5px 0;
                }
                .step-desc {
                    color: #64748b;
                    font-size: 0.85rem;
                    margin-bottom: 15px;
                }

                /* CALENDAR */
                .premium-calendar {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 15px;
                    max-width: 600px;
                }

                .calendar-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .month-display {
                    font-weight: 800;
                    font-size: 0.9rem;
                    color: #0f172a;
                }
                .nav-arrow {
                    width: 26px;
                    height: 26px;
                    border: none;
                    background: white;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .calendar-grid-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #94a3b8;
                    margin-bottom: 5px;
                }
                .calendar-grid-body {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                }
                .day {
                    height: 40px; /* Fixed height instead of aspect-ratio to save space */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    font-size: 0.75rem;
                    color: #334155;
                }
                .day:hover:not(.past):not(.empty) {
                    background: #e2e8f0;
                    transform: scale(1.05);
                }
                .day.selected {
                    background: #0f172a !important;
                    color: white !important;
                }
                .day.past {
                    color: #cbd5e1;
                    cursor: not-allowed;
                }

                .selection-confirm-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    background: #ecfdf5;
                    border-radius: 12px;
                    border: 1px solid #a7f3d0;
                    animation: slideUp 0.3s ease-out;
                    max-width: 600px;
                }
                .selection-confirm-bar span { color: #065f46; font-size: 0.8rem; }

                /* FORMS */
                .premium-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 600px;
                }
                .input-field input, .input-field textarea {
                    width: 100%;
                    padding: 10px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field input:focus, .input-field textarea:focus {
                    border-color: #0f172a;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
                }
                .input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                    font-size: 0.85rem;
                }
                .btn-primary {
                    background: #0f172a;
                    color: white;
                }
                .btn-primary:not(:disabled):hover {
                    background: #1e293b;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px -3px rgba(15, 23, 42, 0.15);
                }
                .hero-btn { width: auto; min-width: 150px; }

                .otp-verification-box {
                    background: #f1f5f9;
                    padding: 15px;
                    border-radius: 12px;
                    border: 2px dashed #cbd5e1;
                }
                .otp-input-wrap {
                    display: flex;
                    gap: 10px;
                    margin: 8px 0;
                }
                .otp-field {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    letter-spacing: 5px;
                    font-weight: 800;
                    font-size: 1rem;
                }
                .otp-hint { font-size: 0.7rem; color: #64748b; margin: 0; }

                .back-link {
                    background: none;
                    border: none;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 12px;
                    padding: 0;
                    font-size: 0.8rem;
                }

                /* SUCCESS VIEW */
                .booking-success-container {
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                }
                .success-card {
                    background: white;
                    padding: 30px;
                    border-radius: 24px;
                    text-align: center;
                    max-width: 380px;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
                }
                .success-icon {
                    width: 50px;
                    height: 50px;
                    background: #10b981;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin: 0 auto 15px;
                }
                .success-card h2 { font-size: 1.3rem; margin-bottom: 8px; }
                .success-card p { font-size: 0.85rem; color: #64748b; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 900px) {
                    .booking-card { grid-template-columns: 1fr; max-height: none; }
                    .doctor-info-sidebar { padding: 25px; }
                    .premium-calendar, .premium-form, .selection-confirm-bar { max-width: 100%; }
                }
            `}</style>
        </div>
    );
}