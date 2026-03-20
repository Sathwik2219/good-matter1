import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { CheckCircle, FileText, PieChart, Briefcase, Users, BarChart2, Rocket, Zap, Shield, Target, ArrowRight, Star } from 'lucide-react';

const Studio = () => {
    useScrollAnimation();
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'programmatic'
    const [billingCycle, setBillingCycle] = useState('monthly');

    const valueProps = [
        { title: "Curated Introductions", desc: "Share your startup with investors actively deploying capital.", icon: <Users size={24} /> },
        { title: "High-Signal Distribution", desc: "Structured deal memos presented to our investor collective.", icon: <Zap size={24} /> },
        { title: "Strategic Feedback", desc: "Insights from experienced operators who have built and backed companies.", icon: <Target size={24} /> },
        { title: "Institutional Quality", desc: "Bespoke services to professionalize your venture for VC scrutiny.", icon: <Shield size={24} /> },
    ];

    const coreServices = [
        { title: "Pitch Deck Orchestration", desc: "Compelling narrative structure and professional design tailored for VC expectations.", icon: <FileText size={24} /> },
        { title: "Financial Modeling", desc: "Robust 3–5 year projections, unit economics, and cash flow analysis.", icon: <PieChart size={24} /> },
        { title: "Growth Stage Advisory", desc: "Valuation analysis for established companies seeking growth capital.", icon: <BarChart2 size={24} /> },
        { title: "Investor-Ready Bundle", desc: "Complete bundle: Financial Model, Valuation, and Professional Pitch Deck.", icon: <Briefcase size={24} /> },
    ];

    const cfoPlans = [
        { name: "Starter", stage: "Pre-Revenue / Early Stage", features: ["Bookkeeping setup", "Compliance framework", "Cash flow tracking", "Founder advisory"] },
        { name: "Growth", stage: "Scale-UP (25L – 5Cr ARR)", popular: true, features: ["Monthly MIS reports", "Burn rate analysis", "Unit economics", "Investor updates"] },
        { name: "CFO Partner", stage: "Growth Stage (5Cr+)", features: ["Strategic oversight", "Board reporting", "Fundraising readiness", "Due diligence support"] },
    ];

    const tiers = [
        {
            id: 1, score: '80–100', tier: 'Tier 1 - Alpha',
            monthly: 1499, color: '#fab1a0', bg: 'rgba(250, 177, 160, 0.1)',
            features: ['Priority deal placement', 'Advanced AI Analysis', 'Direct Investor Linkage'],
            badge: 'Highest Conviction'
        },
        {
            id: 2, score: '60–80', tier: 'Tier 2 - Growth',
            monthly: 2499, color: '#74b9ff', bg: 'rgba(116, 185, 255, 0.1)',
            features: ['Standard distribution', 'Core AI Scoring', 'Real-time interest alerts'],
            badge: 'Founder Favorite'
        },
        {
            id: 3, score: '40–60', tier: 'Tier 3 - Discovery',
            monthly: 3499, color: '#a29bfe', bg: 'rgba(162, 155, 254, 0.1)',
            features: ['Basic visibility', 'Standard AI Scoring', 'Strategic feedback'],
            badge: 'Early Traction'
        }
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* HERO */}
            <section className="section text-center" style={{ padding: '8rem 0 4rem' }}>
                <div className="container animate-slide-up">
                    <div className="hero-badge mx-auto">Impact Studio & Services</div>
                    <h1 className="hero-title">Institutional Growth <span className="text-highlight">Infrastructure</span></h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '800px' }}>
                        Professionalize your fundraising journey with bespoke modeling, advisory, and algorithmic deal distribution.
                    </p>
                    
                    {/* HUB TOGGLE */}
                    <div style={{ 
                        display: 'inline-flex', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)',
                        padding: '6px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: 'var(--shadow-premium)', marginTop: '3rem'
                    }}>
                        <button onClick={() => setActiveTab('services')} style={{ padding: '12px 32px', borderRadius: '16px', border: 'none', background: activeTab === 'services' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'services' ? '#fff' : 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.4s ease', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Studio Services
                        </button>
                        <button onClick={() => setActiveTab('programmatic')} style={{ padding: '12px 32px', borderRadius: '16px', border: 'none', background: activeTab === 'programmatic' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'programmatic' ? '#fff' : 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.4s ease', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Programmatic Access
                        </button>
                    </div>
                </div>
            </section>

            {activeTab === 'services' ? (
                <>
                    {/* CORE SERVICES */}
                    <section className="section">
                        <div className="container">
                            <div className="section-header text-center scroll-animate">
                                <h2 className="section-title">The Founder Edge</h2>
                                <p className="section-subtitle">Bespoke services to ensure your startup is institutional-grade.</p>
                            </div>
                            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                {coreServices.map((service, index) => (
                                    <div key={index} className="glass scroll-animate" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.4)' }}>
                                        <div style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>{service.icon}</div>
                                        <h3 style={{ marginBottom: '1rem', fontSize: '1.35rem', color: 'var(--color-primary)', fontWeight: '800' }}>{service.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>{service.desc}</p>
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
                                <p className="section-subtitle">Scalable financial partnership as your venture grows.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                {cfoPlans.map((plan, index) => (
                                    <div key={index} className="glass scroll-animate" style={{ padding: '3rem 2.5rem', borderRadius: '32px', border: plan.popular ? '2px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.6)', position: 'relative', background: plan.popular ? 'white' : 'rgba(255,255,255,0.4)' }}>
                                        {plan.popular && <div style={{ position: 'absolute', top: 0, right: '2rem', transform: 'translateY(-50%)', background: 'var(--color-accent)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>Recommended</div>}
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{plan.stage}</div>
                                        <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: '800' }}>{plan.name}</h3>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', listStyle: 'none', padding: 0 }}>
                                            {plan.features.map((f, i) => (
                                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500' }}>
                                                    <CheckCircle size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/contact" className={`btn w-100 ${plan.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'center' }}>Connect with CFO</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* PROGRAMMATIC ACCESS */}
                    <section className="section">
                        <div className="container">
                            <div className="section-header text-center scroll-animate">
                                <h2 className="section-title">Score-Based Subscriptions</h2>
                                <p className="section-subtitle">GoodMatter utilizes a proprietary benchmark-driven scoring engine.</p>
                            </div>
                            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
                                {tiers.map(tier => (
                                    <div key={tier.id} className="glass scroll-animate" style={{ borderRadius: '36px', padding: '3.5rem 2.5rem', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'inline-block', padding: '6px 14px', background: tier.bg, color: tier.color, borderRadius: '25px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '1.5rem', width: 'fit-content' }}>AI SCORE: {tier.score}</div>
                                        <h3 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1rem' }}>{tier.tier}</h3>
                                        <div style={{ marginBottom: '2.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>₹</span>
                                                <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>{tier.monthly.toLocaleString('en-IN')}</span>
                                                <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>/mo</span>
                                            </div>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                                            {tier.features.map((f, i) => (
                                                <li key={i} style={{ display: 'flex', gap: '0.875rem', color: 'var(--color-text-main)', fontSize: '1rem', fontWeight: '500' }}>
                                                    <CheckCircle size={20} style={{ color: '#00b894', flexShrink: 0 }} /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/submit-deal" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Access Portal</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PRIORITY NETWORK */}
                    <section className="section">
                        <div className="container">
                            <div className="glass scroll-animate" style={{ background: 'white', borderRadius: '40px', padding: '4rem 5rem', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-premium)', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: '1 1 500px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <Star size={32} fill="#fdcb6e" style={{ color: '#fdcb6e' }} />
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--color-primary)' }}>Priority Network</h2>
                                    </div>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', lineHeight: 1.6, fontWeight: '500' }}>The definitive membership for institutional-grade founders. Uncapped investor credits and strategic advisory.</p>
                                </div>
                                <div className="glass" style={{ background: 'rgba(0,0,0,0.02)', padding: '3rem', borderRadius: '32px', textAlign: 'center', minWidth: '320px' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>₹25,000<span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>/mo</span></div>
                                    <Link to="/contact" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Initiate Priority</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* CLOSING CTA */}
            <section className="section">
                <div className="container">
                    <div className="glass scroll-animate" style={{ padding: '5rem 2rem', borderRadius: '40px', textAlign: 'center', background: 'var(--color-primary)', color: 'white' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Scale with Context.</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.2rem', opacity: 0.8 }}>Join the community of founders building the next generation of value.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            <Link to="/submit-deal" className="btn btn-primary" style={{ background: 'white', color: 'var(--color-primary)', border: 'none' }}>Submit Startup</Link>
                            <Link to="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Studio;
