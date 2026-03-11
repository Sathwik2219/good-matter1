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
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    const deals = [
        { name: "AeroPay", industry: "Fintech", stage: "Seed", raise: "₹5Cr", desc: "Next-gen B2B payment infrastructure for emerging markets.", logo: "AP" },
        { name: "HealthSync", industry: "HealthTech", stage: "Pre-Series A", raise: "₹12Cr", desc: "AI-driven patient data unification and diagnostic insights.", logo: "HS" },
        { name: "Cognitive AI", industry: "AI/SaaS", stage: "Seed", raise: "₹3Cr", desc: "Automating enterprise compliance workflows with large language models.", logo: "CA" },
        { name: "GreenGrid", industry: "ClimateTech", stage: "Series A", raise: "₹25Cr", desc: "Decentralized energy management grids for smart cities.", logo: "GG" },
    ];

    const teamMembers = [
        { name: "Founder", role: "Managing Partner" },
        { name: "Founder", role: "Head of Investments" },
        { name: "Founder", role: "Partnership Lead" },
    ];

    return (
        <div className="home-page">
            {/* HERO */}
            <section className="hero">
                <canvas ref={canvasRef} className="hero-canvas"></canvas>
                <div className="container hero-container animate-fade-in">
                    <div className="hero-content">
                        <div className="hero-badge">Private Markets Access</div>
                        <h1 className="hero-title">
                            Selective Access to <span className="text-highlight">Institutional-Grade</span> Opportunities Across Private Markets
                        </h1>
                        <p className="hero-subtitle">
                            A private community connecting exceptional founders with a curated network of investors.
                        </p>
                        <p className="hero-desc">
                            Good Matter Community curates high-quality early-stage startups and shares them with a trusted network of investors. Every deal is reviewed, vetted, and distributed privately to our investor community.
                        </p>
                        <div className="hero-actions">
                            <Link to="/login" className="btn btn-accent btn-lg">Join as an Investor <ArrowRight size={20} /></Link>
                            <Link to="/apply" className="btn btn-outline-light btn-lg">Submit Your Startup</Link>
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
            <section className="section bg-light">
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

            {/* FEATURED DEALS */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header scroll-animate">
                        <div className="header-split">
                            <div>
                                <h2>Recent Opportunities Shared With Our Community</h2>
                                <p className="section-subtitle">A glimpse into our curated pipeline of high-signal startups.</p>
                            </div>
                            <Link to="/investors" className="btn btn-outline">View All Deals <ChevronRight size={16} /></Link>
                        </div>
                    </div>
                    <div className="deals-grid">
                        {deals.map((deal, index) => (
                            <div key={index} className={`deal-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="deal-header">
                                    <div className="deal-logo">{deal.logo}</div>
                                    <div className="deal-tags">
                                        <span className="tag">{deal.industry}</span>
                                        <span className="tag stage-tag">{deal.stage}</span>
                                    </div>
                                </div>
                                <h3 className="deal-name">{deal.name}</h3>
                                <p className="deal-desc">{deal.desc}</p>
                                <div className="deal-footer">
                                    <div className="deal-metric">
                                        <span className="metric-label">Target Raise</span>
                                        <span className="metric-value">{deal.raise}</span>
                                    </div>
                                    <Link to="/login" className="btn btn-sm btn-primary">View Deal</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header text-center scroll-animate">
                        <h2>The Team Behind Good Matter</h2>
                        <p className="section-subtitle">Operators and investors building the network we wanted to see.</p>
                    </div>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className={`team-card scroll-animate delay-${(index + 1) * 100}`}>
                                <div className="team-photo-placeholder">
                                    <UserIcon />
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <p className="team-role">{member.role}</p>
                                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="linkedin-link">LinkedIn Profile</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="section-dark section text-center">
                <div className="container cta-container scroll-animate">
                    <h2>Good deals. Good people. Good Matter.</h2>
                    <p className="cta-subtitle">Apply today to get access to our private network.</p>
                    <div className="hero-actions justify-center mt-4">
                        <Link to="/login" className="btn btn-accent btn-lg">Join the Investor Community</Link>
                        <Link to="/apply" className="btn btn-outline-light btn-lg">Apply as a Founder</Link>
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
