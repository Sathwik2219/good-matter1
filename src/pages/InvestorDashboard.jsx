import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, FileText, ArrowRight, LogOut, BarChart2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import '../pages/Home.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const categoryColors = {
  'Angel / Early Stage':        { bg: '#eef2ff', color: '#6366f1', border: '#6366f1' },
  'Venture Capital / PE':       { bg: '#eff6ff', color: '#3b82f6', border: '#3b82f6' },
  'IPO Stage':                  { bg: '#ecfdf5', color: '#10b981', border: '#10b981' },
  'Debt & Structured Finance':  { bg: '#fffbeb', color: '#f59e0b', border: '#f59e0b' },
  'Mergers & Acquisitions':     { bg: '#fef2f2', color: '#ef4444', border: '#ef4444' },
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
        <p style={{ color: 'var(--color-text-muted)' }}>Loading your dashboard...</p>
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
      <div style={{ textAlign: 'center', padding: '2rem 2rem', color: 'var(--color-text-muted)', border: '1px dashed #e2e8f0', borderRadius: '14px' }}>
        <TrendingUp size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
        <p style={{ fontSize: '0.9rem', margin: 0 }}>No AI matches yet. Complete your profile to get discovered!</p>
        <Link to="/investor/profile" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Complete Profile</Link>
      </div>
    );

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {matched.map(deal => (
          <div key={deal.deal_id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#f8fafc', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{deal.startup_name}</h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{deal.industry} · {deal.stage}</p>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '20px', background: '#eef2ff', color: '#6366f1', fontSize: '0.72rem', fontWeight: '800' }}>
                AI: {deal.ai_score}
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {deal.problem || deal.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #edf2f7' }}>
               <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                 <CheckCircle size={12} /> {deal.match_reason || 'Highly Relevant'}
               </span>
               <Link to="/investor/deals" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', textDecoration: 'none' }}>Details →</Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '80px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-card { background: white; border-radius: 16px; padding: 1.75rem; border: 1px solid rgba(11,15,26,0.07); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .stat-number { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
        .stat-lbl { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.4rem; font-weight: 500; }
        .intro-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Welcome back,</p>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)', margin: 0 }}>
              {dashboard?.investorName || 'Investor'} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/investor/deals" className="btn btn-primary">
              View All Deals <ArrowRight size={16} />
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#eef2ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={24} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.totalActiveDeals ?? 0}</div>
              <div className="stat-lbl">Active Deals Live</div>
            </div>
          </div>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#ecfdf5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={24} style={{ color: '#10b981' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.myIntroRequests?.length ?? 0}</div>
              <div className="stat-lbl">My Intro Requests</div>
            </div>
          </div>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart2 size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="stat-number">{dashboard?.categoryBreakdown?.length ?? 0}</div>
              <div className="stat-lbl">Deal Categories</div>
            </div>
          </div>
          <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#fffbeb', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={24} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <div className="stat-number">100+</div>
              <div className="stat-lbl">Investor Network</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Deal Categories Breakdown */}
          <div className="dash-card" style={{ gridColumn: 'span 1' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} style={{ color: 'var(--color-accent)' }} /> Deal Category Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allCategories.map(cat => {
                const match = dashboard?.categoryBreakdown?.find(c => c.category === cat);
                const count = match?.count || 0;
                const total = dashboard?.totalActiveDeals || 1;
                const pct = Math.round((count / total) * 100);
                const clr = categoryColors[cat] || { bg: '#f3f4f6', color: '#6b7280', border: '#9ca3af' };
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: clr.color }}>{cat}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{count} deal{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: clr.color, borderRadius: '4px', transition: 'width 0.6s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Introduction Requests */}
          <div className="dash-card" style={{ gridColumn: 'span 1' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--color-accent)' }} /> My Introduction Requests
            </h3>
            {dashboard?.myIntroRequests?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.9rem' }}>No intro requests yet.</p>
                <Link to="/investor/deals" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Browse Deals</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboard.myIntroRequests.map((req, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{req.startup_name}</span>
                    <span className="intro-badge" style={{ background: req.status === 'PENDING' ? '#fffbeb' : '#ecfdf5', color: req.status === 'PENDING' ? '#f59e0b' : '#10b981' }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New: Matched for You Section */}
          <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: '#6366f1' }} /> Matched for You (AI Curated)
              </h3>
              <Link to="/investor/deals" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>See all matched deals →</Link>
            </div>
            
            <MatchedDealsList />
          </div>

          {/* GoodMatter Philosophy Banner */}
          <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e3a5f 100%)', borderRadius: '16px', padding: '2rem 2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Our Moat</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Not data. Not volume.</h3>
              <p style={{ opacity: 0.75, margin: 0, fontSize: '0.95rem' }}>Curation + Restraint + Trust. We do not aggregate. We curate.</p>
            </div>
            <Link to="/investor/deals" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
              Explore Live Deals <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
