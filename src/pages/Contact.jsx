import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Mail, Phone, Users } from 'lucide-react';

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
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-secondary-dark)',
        outline: 'none',
        width: '100%',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        transition: 'border-color 0.2s'
    };

    return (
        <div className="page-wrapper pt-20">
            {/* HERO */}
            <section className="section section-dark text-center">
                <div className="container animate-slide-up">
                    <h1 className="hero-title">Contact Us</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Whether you're an investor looking for dealflow, a founder raising capital, or interested in a partnership — we'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* CONTACT INFO + FORM */}
            <section className="section bg-light">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>

                        {/* Contact Info */}
                        <div className="scroll-animate">
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Get in Touch</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Email Us</h4>
                                        <a href="mailto:goodmatter05@gmail.com" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>goodmatter05@gmail.com</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Phone</h4>
                                        <p style={{ color: 'var(--color-text-muted)' }}>+91 XXXXX XXXXX</p>
                                    </div>
                                </div>
                            </div>

                            {/* PARTNERSHIPS */}
                            <div style={{ marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-secondary-dark)', borderLeft: '4px solid var(--color-accent)' }} className="scroll-animate delay-200">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Users size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Partnerships</h3>
                                </div>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                                    Interested in collaborating with GoodMatter? Reach out for ecosystem partnerships, events, or community initiatives.
                                </p>
                                <a href="mailto:goodmatter05@gmail.com?subject=Partnership%20Inquiry" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--color-accent)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>
                                    Write to us →
                                </a>
                            </div>
                        </div>

                        {/* CONTACT FORM */}
                        <div className="scroll-animate delay-100" style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(11,15,26,0.05)' }}>
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Message Sent!</h3>
                                    <p style={{ color: 'var(--color-text-muted)' }}>Your email client should open with the pre-filled message. We'll get back to you shortly.</p>
                                    <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Send a Message</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>Name *</label>
                                        <input name="name" type="text" placeholder="Your full name" required style={inputStyle} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>Email *</label>
                                        <input name="email" type="email" placeholder="your@email.com" required style={inputStyle} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>Phone</label>
                                        <input name="phone" type="tel" placeholder="+91 99999 99999" style={inputStyle} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>Inquiry Type</label>
                                        <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}>
                                            <option>Investor Inquiry</option>
                                            <option>Founder Application</option>
                                            <option>Impact Studio</option>
                                            <option>Partnership</option>
                                            <option>General Query</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>Message *</label>
                                        <textarea name="message" rows="4" placeholder="How can we help you?" required style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
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
