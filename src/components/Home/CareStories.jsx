import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Image imports
import abuAssanImg from './care_stories/Abu Assan.jpeg';
import salalahImg from './care_stories/Salalah.jpeg';
import hafedhImg from './care_stories/Hafedh.jpeg';
import nawafImg from './care_stories/Nawaf.jpeg';
import saidAlQalbaniImg from './care_stories/said al qalbani.jpeg';

const CareStories = () => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    const allStories = [
        { 
            id: 1, 
            img: abuAssanImg, 
            name: t('stories.list.1.name', 'Abu Assan and Family'), 
            location: t('stories.list.1.location', 'Oman'),
            hospital: t('stories.list.1.hospital', 'Aster Medcity, Kochi'),
            category: t('stories.list.1.category', 'Medical Health Check-up'), 
            quote: t('stories.list.1.quote', 'Bringing my family to Aster Medcity for our comprehensive check-up was the best decision. The MedTour team welcomed us warmly and guided us through every step with incredible care.'), 
            pos: 'center 20%' 
        },
        { 
            id: 2, 
            img: salalahImg, 
            name: t('stories.list.2.name', 'Salalah Guests'), 
            location: t('stories.list.2.location', 'Oman'),
            hospital: t('stories.list.2.hospital', 'Aster Medcity, Kochi'),
            category: t('stories.list.2.category', 'Medical Check-up'), 
            quote: t('stories.list.2.quote', 'Traveling from Salalah was effortless with MedTour. Aster Medcity’s advanced facilities and attentive doctors exceeded our expectations, and the hospitality in Kochi was heartwarming.'), 
            pos: 'center 25%' 
        },
        { 
            id: 3, 
            img: hafedhImg, 
            name: t('stories.list.3.name', 'Hafedh'), 
            location: t('stories.list.3.location', 'Oman'),
            hospital: t('stories.list.3.hospital', 'Aster Medcity, Kochi'),
            category: t('stories.list.3.category', 'Medical Health Check-up'), 
            quote: t('stories.list.3.quote', 'From the moment we arrived in Kochi to our medical health check-up at Aster Medcity, everything was organized to perfection. The professionalism and personal attention were exceptional.'), 
            pos: 'center 20%' 
        },
        { 
            id: 4, 
            img: nawafImg, 
            name: t('stories.list.4.name', 'Nawaf and Family'), 
            location: t('stories.list.4.location', 'Salalah, Oman'),
            hospital: t('stories.list.4.hospital', 'Aster Medcity, Kochi'),
            category: t('stories.list.4.category', 'Medical Check-up'), 
            quote: t('stories.list.4.quote', 'Visiting Aster Medcity with my family from Salalah felt completely comfortable and stress-free. MedTour\'s dedicated guidance made our medical journey smooth and pleasant.'), 
            pos: 'center 40%' 
        },
        { 
            id: 5, 
            img: saidAlQalbaniImg, 
            name: t('stories.list.5.name', 'Said Al Qalbani'), 
            location: t('stories.list.5.location', 'Oman'),
            hospital: t('stories.list.5.hospital', 'Aster Medcity, Kochi'),
            category: t('stories.list.5.category', 'Medical Check-up'), 
            quote: t('stories.list.5.quote', 'The medical standards and compassionate care at Aster Medcity are truly world-class. MedTour handled all the coordination flawlessly, allowing me to focus entirely on my health.'), 
            pos: 'center 20%' 
        },
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="home-expansion-section care-stories-root">
            <div className="container">
                <div className="section-title-alt">
                    <h2>{t('stories.title')}</h2>
                    <p>{t('stories.subtitle')}</p>
                </div>

                <div className="premium-scroll-container">
                    <button className="scroll-nav prev" onClick={() => scroll('left')} aria-label="Previous Stories">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <div className="story-boxes-wrapper" ref={scrollRef}>
                        {allStories.map((story) => (
                            <motion.div 
                                key={story.id} 
                                className="story-box-card"
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="story-box-image">
                                    <img 
                                        src={story.img} 
                                        alt={story.name} 
                                        style={{ objectPosition: story.pos }}
                                        loading="lazy"
                                    />
                                    <div className="story-box-overlay">
                                        <span className="surgery-tag-alt">{story.category}</span>
                                    </div>
                                </div>
                                <div className="story-box-content">
                                    <div className="patient-mini-meta">
                                        <h4>{story.name}</h4>
                                        <div className="story-meta-row">
                                            <span className="story-meta-location">
                                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                                                    <circle cx="12" cy="10" r="2.5"/>
                                                </svg>
                                                {story.location}
                                            </span>
                                            <span className="story-meta-dot">•</span>
                                            <span className="story-meta-hospital">
                                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                                                    <path d="M9 9h1M9 13h1M9 17h1"/>
                                                </svg>
                                                {story.hospital}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="story-description">"{story.quote}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="scroll-nav next" onClick={() => scroll('right')} aria-label="Next Stories">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CareStories;
