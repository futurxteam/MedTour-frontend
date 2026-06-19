import React from "react";
import "./styles/SpecialityModal.css";
import { specialityContent } from "../config/specialityContent";
import { useNavigate } from "react-router-dom";

export default function SpecialityModal({ deptName, deptData, imgUrl, onClose }) {
    const navigate = useNavigate();

    if (!deptData) return null;

    // Resolve content dynamically
    const content =
        specialityContent[deptName] ||
        specialityContent[deptName?.toLowerCase()] ||
        {};

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* HERO IMAGE HEADER */}
                <div className="modal-hero" style={{ backgroundImage: `url(${imgUrl})` }}>
                    <div className="hero-content">
                        <div className="dept-icon">
                            <i className="medical-icon">⚕️</i>
                        </div>
                        <h2>{deptName}</h2>
                    </div>
                    <button className="close-x" onClick={onClose}>✕</button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="modal-scroll-body">
                    <div className="modal-body-content">
                        
                        <div className="modal-grid">
                            {/* LEFT COLUMN */}
                            <div className="modal-col">
                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">🕒</span>
                                        <h4>Brief History & Overview</h4>
                                    </div>
                                    <p>{content.overview || "Combining modern treatment with holistic recovery approaches to ensure long-term healing and restored mobility."}</p>
                                </section>

                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">🧬</span>
                                        <h4>Common Procedures</h4>
                                    </div>
                                    <ul className="procedure-list">
                                        {deptData.surgeries?.slice(0, 6).map((s) => (
                                            <li key={s.id}>
                                                <span className="check">✅</span> {s.name}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="modal-col">
                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">✨</span>
                                        <h4>Expected Outcomes</h4>
                                    </div>
                                    <p>{content.outcomes || "Significant improvement in quality of life, reduced recurring symptoms, and restored physical independence."}</p>
                                </section>

                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">⌛</span>
                                        <h4>Recovery Time</h4>
                                    </div>
                                    <div className="recovery-time-box">
                                        {content.recovery || "3–5 days in hospital, 2–6 weeks of physical recovery and lifestyle adaptation."}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                    <button
                        className="plan-btn"
                        onClick={() => {
                            onClose();
                            navigate("/services", {
                                state: {
                                    specialtyId: deptData._id,
                                    specialtyName: deptName,
                                },
                            });
                        }}
                    >
                        Plan this treatment
                    </button>
                </div>
            </div>
        </div>
    );
}