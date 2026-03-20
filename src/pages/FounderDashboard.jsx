import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle,
  Star, Zap, TrendingUp, FileText, BarChart2, ArrowRight, RefreshCw,
  Search, Info
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ── helpers ─────────────────────────────────────────────────────────── */
const TIERS = {
  TIER_1:  { color: '#e17055', bg: 'rgba(250,177,160,0.15)', label: '🏆 Tier 1', range: '80 – 100', desc: 'High deal closure potential. High investor confidence.' },
  TIER_2:  { color: '#6c5ce7', bg: 'rgba(162,155,254,0.15)', label: '⭐️ Tier 2', range: '60 – 79',  desc: 'Strong fundamentals. Balanced investor interest.' },
  TIER_3:  { color: '#0984e3', bg: 'rgba(116,185,255,0.15)', label: '🌱 Tier 3', range: '40 – 59',  desc: 'Conceptual stage. Requires more time to build interest.' },
  REJECTED: { color: '#d63031', bg: 'rgba(214,48,49,0.15)',  label: '✕ Rejected', range: '< 40',   desc: 'Does not meet current investor criteria.' },
};

const PRICING_PLANS = {
  TIER_1: [
    { name: 'Monthly',   price: '₹1,499',  period: '/mo',  save: '' },
    { name: 'Quarterly', price: '₹2,999',  period: '/qtr', save: 'save ~ 1 month fee' },
    { name: 'Yearly',    price: '₹13,499', period: '/yr',  save: 'save ~ 3 month fee' },
  ],
  TIER_2: [
    { name: 'Monthly',   price: '₹2,499',  period: '/mo',  save: '' },
    { name: 'Quarterly', price: '₹4,999',  period: '/qtr', save: 'save ~ 1 month fee' },
    { name: 'Yearly',    price: '₹22,499', period: '/yr',  save: 'save ~ 3 month fee' },
  ],
  TIER_3: [
    { name: 'Monthly',   price: '₹3,499',  period: '/mo',  save: '' },
    { name: 'Quarterly', price: '₹6,999',  period: '/qtr', save: 'save ~ 1 month fee' },
    { name: 'Yearly',    price: '₹31,499', period: '/yr',  save: 'save ~ 3 month fee' },
  ],
};

const STATUS_MAP = {
  PROCESSING: { icon: Clock,        color: '#6c5ce7', label: 'Processing' },
  ANALYZED:   { icon: CheckCircle,  color: '#00b894', label: 'Analyzed'   },
  APPROVED:   { icon: CheckCircle,  color: '#00b894', label: 'Approved'   },
  FAILED:     { icon: AlertCircle,  color: '#d63031', label: 'Failed'     },
  REJECTED:   { icon: XCircle,      color: '#d63031', label: 'Rejected'   },
};

/* ── component ───────────────────────────────────────────────────────── */
const FounderDashboard = () => {
  const navigate = useNavigate();
  const [deals, setDeals]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [section, setSection] = useState('deals'); // 'deals' | 'pricing'
  const [expandedDeal, setExpandedDeal] = useState(null);

  const fetchDeals = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/founder/login'); return; }
    try {
      const res = await fetch(`${API}/api/founder/my-deals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { navigate('/founder/login'); return; }
      if (!res.ok) throw new Error('Failed to fetch deals');
      setDeals(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();

  /* ── stats ── */
  const analyzed  = deals.filter(d => ['ANALYZED', 'APPROVED'].includes(d.status));
  const avgScore  = analyzed.length ? Math.round(analyzed.reduce((s, d) => s + (d.ai_score || 0), 0) / analyzed.length) : null;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Loading dashboard…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '80px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .metric-pill { background: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.5); border-radius: 16px; padding: 1.25rem; }
        .source-tag { font-size: 0.68rem; font-style: italic; color: var(--color-accent-blue); margin-top: 0.4rem; display: block; opacity: 0.8; font-weight: 500; }
        .price-card:hover { transform: translateY(-8px); border-color: var(--color-accent) !important; box-shadow: var(--shadow-lg) !important; }
        .dash-card { background: rgba(255,255,255,0.45); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.6); box-shadow: var(--shadow-premium); overflow: hidden; transition: all 0.3s ease; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ background: 'transparent', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Welcome back,</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              {user?.name || 'Founder'} 🚀
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0, fontWeight: '500' }}>Manage your fundraising pipeline and AI screenings.</p>
          </div>
          <Link to="/submit-deal" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Plus size={18} /> Submit New Deal
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ maxWidth: '1100px', margin: '3rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Total Deals', value: deals.length, icon: FileText, color: '#6c5ce7' },
            { label: 'Analyzed',    value: analyzed.length, icon: BarChart2, color: '#00b894' },
            { label: 'Avg Score',   value: avgScore != null ? `${avgScore}/100` : '—', icon: TrendingUp, color: '#e17055' },
          ].map(s => (
            <div key={s.label} className="dash-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: `${s.color}15`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '6px', border: '1px solid rgba(255,255,255,0.5)', marginBottom: '2.5rem' }}>
          {[{ key: 'deals', label: 'My Deals' }, { key: 'pricing', label: 'Services' }].map(t => (
            <button key={t.key} onClick={() => setSection(t.key)}
              style={{ padding: '0.625rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'all 0.3s ease',
                background: section === t.key ? 'var(--color-accent)' : 'transparent',
                color: section === t.key ? 'white' : 'var(--color-text-muted)',
                boxShadow: section === t.key ? 'var(--shadow-sm)' : 'none'
              }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        {/* ── MY DEALS SECTION ── */}
        {section === 'deals' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Benchmark Alert */}
            <div className="glass" style={{ padding: '1.25rem 1.75rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '20px', border: '1px solid var(--color-accent-blue)' }}>
              <Info size={20} style={{ color: 'var(--color-accent-blue)' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontWeight: '500' }}>
                <strong style={{ color: 'var(--color-accent-blue)', fontWeight: '700' }}>Market Intel:</strong> Your deck is being benchmarked against live sector data. Rankings update every 15 days to reflect current investor appetite.
              </p>
            </div>

            {deals.length === 0 && !error ? (
              <div className="dash-card" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                <FileText size={64} style={{ color: 'var(--color-accent)', opacity: 0.2, marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.75rem', margin: '0 0 0.75rem', color: 'var(--color-primary)', fontWeight: '800' }}>Submit Your Pitch Deck</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>Get your startup screened by our AI and discovered by the network's top-tier investors.</p>
                <Link to="/submit-deal" className="btn btn-primary btn-lg">Submit New Deal</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {deals.map(deal => {
                  const st = STATUS_MAP[deal.status] || STATUS_MAP.PROCESSING;
                  const ti = TIERS[deal.tier] || null;
                  const isAnalyzed = ['ANALYZED', 'APPROVED'].includes(deal.status);
                  const isExpanded = expandedDeal === deal.id;
                  
                  // Parse analysis JSON for insights
                  let insight = {};
                  try { insight = JSON.parse(deal.analysis_json || '{}'); } catch {}

                  return (
                    <div key={deal.id} className="dash-card" style={{ padding: '2rem' }}>

                      {/* Deal Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <div style={{ width: '56px', height: '56px', background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: st.color, boxShadow: 'var(--shadow-premium)' }}>
                            {deal.startup_name?.charAt(0)}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.625rem', letterSpacing: '-0.01em' }}>
                              {deal.startup_name}
                              {isAnalyzed && <CheckCircle size={18} style={{ color: '#00b894' }} />}
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                               <span style={{ fontSize: '0.8rem', padding: '2px 12px', borderRadius: '20px', background: 'rgba(0,0,0,0.03)', color: 'var(--color-text-muted)', fontWeight: '700' }}>{deal.industry}</span>
                               <span style={{ fontSize: '0.8rem', padding: '2px 12px', borderRadius: '20px', background: 'rgba(0,0,0,0.03)', color: 'var(--color-text-muted)', fontWeight: '700' }}>{deal.stage}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800', padding: '6px 14px', borderRadius: '20px', background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}25`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <st.icon size={14} /> {st.label}
                          </span>
                          {ti && (
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '6px 14px', borderRadius: '20px', background: ti.bg, color: ti.color, border: `1px solid ${ti.color}25`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {ti.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Analyzed Content */}
                      {isAnalyzed && (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                            
                            {/* Score & Pillar Breakdown */}
                            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800', marginBottom: '0.75rem' }}>AI Market Score</p>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-accent)', lineHeight: 1, letterSpacing: '-0.03em' }}>{deal.ai_score}</span>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>/100</span>
                                  </div>
                                </div>
                                <button onClick={() => setExpandedDeal(isExpanded ? null : deal.id)} 
                                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '0.625rem 1rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                  {isExpanded ? 'Collapse' : 'Benchmarks'} <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                                </button>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                  { l: 'Team',   v: deal.team_score,   m: 20, c: '#6c5ce7' },
                                  { l: 'Market', v: deal.market_score, m: 20, c: '#0984e3' },
                                  { l: 'Traction', v: deal.traction_score, m: 20, c: '#00b894' },
                                  { l: 'Product', v: deal.product_score, m: 15, c: '#e17055' },
                                  { l: 'Competition', v: deal.competition_score, m: 15, c: '#d63031' },
                                  { l: 'Financials', v: deal.financial_score, m: 10, c: '#fdcb6e' },
                                ].map(p => (
                                  <div key={p.l} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.01)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.l}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.95rem' }}>{p.v}<span style={{fontSize: '0.75rem', opacity: 0.5}}>/ {p.m}</span></span>
                                      <div style={{ width: '40px', height: '5px', background: 'rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                                        <div style={{ width: `${(p.v/p.m)*100}%`, height: '100%', background: p.c, borderRadius: '10px' }} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Verification Data (Extracted facts) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div className="metric-pill">
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800', marginBottom: '1rem' }}>Extracted Traction</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                  <div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>${(insight.mrr_usd || 0).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Monthly Revenue (MRR)</div>
                                    {insight.mrr_source && <span className="source-tag">"{insight.mrr_source}"</span>}
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#00b894', letterSpacing: '-0.02em' }}>{insight.growth_rate_percent || 0}%</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Growth MoM</div>
                                    {insight.growth_source && <span className="source-tag">"{insight.growth_source}"</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="metric-pill" style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800', marginBottom: '1rem' }}>Market Fit Insights</p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.7, margin: 0, fontWeight: '500' }}>
                                  {insight.qualitative?.market_reasoning || "Compiling market analysis..."}
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* Expanded Benchmark View */}
                          {isExpanded && (
                            <div style={{ marginTop: '1.5rem', padding: '2rem', background: 'rgba(108, 92, 231, 0.04)', borderRadius: '20px', border: '1px solid rgba(108, 92, 231, 0.1)', animation: 'fadeIn 0.4s ease' }}>
                              <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BarChart2 size={20} style={{ color: '#6c5ce7' }} /> Sector Benchmarking
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                                {[
                                  { label: 'Revenue vs. Peer Average', fact: `$${insight.mrr_usd || 0}`, desc: 'Your traction indices are measured against seed-stage deal batches within your specific vertical.' },
                                  { label: 'Velocity percentile', fact: `${insight.growth_rate_percent || 0}%`, desc: 'Quarterly expansion signals compared against the top 10% of vetted deals in the network.' },
                                  { label: 'Network Confidence', fact: `${deal.ai_score >= 80 ? 'Exceptional' : 'Strong'}`, desc: 'Algorithmic readiness score for distribution to institutional limited partners.' }
                                ].map(b => (
                                  <div key={b.label} style={{ background: 'white', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.02)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#6c5ce7', fontWeight: '800', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>{b.fact}</div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, fontWeight: '500' }}>{b.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PRICING SECTION ── */}
        {section === 'pricing' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Service Tiers</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                Good Matter uses a performance-indexed pricing model. Your startup's AI Market Score determines your access tier and listing rates.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {Object.keys(PRICING_PLANS).map(tKey => {
                const tInfo = TIERS[tKey];
                const plans = PRICING_PLANS[tKey];
                const isCurrentTier = deals.some(d => d.tier === tKey && d.status === 'ANALYZED');

                return (
                  <div key={tKey} className="price-card dash-card" style={{ 
                    padding: '3rem 2.5rem', 
                    border: `2px solid ${isCurrentTier ? tInfo.color : 'rgba(255,255,255,0.6)'}`,
                    position: 'relative',
                    boxShadow: isCurrentTier ? 'var(--shadow-lg)' : 'var(--shadow-premium)'
                  }}>
                    {isCurrentTier && (
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: tInfo.color, color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Your Current Bracket
                      </div>
                    )}

                    <div style={{ marginBottom: '2.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: tInfo.color }}>{tInfo.label}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>({tInfo.range})</span>
                      </div>
                      <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', margin: 0, minHeight: '3em', lineHeight: 1.6, fontWeight: '500' }}>{tInfo.desc}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {plans.map(p => (
                        <div key={p.name} style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.01)', borderRadius: '20px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '700', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.name} Access</span>
                            {p.save && <span style={{ fontSize: '0.7rem', background: 'rgba(0, 184, 148, 0.1)', color: '#00b894', padding: '4px 10px', borderRadius: '20px', fontWeight: '800', textTransform: 'uppercase' }}>{p.save}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>{p.price}</span>
                            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{p.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="btn btn-primary" style={{ 
                      width: '100%', 
                      marginTop: '2.5rem', 
                      pointerEvents: isCurrentTier ? 'auto' : 'none', 
                      opacity: isCurrentTier ? 1 : 0.3,
                      background: isCurrentTier ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)',
                      color: 'white',
                      boxShadow: 'none'
                    }}>
                      {isCurrentTier ? 'Initialize Access' : `Unlock at ${tInfo.range} Score`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="glass" style={{ marginTop: '5rem', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>Governance & Distribution</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div>
                   <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, fontWeight: '500' }}>
                     <strong style={{ color: 'var(--color-primary)' }}>Success Alignment:</strong> Highly rated startups (Tier 1) benefit from institutional priority and lower monthly costs, reflecting our confidence in their deal velocity.
                   </p>
                </div>
                <div>
                   <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, fontWeight: '500' }}>
                     <strong style={{ color: 'var(--color-primary)' }}>Network Distribution:</strong> All active subscriptions provide unhindered access to our private network. Distribution is signal-driven, not spend-driven.
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FounderDashboard;
