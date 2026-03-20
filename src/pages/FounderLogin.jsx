import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, AlertCircle, Rocket } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const FounderAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── 1. Already-authenticated redirect ──────────────────────────────────────
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?.role === 'FOUNDER') {
        const redirect = localStorage.getItem('gm_redirect_after_login') || '/founder/dashboard';
        localStorage.removeItem('gm_redirect_after_login');
        navigate(redirect, { replace: true });
      }
    } catch {}
  }, [navigate]);

  const [step, setStep] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/api/founder/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send code');
      setStep('OTP');
      setMsg({ text: 'Access code sent to your inbox!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/api/founder/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const redirect = localStorage.getItem('gm_redirect_after_login') || '/founder/dashboard';
      localStorage.removeItem('gm_redirect_after_login');
      navigate(redirect, { replace: true });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem 0.875rem 3.25rem',
    background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '16px', color: 'var(--color-primary)', outline: 'none',
    fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem', background: 'transparent' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <Rocket size={32} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            GoodMatter for Founders
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
            Initialize your fundraising sequence.
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass" style={{ borderRadius: '32px', padding: '2.5rem', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(255,255,255,0.6)' }}>
            {msg.text && (
              <div style={{ padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600',
                background: msg.type === 'success' ? 'rgba(0, 184, 148, 0.1)' : 'rgba(214, 48, 49, 0.1)', 
                color: msg.type === 'success' ? '#00b894' : '#d63031', 
                border: msg.type === 'success' ? '1px solid rgba(0, 184, 148, 0.15)' : '1px solid rgba(214, 48, 49, 0.15)'
              }}>
                {msg.text}
              </div>
            )}

            {step === 'EMAIL' ? (
              <form onSubmit={handleSendOtp} style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Work Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                    <input type="email" placeholder="founder@startup.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                  {loading ? 'Sending Code...' : (<>Request Access Code <ArrowRight size={20} /></>)}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{...labelStyle, textAlign: 'center'}}>Enter 6-Digit Secure Code</label>
                  <input type="text" maxLength="6" placeholder="000000" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    style={{...inputStyle, padding: '1rem', textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: '800', background: 'rgba(255,255,255,0.8)'}} 
                    onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} 
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.8)'; }} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: 'var(--color-accent-blue)', color: 'white' }}>
                  {loading ? 'Authorizing...' : 'Complete Verification'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                   <button type="button" onClick={() => setStep('EMAIL')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>
                      Change Email Address
                   </button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--color-text-muted)', opacity: 0.4 }}>
              <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
              <span style={{ padding: '0 1.25rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity Logic</span>
              <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoading(true);
                  try {
                    const res = await fetch(`${API}/api/founder/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ idToken: credentialResponse.credential, role: 'FOUNDER', intent: 'login' })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('user', JSON.stringify(data.user));
                      const redirect = localStorage.getItem('gm_redirect_after_login') || '/founder/dashboard';
                      localStorage.removeItem('gm_redirect_after_login');
                      navigate(redirect, { replace: true });
                    } else {
                      setMsg({ text: data.message || 'Google authentication failed', type: 'error' });
                    }
                  } catch (err) {
                    setMsg({ text: 'Network error during Google authentication', type: 'error' });
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => setMsg({ text: 'Google Auth Failed', type: 'error' })}
              />
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, fontWeight: '500', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                Are you an Investor? <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '700' }}>Switch to Investor Portal</Link>
            </p>
        </div>
        
        {/* Subtle footer note */}
        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500', opacity: 0.6 }}>
          One-time code verification ensures secure, passwordless access.
        </p>
      </div>
    </div>
  );
};

export default FounderAuth;
