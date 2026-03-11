import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { CheckCircle, FileText, PieChart, Briefcase, Users, BarChart2 } from 'lucide-react';

const ImpactStudio = () => {
    useScrollAnimation();

    const valueProps = [
        { title: "Curated Investor Introductions", desc: "Share your startup with investors actively deploying capital across sectors." },
        { title: "High-Signal Deal Distribution", desc: "Your startup is presented through structured deal memos to our investor collective." },
        { title: "Strategic Feedback", desc: "Insights from experienced investors and operators who have built and backed companies." },
        { title: "Impact Studio for Founders", desc: "Bespoke services for your startup, through our trusted network of partners." },
        { title: "Long-Term Community", desc: "Become part of the Good Matter founder ecosystem and build lasting relationships." },
    ];

    const founderSteps = [
        { step: "01", title: "Apply", desc: "Submit your startup through the structured application form." },
        { step: "02", title: "Screening", desc: "Our team reviews and evaluates the startup for quality and fit." },
        { step: "03", title: "Deal Memo", desc: "Selected startups are featured in our investor communications." },
        { step: "04", title: "Investor Introductions", desc: "Interested investors request meetings directly with founders." },
    ];

    const coreServices = [
        { title: "Pitch Deck Creation", desc: "Compelling narrative structure, professional design, and a clear value proposition tailored for VC expectations.", icon: <FileText size={24} className="feature-icon" /> },
        { title: "Startup – Financial Modeling + Valuation", desc: "Robust 3–5 year financial projections, unit economics, and cash flow analysis supporting your raise.", icon: <PieChart size={24} className="feature-icon" /> },
        { title: "Running Company – Financial Modeling + Valuation", desc: "Detailed financial modelling and valuation for established companies seeking growth capital or strategic exits.", icon: <BarChart2 size={24} className="feature-icon" /> },
        { title: "Startup – Financial Modeling + Valuation + Pitch Deck (Combo)", desc: "Complete investor-ready bundle: Financial Model, Valuation Analysis, and Professional Pitch Deck in one package.", icon: <Briefcase size={24} className="feature-icon" /> },
    ];

    const cfoPlans = [
        { name: "Starter", stage: "Pre-Revenue to Very Early Stage", features: ["Basic bookkeeping setup", "Initial compliance", "Monthly cash flow tracking", "Founder advisory sessions"] },
        { name: "Growth", stage: "Early Stage (25L – 5Cr ARR)", popular: true, features: ["Monthly MIS reports", "Burn rate analysis", "Compliance management", "Unit economics tracking", "Investor update templates"] },
        { name: "CFO Partner", stage: "Growth Stage (5Cr+)", features: ["Advanced financial oversight", "Board reporting", "Fundraising readiness", "Due diligence support", "Strategic financial advisory"] },
        { name: "Fundraising CFO", stage: "Pre-Series A / Series A / High-Growth", features: ["Data room preparation", "Investor relations", "Cap table management", "Deal structuring support", "Full fundraise process support"] },
    ];

    const additionalServices = [
        { cat: "One-Time Setup", items: ["Company Registration", "LLP Registration", "GST Registration", "Accounting Software Setup"] },
        { cat: "Fundraising & Growth", items: ["Startup Financial Model", "Investor-Ready Financial Model + Valuation", "Fundraising Legal Docs", "ESOP Policy Setup"] },
        { cat: "Add-On Services", items: ["Pitch Deck Financial Slides", "Revenue Leakage Audit"] },
    ];

    const blkbookServices = [
        { title: "One-Time Events", desc: "Curated networking and pitch events connecting founders with the right investors and operators." },
        { title: "Memberships", desc: "Exclusive access to ongoing founder and investor community gatherings." },
        { title: "Private / Corporate Sessions", desc: "Bespoke sessions for teams, companies, and leadership groups." },
        { title: "Founder-Led Investor Matchmaking", desc: "Structured matching between founders and pre-qualified investors based on thesis alignment." },
        { title: "Private Matchmaking Sessions", desc: "One-on-one curated introductions for high-conviction deals and partnerships." },
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* PAGE INTRO */}
            <section className="section bg-light text-center">
                <div className="container animate-slide-up">
                    <div className="hero-badge" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>For Founders</div>
                    <h1 className="hero-title" style={{ color: 'var(--color-primary)' }}>Impact Studio for Founders</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
                        Get your startup in front of a curated network of investors actively deploying capital.
                    </p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/apply" className="btn btn-primary btn-lg">Submit Your Startup</Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">Know More</Link>
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Why Apply to Good Matter?</h2>
                        <p className="section-subtitle">We give founders access to a curated, high-conviction investor network.</p>
                    </div>
                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        {valueProps.map((vp, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`}>
                                <h3 style={{ marginBottom: '0.5rem' }}>{vp.title}</h3>
                                <p>{vp.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOUNDER PROCESS */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>The Founder Process</h2>
                        <p className="section-subtitle">A structured, four-stage process from application to investor introduction.</p>
                    </div>
                    <div className="deals-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                        {founderSteps.map((step, index) => (
                            <div key={index} className={`deal-card scroll-animate delay-${(index + 1) * 100}`} style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-accent)', opacity: 0.2, lineHeight: 1, marginBottom: '0.5rem' }}>{step.step}</div>
                                <h3 style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE SERVICES */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Services</h2>
                        <p className="section-subtitle">Professionalize your startup with our financial modeling, pitch creation, and advisory services.</p>
                    </div>
                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        {coreServices.map((service, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="icon-wrapper">{service.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VIRTUAL CFO */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Virtual CFO Plans</h2>
                        <p className="section-subtitle">Scalable financial partnership as your startup grows — from pre-revenue to fundraising stage.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                        {cfoPlans.map((plan, index) => (
                            <div key={index} className={`scroll-animate delay-${(index + 1) * 100}`} style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: plan.popular ? '2px solid var(--color-accent)' : '1px solid rgba(11,15,26,0.1)', position: 'relative' }}>
                                {plan.popular && <div style={{ position: 'absolute', top: 0, right: '2rem', transform: 'translateY(-50%)', background: 'var(--color-accent)', color: 'white', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 'bold' }}>Most Popular</div>}
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{plan.stage}</div>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>{plan.name}</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--color-text-muted)' }}>
                                            <CheckCircle size={18} style={{ color: 'var(--color-highlight)', flexShrink: 0, marginTop: '2px' }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/contact" className={`btn w-100 ${plan.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'center' }}>Contact for Pricing</Link>
                            </div>
                        ))}
                    </div>

                    {/* Additional Services Table */}
                    <div className="scroll-animate" style={{ marginTop: '4rem' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Additional Services</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                            {additionalServices.map((group, gi) => (
                                <div key={gi} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid rgba(11,15,26,0.08)' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', marginBottom: '1rem' }}>{group.cat}</div>
                                    {group.items.map((item, ii) => (
                                        <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: ii < group.items.length - 1 ? '1px solid var(--color-secondary)' : 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            <CheckCircle size={14} style={{ color: 'var(--color-highlight)', flexShrink: 0 }} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BLKBOOK x GOODMATTER */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <div className="hero-badge" style={{ margin: '0 auto 1rem', display: 'inline-block', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>Community</div>
                        <h2>BLKBOOK × GoodMatter</h2>
                        <p className="section-subtitle">Exclusive community events and matchmaking experiences for founders and investors.</p>
                    </div>
                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                        {blkbookServices.map((service, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`} style={{ borderTop: '3px solid var(--color-accent)' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-dark section text-center">
                <div className="container cta-container scroll-animate">
                    <h2>Ready to Get Your Startup in Front of Investors?</h2>
                    <p className="cta-subtitle">Apply now to be considered for the Good Matter curated dealflow.</p>
                    <div className="hero-actions justify-center mt-4">
                        <Link to="/apply" className="btn btn-accent btn-lg">Submit Your Startup</Link>
                        <Link to="/contact" className="btn btn-outline-light btn-lg">Know More</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactStudio;
