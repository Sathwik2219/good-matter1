import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminLogin = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();

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

            if (res.ok && data.user?.role === 'ADMIN') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/admin');
            } else if (res.ok && data.user?.role !== 'ADMIN') {
                setError('Access denied. This portal is for administrators only.');
            } else {
                setError(data.message || 'Invalid credentials.');
            }
        } catch {
            setError('Server connection failed. Is the backend running?');
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', padding: '0.85rem 1rem',
        background: 'var(--color-bg-surface-light)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px', color: 'var(--color-text-main)', outline: 'none',
        fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box',
    };

    const labelStyle = {
        display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--color-bg-main)' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <Shield size={28} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--color-text-main)', margin: '0 0 0.5rem' }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                        Restricted access — GoodMatter team only
                    </p>
                </div>

                {/* Card */}
                <div style={{ background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {error && (
                        <div style={{ padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                             {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Admin Email</label>
                            <input type="email" placeholder="admin@goodmatter.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Password</label>
                            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                        </div>
                        
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
                            background: 'white', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                        }}>
                            {loading ? 'Authenticating...' : 'Sign In as Admin'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <span style={{ padding: '0 1rem', fontSize: '0.85rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                setLoading(true);
                                try {
                                    const res = await fetch(`${API}/api/auth/google`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ idToken: credentialResponse.credential, intent: 'login' })
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.user?.role === 'ADMIN') {
                                        localStorage.setItem('token', data.token);
                                        localStorage.setItem('user', JSON.stringify(data.user));
                                        navigate('/admin');
                                    } else if (res.ok) {
                                        setError('Access denied. Admin role required.');
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

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        Not an admin? <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '600' }}>Investor Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
