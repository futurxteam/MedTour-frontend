import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicHospitalById } from '../api/api';
import './styles/HomeExpansion.css';

const HospitalPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    padding: '80px 0'
                }}>
                    <div className="container">
                        <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, margin: 0 }}>{hospital.hospitalName}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📍</span> {hospital.city}, {hospital.state}, {hospital.country}
                        </p>
                    </div>
                </div>
            </div>

            <section className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '60px' }}>
                    <div>
                        <div style={{ marginBottom: '60px' }}>
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

                        <div style={{ marginTop: '60px' }}>
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
                                    hospital.doctors.map((doc, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '50%',
                                                background: '#f1f5f9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                overflow: 'hidden'
                                            }}>
                                                {doc.hasPhoto ? "👨‍⚕️" : "👤"}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>{doc.name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{doc.designation}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>{doc.experience} Years Experience</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#64748b' }}>Consultation details available on request.</p>
                                )}
                            </div>
                            <button className="submit-btn" style={{ marginTop: '40px', width: '100%', py: '16px', borderRadius: '16px' }} onClick={() => navigate('/services', { state: { hospitalId: hospital._id } })}>
                                Book Consultation
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: '#64748b' }}>
                                Contact: {hospital.phone}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HospitalPublicProfile;
