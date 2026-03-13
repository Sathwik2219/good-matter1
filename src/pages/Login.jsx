import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect based on role
                if (data.user.role === 'INVESTOR') navigate('/investor/dashboard');
                else if (data.user.role === 'ADMIN') navigate('/admin');
                else navigate('/');

            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server connection failed. Is the backend running?');
        }
    };

    return (
        <div className="page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                <div className="glass scroll-animate" style={{ maxWidth: '450px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(11, 15, 26, 0.05)' }}>

                    <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                        <Link to="/" className="navbar-logo" style={{ display: 'inline-block', marginBottom: '1rem' }}>GoodMatter</Link>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Private Access for Investors</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Gain selective access to institutional‑grade startup opportunities.</p>
                    </div>

                    {error && <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="investor@fund.com"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-secondary-dark)', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Log In
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Not a member yet? <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: '500' }}>Apply here <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
