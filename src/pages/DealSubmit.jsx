import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const INDUSTRIES = [
  'Fintech','HealthTech','AI/SaaS','ClimateTech','EdTech','DeepTech',
  'TravelTech','F&B','D2C / Retail','Logistics','AgriTech',
  'Pet Care (Tech)','Health & Wellness','Enterprise SaaS','Cybersecurity','Other',
];
const STAGES = ['Pre-seed','Seed','Pre-Series A','Series A','Series B+'];

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #eef2ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {title}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {children}
    </div>
  </div>
);

const Field = ({ label, required, children, full }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: full ? '1 / -1' : 'auto' }}>
    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const DealSubmit = () => {
  useScrollAnimation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const inputStyle = {
    padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1px solid #e2e8f0', outline: 'none',
    fontFamily: 'inherit', fontSize: '0.9rem', width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
    background: 'white',
  };
  const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '90px' };
  const selectStyle   = { ...inputStyle, backgroundColor: 'white', cursor: 'pointer' };

  const focus = e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
  const blur  = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res  = await fetch(`${API}/api/founder/submit-deal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  // --- Success Screen ---
  if (result) {
    const isRejected = result.filter_status === 'AUTO_REJECTED';
    const isReview   = result.filter_status === 'REVIEW_NEEDED';
    const isApproved = result.filter_status === 'ELIGIBLE';
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', paddingTop: '80px', padding: '6rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '540px', width: '100%', background: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            {isApproved ? '🚀' : isReview ? '📋' : '❌'}
          </div>
          <h2 style={{ marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
            {isApproved ? 'Deal Eligible!' : isReview ? 'Under Review' : 'Not a Fit Right Now'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {result.message}
          </p>

          {/* AI Score Display */}
          <div style={{ background: isApproved ? '#f0fdf4' : isReview ? '#fffbeb' : '#fef2f2', border: `1px solid ${isApproved ? '#bbf7d0' : isReview ? '#fde68a' : '#fca5a5'}`, borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: isApproved ? '#16a34a' : isReview ? '#92400e' : '#b91c1c' }}>
              AI Investment Readiness Score
            </p>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: isApproved ? '#16a34a' : isReview ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>
              {result.ai_score}<span style={{ fontSize: '1.2rem', fontWeight: '600' }}>/100</span>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {isApproved ? 'Strong candidate — matched to relevant investors' : isReview ? 'Manual review required before investor distribution' : 'Score below threshold — does not meet current criteria'}
            </p>
          </div>

          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ width: '100%' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // --- Submission Form ---
  return (
    <div style={{ background: '#f4f6fb', paddingTop: '72px' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e3a5f 100%)', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI-Evaluated Deal Submission</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '900', margin: '0 0 1rem' }}>Submit Your Deal</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            Every submission is evaluated by our AI scoring engine across 6 dimensions. High-quality deals are matched directly with relevant investors.
          </p>
          {/* Score badges */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {['Team','Market','Product','Traction','Financials','Competition'].map(dim => (
              <span key={dim} style={{ padding: '4px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: '600' }}>{dim}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 3rem)', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '2rem', fontSize: '0.9rem' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <Section title="👤 Submitter Details">
                <Field label="Your Full Name" required>
                  <input name="submitted_by" type="text" required placeholder="Jane Smith" style={inputStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Email Address" required>
                  <input name="email" type="email" required placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </Section>

              <Section title="🚀 Startup Overview">
                <Field label="Startup Name" required>
                  <input name="startup_name" type="text" required placeholder="e.g. Acme AI" style={inputStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Industry / Sector" required>
                  <select name="industry" required style={selectStyle} onFocus={focus} onBlur={blur}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Funding Stage" required>
                  <select name="stage" required style={selectStyle} onFocus={focus} onBlur={blur}>
                    <option value="">Select stage</option>
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Funding Amount Sought">
                  <input name="funding_amount" type="text" placeholder="e.g. ₹5Cr / $500K" style={inputStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </Section>

              <Section title="🎯 Problem & Solution">
                <Field label="Problem Statement" required full>
                  <textarea name="problem" required rows={3} placeholder="What specific problem are you solving? Who faces this problem?" style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
                <Field label="Solution & Product" required full>
                  <textarea name="solution" required rows={3} placeholder="Describe your solution, how it works, and what makes it unique..." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
              </Section>

              <Section title="📊 Market">
                <Field label="Market Size (TAM / SAM / SOM)" required full>
                  <textarea name="market_size" required rows={2} placeholder="e.g. TAM: $50B, SAM: $5B, SOM: $500M. Include CAGR if known." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
                <Field label="Business Model" full>
                  <textarea name="business_model" rows={2} placeholder="e.g. SaaS subscription, marketplace, D2C, transaction fee..." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
              </Section>

              <Section title="📈 Traction & Metrics">
                <Field label="Current Traction" full>
                  <textarea name="traction" rows={2} placeholder="Users, revenue, clients, partnerships, waitlist size, growth rate..." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
                <Field label="Revenue Metrics" full>
                  <textarea name="revenue_metrics" rows={2} placeholder="ARR, MRR, LTV, CAC, Gross Margin, Conversion Rate..." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
              </Section>

              <Section title="⚔️ Competitive Landscape">
                <Field label="Competitors & Your Moat" full required>
                  <textarea name="competition" required rows={3} placeholder="List key competitors. What is your unfair advantage, moat, or barrier to entry?" style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
              </Section>

              <Section title="💰 Financials">
                <Field label="Financial Projections" full>
                  <textarea name="financial_projection" rows={2} placeholder="3-year projections, path to profitability, key milestones..." style={textareaStyle} onFocus={focus} onBlur={blur}></textarea>
                </Field>
                <Field label="Pitch Deck URL" required full>
                  <input name="pitch_deck_url" type="url" required placeholder="https://drive.google.com/... or DocSend / Dropbox link" style={inputStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </Section>

              {/* Submit */}
              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  🤖 <span>Your submission will be instantly scored by our <strong>AI evaluation engine</strong> across 6 categories. Deals scoring above 70 are automatically eligible for investor distribution.</span>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-accent btn-lg" style={{ width: '100%', opacity: submitting ? 0.7 : 1, fontSize: '1rem', padding: '1rem' }}>
                  {submitting ? '🔄 Analyzing your startup...' : '🚀 Submit for AI Evaluation'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Response within 7 business days. All submissions are reviewed by the GoodMatter team.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealSubmit;
