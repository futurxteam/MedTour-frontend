import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Image imports
import img1 from './care_stories/1.JPG.jpeg';
import img2 from './care_stories/2.JPG.jpeg';
import img3 from './care_stories/3.JPG.jpeg';
import img4 from './care_stories/4.JPG.jpeg';
import img5 from './care_stories/5.JPG.jpeg';
import img6 from './care_stories/6.JPG.jpeg';

const CareStories = () => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    const allStories = [
        { 
            id: 1, 
            img: img1, 
            name: t('stories.list.1.name'), 
            country: t('stories.list.1.country'), 
            surgery: t('stories.list.1.surgery'), 
            review: t('stories.list.1.review'), 
            pos: 'center' 
        },
        { 
            id: 2, 
            img: img2, 
            name: t('stories.list.2.name'), 
            country: t('stories.list.2.country'), 
            surgery: t('stories.list.2.surgery'), 
            review: t('stories.list.2.review'), 
            pos: 'center' 
        },
        { 
            id: 3, 
            img: img3, 
            name: t('stories.list.3.name'), 
            country: t('stories.list.3.country'), 
            surgery: t('stories.list.3.surgery'), 
            review: t('stories.list.3.review'), 
            pos: 'top' 
        },
        { 
            id: 4, 
            img: img4, 
            name: t('stories.list.4.name'), 
            country: t('stories.list.4.country'), 
            surgery: t('stories.list.4.surgery'), 
            review: t('stories.list.4.review'), 
            pos: '20% 20%' 
        },
        { 
            id: 5, 
            img: img5, 
            name: t('stories.list.5.name'), 
            country: t('stories.list.5.country'), 
            surgery: t('stories.list.5.surgery'), 
            review: t('stories.list.5.review'), 
            pos: 'center' 
        },
        { 
            id: 6, 
            img: img6, 
            name: t('stories.list.6.name'), 
            country: t('stories.list.6.country'), 
            surgery: t('stories.list.6.surgery'), 
            review: t('stories.list.6.review'), 
            pos: 'top' 
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
                    <button className="scroll-nav prev" onClick={() => scroll('left')}>
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
                                    />
                                    <div className="story-box-overlay">
                                        <span className="surgery-tag-alt">{story.surgery}</span>
                                    </div>
                                </div>
                                <div className="story-box-content">
                                    <div className="stars">★★★★★</div>
                                    <p className="story-review">"{story.review}"</p>
                                    <div className="story-box-footer">
                                        <div className="patient-mini-meta">
                                            <h4>{story.name}</h4>
                                            <span>{story.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="scroll-nav next" onClick={() => scroll('right')}>
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
