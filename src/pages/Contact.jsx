import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Mail, Phone, Users, MessageSquare, MapPin, Globe, ArrowRight } from 'lucide-react';

const Contact = () => {
    useScrollAnimation();
    const [inquiryType, setInquiryType] = useState('General Query');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('[name="name"]').value;
        const email = form.querySelector('[name="email"]').value;
        const phone = form.querySelector('[name="phone"]').value;
        const message = form.querySelector('[name="message"]').value;
        const subject = `GoodMatter ${inquiryType} from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`;
        window.location.href = `mailto:goodmatter05@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSubmitted(true);
    };

    const inputStyle = {
        width: '100%', padding: '0.875rem 1.25rem',
        background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '16px', color: 'var(--color-primary)', outline: 'none',
        fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        display: 'block', marginBottom: '0.625rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
    };

    return (
        <div className="page-wrapper pt-20">
            {/* HERO */}
            <section className="section text-center" style={{ padding: '8rem 0 4rem' }}>
                <div className="container animate-slide-up">
                    <div className="hero-badge mx-auto">Communication Proxy</div>
                    <h1 className="hero-title">Initiate Dialogue</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px' }}>
                        Connect with the collective. Whether you're navigating capital markets or building the next generation of value, we're here to facilitate.
                    </p>
                </div>
            </section>

            {/* CONTACT INFO + FORM */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>

                        {/* Contact Info */}
                        <div className="scroll-animate">
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '2.5rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Direct Access</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div className="glass" style={{ width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0, border: '1px solid rgba(255,255,255,0.8)' }}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.4rem', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>Protocol Email</h4>
                                        <a href="mailto:goodmatter05@gmail.com" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem' }}>goodmatter05@gmail.com</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div className="glass" style={{ width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0, border: '1px solid rgba(255,255,255,0.8)' }}>
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.4rem', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>Global Outreach</h4>
                                        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '500' }}>Operating remotely from technology hubs across India.</p>
                                    </div>
                                </div>
                            </div>

                            {/* PARTNERSHIPS */}
                            <div className="glass scroll-animate delay-200" style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-premium)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <Users size={24} style={{ color: 'var(--color-accent)' }} />
                                    <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800', color: 'var(--color-primary)' }}>Ecosystem Partnerships</h3>
                                </div>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1.5rem', fontWeight: '500' }}>
                                    Interested in collaborating with GoodMatter? We welcome dialogue regarding co-investment, ecosystem development, and strategic events.
                                </p>
                                <a href="mailto:goodmatter05@gmail.com?subject=Partnership%20Inquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: '700', fontSize: '1rem', textDecoration: 'none' }}>
                                    Partner with us <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>

                        {/* CONTACT FORM */}
                        <div className="glass scroll-animate delay-100" style={{ padding: '3.5rem', borderRadius: '32px', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(255,255,255,0.6)' }}>
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(0, 184, 148, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#00b894' }}>
                                        <MessageSquare size={40} />
                                    </div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-primary)' }}>Signal Synchronized</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', fontWeight: '500', lineHeight: 1.6 }}>Your inquiry has been processed. Our operatives will review and respond within 48 standard hours.</p>
                                    <button className="btn btn-outline" style={{ marginTop: '2.5rem', padding: '1rem 2.5rem' }} onClick={() => setSubmitted(false)}>Send Another Message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>Secure Message</h3>

                                    <div>
                                        <label style={labelStyle}>Full Identity</label>
                                        <input name="name" type="text" placeholder="Jane Doe" required style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Email Protocol</label>
                                            <input name="email" type="email" placeholder="jane@firm.com" required style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Comm-Link (Phone)</label>
                                            <input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Inquiry Classification</label>
                                        <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%232D3446\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center' }}>
                                            <option>Investor Inquiry</option>
                                            <option>Founder Admission</option>
                                            <option>Impact Studio Access</option>
                                            <option>Corporate Partnership</option>
                                            <option>General Protocol Query</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Message Narrative</label>
                                        <textarea name="message" rows="5" placeholder="Elaborate on your inquiry..." required style={{ ...inputStyle, resize: 'none' }} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }}></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontWeight: '800' }}>Transmit Signal</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
