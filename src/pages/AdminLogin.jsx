import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock } from 'lucide-react';

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
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        outline: 'none',
        width: '100%',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.07)',
        color: 'white',
        transition: 'border-color 0.2s',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0b0f1a 0%, #111827 50%, #0f1f38 100%)',
            padding: '2rem',
        }}>
            {/* Subtle grid bg */}
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

                {/* Lock Icon */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
                        <Shield size={30} style={{ color: 'white' }} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.4rem' }}>Admin Portal</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>Restricted access — GoodMatter team only</p>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)' }}>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={14} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@goodmatter.com"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.9rem 1.5rem',
                                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {loading ? 'Authenticating...' : (<>Access Admin Panel <ArrowRight size={16} /></>)}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
                    Not an admin? <a href="/login" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Investor Login →</a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
