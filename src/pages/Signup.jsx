import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Rocket, User, Mail, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'FOUNDER' })
            });
            const data = await response.json();
            if (response.ok) {
                setMsg(data.message || 'Verification link sent to your email.');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Server connection failed. Is the backend running?');
        }
        setLoading(false);
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
            <div style={{ width: '100%', maxWidth: '480px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(0,0,0,0.02)' }}>
                        <Rocket size={32} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                        Join the Network
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
                        Connect with aligned capital and build your legacy.
                    </p>
                </div>

                {/* Glass Card */}
                <div className="glass" style={{ borderRadius: '32px', padding: '2.5rem', boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(255,255,255,0.6)' }}>
                    {(error || msg) && (
                        <div style={{ padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600',
                            background: error ? 'rgba(214, 48, 49, 0.1)' : 'rgba(0, 184, 148, 0.1)', 
                            color: error ? '#d63031' : '#00b894', 
                            border: error ? '1px solid rgba(214, 48, 49, 0.15)' : '1px solid rgba(0, 184, 148, 0.15)' 
                        }}>
                            {error || msg}
                        </div>
                    )}

                    <form onSubmit={handleSignup} style={{ marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Founder Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                                <input type="text" placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Work Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                                <input type="email" placeholder="jane@startup.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>Secure Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                                <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'white'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.6)'; }} />
                            </div>
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                            {loading ? 'Processing...' : (<>Initialize Account <ArrowRight size={20} /></>)}
                        </button>
                    </form>

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
                                    const res = await fetch(`${API}/api/auth/google`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ idToken: credentialResponse.credential, role: 'FOUNDER', intent: 'signup' })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        localStorage.setItem('token', data.token);
                                        localStorage.setItem('user', JSON.stringify({ ...data.user, role: 'FOUNDER' }));
                                        navigate('/founder/dashboard');
                                    } else {
                                        setError(data.message || 'Google signup failed');
                                    }
                                } catch (err) {
                                    setError('Network error during Google signup');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            onError={() => setError('Google Signup Failed')}
                        />
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, fontWeight: '500', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                        Already have an account? <Link to="/founder/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '700' }}>Log In Here</Link>
                    </p>
                </div>

                {/* Subtle footer note */}
                <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500', opacity: 0.6 }}>
                  Selective vetting in progress. Accounts are verified within 24 hours.
                </p>
            </div>
        </div>
    );
};

export default Signup;
