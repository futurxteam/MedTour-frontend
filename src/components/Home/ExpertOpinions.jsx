import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Video imports
import vid1 from './experts/1.MP4';
import vid2 from './experts/2.MP4';
import vid3 from './experts/3.MP4';

const ExpertOpinions = () => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    const expertData = [
        {
            id: 1,
            video: vid1,
            name: t('experts.list.1.name'),
            role: t('experts.list.1.role'),
            hospital: t('experts.list.1.hospital'),
            desc: t('experts.list.1.desc'),
            pos: 'top'
        },
        {
            id: 2,
            video: vid2,
            name: t('experts.list.2.name'),
            role: t('experts.list.2.role'),
            hospital: t('experts.list.2.hospital'),
            desc: t('experts.list.2.desc'),
            pos: 'top'
        },
        {
            id: 3,
            video: vid3,
            name: t('experts.list.3.name'),
            role: t('experts.list.3.role'),
            hospital: t('experts.list.3.hospital'),
            desc: t('experts.list.3.desc'),
            pos: 'top'
        }
    ];

    const VideoCard = ({ video, name, pos }) => {
        const [isPlaying, setIsPlaying] = useState(false);

        return (
            <div className="expert-video-container" onClick={() => setIsPlaying(true)}>
                {!isPlaying ? (
                    <div className="video-placeholder">
                        <video
                            src={`${video}#t=0.1`}
                            preload="metadata"
                            className="thumbnail-video"
                            style={{ objectPosition: pos }}
                        />
                        <div className="play-overlay-v2">
                            <div className="play-button-v2">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ) : (
                    <video
                        src={video}
                        controls
                        autoPlay
                        className="active-video"
                        controlsList="nofullscreen nodownload"
                        disablePictureInPicture
                        style={{ objectPosition: pos }}
                    />
                )}
            </div>
        );
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="home-expansion-section experts-root">
            <div className="container">
                <div className="section-title-alt">
                    <h2>{t('experts.title')}</h2>
                    <p>{t('experts.subtitle')}</p>
                </div>

                <div className="premium-scroll-container">
                    <button className="scroll-nav prev" onClick={() => scroll('left')}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="story-boxes-wrapper" ref={scrollRef}>
                        {expertData.map((expert) => (
                            <motion.div
                                key={expert.id}
                                className="expert-box-card"
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="expert-box-media">
                                    <VideoCard video={expert.video} name={expert.name} pos={expert.pos} />
                                    <div className="expert-box-badge">{t('experts.badge')}</div>
                                </div>
                                <div className="expert-box-info">
                                    <h4 className="expert-name">{expert.name}</h4>
                                    <span className="expert-role">{expert.role}</span>
                                    <p className="expert-hospital">{expert.hospital}</p>
                                    <p className="expert-desc">{expert.desc}</p>
                                    <div className="expert-box-footer">
                                        <div className="verified-badge">
                                            <svg viewBox="0 0 24 24" width="16" height="16">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {t('common.certified_expert')}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="scroll-nav next" onClick={() => scroll('right')}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ExpertOpinions;
