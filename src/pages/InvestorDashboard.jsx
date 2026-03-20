import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, FileText, ArrowRight, LogOut, BarChart2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import '../pages/Home.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const categoryColors = {
  'Angel / Early Stage':        { bg: 'rgba(250, 177, 160, 0.1)', color: '#e17055', border: 'rgba(250, 177, 160, 0.2)' },
  'Venture Capital / PE':       { bg: 'rgba(116, 185, 255, 0.1)', color: '#0984e3', border: 'rgba(116, 185, 255, 0.2)' },
  'IPO Stage':                  { bg: 'rgba(85, 239, 196, 0.1)', color: '#00b894', border: 'rgba(85, 239, 196, 0.2)' },
  'Debt & Structured Finance':  { bg: 'rgba(255, 234, 167, 0.1)', color: '#fdcb6e', border: 'rgba(255, 234, 167, 0.2)' },
  'Mergers & Acquisitions':     { bg: 'rgba(162, 155, 254, 0.1)', color: '#6c5ce7', border: 'rgba(162, 155, 254, 0.2)' },
};

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [matched, setMatched] = useState([]);
  const [loadingMatched, setLoadingMatched] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    // Fetch dashboard stats
    fetch(`${API}/api/investor/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(data => { setDashboard(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });

    // Fetch matched deals
    fetch(`${API}/api/investor/matched-deals`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setMatched(data.slice(0, 3)); setLoadingMatched(false); })
      .catch(() => setLoadingMatched(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--color-text-main)' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '80px' }}>
      <AlertCircle size={40} style={{ color: '#ef4444' }} />
      <p style={{ color: 'var(--color-text-muted)' }}>Session expired. Please log in again.</p>
      <Link to="/login" className="btn btn-primary">Log In</Link>
    </div>
  );

  const allCategories = [
    'Angel / Early Stage', 'Venture Capital / PE', 'IPO Stage',
    'Debt & Structured Finance', 'Mergers & Acquisitions'
  ];

  const MatchedDealsList = () => {
    if (loadingMatched) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Finding matches...</div>;
    if (matched.length === 0) return (
      <div className="glass" style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: '24px' }}>
        <TrendingUp size={32} style={{ opacity: 0.3, marginBottom: '0.75rem', color: 'var(--color-accent)' }} />
        <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--color-text-muted)' }}>No AI matches yet. Complete your profile to get discovered!</p>
        <Link to="/investor/profile" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Complete Profile</Link>
      </div>
    );

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {matched.map(deal => {
          const clr = categoryColors[deal.category] || { bg: 'rgba(250, 177, 160, 0.1)', color: '#e17055', border: 'rgba(250, 177, 160, 0.2)' };
          const score = deal.ai_score ?? 0;
          const scoreColor = score >= 85 ? '#e17055' : score >= 70 ? '#0984e3' : score >= 60 ? '#00b894' : '#636E72';
          return (
            <div key={deal.deal_id} className="glass"
              style={{ borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.4)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'default', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-premium)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}>

              {/* Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: clr.color, flexShrink: 0, border: `1px solid rgba(0,0,0,0.03)`, boxShadow: 'var(--shadow-sm)' }}>
                    {deal.startup_name?.charAt(0) || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.startup_name}</h4>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {deal.industry && <span style={{ fontSize: '0.75rem', color: clr.color, fontWeight: '700', padding: '1px 10px', background: clr.bg, borderRadius: '20px' }}>{deal.industry}</span>}
                    </div>
                  </div>
                </div>
                {/* AI Score pill */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: scoreColor, lineHeight: 1 }}>{deal.ai_score ?? '—'}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Match</div>
                </div>
              </div>

              {/* Summary */}
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, flex: 1, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {deal.problem || deal.description || 'Details available upon introduction.'}
              </p>

              {/* Bottom Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted-light)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.25rem' }}>Raise Target</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{deal.raise_amount || '—'}</div>
                </div>
                <Link to="/investor/deals" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Inquire <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '80px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-card { background: rgba(255,255,255,0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; padding: 2rem; border: 1px solid rgba(255,255,255,0.5); box-shadow: var(--shadow-premium); transition: transform 0.3s ease; }
        .stat-number { font-size: 2.75rem; font-weight: 800; color: var(--color-primary); line-height: 1; letter-spacing: -0.02em; }
        .stat-lbl { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .intro-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Welcome back,</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              {dashboard?.investorName || 'Investor'} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/investor/deals" className="btn btn-primary">
              Browse Deals <ArrowRight size={18} />
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(250, 177, 160, 0.15)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={28} style={{ color: '#e17055' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.totalActiveDeals ?? 0}</div>
              <div className="stat-lbl">Active Deals</div>
            </div>
          </div>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(85, 239, 196, 0.15)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={28} style={{ color: '#00b894' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.myIntroRequests?.length ?? 0}</div>
              <div className="stat-lbl">Intro Requests</div>
            </div>
          </div>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(116, 185, 255, 0.15)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart2 size={28} style={{ color: '#0984e3' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.categoryBreakdown?.length ?? 0}</div>
              <div className="stat-lbl">Sectors</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

          {/* Deal Categories Breakdown */}
          <div className="dash-card">
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontWeight: '700' }}>
              <BarChart2 size={20} style={{ color: 'var(--color-accent)' }} /> Sector Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {allCategories.map(cat => {
                const match = dashboard?.categoryBreakdown?.find(c => c.category === cat);
                const count = match?.count || 0;
                const total = dashboard?.totalActiveDeals || 1;
                const pct = Math.round((count / total) * 100);
                const clr = categoryColors[cat] || { bg: '#f3f4f6', color: '#6b7280', border: '#9ca3af' };
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: clr.color }}>{cat}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{count} deals</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: clr.color, borderRadius: '10px', transition: 'width 1s cubic-bezier(0.23, 1, 0.32, 1)' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Introduction Requests */}
          <div className="dash-card">
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontWeight: '700' }}>
              <Clock size={20} style={{ color: 'var(--color-accent)' }} /> Intro Status
            </h3>
            {dashboard?.myIntroRequests?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.95rem' }}>No active requests.</p>
                <Link to="/investor/deals" className="btn btn-outline btn-sm" style={{ marginTop: '1.5rem' }}>Browse Deals</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dashboard.myIntroRequests.map((req, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.02)' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary)' }}>{req.startup_name}</span>
                    <span className="intro-badge" style={{ background: req.status === 'PENDING' ? 'rgba(250, 177, 160, 0.15)' : 'rgba(85, 239, 196, 0.15)', color: req.status === 'PENDING' ? '#e17055' : '#00b894', border: `1px solid ${req.status === 'PENDING' ? 'rgba(250, 177, 160, 0.2)' : 'rgba(85, 239, 196, 0.2)'}` }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New: Matched for You Section */}
          <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontWeight: '700' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} /> AI Matched Dealflow
              </h3>
              <Link to="/investor/deals" style={{ fontSize: '0.9rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '700' }}>Full Pipeline →</Link>
            </div>
            
            <MatchedDealsList />
          </div>

          {/* GoodMatter Philosophy Banner */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(45, 52, 70, 0.95)', borderRadius: '24px', padding: '3rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-lg)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem', fontWeight: '700' }}>Private Access</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>Not data. Not volume.</h3>
              <p style={{ opacity: 0.8, margin: 0, fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6 }}>Curation + Restraint + Trust. We do not aggregate. We curate for conviction.</p>
            </div>
            <Link to="/investor/deals" className="btn btn-primary" style={{ whiteSpace: 'nowrap', background: 'white', color: 'var(--color-primary)', boxShadow: 'none' }}>
              Explore High-Signal Deals <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
