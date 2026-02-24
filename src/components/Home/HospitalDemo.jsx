import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicHospitals } from '../../api/api';

const HospitalDemo = () => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await getPublicHospitals();
                setHospitals(res.data.hospitals || []);
            } catch (err) {
                console.error("Failed to fetch hospitals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, []);

    if (loading) return null; // Or a skeleton
    if (hospitals.length === 0) return null;

    return (
        <section className="home-expansion-section">
            <div className="container">
                <div className="section-title-alt">
                    <h2>Discovery: Top Rated Hospitals</h2>
                    <p>Kerala's medical hub features infrastructure at par with Western standards. Explore our diamond-tier partners.</p>
                </div>
                <div className="hospitals-grid">
                    {hospitals.map(hosp => {
                        const mainImg = hosp.photos?.[0]?.url || hosp.avatar || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";
                        return (
                            <div key={hosp._id} className="hospital-card-alt">
                                <div className="hosp-banner">
                                    <img src={mainImg} alt={hosp.hospitalName} />
                                </div>
                                <div className="hosp-content">
                                    <h3>{hosp.hospitalName}</h3>
                                    <div className="hosp-meta">
                                        <span>📍 {hosp.city || 'Kochi'}, {hosp.country || 'India'}</span>
                                        <span>⭐ 4.9 Rating</span>
                                    </div>
                                    <div style={{ marginTop: "10px", marginBottom: "15px", display: "flex", gap: "5px", flexWrap: "wrap", overflow: "hidden", maxHeight: "25px" }}>
                                        {hosp.specialties?.slice(0, 3).map(s => (
                                            <span key={s._id} style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                                                {s.name}
                                            </span>
                                        ))}
                                        {hosp.specialties?.length > 3 && (
                                            <span style={{ fontSize: "11px", color: "#64748b" }}>+{hosp.specialties.length - 3}</span>
                                        )}
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                                        {hosp.description ? (hosp.description.substring(0, 100) + "...") : "Premier medical facility offering world-class healthcare services."}
                                    </p>
                                    <button
                                        className="view-hosp-btn"
                                        onClick={() => navigate(`/hospital/${hosp._id}`)}
                                    >
                                        View Full Hospital Profile
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HospitalDemo;
