import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Send, FileUp, Link2, ArrowRight, Lock, Trash2, AlertCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const INDUSTRIES = [
  'Fintech','HealthTech','AI/SaaS','ClimateTech','EdTech','DeepTech',
  'TravelTech','F&B','D2C / Retail','Logistics','AgriTech',
  'Pet Care (Tech)','Health & Wellness','Enterprise SaaS','Cybersecurity','Other',
];
const STAGES = ['Pre-seed','Seed','Pre-Series A','Series A','Series B+'];

const inp = {
  width: '100%', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.45)',
  border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: '14px',
  color: 'var(--color-text-main)', outline: 'none', fontFamily: 'inherit',
  fontSize: '0.92rem', boxSizing: 'border-box', transition: 'all 0.25s',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
};
const sel = { ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23636E72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', paddingRight: '2.5rem' };

const Field = ({ label, required, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
    <label style={{ fontSize: '0.75rem', fontWeight: '750', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      {hint && <span style={{ fontWeight: '400', textTransform: 'none', marginLeft: 6, opacity: 0.7 }}>({hint})</span>}
    </label>
    {children}
  </div>
);

const DealSubmit = () => {
  const navigate   = useNavigate();
  useScrollAnimation();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState('');
  const [isAuth, setIsAuth]         = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // File state for UI feedback
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem('token');
  const user  = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();

  useEffect(() => {
    // Require FOUNDER login
    if (token && user?.role === 'FOUNDER') {
      setIsAuth(true);
    } else {
      localStorage.setItem('gm_redirect_after_login', '/submit-deal');
    }
    setCheckingAuth(false);
  }, [token, user?.role]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    const input = document.getElementById('pitch_deck_file_input');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] Starting Submission...');
    setSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData(e.target);
      
      // Safety defaults
      if (!formData.get('submitted_by')?.trim() && user?.name) formData.set('submitted_by', user.name);
      if (!formData.get('email')?.trim() && user?.email) formData.set('email', user.email);

      const res = await fetch(`${API}/api/founder/submit-deal`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed. Please check all fields.');
      }

      setResult(data);
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) return null;

  if (!isAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem 3rem', background: 'var(--color-bg-main)' }}>
      <div className="glass" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '24px', padding: '3rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.06)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={28} style={{ color: '#ef4444' }} />
        </div>
        <h2 style={{ color: 'var(--color-text-main)', marginBottom: '0.75rem', fontWeight: 800 }}>Founder Login Required</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.7, fontWeight: 500 }}>You need a founder account to submit a deal. Please sign in or create an account to proceed.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/founder/login" className="btn btn-primary">Sign In / Sign Up</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  if (result) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem 3rem', background: 'var(--color-bg-main)' }}>
      <div className="glass" style={{ maxWidth: '580px', width: '100%', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '32px', padding: '4rem 3rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(85,239,196,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <CheckCircle size={40} style={{ color: 'var(--color-highlight)' }} />
        </div>
        <h2 style={{ color: 'var(--color-text-main)', marginBottom: '1rem', fontSize: '2rem', fontWeight: 800 }}>Deal Submitted!</h2>
        <div style={{ background: 'rgba(116,185,255,0.05)', border: '1px solid rgba(116,185,255,0.15)', borderRadius: '18px', padding: '1.5rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            <strong style={{ color: 'var(--color-accent-blue)' }}>AI Scoring Engine Initialized</strong><br /><br />
            Our benchmark-driven AI is now analyzing your pitch deck. You will receive an email and dashboard notification once the analysis is complete (30–90 seconds).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/founder/dashboard" className="btn btn-primary btn-lg">
            Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', paddingTop: '80px' }}>
      <style>{`
        input:focus, select:focus, textarea:focus { border-color: var(--color-accent) !important; background: white !important; box-shadow: 0 0 0 4px rgba(250, 177, 160, 0.1); }
        option { background: white; color: var(--color-primary); padding: 10px; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, hsla(14, 100%, 96%, 1) 0%, hsla(210, 100%, 96%, 1) 100%)', padding: '5rem 1.5rem 4rem', borderBottom: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '24px', padding: '8px 20px', fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: 'var(--shadow-sm)' }}>
          <Send size={14} /> Protocol Submission
        </div>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '3rem', fontWeight: '800', margin: '0 0 1rem', letterSpacing: '-0.04em' }}>Submit Your Startup</h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
          Join the GoodMatter network. Upload your materials for benchmark-driven AI analysis and private network matching.
        </p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <div className="glass scroll-animate" style={{ padding: '4rem 3.5rem', borderRadius: '32px' }}>

          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><AlertCircle size={18} /> {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input id="pitch_deck_file_input" name="pitch_deck_file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field label="Founder Name" required>
                <input name="submitted_by" required placeholder="Full name" style={inp} defaultValue={user?.name || ''} />
              </Field>
              <Field label="Direct Email" required>
                <input name="email" type="email" required placeholder="name@startup.com" style={inp} defaultValue={user?.email || ''} />
              </Field>
            </div>

            <Field label="Startup Name" required>
              <input name="startup_name" required placeholder="e.g. Acme AI" style={inp} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Field label="Industry Sector" required>
                <div style={{ position: 'relative' }}>
                  <select name="industry" required style={sel} defaultValue="">
                    <option value="" disabled>Select Sector</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </Field>
              <Field label="Funding Stage" required>
                <div style={{ position: 'relative' }}>
                  <select name="stage" required style={sel} defaultValue="">
                    <option value="" disabled>Current Stage</option>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Field label="Total Raising" required hint="e.g. ₹2Cr or $1M">
                <input name="funding_amount" required placeholder="Capital requested" style={inp} />
              </Field>
              <Field label="Startup Website" hint="Optional">
                <input name="website" placeholder="https://..." style={inp} />
              </Field>
            </div>

            <Field label="Elevator Pitch" required hint="Max 200 characters">
              <textarea name="description" required placeholder="Problem you solve in one sentence..." style={{ ...inp, minHeight: '100px', resize: 'vertical' }} />
            </Field>

            {/* Deck upload wrapper */}
            <div style={{ background: 'rgba(0,0,0,0.02)', border: '2px dashed rgba(0,0,0,0.06)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', transition: 'all 0.3s' }}>
               <div style={{ marginBottom: '1.5rem' }}>
                 <div style={{ width: '64px', height: '64px', background: 'rgba(116,185,255,0.06)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                   <FileUp size={28} style={{ color: 'var(--color-accent-blue)' }} />
                 </div>
                 <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.5rem' }}>Pitch Deck (PDF)</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Securely upload your materials for AI benchmarking.</p>
               </div>

               {!selectedFile ? (
                  <button type="button" onClick={() => document.getElementById('pitch_deck_file_input').click()}
                    className="btn btn-primary"
                    style={{ padding: '0.85rem 2.5rem', fontWeight: '800' }}>
                    Choose PDF File
                  </button>
               ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(85,239,196,0.08)', border: '1px solid rgba(85,239,196,0.2)', padding: '1rem 1.5rem', borderRadius: '16px', maxWidth: '400px', margin: '0 auto' }}>
                    <CheckCircle size={20} style={{ color: 'var(--color-highlight)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-highlight-hover)', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedFile.name}
                    </span>
                    <button type="button" onClick={clearFile} style={{ color: '#ff7675', opacity: 0.7, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
                      <Trash2 size={18} />
                    </button>
                  </div>
               )}
               
               <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                 <div style={{ height: '1px', flex: 1, background: 'rgba(0,0,0,0.04)' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '800', letterSpacing: '0.1em' }}>OR PROVIDE LINK</span>
                 <div style={{ height: '1px', flex: 1, background: 'rgba(0,0,0,0.04)' }} />
               </div>

               <div style={{ marginTop: '1.5rem', position: 'relative' }}>
                 <Link2 size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted-light)' }} />
                 <input name="pitch_deck_url" type="url" placeholder="DocSend / Google Drive Link" style={{ ...inp, paddingLeft: '3rem', fontSize: '0.9rem' }} />
               </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontWeight: '800', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Processing Submission...
                </>
              ) : (
                <>Initialize AI Analysis <ArrowRight size={20} /></>
              )}
            </button>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0, opacity: 0.6 }}>
              Safe & Confidential. Your data is only shared with verified institutional investors.
            </p>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DealSubmit;
