import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Apply = () => {
    useScrollAnimation();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(null); // { score }
    const [error, setError]           = useState('');

    const inputStyle = {
        padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-secondary-dark)', outline: 'none',
        width: '100%', fontFamily: 'inherit', fontSize: '0.9rem',
        transition: 'border-color 0.2s',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        const form = e.target;
        const payload = {
            founder_name:   form.founder_name.value,
            email:          form.email.value,
            linkedin_url:   form.linkedin_url.value,
            startup_name:   form.startup_name.value,
            website:        form.website.value,
            industry:       form.industry.value,
            stage:          form.stage.value,
            raise_amount:   form.raise_amount.value,
            description:    form.description.value,
            pitch_deck_url: form.pitch_deck_url.value,
            additional_info: form.additional_info.value,
        };

        try {
            const res = await fetch(`${API}/api/founder/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Submission failed.');
            setSubmitted({ score: data.ai_score });
        } catch (err) {
            setError(err.message);
        }
        setSubmitting(false);
    };

    if (submitted) return (
        <div className="page-wrapper pt-20" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ maxWidth: '550px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ marginBottom: '0.75rem' }}>Application Submitted!</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Your startup has been received and is being reviewed by our team.
                        We'll respond within <strong>7 business days</strong>.
                    </p>
                    {submitted.score && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#065f46' }}>
                                <strong>AI Pre-Screen Score: {submitted.score}/100</strong><br/>
                                Our system has evaluated your startup based on industry, stage, and description.
                            </p>
                        </div>
                    )}
                    <a href="/" className="btn btn-primary">Back to Home</a>
                </div>
            </div>
        </div>
    );

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
                    <div className="glass scroll-animate delay-100" style={{ maxWidth: '720px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>

                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                            {/* Founder Details */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Founder Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Full Name *</label>
                                        <input name="founder_name" type="text" required placeholder="Jane Doe" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email *</label>
                                        <input name="email" type="email" required placeholder="founder@startup.com" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>LinkedIn Profile URL</label>
                                        <input name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." style={inputStyle} />
                                    </div>
                                </div>
                            </div>

                            {/* Startup Details */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Startup Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Company Name *</label>
                                        <input name="startup_name" type="text" required placeholder="Acme Inc." style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Website</label>
                                        <input name="website" type="url" placeholder="https://..." style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Industry / Sector *</label>
                                        <select name="industry" required style={{ ...inputStyle, backgroundColor: 'white' }}>
                                            <option value="">Select industry</option>
                                            <option>Fintech</option>
                                            <option>HealthTech</option>
                                            <option>AI/SaaS</option>
                                            <option>ClimateTech</option>
                                            <option>EdTech</option>
                                            <option>DeepTech</option>
                                            <option>TravelTech</option>
                                            <option>F&amp;B</option>
                                            <option>D2C / Retail</option>
                                            <option>Logistics</option>
                                            <option>AgriTech</option>
                                            <option>Pet Care (Tech)</option>
                                            <option>Health &amp; Wellness</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Current Stage *</label>
                                        <select name="stage" required style={{ ...inputStyle, backgroundColor: 'white' }}>
                                            <option value="">Select stage</option>
                                            <option>Pre-seed</option>
                                            <option>Seed</option>
                                            <option>Pre-Series A</option>
                                            <option>Series A+</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Target Raise Amount</label>
                                        <input name="raise_amount" type="text" placeholder="e.g. ₹5Cr / $500K" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Description / One-Line Pitch *</label>
                                        <textarea name="description" rows="3" required placeholder="Describe what you're building and for whom..." style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Materials */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-secondary-dark)', paddingBottom: '0.5rem' }}>Materials</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Pitch Deck URL * <span style={{ fontWeight: '400', color: 'var(--color-text-muted)' }}>(Google Drive, Dropbox, DocSend)</span></label>
                                        <input name="pitch_deck_url" type="url" required placeholder="https://drive.google.com/..." style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Additional Info <span style={{ fontWeight: '400', color: 'var(--color-text-muted)' }}>(Traction, Revenue, Ask)</span></label>
                                        <textarea name="additional_info" rows="3" placeholder="Any additional context about your raise..." style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={submitting} className="btn btn-accent btn-lg" style={{ width: '100%', opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Submitting...' : '🚀 Submit Application'}
                                </button>
                                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    By submitting, you agree to our privacy policy. We review all applications within 7 business days.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Apply;
