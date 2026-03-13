import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminRegister = () => {
    const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Must be logged in as ADMIN to access this page
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'ADMIN') navigate('/admin/login');
    }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (form.password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await fetch(`${API}/api/admin/create-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setSuccess(data.message);
            setForm({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
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
        boxSizing: 'border-box',
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
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 32px rgba(16,185,129,0.35)' }}>
                        <UserPlus size={30} style={{ color: 'white' }} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.4rem' }}>Create Admin Account</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>Restricted — only existing admins can create new admins</p>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)' }}>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {[
                            { label: 'Full Name',        name: 'name',            type: 'text',     ph: 'Jane Smith' },
                            { label: 'Email Address',    name: 'email',           type: 'email',    ph: 'jane@goodmatter.com' },
                            { label: 'Password',         name: 'password',        type: 'password', ph: '••••••••' },
                            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', ph: '••••••••' },
                        ].map(({ label, name, type, ph }) => (
                            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    required
                                    value={form[name]}
                                    onChange={handleChange}
                                    placeholder={ph}
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.6)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.9rem 1.5rem',
                                background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
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
                                boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                            }}
                        >
                            {loading ? 'Creating...' : (<><UserPlus size={16} /> Create Admin Account</>)}
                        </button>
                    </form>
                </div>

                {/* Nav */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <Link to="/admin" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ArrowLeft size={13} /> Back to Dashboard
                    </Link>
                    <Link to="/admin/login" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                        Admin Login →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
