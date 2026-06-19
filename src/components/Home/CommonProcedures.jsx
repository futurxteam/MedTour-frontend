import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCommonProcedures } from '../../api/api';

const CommonProcedures = () => {
    const { t, i18n } = useTranslation();
    const [procedures, setProcedures] = useState([]);

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const res = await getCommonProcedures();
                setProcedures(res.data.commonProcedures || []);
            } catch (err) {
                console.error("Failed to fetch procedures", err);
            }
        };
        fetchProcedures();
    }, [i18n.language]);

    return (
        <section className="home-expansion-section">
            <div className="container">
                <div className="section-title-alt">
                    <h2>{t('procedures.title')}</h2>
                    <p>{t('procedures.subtitle')}</p>
                </div>
                <div className="procedures-grid">
                    {procedures.map(proc => (
                        <div key={proc._id} className="procedure-item">
                            <div className="proc-info">
                                <h4>{proc.surgeryName}</h4>
                                <span>{proc.specialization?.name}</span>
                            </div>
                            <div style={{ color: '#0d9488', fontSize: '1.25rem' }}>🩺</div>
                        </div>
                    ))}
                    {procedures.length === 0 && <p style={{ textAlign: 'center', width: '100%' }}>No procedures listed yet.</p>}
                </div>
            </div>
        </section>
    );
};

export default CommonProcedures;
