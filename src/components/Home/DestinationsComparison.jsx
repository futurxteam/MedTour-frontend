import React from 'react';
import { comparisonData } from '../../pages/demoData';

const DestinationsComparison = () => {
    return (
        <section className="home-expansion-section" style={{ background: '#f8fafc' }}>
            <div className="container">
                <div className="section-title-alt">
                    <h2>Global Cost Transparency</h2>
                    <p>Compare treatment costs in India with other major global hubs. Quality affordable care is no longer a myth.</p>
                </div>
                <div className="comparison-container">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Procedure</th>
                                <th>USA</th>
                                <th>UK</th>
                                <th>India (Kerala)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 700 }}>{row.procedure}</td>
                                    <td>{row.usa}</td>
                                    <td>{row.uk}</td>
                                    <td className="price-india">{row.india}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '0.9rem' }}>
                    * Prices are approximate and vary based on hospital choice and patient condition.
                </p>
            </div>
        </section>
    );
};

export default DestinationsComparison;
