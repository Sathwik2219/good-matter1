import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const VerifyLink = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        // Try the standard user route first, then founder if it fails
        let res = await fetch(`${API}/api/auth/verify?token=${token}`);
        let data = await res.json();

        if (!res.ok) {
           // If it failed on /auth, it might be a founder token
           res = await fetch(`${API}/api/founder/verify?token=${token}`);
           data = await res.json();
        }

        if (res.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verifyToken();
  }, [location, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-main)', padding: '20px' }}>
      <div style={{ background: 'var(--color-bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <Loader2 size={48} style={{ color: '#818cf8', animation: 'spin 1s linear infinite' }} />
            <h2 style={{ color: 'var(--color-text-main)', margin: 0, fontSize: '1.5rem' }}>Verifying Identity</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <CheckCircle size={56} style={{ color: '#10b981' }} />
            <h2 style={{ color: 'var(--color-text-main)', margin: 0, fontSize: '1.5rem' }}>Verified!</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{message}</p>
            <p style={{ fontSize: '0.85rem', color: '#6366f1', marginTop: '10px' }}>Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <XCircle size={56} style={{ color: '#ef4444' }} />
            <h2 style={{ color: 'var(--color-text-main)', margin: 0, fontSize: '1.5rem' }}>Verification Failed</h2>
            <p style={{ color: '#f87171', margin: 0, fontSize: '0.95rem' }}>{message}</p>
            
            <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '10px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Return to Login
            </button>
          </div>
        )}

      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VerifyLink;
