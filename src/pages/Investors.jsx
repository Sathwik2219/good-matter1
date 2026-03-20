import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Target, Lock, Presentation, Users } from 'lucide-react';

const Investors = () => {
    useScrollAnimation();

    const benefits = [
        {
            icon: <Target size={24} className="feature-icon" />,
            title: "Curated Dealflow",
            desc: "Stop sifting through noise. We present only top-decile opportunities that have passed our internal screening."
        },
        {
            icon: <Presentation size={24} className="feature-icon" />,
            title: "Extensive Due Diligence",
            desc: "Access full pitch decks, deal memos, financial models, and founder backgrounds for every listed deal."
        },
        {
            icon: <Users size={24} className="feature-icon" />,
            title: "Direct Founder Introductions",
            desc: "Request introductions to founders seamlessly through the platform when you're ready to engage."
        },
        {
            icon: <Lock size={24} className="feature-icon" />,
            title: "Private Investor Network",
            desc: "Connect with like-minded angels, operators, and VCs to co-invest and syndicate deals."
        }
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* Hero */}
            <section className="section section-dark text-center">
                <div className="container animate-slide-up">
                    <div className="hero-badge">For Investors</div>
                    <h1 className="hero-title">Private Access to Top Tier Startups</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
                        Gain selective access to institutional-grade startup opportunities before they hit the broader market.
                    </p>
                    <Link to="/login" className="btn btn-accent btn-lg">Investor Login</Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section bg-deep">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Why Invest with GoodMatter?</h2>
                        <p className="section-subtitle">We do the heavy lifting of sourcing and screening so you can focus on investing.</p>
                    </div>
                    <div className="features-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="icon-wrapper">
                                    {benefit.icon}
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-deep text-center">
                <div className="container scroll-animate">
                    <h2>Ready to see our dealflow?</h2>
                    <p className="section-subtitle mt-4 mb-4" style={{ margin: '1rem auto 2rem' }}>
                        Membership is invite-only or by application to ensure high signal-to-noise ratio.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg">Investor Login</Link>
                </div>
            </section>
        </div>
    );
};

export default Investors;
