import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LineChart, Users, Sparkles, MessageSquare } from 'lucide-react';

const Founders = () => {
    useScrollAnimation();

    const valueProps = [
        {
            icon: <Users size={24} className="feature-icon" />,
            title: "Curated Investor Introductions",
            desc: "Get introduced directly to active angels, family offices, and VCs relevant to your industry and stage."
        },
        {
            icon: <Sparkles size={24} className="feature-icon" />,
            title: "High-Signal Deal Distribution",
            desc: "Your startup is presented professionally to a closed network that actually deploys capital."
        },
        {
            icon: <MessageSquare size={24} className="feature-icon" />,
            title: "Strategic Feedback",
            desc: "Receive actionable insights on your pitch and business model from experienced operators."
        },
        {
            icon: <LineChart size={24} className="feature-icon" />,
            title: "Capital Readiness",
            desc: "Leverage our Impact Studio to professionalize your financial models and pitch materials."
        }
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* Hero */}
            <section className="section section-dark text-center">
                <div className="container animate-slide-up">
                    <div className="hero-badge">For Founders</div>
                    <h1 className="hero-title">Impact Studio for Founders</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
                        Get your startup in front of a highly curated network of active investors who are aligned with your vision.
                    </p>
                    <div className="hero-actions justify-center">
                        <Link to="/apply" className="btn btn-accent btn-lg">Apply for Funding</Link>
                        <Link to="/impact-studio" className="btn btn-outline-light btn-lg">Explore Services</Link>
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section className="section bg-white text-center">
                <div className="container scroll-animate">
                    <h2>The GoodMatter Process</h2>
                    <p className="section-subtitle mt-4 mb-4" style={{ margin: '1rem auto 4rem' }}>A streamlined path from application to investment.</p>

                    <div className="timeline" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                        {[
                            { step: '1', title: 'Apply', desc: 'Submit your pitch deck, financials, and team details for review.' },
                            { step: '2', title: 'Startup Screening', desc: 'Our team evaluates your business model, traction, and market potential.' },
                            { step: '3', title: 'Deal Memo Creation', desc: 'We craft a professional investment memo highlighting your strengths.' },
                            { step: '4', title: 'Investor Introductions', desc: 'Your deal is pushed to our private network, opening direct lines of communication.' },
                        ].map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1.5rem', background: 'var(--color-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }} className={`scroll-animate delay-${(index + 1) * 100}`}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                    {item.step}
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Prop */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Value Proposition</h2>
                        <p className="section-subtitle">Why exceptional founders choose our platform.</p>
                    </div>
                    <div className="features-grid">
                        {valueProps.map((prop, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="icon-wrapper">
                                    {prop.icon}
                                </div>
                                <h3>{prop.title}</h3>
                                <p>{prop.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Founders;
