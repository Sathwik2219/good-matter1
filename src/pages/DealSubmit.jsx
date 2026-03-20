import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Send, FileUp, Link2, ArrowRight, Lock, Trash2, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const INDUSTRIES = [
  'Fintech','HealthTech','AI/SaaS','ClimateTech','EdTech','DeepTech',
  'TravelTech','F&B','D2C / Retail','Logistics','AgriTech',
  'Pet Care (Tech)','Health & Wellness','Enterprise SaaS','Cybersecurity','Other',
];
const STAGES = ['Pre-seed','Seed','Pre-Series A','Series A','Series B+'];

const inp = {
  width: '100%', padding: '0.85rem 1rem', background: '#1C2436',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
  color: 'var(--color-text-main)', outline: 'none', fontFamily: 'inherit',
  fontSize: '0.92rem', boxSizing: 'border-box', transition: 'all 0.2s',
};
const sel = { ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' };

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
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width: '60px', height: '60px', background: 'rgba(239,68,68,0.12)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={28} style={{ color: '#f87171' }} />
        </div>
        <h2 style={{ color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>Founder Login Required</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>You need a founder account to submit a deal. Please sign in or create an account.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/founder/login" className="btn btn-primary">Sign In / Sign Up</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  if (result) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem 3rem', background: 'var(--color-bg-main)' }}>
      <div style={{ maxWidth: '580px', width: '100%', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.12)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={36} style={{ color: '#10b981' }} />
        </div>
        <h2 style={{ color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>Deal Submitted!</h2>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#818cf8' }}>AI Evaluation in Progress</strong><br /><br />
            Our AI is now analyzing your pitch deck. This usually takes 30–120 seconds.
            Your score will appear in your dashboard shortly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/founder/dashboard" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', paddingTop: '80px' }}>
      <style>{`
        input:focus, select:focus, textarea:focus { border-color: var(--color-accent) !important; background: #242D42 !important; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        option { background: #1C2436; color: white; padding: 10px; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-bg-deep) 0%, #151a2e 100%)', padding: '4rem 1.5rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '6px 16px', fontSize: '0.78rem', color: '#818cf8', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Send size={12} /> New Submission
        </div>
        <h1 style={{ color: 'var(--color-text-main)', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem', letterSpacing: '-0.03em' }}>Submit Your Startup</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
          Join the GoodMatter network. Upload your pitch deck for instant AI analysis and institutional matching.
        </p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: '28px', padding: '3rem', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>

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
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', textAlign: 'center', transition: 'all 0.3s' }}>
               <div style={{ marginBottom: '1.5rem' }}>
                 <div style={{ width: '50px', height: '50px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                   <FileUp size={24} style={{ color: 'var(--color-accent)' }} />
                 </div>
                 <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.25rem' }}>Pitch Deck (PDF)</h4>
                 <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Maximum file size: 30MB</p>
               </div>

               {!selectedFile ? (
                  <button type="button" onClick={() => document.getElementById('pitch_deck_file_input').click()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 2rem', background: 'var(--color-accent)', color: 'white', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', border: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}>
                    Choose PDF File
                  </button>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem 1.25rem', borderRadius: '12px', maxWidth: '400px', margin: '0 auto' }}>
                   <CheckCircle size={18} style={{ color: '#10b981' }} />
                   <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                     {selectedFile.name}
                   </span>
                   <button type="button" onClick={clearFile} style={{ color: 'rgba(255,255,255,0.3)', hover: { color: '#f87171' }, transition: 'color 0.2s' }} 
                     onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                     onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                     <Trash2 size={16} />
                   </button>
                 </div>
               )}
               
               <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                 <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.05)' }} />
                 <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontWeight: '700' }}>OR</span>
                 <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.05)' }} />
               </div>

               <div style={{ marginTop: '1.25rem', position: 'relative' }}>
                 <Link2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                 <input name="pitch_deck_url" type="url" placeholder="DocSend / Google Drive Link" style={{ ...inp, paddingLeft: '2.75rem', fontSize: '0.85rem' }} />
               </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary"
              style={{ width: '100%', padding: '1.1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', fontSize: '1.05rem', fontWeight: '800', opacity: submitting ? 0.7 : 1, borderRadius: '14px' }}>
              {submitting ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Uploading Deal...
                </>
              ) : (
                <>Analyze My Startup <ArrowRight size={20} /></>
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
