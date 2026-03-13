import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ArrowRight, ExternalLink, Users, TrendingUp, CheckCircle, Bookmark, BookmarkCheck, SortAsc } from 'lucide-react';
import '../pages/Home.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CATEGORIES = [
  'All',
  'Angel / Early Stage',
  'Venture Capital / PE',
  'IPO Stage',
  'Debt & Structured Finance',
  'Mergers & Acquisitions',
];

const STAGES = ['All Stages', 'Pre-seed', 'Seed', 'Early Stage', 'Pre-Series A', 'Series A', 'Pre-IPO', 'Growth', 'Acquisition Target'];

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest First' },
  { value: 'oldest',      label: 'Oldest First' },
  { value: 'raise_desc',  label: 'Highest Raise' },
  { value: 'name_asc',    label: 'Name A–Z' },
];

const categoryColors = {
  'Angel / Early Stage':        { color: '#6366f1', bg: '#eef2ff' },
  'Venture Capital / PE':       { color: '#3b82f6', bg: '#eff6ff' },
  'IPO Stage':                  { color: '#10b981', bg: '#ecfdf5' },
  'Debt & Structured Finance':  { color: '#f59e0b', bg: '#fffbeb' },
  'Mergers & Acquisitions':     { color: '#ef4444', bg: '#fef2f2' },
};

const parseRaiseNum = (amount) => {
  if (!amount) return 0;
  const match = amount.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const InvestorDeals = () => {
  const navigate = useNavigate();
  const [deals, setDeals]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStage, setActiveStage]   = useState('All Stages');
  const [search, setSearch]             = useState('');
  const [sortBy, setSortBy]             = useState('newest');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [introSuccess, setIntroSuccess] = useState('');
  const [introLoading, setIntroLoading] = useState(false);
  const [bookmarks, setBookmarks]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('gm_bookmarks') || '[]'); } catch { return []; }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    fetch(`${API}/api/investor/deals`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        if (r.status === 401 || r.status === 403) throw new Error('auth');
        if (!r.ok) throw new Error('fetch');
        return r.json();
      })
      .then(data => { setDeals(data); setLoading(false); })
      .catch(err => {
        if (err.message === 'auth') navigate('/login');
        else setError('Could not load deals. Please try again.');
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    let result = [...deals];
    if (activeCategory !== 'All') result = result.filter(d => d.category === activeCategory);
    if (activeStage !== 'All Stages') result = result.filter(d => d.stage === activeStage);
    if (showBookmarksOnly) result = result.filter(d => bookmarks.includes(d.startup_id));
    if (search.trim()) result = result.filter(d =>
      d.startup_name.toLowerCase().includes(search.toLowerCase()) ||
      d.industry.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    );
    // Sorting
    if (sortBy === 'newest') result.sort((a, b) => b.deal_id - a.deal_id);
    if (sortBy === 'oldest') result.sort((a, b) => a.deal_id - b.deal_id);
    if (sortBy === 'raise_desc') result.sort((a, b) => parseRaiseNum(b.raise_amount) - parseRaiseNum(a.raise_amount));
    if (sortBy === 'name_asc') result.sort((a, b) => a.startup_name.localeCompare(b.startup_name));
    setFiltered(result);
  }, [activeCategory, activeStage, search, sortBy, deals, bookmarks, showBookmarksOnly]);

  const toggleBookmark = (startupId, e) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = prev.includes(startupId) ? prev.filter(id => id !== startupId) : [...prev, startupId];
      localStorage.setItem('gm_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleIntroRequest = async (startupId) => {
    setIntroLoading(true);
    setIntroSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/investor/request-intro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ startup_id: startupId }),
      });
      const data = await res.json();
      setIntroSuccess(data.message);
    } catch {
      setIntroSuccess('Failed to send request. Please try again.');
    }
    setIntroLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading curated dealflow...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Deal Detail View ──────────────────────────────────────────────────────────
  if (selectedDeal) {
    const clr = categoryColors[selectedDeal.category] || { color: '#6366f1', bg: '#eef2ff' };
    const isBookmarked = bookmarks.includes(selectedDeal.startup_id);
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '90px' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
          <button onClick={() => { setSelectedDeal(null); setIntroSuccess(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Deals
          </button>

          {/* Deal Header */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', marginBottom: '1.5rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '64px', height: '64px', background: clr.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: clr.color }}>
                  {selectedDeal.startup_name.charAt(0)}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.25rem', color: 'var(--color-primary)' }}>{selectedDeal.startup_name}</h1>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '3px 12px', borderRadius: '20px', background: clr.bg, color: clr.color }}>{selectedDeal.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Target Raise</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>{selectedDeal.raise_amount}</div>
                </div>
                <button onClick={(e) => toggleBookmark(selectedDeal.startup_id, e)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', borderRadius: '20px', border: '1px solid', background: isBookmarked ? '#fffbeb' : 'white', borderColor: isBookmarked ? '#f59e0b' : '#e2e8f0', color: isBookmarked ? '#f59e0b' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                  {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ padding: '6px 14px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>{selectedDeal.industry}</span>
              <span style={{ padding: '6px 14px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>{selectedDeal.stage}</span>
              <span style={{ padding: '6px 14px', background: '#f0fdf4', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: '#16a34a' }}>● {selectedDeal.deal_status}</span>
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.8', margin: 0 }}>{selectedDeal.description}</p>
          </div>

          {/* Detail Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
                <Users size={16} style={{ color: 'var(--color-accent)' }} /> Founders
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>{selectedDeal.founders || 'Information available upon introduction request.'}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
                <TrendingUp size={16} style={{ color: 'var(--color-accent)' }} /> Traction
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>{selectedDeal.traction || 'Traction details shared after NDA.'}</p>
            </div>
            {/* Product Section */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📦 Product</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                {selectedDeal.product_description || 'Detailed product breakdown available after introduction.'}
              </p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📋 Fundraising Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Raise Target', value: selectedDeal.raise_amount },
                  { label: 'Stage', value: selectedDeal.stage },
                  { label: 'Status', value: selectedDeal.deal_status },
                  { label: 'Closing', value: selectedDeal.closing_date || 'Rolling' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attachments & CTA */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>📎 Attachments</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-sm" style={{ fontSize: '0.85rem' }}>Pitch Deck (available on request)</button>
                <button className="btn btn-outline btn-sm" style={{ fontSize: '0.85rem' }}>Financial Summary (available on request)</button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {introSuccess ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '600' }}>
                  <CheckCircle size={18} /> {introSuccess}
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleIntroRequest(selectedDeal.startup_id)}
                  disabled={introLoading}
                >
                  {introLoading ? 'Sending...' : 'Request Introduction to Founder'}
                  {!introLoading && <ArrowRight size={16} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Deals List View ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '80px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Page Header */}
      <div style={{ background: 'var(--color-primary)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <Link to="/investor/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <ArrowLeft size={14} /> Dashboard
              </Link>
              <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', margin: 0 }}>Curated Dealflow</h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                {filtered.length} active deal{filtered.length !== 1 ? 's' : ''} across private markets
              </p>
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
              <input
                type="text"
                placeholder="Search deals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '36px', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', outline: 'none', width: '240px', fontFamily: 'inherit', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Filter Row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {CATEGORIES.map(cat => {
              const clr = cat === 'All' ? null : categoryColors[cat];
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', transition: 'all 0.2s', background: isActive ? (clr ? clr.color : 'white') : 'rgba(255,255,255,0.12)', color: isActive ? (clr ? 'white' : 'var(--color-primary)') : 'rgba(255,255,255,0.7)' }}>
                  {cat}
                </button>
              );
            })}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Stage Filter */}
              <select value={activeStage} onChange={e => setActiveStage(e.target.value)} style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', fontFamily: 'inherit', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
                {STAGES.map(s => <option key={s} value={s} style={{ color: '#111', background: 'white' }}>{s}</option>)}
              </select>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', fontFamily: 'inherit', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ color: '#111', background: 'white' }}>{o.label}</option>)}
              </select>
              {/* Bookmarks Toggle */}
              <button onClick={() => setShowBookmarksOnly(b => !b)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)', background: showBookmarksOnly ? '#f59e0b' : 'rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bookmark size={13} /> {showBookmarksOnly ? 'All Deals' : 'Saved'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>{error}</p>}

        {filtered.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
            <Filter size={40} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>No deals match your filters.</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setActiveCategory('All'); setActiveStage('All Stages'); setSearch(''); setShowBookmarksOnly(false); }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(deal => {
              const clr = categoryColors[deal.category] || { color: '#6366f1', bg: '#eef2ff' };
              const isBookmarked = bookmarks.includes(deal.startup_id);
              return (
                <div key={deal.deal_id}
                  style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(11,15,26,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onClick={() => setSelectedDeal(deal)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
                >
                  {/* Card Top */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', background: clr.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: clr.color, flexShrink: 0 }}>
                        {deal.startup_name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-primary)' }}>{deal.startup_name}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{deal.industry}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button onClick={(e) => toggleBookmark(deal.startup_id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isBookmarked ? '#f59e0b' : '#cbd5e1' }}>
                        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: clr.bg, color: clr.color, whiteSpace: 'nowrap' }}>
                        {deal.category}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: '1.7', flex: 1, marginBottom: '1.25rem' }}>
                    {deal.description}
                  </p>

                  {/* Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Stage</div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{deal.stage}</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Target Raise</div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{deal.raise_amount}</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedDeal(deal); }}
                  >
                    View Deal Details <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDeals;
