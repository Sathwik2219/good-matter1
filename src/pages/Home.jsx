import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Target, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Home.css';

const Home = () => {
    useScrollAnimation();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(250, 177, 160, 0.4)'; // Soft Peach
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.strokeStyle = 'rgba(116, 185, 255, 0.1)'; // Soft Blue
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    if (Math.sqrt(dx * dx + dy * dy) < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); };
    }, []);

    const valueProps = [
        { icon: <Target size={24} className="feature-icon" />, title: "Curated Dealflow", desc: "Access hand-picked startups reviewed by our internal screening process." },
        { icon: <Users size={24} className="feature-icon" />, title: "Trusted Investor Network", desc: "A private community of angels, VCs, and operators actively deploying capital." },
        { icon: <ShieldCheck size={24} className="feature-icon" />, title: "Founder-Investor Alignment", desc: "Focus on meaningful partnerships rather than transactional fundraising." },
        { icon: <TrendingUp size={24} className="feature-icon" />, title: "High-Signal Opportunities", desc: "Prioritizing quality over volume — every deal is curated and conviction-backed." },
    ];



    return (
        <div className="home-page">
            {/* HERO */}
            <section className="hero">
                <canvas ref={canvasRef} className="hero-canvas"></canvas>
                <div className="container hero-container animate-fade-in">
                    <div className="hero-content">
                        <div className="hero-badge">Curation • Restraint • Trust</div>
                        <h1 className="hero-title">
                            Institutional-Grade <span className="text-highlight">Private Market</span> Access
                        </h1>
                        <p className="hero-subtitle">
                          Only 3% upon successful deal closure. No upfront fees.
                        </p>
                        <p className="hero-desc">
                            Good Matter Community curates high-quality early-stage startups and shares them with a trusted network of investors. Every deal is reviewed, vetted, and distributed privately.
                        </p>
                        <div className="hero-actions">
                            <Link to="/founder/login" className="btn btn-primary btn-lg">Submit Startup</Link>
                            <Link to="/login" className="btn btn-outline btn-lg">Investor Login <ArrowRight size={20} /></Link>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item delay-100">
                            <span className="stat-value">100+</span>
                            <span className="stat-label">Active Investors</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item delay-200">
                            <span className="stat-value">₹35Cr+</span>
                            <span className="stat-label">Fundraising Pipeline</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item delay-300">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Curated Deals Only</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOCIAL PROOF SCROLLING BELT */}
            <section className="social-proof section-sm glass">
                <div className="container">
                    <p className="social-proof-title text-center">TRUSTED BY OUR PRIVATE NETWORK</p>
                    <div className="logo-marquee">
                        <div className="logo-track">
                            {['Angel Investors', 'Venture Funds', 'Family Offices', 'Operators', 'PE Firms', 'Angel Investors', 'Venture Funds', 'Family Offices', 'Operators', 'PE Firms'].map((item, i) => (
                                i % 2 === 0
                                    ? <span key={i} className="logo-item">{item}</span>
                                    : <span key={i} className="logo-item text-muted">•</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="section bg-deep">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>Why GoodMatter?</h2>
                        <p className="section-subtitle">We believe the best investment opportunities emerge from trusted communities.</p>
                    </div>
                    <div className="features-grid">
                        {valueProps.map((vp, index) => (
                            <div key={index} className={`feature-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="icon-wrapper">{vp.icon}</div>
                                <h3>{vp.title}</h3>
                                <p>{vp.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* 3-STEP FLOW */}
            <section className="section">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>How It Works</h2>
                        <p className="section-subtitle">A streamlined process for exceptional capital deployment.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card scroll-animate delay-100">
                            <div className="icon-wrapper">1</div>
                            <h3>Submit</h3>
                            <p>Founders apply through a structured application form for initial screening.</p>
                        </div>
                        <div className="feature-card scroll-animate delay-200">
                            <div className="icon-wrapper">2</div>
                            <h3>Review & Vetting</h3>
                            <p>Internal evaluation and benchmark-driven scoring to identify high-signal ventures.</p>
                        </div>
                        <div className="feature-card scroll-animate delay-300">
                            <div className="icon-wrapper">3</div>
                            <h3>Curate</h3>
                            <p>Selected deals are professionalized and prepared for institutional-grade distribution.</p>
                        </div>
                        <div className="feature-card scroll-animate delay-400">
                            <div className="icon-wrapper">4</div>
                            <h3>Deal Goes Live</h3>
                            <p>Vetted opportunities are distributed privately to our selective investor collective.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURATED SEGMENTS */}
            <section className="section bg-deep">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2 className="section-title">Institutional Coverage</h2>
                        <p className="section-subtitle">We curate high-signal opportunities across the primary capital spectrum.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { title: "Angel / Early Stage", desc: "Seed to Pre-Series A" },
                            { title: "Venture Capital / PE", desc: "Growth & Secondary Blocks" },
                            { title: "IPO Stage", desc: "Late-stage Pre-IPO" },
                            { title: "Debt & Structured Finance", desc: "Non-equity capital" },
                            { title: "Mergers & Acquisitions", desc: "Strategic Exits" }
                        ].map((segment, i) => (
                            <div key={i} className="glass scroll-animate" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.6)', transition: 'transform 0.3s ease' }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{segment.title}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, fontWeight: '600' }}>{segment.desc}</p>
                            </div>
                        ))}
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
                              <Link to="/founder/login" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Apply as Founder</Link>
                          </div>
                        </div>
                        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const UserIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white', opacity: 0.5 }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default Home;
