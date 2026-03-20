import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, ExternalLink } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?.role === 'INVESTOR') navigate('/investor/dashboard', { replace: true });
      if (u?.role === 'ADMIN')    navigate('/admin', { replace: true });
    } catch {}
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'INVESTOR') navigate('/investor/dashboard');
        else if (data.user.role === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        if (res.status === 403 && data.needsVerification) {
          setError('Please verify your email address. Check your inbox for the verification link.');
          return;
        }
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server connection failed. Please try again.');
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
            <Shield size={32} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>Investor Access</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
            Exclusive entry for curated institutional capital.
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass" style={{ borderRadius: '32px', padding: '2.5rem', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(255,255,255,0.6)' }}>

          {error && (
            <div style={{ background: 'rgba(214,48,49,0.1)', border: '1px solid rgba(214,48,49,0.15)', color: '#d63031', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                  <input type="email" placeholder="investor@firm.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={labelStyle}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '700', marginBottom: '0.5rem' }}>Forgot ID?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                  <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                {loading ? 'Verifying Credentials...' : 'Sign In to Portal'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', opacity: 0.4 }}>
              <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
              <span style={{ padding: '0 1.25rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity Logic</span>
              <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoading(true);
                  try {
                    const res = await fetch(`${API}/api/auth/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ idToken: credentialResponse.credential, role: 'INVESTOR', intent: 'login' })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('user', JSON.stringify(data.user));
                      if (data.user.role === 'INVESTOR') navigate('/investor/dashboard');
                      else if (data.user.role === 'ADMIN') navigate('/admin');
                      else navigate('/');
                    } else {
                      setError(data.message || 'Google login failed');
                    }
                  } catch (err) {
                    setError('Network error during Google login');
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => setError('Google Login Failed')}
              />
            </div>
          </div>

          {/* Request Access CTA */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, fontWeight: '500' }}>
                Are you a Founder? <Link to="/founder/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '700' }}>Switch to Founder Portal</Link>
            </p>
          </div>
        </div>

        {/* Subtle footer note */}
        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500', opacity: 0.6 }}>
          By accessing this portal, you agree to our <Link to="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Standards</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
