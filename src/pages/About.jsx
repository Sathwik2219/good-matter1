import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import saswatImg from '../assets/team/saswat.png';
import { Shield, Users, Target, Zap, Globe, Heart } from 'lucide-react';

const About = () => {
    useScrollAnimation();

    const values = [
      { 
        title: "Quality over Quantity", 
        desc: "We reject the marketplace model. We don't want thousands of mediocre deals — we curate the top decile that we have vetted personally and stand behind with conviction.",
        icon: <Shield size={24} />,
        accent: "var(--color-accent)"
      },
      { 
        title: "Community over Transactions", 
        desc: "Investing is a partnership, not a simple swap of capital for equity. We prioritize bringing together operators, angels, and founders who can help each other win.",
        icon: <Users size={24} />,
        accent: "var(--color-accent-blue)"
      },
      { 
        title: "Alignment over Hype", 
        desc: "We look for sustainable business models, disciplined capital allocation, and founders building for long-term value creation — not short-term flips.",
        icon: <Target size={24} />,
        accent: "#00b894"
      }
    ];

    return (
        <div className="page-wrapper pt-20">
            {/* HERO */}
            <section className="section text-center" style={{ padding: '8rem 0 6rem' }}>
                <div className="container animate-slide-up">
                    <div className="hero-badge mx-auto">Foundational Thesis</div>
                    <h1 className="hero-title">The GoodMatter Protocol</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px' }}>
                        Sophisticated infrastructure for private capital. We believe the highest alpha emerges from high-trust, curated communities.
                    </p>
                </div>
            </section>

            {/* MISSION */}
            <section className="section">
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="scroll-animate" style={{ marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Our Mission</h2>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', lineHeight: '1.8', marginBottom: '2rem', fontWeight: '500' }}>
                            Good Matter connects exceptional founders with thoughtful investors through curated, high-quality deal flow.
                        </p>
                        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: '1.8', margin: 0, fontWeight: '500' }}>
                            The private markets have become inundated with noise. We are building a curated ecosystem that bridges the gap between high-conviction founders and aligned capital. Every venture is examined, vetted, and distributed privately to our institutional and angel collective.
                        </p>
                    </div>

                    {/* WHAT WE DO */}
                    <div className="glass scroll-animate delay-100" style={{ marginBottom: '6rem', padding: '4rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-premium)' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Signal over Noise</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', lineHeight: '1.8', margin: '0 0 2rem', fontWeight: '500' }}>
                            The private markets are inundated with "data exhaust." Most platforms aggregate every bit of noise. **GoodMatter does the opposite.**
                        </p>
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', margin: 0, fontWeight: '600', fontStyle: 'italic' }}>
                                "We do not aggregate. We curate. We do not provide volume. We provide conviction. Our moat is restraint."
                            </p>
                        </div>
                    </div>

                    {/* TEAM SECTION */}
                    <div className="section-header text-center scroll-animate" style={{ marginTop: '8rem' }}>
                        <h2 className="section-title">The Orchestrators</h2>
                        <p className="section-subtitle">Operators and investors building the network we wanted to see.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
                        <div className="glass scroll-animate" style={{ padding: '3.5rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.6)', textAlign: 'center' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 2rem', border: '4px solid white', boxShadow: 'var(--shadow-premium)' }}>
                                <img src={saswatImg} alt="Saswat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Saswat</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Founder</p>
                            <p style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                                Dedicated to building high-signal infrastructure for the next generation of private market opportunities.
                            </p>
                            <a href="https://www.linkedin.com/company/goodmattercommunity/" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                LinkedIn Profile
                            </a>
                        </div>
                    </div>

                    {/* PHILOSOPHY */}
                    <div className="scroll-animate delay-200">
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '3rem', color: 'var(--color-primary)', letterSpacing: '-0.02em', textAlign: 'center' }}>The Philosophy</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {values.map((v, i) => (
                              <div key={i} className="glass" style={{ padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.6)', borderLeft: `6px solid ${v.accent}`, boxShadow: 'var(--shadow-premium)' }}>
                                <div style={{ color: v.accent, marginBottom: '1.5rem' }}>{v.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-primary)' }}>{v.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.75', margin: 0, fontWeight: '500' }}>{v.desc}</p>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="section">
                <div className="container">
                    <div className="glass scroll-animate" style={{ padding: '6rem 2rem', borderRadius: '48px', textAlign: 'center', background: 'var(--color-primary)', color: 'white', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Good deals. Good people.</h2>
                          <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem', fontSize: '1.25rem', opacity: 0.8, fontWeight: '500' }}>
                              Join the most selective community of aligned investors and exceptional founders.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                              <Link to="/login" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--color-primary)', border: 'none' }}>Join as Investor</Link>
                              <Link to="/submit-deal" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Apply as Founder</Link>
                          </div>
                        </div>
                        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
