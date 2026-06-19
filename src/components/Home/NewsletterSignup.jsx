import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewsletterSignup = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert(`Thank you for subscribing, ${email}!`);
        setEmail("");
    };

    return (
        <section className="home-expansion-section">
            <div className="container">
                <div className="newsletter-card">
                    <h2>{t('newsletter.title')}</h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{t('newsletter.subtitle')}</p>

                    <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder={t('newsletter.placeholder')}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">{t('newsletter.subscribe')}</button>
                    </form>

                    <p className="privacy-notice">
                        {t('newsletter.privacy')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;
