import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicHospitalById, getCountries, getCitiesByCountry, sendEnquiryOtp, verifyOtpAndCreateEnquiry } from '../api/api';
import './styles/HomeExpansion.css';

const HospitalPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ── Enquiry Modal State ────────────────────────── */
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [enquiryLoading, setEnquiryLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [otp, setOtp] = useState("");

    const [formData, setFormData] = useState({
        patientName: "",
        country: "",
        otherCountry: "",
        countryCode: "",
        city: "",
        phoneCode: "+91",
        phoneNumber: "",
        medicalProblem: "",
        ageOrDob: "",
    });

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await getPublicHospitalById(id);
                setHospital(res.data);
            } catch (err) {
                console.error("Failed to fetch hospital details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, [id]);

    /* Fetch countries when modal opens */
    useEffect(() => {
        if (showEnquiryModal && countries.length === 0) {
            const fetchCountries = async () => {
                try {
                    const res = await getCountries();
                    setCountries(res.data.countries || []);
                } catch (err) {
                    console.error("Failed to fetch countries", err);
                }
            };
            fetchCountries();
        }
    }, [showEnquiryModal]);

    const handleCountryChange = async (e) => {
        const countryName = e.target.value;

        if (countryName === "Other") {
            setFormData({ ...formData, country: "Other", countryCode: "OTHER", city: "", phoneCode: "+" });
            setCities([]);
            return;
        }

        const country = countries.find((c) => c.name === countryName);
        if (!country) {
            setFormData({ ...formData, country: "", countryCode: "", city: "" });
            setCities([]);
            return;
        }

        setFormData({
            ...formData,
            country: country.name,
            countryCode: country.code,
            city: "",
            phoneCode: country.phoneCode || "+91",
        });

        if (country.hasCities) {
            setLoadingCities(true);
            try {
                const res = await getCitiesByCountry(country.code);
                setCities(res.data.cities || []);
            } catch (err) { setCities([]); }
            finally { setLoadingCities(false); }
        } else {
            setCities([]);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.patientName || !formData.country || !formData.phoneNumber || !formData.ageOrDob) {
            alert("Please fill all required fields");
            return;
        }
        setEnquiryLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await sendEnquiryOtp({ phone: fullPhone });
            setShowOtpModal(true);
        } catch (err) {
            alert("Failed to send OTP");
        } finally {
            setEnquiryLoading(false);
        }
    };

    const handleSubmitEnquiry = async () => {
        if (otp !== "123") { alert("Invalid OTP. Use 123"); return; }

        setEnquiryLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await verifyOtpAndCreateEnquiry({
                patientName: formData.patientName,
                phone: fullPhone,
                otp,
                contactMode: "call",
                source: "hospital_enquiry",
                hospitalProfileId: hospital._id,
                country: formData.country === "Other" ? formData.otherCountry : formData.country,
                city: formData.city,
                medicalProblem: formData.medicalProblem,
                ageOrDob: formData.ageOrDob,
            });

            alert("Thank you! Our assistant will contact you shortly.");
            setShowOtpModal(false);
            setShowEnquiryModal(false);
            setOtp("");
            setFormData({ patientName: "", country: "", otherCountry: "", countryCode: "", city: "", phoneCode: "+91", phoneNumber: "", medicalProblem: "", ageOrDob: "" });
        } catch (err) {
            alert("Failed to submit enquiry");
        } finally {
            setEnquiryLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="home-root">
                <Header />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <div className="loader-spinner"></div>
                    <h2>Loading Hospital Profile...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="home-root">
                <Header />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h2>Hospital Not Found</h2>
                    <button onClick={() => navigate('/')} className="view-hosp-btn" style={{ width: 'auto', marginTop: '20px' }}>
                        Back to Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const mainBannerImg = hospital.photos?.[0]?.url || hospital.avatar || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="home-root">
            <Header />

            <div className="hosp-banner-large" style={{
                height: '450px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <img src={mainBannerImg} alt={hospital.hospitalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '40px 0'
                }}>
                    <div className="container">
                        <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, margin: 0 }}>{hospital.hospitalName}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📍</span> {hospital.city}, {hospital.state}, {hospital.country}
                        </p>
                    </div>
                </div>
            </div>

            <section className="container" style={{ padding: '40px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '60px' }}>
                    <div>
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '2.25rem', marginBottom: '24px', fontWeight: 800 }}>About the Hospital</h2>
                            <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.8 }}>
                                {hospital.description || "This facility provides comprehensive healthcare services with state-of-the-art infrastructure and a patient-centric approach."}
                            </p>
                        </div>

                        {hospital.photos?.length > 1 && (
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 800 }}>Facility Tour</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {hospital.photos.slice(1).map((photo, idx) => (
                                        <div key={idx} style={{ height: '150px', borderRadius: '16px', overflow: 'hidden' }}>
                                            <img src={photo.url} alt="Facility" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 800 }}>Our Specializations</h2>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {hospital.specialties?.length > 0 ? (
                                    hospital.specialties.map(spec => (
                                        <span key={spec._id} style={{
                                            padding: '10px 24px',
                                            background: '#f1f5f9',
                                            borderRadius: '100px',
                                            fontWeight: 700,
                                            color: '#0d9488',
                                            fontSize: '0.9rem'
                                        }}>
                                            {spec.name}
                                        </span>
                                    ))
                                ) : (
                                    <p style={{ color: '#64748b' }}>Multi-specialty services.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div style={{
                            background: 'white',
                            padding: '40px',
                            borderRadius: '32px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ marginBottom: '24px', fontWeight: 900, fontSize: '1.5rem' }}>Top Specialists</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {hospital.doctors?.length > 0 ? (
                                    hospital.doctors.map((doc) => (
                                        <div
                                            key={doc._id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        background: '#f1f5f9',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {doc.hasPhoto ? "👨‍⚕️" : "👤"}
                                                </div>

                                                <div>
                                                    <h4 style={{ margin: 0, fontWeight: 700 }}>{doc.name}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                                                        {doc.designation}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>
                                                        {doc.experience} Years Experience
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ✅ DOCTOR-SPECIFIC BUTTON */}
                                            <button
                                                className="view-hosp-btn"
                                                style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                                                onClick={() => navigate(`/book/doctor/${doc._id}`)}
                                            >
                                                Book
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#64748b' }}>Consultation details available on request.</p>
                                )}
                            </div>

                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: '#64748b' }}>
                                Contact: {hospital.phone}
                            </p>

                            {/* ── Contact Hospital Button ── */}
                            <button
                                onClick={() => setShowEnquiryModal(true)}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    padding: '16px 24px',
                                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '1rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
                                    letterSpacing: '0.3px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Enquire About This Hospital
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                HOSPITAL ENQUIRY MODAL
            ══════════════════════════════════════════════ */}
            {showEnquiryModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '28px',
                        maxWidth: '520px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '40px',
                        position: 'relative',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.25)'
                    }}>
                        {/* Close button */}
                        <button
                            onClick={() => { setShowEnquiryModal(false); setShowOtpModal(false); setOtp(""); }}
                            style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                                width: '36px', height: '36px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 700, color: '#64748b'
                            }}
                        >✕</button>

                        {/* Hospital badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            marginBottom: '24px', padding: '16px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                            border: '1px solid #bbf7d0'
                        }}>
                            <span style={{ fontSize: '2rem' }}>🏥</span>
                            <div>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#166534' }}>{hospital.hospitalName}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803d' }}>📍 {hospital.city}, {hospital.country}</p>
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 8px 0', fontWeight: 900, fontSize: '1.5rem' }}>Enquire About This Hospital</h3>
                        <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Fill in your details and our medical assistant will contact you with all the information you need.
                        </p>

                        {!showOtpModal ? (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient Name *</label>
                                    <input
                                        type="text" required placeholder="Full name"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                                        onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country *</label>
                                        <select
                                            required value={formData.country} onChange={handleCountryChange}
                                            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</label>
                                        {formData.country === "Other" ? (
                                            <input
                                                type="text" placeholder="Your country"
                                                value={formData.otherCountry}
                                                onChange={(e) => setFormData({ ...formData, otherCountry: e.target.value })}
                                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        ) : (
                                            <>
                                                <input
                                                    list="hosp-cities-list"
                                                    placeholder={loadingCities ? "Loading..." : "Select city"}
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    disabled={!formData.countryCode}
                                                    style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                                <datalist id="hosp-cities-list">
                                                    {cities.map((city, idx) => <option key={idx} value={city.name} />)}
                                                </datalist>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number *</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {formData.country === "Other" ? (
                                            <input
                                                type="text" placeholder="+XX"
                                                value={formData.phoneCode}
                                                onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                                                style={{ width: '80px', padding: '14px 12px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                                            />
                                        ) : (
                                            <div style={{
                                                padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px',
                                                fontSize: '1rem', fontWeight: 700, color: '#334155', background: '#f8fafc',
                                                minWidth: '65px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {formData.phoneCode}
                                            </div>
                                        )}
                                        <input
                                            type="tel" required placeholder="Your phone number"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            style={{ flex: 1, padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age / Date of Birth *</label>
                                    <input
                                        type="text" required placeholder="e.g. 30 Yrs or 29-05-1985"
                                        value={formData.ageOrDob}
                                        onChange={(e) => setFormData({ ...formData, ageOrDob: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                        onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medical Concern (Optional)</label>
                                    <textarea
                                        placeholder="Describe your medical concern or what you'd like to know about this hospital..."
                                        value={formData.medicalProblem}
                                        onChange={(e) => setFormData({ ...formData, medicalProblem: e.target.value })}
                                        rows={3}
                                        style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                        onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <button
                                    type="submit" disabled={enquiryLoading}
                                    style={{
                                        width: '100%', padding: '16px',
                                        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                        color: 'white', border: 'none', borderRadius: '16px',
                                        fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
                                        marginTop: '8px', opacity: enquiryLoading ? 0.7 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {enquiryLoading ? "Processing..." : "📩 Submit & Verify Phone"}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                                    By submitting, you agree to our Terms of Use and Privacy Policy.
                                </p>
                            </form>
                        ) : (
                            /* ── OTP Verification Step ── */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{
                                    padding: '20px', borderRadius: '16px',
                                    background: '#fffbeb', border: '1px solid #fde68a', textAlign: 'center'
                                }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: '#92400e', fontSize: '1rem' }}>📱 OTP Sent!</p>
                                    <p style={{ margin: '6px 0 0 0', color: '#a16207', fontSize: '0.85rem' }}>We've sent a verification code to your phone.</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enter OTP</label>
                                    <input
                                        type="text" placeholder="Enter OTP (123)"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ width: '100%', padding: '16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1.25rem', textAlign: 'center', letterSpacing: '8px', fontWeight: 800, outline: 'none', boxSizing: 'border-box' }}
                                        onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setShowOtpModal(false)}
                                        style={{
                                            flex: 1, padding: '14px', background: '#f1f5f9',
                                            border: '1px solid #e2e8f0', borderRadius: '14px',
                                            fontSize: '1rem', fontWeight: 700, cursor: 'pointer', color: '#475569'
                                        }}
                                    >← Back</button>

                                    <button
                                        onClick={handleSubmitEnquiry}
                                        disabled={enquiryLoading}
                                        style={{
                                            flex: 2, padding: '14px',
                                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                            color: 'white', border: 'none', borderRadius: '14px',
                                            fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                                            opacity: enquiryLoading ? 0.7 : 1
                                        }}
                                    >
                                        {enquiryLoading ? "Verifying..." : "✅ Verify & Submit"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default HospitalPublicProfile;
