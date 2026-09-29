import React from "react";
import { useTranslation } from "react-i18next";
import "./styles/SpecialityModal.css";
import { specialityContent } from "../config/specialityContent";
import { useNavigate } from "react-router-dom";

export default function SpecialityModal({ deptName, deptData, imgUrl, onClose }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!deptData) return null;

    // Resolve content dynamically
    const content =
        specialityContent[deptName] ||
        specialityContent[deptName?.toLowerCase()] ||
        {};

    const translatedDeptName = t(`depts.${deptName}`, deptName);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* HERO IMAGE HEADER */}
                <div className="modal-hero" style={{ backgroundImage: `url(${imgUrl})` }}>
                    <div className="hero-content">
                        <div className="dept-icon">
                            <i className="medical-icon">⚕️</i>
                        </div>
                        <h2>{translatedDeptName}</h2>
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
                                        <h4>{t('modal.overview_title')}</h4>
                                    </div>
                                    <p>{content.overview || t('modal.overview_desc')}</p>
                                </section>

                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">🧬</span>
                                        <h4>{t('modal.procedures_title')}</h4>
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
                                        <h4>{t('modal.outcomes_title')}</h4>
                                    </div>
                                    <p>{content.outcomes || t('modal.outcomes_desc')}</p>
                                </section>

                                <section className="info-section">
                                    <div className="section-title">
                                        <span className="icon">⌛</span>
                                        <h4>{t('modal.recovery_title')}</h4>
                                    </div>
                                    <div className="recovery-time-box">
                                        {content.recovery || t('modal.recovery_desc')}
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
                        {t('modal.plan_btn')}
                    </button>
                </div>
            </div>
        </div>
    );
}