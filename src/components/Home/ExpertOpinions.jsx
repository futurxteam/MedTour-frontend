import React from 'react';
import { experts } from '../../pages/demoData';

const ExpertOpinions = () => {
    return (
        <section className="home-expansion-section" style={{ background: '#f8fafc' }}>
            <div className="container">
                <div className="section-title-alt">
                    <h2>Expert Perspectives</h2>
                    <p>Insights from Kerala's leading medical practitioners on why MedTour is the gold standard for global patients.</p>
                </div>
                <div className="experts-grid">
                    {experts.map(expert => (
                        <div key={expert.id} className="expert-card">
                            <div className="expert-avatar">👨‍⚕️</div>
                            <div className="expert-info">
                                <h4>{expert.name}</h4>
                                <span className="expert-specialty">{expert.specialty}</span>
                                <p className="expert-quote">"{expert.quote}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExpertOpinions;
