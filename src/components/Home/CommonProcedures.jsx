import React, { useState, useEffect } from 'react';
import { getCommonProcedures } from '../../api/api';

const CommonProcedures = () => {
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
    }, []);

    return (
        <section className="home-expansion-section">
            <div className="container">
                <div className="section-title-alt">
                    <h2>Popular Treatments</h2>
                    <p>Highly sought-after medical procedures performed by Kerala's most trusted hospitals.</p>
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
