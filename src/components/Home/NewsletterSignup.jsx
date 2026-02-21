import React, { useState } from 'react';

const NewsletterSignup = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        console.log("Newsletter subscription for:", email);
        alert(`Thank you for subscribing, ${email}! You'll receive medical travel updates soon.`);
        setEmail("");
    };

    return (
        <section className="home-expansion-section">
            <div className="container">
                <div className="newsletter-card">
                    <h2>Stay Updated</h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Join 5,000+ others receiving the latest medical travel news and cost savings.</p>

                    <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">Subscribe</button>
                    </form>

                    <p className="privacy-notice">
                        We value your privacy. No spam, just high-quality health updates.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;
