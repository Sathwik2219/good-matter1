import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Apply = () => {
    useScrollAnimation();

    return (
        <div className="page-wrapper pt-20" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <section className="section pb-0 text-center">
                <div className="container animate-slide-up">
                    <h1 className="hero-title" style={{ color: 'var(--color-primary)' }}>Apply as Founder</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
                        Submit your startup for review. We evaluate every application and respond within 7 days.
                    </p>
                </div>
            </section>

            <section className="section pt-0">
                <div className="container">
                    <div className="glass scroll-animate delay-100" style={{ maxWidth: '700px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>

                        <form onSubmit={(e) => { e.preventDefault(); alert('Application Submitted Successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                            {/* Founder Section */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Founder Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                                        <input type="text" required placeholder="Jane Doe" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                                        <input type="email" required placeholder="founder@startup.com" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>LinkedIn Profile URL</label>
                                        <input type="url" required placeholder="https://linkedin.com/in/..." style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Startup Section */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Startup Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Company Name</label>
                                        <input type="text" required placeholder="Acme Inc." style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Website</label>
                                        <input type="url" placeholder="https://..." style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Industry / Sector</label>
                                        <select required style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)', backgroundColor: 'white' }}>
                                            <option value="">Select industry</option>
                                            <option>Fintech</option>
                                            <option>Healthtech</option>
                                            <option>Enterprise SaaS</option>
                                            <option>ClimateTech</option>
                                            <option>DeepTech</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Current Stage</label>
                                        <select required style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)', backgroundColor: 'white' }}>
                                            <option value="">Select stage</option>
                                            <option>Pre-seed</option>
                                            <option>Seed</option>
                                            <option>Pre-Series A</option>
                                            <option>Series A+</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>One-Line Pitch</label>
                                        <input type="text" required placeholder="We are building X for Y to solve Z." style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Materials</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Pitch Deck (PDF link)</label>
                                        <input type="url" required placeholder="Google Drive, Dropbox, DocSend..." style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Additional Info (Traction, Ask, etc.)</label>
                                        <textarea rows="4" placeholder="Any additional context about your raise?" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)', resize: 'vertical' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-accent btn-lg w-100" style={{ width: '100%' }}>Submit Application</button>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Apply;
