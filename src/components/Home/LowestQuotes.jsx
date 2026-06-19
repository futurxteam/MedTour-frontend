import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLowestQuotes } from '../../api/api';

const LowestQuotes = () => {
    const { t, i18n } = useTranslation();
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await getLowestQuotes();
                setQuotes(res.data.lowestQuotes || []);
            } catch (err) {
                console.error("Failed to fetch quotes", err);
            }
        };
        fetchQuotes();
    }, [i18n.language]);

    return (
        <section className="home-expansion-section" style={{ background: '#f8fafc' }}>
            <div className="container">
                <div className="section-title-alt">
                    <h2>{t('quotes.title')}</h2>
                    <p>{t('quotes.subtitle')}</p>
                </div>
                <div className="quotes-list">
                    {quotes.map(quote => (
                        <div key={quote._id} className="quote-row">
                            <div>
                                <h4>{quote.surgeryName}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{quote.specialization?.name}</p>
                            </div>
                            <div className="quote-price">
                                <label>{t('procedures.starting_from')}</label>
                                <span>₹{quote.minimumCost?.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {quotes.length === 0 && <p style={{ textAlign: 'center' }}>Loading price registry...</p>}
                </div>
            </div>
        </section>
    );
};

export default LowestQuotes;
