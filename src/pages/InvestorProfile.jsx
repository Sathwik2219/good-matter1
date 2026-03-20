import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SECTORS = [
  'Fintech','HealthTech','AI/SaaS','ClimateTech','EdTech','DeepTech',
  'TravelTech','F&B','D2C / Retail','Logistics','AgriTech','Enterprise SaaS',
  'Cybersecurity','Health & Wellness',
];
const STAGES = ['Pre-seed','Seed','Series A','Series B','Series D'];
const ROLES = ['Partner', 'Analyst or Associates', 'Angel', 'VC', 'PE', 'M&A', 'Family Office', 'Debt'];

const InvestorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile]  = useState({ 
    preferred_sectors: [], 
    preferred_stages: [], 
    ticket_size: '', 
    bio: '', 
    linkedin_url: '',
    firm_name: '',
    role: '',
    geography: '',
    sector_agnostic: false
  });
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

        const sectors = safeJsonParse(data.preferred_sectors, []);
        
        setProfile({
          preferred_sectors: sectors,
          preferred_stages:  safeJsonParse(data.preferred_stages, []),
          ticket_size:       data.ticket_size   || '',
          bio:               data.bio           || '',
          linkedin_url:      data.linkedin_url  || '',
          firm_name:         data.firm_name     || '',
          role:              data.role          || '',
          geography:         data.geography     || '',
          sector_agnostic:   sectors.includes('Sector Agnostic') || data.sector_agnostic === true,
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

  const toggleSector = (s) => {
    if (s === 'Sector Agnostic') {
      setProfile(p => ({
        ...p,
        sector_agnostic: !p.sector_agnostic,
        preferred_sectors: !p.sector_agnostic ? ['Sector Agnostic'] : []
      }));
      return;
    }

    setProfile(p => {
      const sectors = p.preferred_sectors.includes('Sector Agnostic') 
        ? p.preferred_sectors.filter(x => x !== 'Sector Agnostic')
        : p.preferred_sectors;
        
      return {
        ...p,
        sector_agnostic: false,
        preferred_sectors: sectors.includes(s)
          ? sectors.filter(x => x !== s)
          : [...sectors, s],
      };
    });
  };

  const toggleStage = (s) => setProfile(p => ({
    ...p,
    preferred_stages: p.preferred_stages.includes(s)
      ? p.preferred_stages.filter(x => x !== s)
      : [...p.preferred_stages, s],
  }));

  const handleSave = async () => {
    setSaving(true); setSuccess(''); setError('');
    try {
      const payload = { ...profile };
      if (profile.sector_agnostic) {
        payload.preferred_sectors = ['Sector Agnostic'];
      }

      const res = await fetch(`${API}/api/investor/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const inputStyle = { padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--color-bg-surface-light)', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s', background: 'var(--color-bg-surface-light)', color: 'var(--color-text-main)' };
  const chipStyle  = (active) => ({ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${active ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}`, background: active ? 'rgba(99,102,241,0.1)' : 'var(--color-bg-surface-light)', color: active ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', transition: 'all 0.2s' });

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}><p>Loading profile...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', paddingTop: '90px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-text-main)' }}>Investor Profile</h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Welcome, <span style={{ color: 'var(--color-accent)' }}>{user.name}</span>! Set your preferences for deal matching.
            </p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {saving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
          </button>
        </div>

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> {success}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>⚠️ {error}</div>
        )}

        {/* Personal & Organization Info */}
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
            <User size={16} style={{ color: 'var(--color-accent)' }} /> Organization & Role
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Firm / Organization</label>
              <input value={profile.firm_name} onChange={e => setProfile(p => ({ ...p, firm_name: e.target.value }))} placeholder="e.g. Sequoia Capital, Angel List" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Role</label>
              <select value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} style={{ ...inputStyle, backgroundColor: 'var(--color-bg-surface-light)' }}>
                <option value="">Select your role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>LinkedIn URL</label>
              <input value={profile.linkedin_url} onChange={e => setProfile(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Geography Preference</label>
              <input value={profile.geography} onChange={e => setProfile(p => ({ ...p, geography: e.target.value }))} placeholder="e.g. India, USA, Global" style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Average Check Size (Ticket Size)</label>
              <input value={profile.ticket_size} onChange={e => setProfile(p => ({ ...p, ticket_size: e.target.value }))} placeholder="e.g. $100K - $500K" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={2} placeholder="Briefly describe your investment background..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Investment Stages */}
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)' }}>📊 Investment Stage Focus</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Select funding stages you typically participate in.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {STAGES.map(s => (
              <button key={s} type="button" onClick={() => toggleStage(s)} style={chipStyle(Array.isArray(profile.preferred_stages) && profile.preferred_stages.includes(s))}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Preferences */}
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)' }}>🏭 Sector Preferences</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', color: profile.sector_agnostic ? '#6366f1' : 'var(--color-text-muted)' }}>
              <input type="checkbox" checked={profile.sector_agnostic} onChange={() => toggleSector('Sector Agnostic')} style={{ width: '16px', height: '16px' }} />
              Sector Agnostic
            </label>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {profile.sector_agnostic ? 'You are open to all sectors. Deselect "Sector Agnostic" to pick specific ones.' : 'Select all sectors of interest.'}
          </p>
          {!profile.sector_agnostic && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SECTORS.map(s => (
                <button key={s} type="button" onClick={() => toggleSector(s)} style={chipStyle(Array.isArray(profile.preferred_sectors) && profile.preferred_sectors.includes(s))}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Matching preview */}
        <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-accent)' }}>🤖 Your Matching Criteria</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Role @ Firm</div>
              <div style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                {profile.role || 'No Role'} {profile.firm_name ? `@ ${profile.firm_name}` : ''}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Sectors</div>
              <div style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                {profile.sector_agnostic ? 'Sector Agnostic (All)' : (Array.isArray(profile.preferred_sectors) && profile.preferred_sectors.length ? profile.preferred_sectors.join(', ') : 'None selected')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Stages</div>
              <div style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                {Array.isArray(profile.preferred_stages) && profile.preferred_stages.length ? profile.preferred_stages.join(', ') : 'All stages'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Geography</div>
              <div style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{profile.geography || 'Not set'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestorProfile;
