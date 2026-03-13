import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SECTORS = [
  'Fintech','HealthTech','AI/SaaS','ClimateTech','EdTech','DeepTech',
  'TravelTech','F&B','D2C / Retail','Logistics','AgriTech','Enterprise SaaS',
  'Cybersecurity','Health & Wellness',
];
const STAGES = ['Pre-seed','Seed','Pre-Series A','Series A','Series B+'];

const InvestorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile]  = useState({ preferred_sectors: [], preferred_stages: [], ticket_size: '', bio: '', linkedin_url: '' });
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);
  const [success, setSuccess]  = useState('');
  const [error, setError]      = useState('');

  const safeJsonParse = (str, fallback) => {
    try {
      if (!str) return fallback;
      if (typeof str === 'object') return str;
      return JSON.parse(str);
    } catch (e) {
      console.error('Safe JSON Parse Error:', e, 'String:', str);
      return fallback;
    }
  };

  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'INVESTOR') { navigate('/login'); return; }
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/investor/profile`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        
        const data = await res.json();
        console.log('Profile Data Loaded:', data);

        setProfile({
          preferred_sectors: safeJsonParse(data.preferred_sectors, []),
          preferred_stages:  safeJsonParse(data.preferred_stages, []),
          ticket_size:       data.ticket_size   || '',
          bio:               data.bio           || '',
          linkedin_url:      data.linkedin_url  || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const toggleSector = (s) => setProfile(p => ({
    ...p,
    preferred_sectors: p.preferred_sectors.includes(s)
      ? p.preferred_sectors.filter(x => x !== s)
      : [...p.preferred_sectors, s],
  }));

  const toggleStage = (s) => setProfile(p => ({
    ...p,
    preferred_stages: p.preferred_stages.includes(s)
      ? p.preferred_stages.filter(x => x !== s)
      : [...p.preferred_stages, s],
  }));

  const handleSave = async () => {
    setSaving(true); setSuccess(''); setError('');
    try {
      const res = await fetch(`${API}/api/investor/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const inputStyle = { padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  const chipStyle  = (active) => ({ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${active ? '#6366f1' : '#e2e8f0'}`, background: active ? '#eef2ff' : 'white', color: active ? '#6366f1' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', transition: 'all 0.2s' });

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}><p>Loading profile...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '90px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Investor Profile</h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Set your preferences to receive matched deals from our AI engine
            </p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {saving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
          </button>
        </div>

        {success && (
          <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> {success}
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>⚠️ {error}</div>
        )}

        {/* Personal Info */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} style={{ color: 'var(--color-accent)' }} /> Personal Info
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>LinkedIn URL</label>
              <input value={profile.linkedin_url} onChange={e => setProfile(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Investment Ticket Size</label>
              <input value={profile.ticket_size} onChange={e => setProfile(p => ({ ...p, ticket_size: e.target.value }))} placeholder="e.g. ₹50L – ₹2Cr" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={2} placeholder="Briefly describe your background and investment focus..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Preferred Sectors */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '700' }}>🏭 Preferred Sectors</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Select all sectors you invest in. Deals will be matched based on these.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SECTORS.map(s => (
              <button key={s} type="button" onClick={() => toggleSector(s)} style={chipStyle(Array.isArray(profile.preferred_sectors) && profile.preferred_sectors.includes(s))}>
                {s}
              </button>
            ))}
          </div>
          {(!Array.isArray(profile.preferred_sectors) || profile.preferred_sectors.length === 0) && (
            <p style={{ color: '#f59e0b', fontSize: '0.82rem', marginTop: '0.75rem' }}>⚠️ No sectors selected — you will match all deal sectors</p>
          )}
        </div>

        {/* Preferred Stages */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '700' }}>📊 Preferred Stages</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Select funding stages you typically invest in.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {STAGES.map(s => (
              <button key={s} type="button" onClick={() => toggleStage(s)} style={chipStyle(Array.isArray(profile.preferred_stages) && profile.preferred_stages.includes(s))}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Matching preview */}
        <div style={{ background: '#eef2ff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #c7d2fe' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: '700', color: '#4338ca' }}>🤖 Your Matching Criteria</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Sectors</div>
              <div style={{ color: '#4338ca', fontSize: '0.9rem' }}>
                {Array.isArray(profile.preferred_sectors) && profile.preferred_sectors.length ? profile.preferred_sectors.join(', ') : 'All sectors'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Stages</div>
              <div style={{ color: '#4338ca', fontSize: '0.9rem' }}>
                {Array.isArray(profile.preferred_stages) && profile.preferred_stages.length ? profile.preferred_stages.join(', ') : 'All stages'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ticket Size</div>
              <div style={{ color: '#4338ca', fontSize: '0.9rem' }}>{profile.ticket_size || 'Not set'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestorProfile;
