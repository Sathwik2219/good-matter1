import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminRegister = () => {
    const [form, setForm]       = useState({ name: '', email: '', password: '' });
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
            setForm({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.message);
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
            <div style={{ width: '100%', maxWidth: '460px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <UserPlus size={30} style={{ color: 'var(--color-highlight)' }} />
                    </div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--color-text-main)', margin: '0 0 0.5rem' }}>
                        Create Admin Account
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                        Restricted — only existing admins can create new admins
                    </p>
                </div>

                {/* Card */}
                <div style={{ background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {(error || success) && (
                        <div style={{ padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem', 
                            background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                            color: error ? '#f87171' : '#34d399', 
                            border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)' 
                        }}>
                             {error || success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Full Name',        name: 'name',            type: 'text',     ph: 'Jane Smith' },
                            { label: 'Email Address',    name: 'email',           type: 'email',    ph: 'jane@goodmatter.com' },
                            { label: 'Temporary Password', name: 'password',      type: 'text',     ph: 'adminpassword123' },
                        ].map(({ label, name, type, ph }) => (
                            <div key={name} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    required
                                    value={form[name]}
                                    onChange={handleChange}
                                    placeholder={ph}
                                    style={inputStyle}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
                                background: 'white', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255,255,255,0.1)', marginTop: '0.5rem'
                            }}
                        >
                            {loading ? 'Creating...' : (<><UserPlus size={16} /> Create Admin</>)}
                        </button>
                    </form>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                        <Link to="/admin" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ArrowLeft size={13} /> Dashboard
                        </Link>
                        <Link to="/admin/login" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                            Admin Login →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
