import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { CheckCircle, FileText, PieChart, Briefcase, Users, BarChart2, Rocket, Zap, Shield, Target } from 'lucide-react';

const ImpactStudio = () => {
    useScrollAnimation();

    const valueProps = [
        { title: "Curated Investor Introductions", desc: "Share your startup with investors actively deploying capital across sectors.", icon: <Users size={24} /> },
        { title: "High-Signal Distribution", desc: "Your startup is presented through structured deal memos to our investor collective.", icon: <Zap size={24} /> },
        { title: "Strategic Feedback", desc: "Insights from experienced investors and operators who have built and backed companies.", icon: <Target size={24} /> },
        { title: "Impact Studio Services", desc: "Bespoke services for your startup, through our trusted network of partners.", icon: <Rocket size={24} /> },
        { title: "Long-Term Community", desc: "Become part of the Good Matter founder ecosystem and build lasting relationships.", icon: <Shield size={24} /> },
    ];

    const founderSteps = [
        { step: "01", title: "Apply", desc: "Submit your startup through the structured application form." },
        { step: "02", title: "Screening", desc: "Our team reviews and evaluates the startup for quality and fit." },
        { step: "03", title: "Deal Memo", desc: "Selected startups are featured in our investor communications." },
        { step: "04", title: "Introductions", desc: "Interested investors request meetings directly with founders." },
    ];

    const coreServices = [
        { title: "Pitch Deck Creation", desc: "Compelling narrative structure, professional design, and a clear value proposition tailored for VC expectations.", icon: <FileText size={24} /> },
        { title: "Financial Modeling + Valuation", desc: "Robust 3–5 year financial projections, unit economics, and cash flow analysis supporting your raise.", icon: <PieChart size={24} /> },
        { title: "Growth Stage Modeling", desc: "Detailed financial modelling and valuation for established companies seeking growth capital or strategic exits.", icon: <BarChart2 size={24} /> },
        { title: "Investor-Ready Bundle", desc: "Complete investor-ready bundle: Financial Model, Valuation Analysis, and Professional Pitch Deck.", icon: <Briefcase size={24} /> },
    ];

    const cfoPlans = [
        { name: "Starter", stage: "Pre-Revenue / Early Stage", features: ["Basic bookkeeping setup", "Compliance framework", "Monthly cash flow tracking", "Founder advisory"] },
        { name: "Growth", stage: "Scale-UP (25L – 5Cr ARR)", popular: true, features: ["Monthly MIS reports", "Burn rate analysis", "Compliance management", "Unit economics", "Investor updates"] },
        { name: "CFO Partner", stage: "Growth Stage (5Cr+)", features: ["Strategic oversight", "Board reporting", "Fundraising readiness", "Due diligence support", "Board advisory"] },
        { name: "Fundraising CFO", stage: "Series A+ / High-Growth", features: ["Data room prep", "Investor relations", "Cap table management", "Deal structuring", "Full process support"] },
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* HERO SECTION */}
            <section className="section text-center" style={{ padding: '8rem 0 6rem' }}>
                <div className="container animate-slide-up">
                    <div className="hero-badge mx-auto">Founders Ecosystem</div>
                    <h1 className="hero-title">Impact Studio for Founders</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px' }}>
                        Sophisticated infrastructure for high-growth startups. Get your venture in front of a curated network of private capital.
                    </p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/submit-deal" className="btn btn-primary btn-lg">Submit Startup</Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">Access Studio</Link>
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="section">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2 className="section-title">The Founder Edge</h2>
                        <p className="section-subtitle">We provide the network and tools for institutional-grade fundraising.</p>
                    </div>
                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                        {valueProps.map((vp, index) => (
                            <div key={index} className={`glass scroll-animate delay-${(index + 1) * 100}`} style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.6)' }}>
                                <div style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>{vp.icon}</div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.35rem', color: 'var(--color-primary)', fontWeight: '800' }}>{vp.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>{vp.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STEP PROCESS */}
            <section className="section">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2 className="section-title">Genesis Process</h2>
                        <p className="section-subtitle">A seamless journey from application to capital introduction.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                        {founderSteps.map((step, index) => (
                            <div key={index} className={`glass scroll-animate delay-${(index + 1) * 100}`} style={{ padding: '2.5rem 2rem', borderRadius: '32px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.6)' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-accent)', opacity: 0.1, lineHeight: 1, marginBottom: '0.75rem' }}>{step.step}</div>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: '800' }}>{step.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CFO PLANS */}
            <section className="section">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2 className="section-title">Fractional CFO Intelligence</h2>
                        <p className="section-subtitle">Institutional financial oversight paired with strategic fundraising readiness.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {cfoPlans.map((plan, index) => (
                            <div key={index} className={`glass scroll-animate delay-${(index + 1) * 100}`} style={{ padding: '3rem 2.5rem', borderRadius: '32px', border: plan.popular ? '2px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.6)', position: 'relative', background: plan.popular ? 'white' : 'rgba(255,255,255,0.4)', boxShadow: plan.popular ? 'var(--shadow-lg)' : 'var(--shadow-premium)' }}>
                                {plan.popular && <div style={{ position: 'absolute', top: 0, right: '2rem', transform: 'translateY(-50%)', background: 'var(--color-accent)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</div>}
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{plan.stage}</div>
                                <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: '800' }}>{plan.name}</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', padding: 0, listStyle: 'none' }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500' }}>
                                            <CheckCircle size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/contact" className={`btn w-100 ${plan.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'center', padding: '1rem' }}>Initiate Partnership</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="section">
                <div className="container">
                    <div className="glass scroll-animate" style={{ padding: '5rem 2rem', borderRadius: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-premium)' }}>
                        <h2 style={{ fontSize: '2.75rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Scale with Conviction.</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.25rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                            Join a network of select founders building the future of institutional-grade startups.
                        </p>
                        <div className="hero-actions justify-center" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            <Link to="/submit-deal" className="btn btn-primary btn-lg">Submit Startup</Link>
                            <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactStudio;
