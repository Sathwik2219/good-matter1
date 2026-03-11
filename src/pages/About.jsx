import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
    useScrollAnimation();

    return (
        <div className="page-wrapper pt-20">
            {/* HERO */}
            <section className="section section-dark text-center">
                <div className="container animate-slide-up">
                    <div className="hero-badge" style={{ margin: '0 auto 1rem', display: 'inline-block' }}>About Us</div>
                    <h1 className="hero-title">About GoodMatter</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        We believe the best investment opportunities emerge from trusted communities.
                    </p>
                </div>
            </section>

            {/* MISSION */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="scroll-animate">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Our Mission</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Good Matter connects exceptional founders with thoughtful investors through curated, high-quality deal flow.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>
                            The private markets have become too noisy. We are building a curated community that connects high-quality founders with aligned investors and facilitates high-signal startup execution. Every deal is reviewed, vetted, and distributed privately to our investor community.
                        </p>
                    </div>

                    {/* WHAT WE DO */}
                    <div className="scroll-animate delay-100" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>What We Do</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                            We review early-stage startups and selectively share them with angels, venture capitalists, and operators. Our process ensures that every deal reaching our network is curated for quality, fit, and potential — giving investors access to opportunities they would not otherwise see, and giving founders the structured exposure they need.
                        </p>
                    </div>

                    {/* PHILOSOPHY */}
                    <div className="scroll-animate delay-200">
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Our Philosophy</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ padding: '2rem', background: 'var(--color-secondary)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-accent)' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Quality over Quantity</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>We reject the marketplace model. We don't want thousands of mediocre deals — we want the top decile that we have vetted personally and stand behind with conviction.</p>
                            </div>
                            <div style={{ padding: '2rem', background: 'var(--color-secondary)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-highlight)' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Community over Transactions</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>Investing is a partnership, not a simple swap of capital for equity. We prioritize bringing together operators, angels, and founders who can help each other win.</p>
                            </div>
                            <div style={{ padding: '2rem', background: 'var(--color-secondary)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-primary)' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Alignment over Hype</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>We look for sustainable business models, disciplined capital allocation, and founders building for long-term value creation — not short-term flips.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-dark section text-center">
                <div className="container cta-container scroll-animate">
                    <h2>Good deals. Good people. Good Matter.</h2>
                    <p className="cta-subtitle">Join our community of aligned investors and exceptional founders.</p>
                    <div className="hero-actions justify-center mt-4">
                        <Link to="/login" className="btn btn-accent btn-lg">Join as Investor</Link>
                        <Link to="/apply" className="btn btn-outline-light btn-lg">Apply as Founder</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
