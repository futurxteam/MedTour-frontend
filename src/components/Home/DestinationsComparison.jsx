import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { comparisonData, exchangeRates } from '../../pages/demoData';

const DestinationsComparison = () => {
    const { t } = useTranslation();
    const [currency, setCurrency] = useState('USD');

    const formatPrice = (priceInUsd) => {
        const { rate, symbol } = exchangeRates[currency];
        const converted = priceInUsd * rate;
        
        return `${symbol}${converted.toLocaleString(undefined, { 
            maximumFractionDigits: 0 
        })}`;
    };

    const getProcedureName = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('knee')) return t('comparison.list.knee');
        if (lowerName.includes('cardiac')) return t('comparison.list.cardiac');
        if (lowerName.includes('ivf')) return t('comparison.list.ivf');
        if (lowerName.includes('dental')) return t('comparison.list.dental');
        return name;
    };

    return (
        <section className="home-expansion-section" style={{ background: '#f8fafc' }}>
            <div className="container">
                <div className="section-title-alt">
                    <h2>{t('comparison.title')}</h2>
                    <p>{t('comparison.subtitle')}</p>
                </div>

                <div className="currency-selector-wrapper">
                    <span className="currency-dropdown-label">{t('comparison.show_in')}</span>
                    <select 
                        className="currency-select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {Object.entries(exchangeRates).map(([key]) => (
                            <option key={key} value={key}>{t(`comparison.currencies.${key}`)}</option>
                        ))}
                    </select>
                </div>

                <div className="comparison-container">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>{t('comparison.procedure')}</th>
                                <th>USA</th>
                                <th>UK</th>
                                <th>UAE</th>
                                <th>
                                    <span className="hide-mobile">{t('comparison.india')}</span>
                                    <span className="show-mobile">India</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 700 }}>{getProcedureName(row.procedure)}</td>
                                    <td>{formatPrice(row.usa)}</td>
                                    <td>{formatPrice(row.uk)}</td>
                                    <td>{formatPrice(row.uae)}</td>
                                    <td className="price-india">{formatPrice(row.india)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '0.9rem' }}>
                    {t('comparison.disclaimer')}
                </p>
            </div>
        </section>
    );
};

export default DestinationsComparison;
