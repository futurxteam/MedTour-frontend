import React from 'react';
import { testimonials } from '../../pages/demoData';

const CareStories = () => {
    return (
        <section className="home-expansion-section" style={{ background: 'white' }}>
            <div className="container">
                <div className="section-title-alt">
                    <h2>Real Care Stories</h2>
                    <p>Hear from patients who traveled across the world to find healing and hope through MedTour.</p>
                </div>
                <div className="stories-grid">
                    {testimonials.map(story => (
                        <div key={story.id} className="story-card">
                            <div className="patient-info">
                                <img src={story.img} alt={story.name} className="patient-img" />
                                <div className="patient-meta">
                                    <h4>{story.name}</h4>
                                    <span>{story.country}</span>
                                </div>
                            </div>
                            <p className="story-content">"{story.review}"</p>
                            <span className="surgery-tag">{story.surgery}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareStories;
