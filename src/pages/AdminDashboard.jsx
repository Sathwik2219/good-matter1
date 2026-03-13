import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Users, FileText, TrendingUp, CheckCircle, XCircle, 
  Clock, BarChart2, AlertCircle, LogOut, ChevronDown, ChevronUp, ExternalLink 
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const statusColors = {
  PENDING:  { bg: '#fffbeb', color: '#f59e0b', label: 'Pending Review' },
  APPROVED: { bg: '#ecfdf5', color: '#10b981', label: 'Approved' },
  REJECTED: { bg: '#fef2f2', color: '#ef4444', label: 'Rejected' },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [legacySubs, setLegacySubs] = useState([]);
  const [newDeals, setNewDeals]     = useState([]);
  const [investors, setInvestors]     = useState([]);
  const [activeTab, setActiveTab]     = useState('deals'); // Default to new deals
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState(null);
  const [actionMsg, setActionMsg]     = useState('');

  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'ADMIN') { navigate('/admin/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, legacyRes, newRes, invRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/submissions`, { headers }), // legacy
        fetch(`${API}/api/admin/deals`, { headers }),       // new
        fetch(`${API}/api/admin/investors`, { headers }),
      ]);
      if (!statsRes.ok) throw new Error('Auth failed');
      setStats(await statsRes.json());
      setLegacySubs(await legacyRes.json());
      setNewDeals(await newRes.json());
      setInvestors(await invRes.json());
    } catch (e) {
      navigate('/admin/login');
    }
    setLoading(false);
  };

  const handleAction = async (id, action, isNew = true, reason = '') => {
    try {
      const endpoint = isNew ? `/api/admin/deals/${id}/${action}` : `/api/admin/startups/${id}/${action}`;
      const res = await fetch(`${API}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      setActionMsg(data.message);
      fetchAll();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      setActionMsg('Action failed. Please try again.');
    }
  };

  const parseAI = (aiSummary) => {
    try { return JSON.parse(aiSummary); } catch { return null; }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading admin panel...</p>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  const cardStyle = { background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };
  const tabStyle  = (active) => ({ padding: '0.6rem 1.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', background: active ? 'var(--color-primary)' : '#f1f5f9', color: active ? 'white' : 'var(--color-text-muted)', transition: 'all 0.2s' });

  const SubmissionCard = ({ item, isNew }) => {
    const isExp = expanded === item.id;
    const sc    = statusColors[item.status] || statusColors.PENDING;
    const ai    = isNew ? (item.ai_breakdown ? JSON.parse(item.ai_breakdown) : null) : parseAI(item.ai_summary);

    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{item.startup_name}</h3>
              <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', background: sc.bg, color: sc.color }}>{sc.label}</span>
              {item.ai_score > 0 && (
                <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', background: item.ai_score >= 75 ? '#ecfdf5' : '#fffbeb', color: item.ai_score >= 75 ? '#10b981' : '#f59e0b' }}>
                  AI Score: {item.ai_score}/100
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {isNew ? item.submitted_by : item.founder_name} · {item.email} · {item.industry} · {item.stage}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            {item.status === 'PENDING' && (
              <>
                <button onClick={() => handleAction(item.id, 'approve', isNew)} className="btn btn-sm" style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={() => handleAction(item.id, 'reject', isNew, 'Does not meet current criteria')} className="btn btn-sm" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={14} /> Reject
                </button>
              </>
            )}
            {item.pitch_deck_url && (
              <a href={item.pitch_deck_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                <ExternalLink size={13} /> Deck
              </a>
            )}
            <button onClick={() => setExpanded(isExp ? null : item.id)} className="btn btn-sm" style={{ background: '#f1f5f9', color: 'var(--color-primary)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isExp ? 'Less' : 'More'}
            </button>
          </div>
        </div>

        {isExp && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {isNew ? (
                <>
                  <b>Problem:</b> {item.problem}<br/><br/>
                  <b>Solution:</b> {item.solution}<br/><br/>
                  <b>Market:</b> {item.market_size}
                </>
              ) : (
                item.description
              )}
            </p>

            {ai && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                
                {/* 6 Category Scores (if new) */}
                {isNew && ai.categories && (
                  <div style={{ gridColumn: '1 / -1', background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', border: '1px solid #e2e8f0' }}>
                    {Object.entries(ai.categories).map(([cat, score]) => (
                      <div key={cat} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{cat}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444' }}>{score}/10</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: '#ecfdf5', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>✅ Strengths</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#065f46', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {ai.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>

                <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fecaca' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⚠️ Risks</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991b1b', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {ai.risks?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', gridColumn: 'span 1' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>📊 Market Opportunity</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    {ai.marketOpportunity}
                  </p>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', gridColumn: 'span 1' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>💡 Investment Potential</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    {ai.investmentPotential}
                  </p>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '80px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-card { background: white; border-radius: 16px; padding: 1.75rem; border: 1px solid rgba(11,15,26,0.07); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .stat-number { font-size: 2rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
        .stat-lbl { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.4rem; font-weight: 500; }
        .intro-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} style={{ color: 'white' }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Admin Panel</h1>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>GoodMatter Moderation Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/register" className="btn btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem' }}>
              + Create Admin
            </Link>
            <button onClick={() => { localStorage.clear(); navigate('/admin/login'); }} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {actionMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> {actionMsg}
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Submissions',  value: stats?.totalSubmissions || 0,  icon: FileText,   bg: '#eef2ff', color: '#6366f1' },
            { label: 'Pending Review',     value: stats?.pendingReview || 0,     icon: Clock,      bg: '#fffbeb', color: '#f59e0b' },
            { label: 'Active Deals',       value: stats?.activeDeals || 0,       icon: TrendingUp, bg: '#ecfdf5', color: '#10b981' },
            { label: 'Investors',          value: stats?.totalInvestors || 0,    icon: Users,      bg: '#eff6ff', color: '#3b82f6' },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div key={label} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button style={tabStyle(activeTab === 'deals')} onClick={() => setActiveTab('deals')}>
            🚀 Deal Submissions ({newDeals.length})
          </button>
          <button style={tabStyle(activeTab === 'legacy')} onClick={() => setActiveTab('legacy')}>
            📜 Legacy Apps ({legacySubs.length})
          </button>
          <button style={tabStyle(activeTab === 'investors')} onClick={() => setActiveTab('investors')}>
            👥 Investors ({investors.length})
          </button>
        </div>

        {/* ── New Deal Submissions Tab ── */}
        {activeTab === 'deals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {newDeals.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>No AI deals submitted yet.</div>}
            {newDeals.map(deal => (
              <SubmissionCard key={deal.id} item={deal} isNew={true} />
            ))}
          </div>
        )}

        {/* ── Legacy Submissions Tab ── */}
        {activeTab === 'legacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {legacySubs.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>No legacy apps.</div>}
            {legacySubs.map(app => (
              <SubmissionCard key={app.id} item={app} isNew={false} />
            ))}
          </div>
        )}

        {/* ── Investors Tab ── */}
        {activeTab === 'investors' && (
          <div style={cardStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '520px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Name', 'Email', 'Role', 'Intro Requests'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investors.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: '600' }}>{inv.name}</td>
                    <td style={{ padding: '0.85rem 0.75rem', color: 'var(--color-text-muted)' }}>{inv.email}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}><span style={{ background: '#eef2ff', color: '#6366f1', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{inv.role}</span></td>
                    <td style={{ padding: '0.85rem 0.75rem', color: 'var(--color-text-muted)' }}>{inv.intro_requests || 0}</td>
                  </tr>
                ))}
                {investors.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No investors yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
