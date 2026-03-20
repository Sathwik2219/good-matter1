import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ArrowRight, ExternalLink, Users, TrendingUp, CheckCircle, Bookmark, BookmarkCheck, SortAsc, ChevronDown } from 'lucide-react';

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
  'Angel / Early Stage':        { bg: 'rgba(250, 177, 160, 0.1)', color: '#e17055', border: 'rgba(250, 177, 160, 0.2)' },
  'Venture Capital / PE':       { bg: 'rgba(116, 185, 255, 0.1)', color: '#0984e3', border: 'rgba(116, 185, 255, 0.2)' },
  'IPO Stage':                  { bg: 'rgba(85, 239, 196, 0.1)', color: '#00b894', border: 'rgba(85, 239, 196, 0.2)' },
  'Debt & Structured Finance':  { bg: 'rgba(255, 234, 167, 0.1)', color: '#fdcb6e', border: 'rgba(255, 234, 167, 0.2)' },
  'Mergers & Acquisitions':     { bg: 'rgba(162, 155, 254, 0.1)', color: '#6c5ce7', border: 'rgba(162, 155, 254, 0.2)' },
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
  const [myInterests, setMyInterests]             = useState([]); 

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

    fetch(`${API}/api/investor/my-interests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setMyInterests(Array.isArray(data) ? data.map(d => d.deal_id) : []))
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    let result = [...deals];
    if (activeCategory !== 'All') result = result.filter(d => d.category === activeCategory);
    if (activeStage !== 'All Stages') result = result.filter(d => d.stage === activeStage);
    if (showBookmarksOnly) result = result.filter(d => bookmarks.includes(d.startup_id));
    if (search.trim()) result = result.filter(d =>
      d.startup_name.toLowerCase().includes(search.toLowerCase()) ||
      d.industry?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'newest') result.sort((a, b) => b.deal_id - a.deal_id);
    if (sortBy === 'oldest') result.sort((a, b) => a.deal_id - b.deal_id);
    if (sortBy === 'raise_desc') result.sort((a, b) => parseRaiseNum(b.raise_amount) - parseRaiseNum(a.raise_amount));
    if (sortBy === 'name_asc') result.sort((a, b) => a.startup_name.localeCompare(b.startup_name));
    setFiltered(result);
  }, [deals, activeCategory, activeStage, search, sortBy, showBookmarksOnly, bookmarks]);

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    const newB = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(newB);
    localStorage.setItem('gm_bookmarks', JSON.stringify(newB));
  };

  const handleIntroRequest = async (deal) => {
    setIntroLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/investor/express-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deal_id: deal.deal_id || deal.startup_id })
      });
      if (res.ok) {
        setIntroSuccess('Success! Introduction request sent.');
        setMyInterests([...myInterests, deal.deal_id || deal.startup_id]);
      } else {
        setError('Introduction request failed.');
      }
    } catch { setError('Connection error.'); }
    setIntroLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--color-text-main)' }}>Loading curated dealroom...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (selectedDeal) {
    const clr = categoryColors[selectedDeal.category] || { bg: 'rgba(250, 177, 160, 0.1)', color: '#e17055', border: 'rgba(250, 177, 160, 0.2)' };
    const isBookmarked = bookmarks.includes(selectedDeal.startup_id);
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 5rem' }}>
          <button onClick={() => { setSelectedDeal(null); setIntroSuccess(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2.5rem', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
            <ArrowLeft size={18} /> Back to selection
          </button>

          <div className="glass" style={{ borderRadius: '32px', padding: '3.5rem', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-premium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', fontWeight: '800', color: clr.color, boxShadow: 'var(--shadow-premium)' }}>
                  {selectedDeal.startup_name.charAt(0)}
                </div>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.75rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{selectedDeal.startup_name}</h1>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', padding: '6px 16px', borderRadius: '25px', background: clr.bg, color: clr.color, textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${clr.border}` }}>{selectedDeal.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Facility</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{selectedDeal.raise_amount}</div>
                </div>
                <button onClick={(e) => toggleBookmark(selectedDeal.startup_id, e)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 1.25rem', borderRadius: '15px' }}>
                  {isBookmarked ? <BookmarkCheck size={16} style={{color: '#f39c12'}} /> : <Bookmark size={16} />}
                  {isBookmarked ? 'Pinned to Pipeline' : 'Pin Deal'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <span style={{ padding: '0.625rem 1.25rem', background: 'rgba(0,0,0,0.03)', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-primary)' }}>{selectedDeal.industry}</span>
              <span style={{ padding: '0.625rem 1.25rem', background: 'rgba(0,0,0,0.03)', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-primary)' }}>{selectedDeal.stage}</span>
              <span style={{ padding: '0.625rem 1.25rem', background: 'rgba(0, 184, 148, 0.08)', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '800', color: '#00b894', border: '1px solid rgba(0, 184, 148, 0.15)' }}>● {selectedDeal.deal_status}</span>
            </div>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', lineHeight: '1.9', margin: 0, fontWeight: '500' }}>{selectedDeal.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div className="glass" style={{ borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '800' }}>
                <Users size={20} style={{ color: 'var(--color-accent)' }} /> Founding Team
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, fontWeight: '500' }}>{selectedDeal.founders || 'Team dossier shared upon introduction request.'}</p>
            </div>
            <div className="glass" style={{ borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '800' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} /> Market Context
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, fontWeight: '500' }}>{selectedDeal.traction || 'Proprietary market signals shared after NDAs are finalized.'}</p>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: '24px', padding: '3rem', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem', boxShadow: 'var(--shadow-premium)' }}>
            <div>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '800' }}>Identity & Materials</h3>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline" style={{ fontSize: '0.9rem', borderRadius: '12px' }}>Pitch Deck (Vetted)</button>
                <button className="btn btn-outline" style={{ fontSize: '0.9rem', borderRadius: '12px' }}>Financial Nexus</button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {introSuccess ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00b894', fontWeight: '800', fontSize: '1.25rem' }}>
                  <CheckCircle size={28} /> Allocation Requested
                </div>
              ) : myInterests.includes(selectedDeal.deal_id || selectedDeal.startup_id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00b894', fontWeight: '800', fontSize: '1.1rem', background: 'rgba(0, 184, 148, 0.08)', padding: '1rem 2rem', borderRadius: '16px', border: '1px solid rgba(0, 184, 148, 0.2)' }}>
                  <CheckCircle size={22} /> Interest Confirmed
                </div>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => handleIntroRequest(selectedDeal)} disabled={introLoading} style={{ padding: '1.25rem 3.5rem', borderRadius: '18px' }}>
                  {introLoading ? 'Sequencing...' : 'Request Introduction'}
                  {!introLoading && <ArrowRight size={22} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '80px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .filter-select { padding: 0.625rem 1.25rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); background: white; color: var(--color-primary); font-family: inherit; font-size: 0.9rem; cursor: pointer; outline: none; transition: all 0.3s ease; appearance: none; padding-right: 2.75rem; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232D3446' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; box-shadow: var(--shadow-sm); font-weight: 600; }
        .filter-select:hover { border-color: var(--color-accent); transform: translateY(-1px); }
        .cat-btn { padding: 0.625rem 1.25rem; border-radius: 25px; border: none; cursor: pointer; fontWeight: '700'; fontSize: '0.9rem'; transition: all 0.3s ease; white-space: nowrap; font-weight: 700; }
        .deal-card { background: rgba(255,255,255,0.4); backdrop-filter: blur(20px); border-radius: 28px; padding: 2.25rem; border: 1px solid rgba(255,255,255,0.6); box-shadow: var(--shadow-premium); display: flex; flexDirection: column; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .deal-card:hover { transform: translateY(-8px); border-color: var(--color-accent); box-shadow: var(--shadow-lg); }
      `}</style>

      {/* Hero Search Section */}
      <div style={{ background: 'transparent', padding: '4rem 2rem 3rem', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
              <Link to="/investor/dashboard" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', fontWeight: '700', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                <ArrowLeft size={18} /> Dashboard
              </Link>
              <h1 style={{ color: 'var(--color-primary)', fontSize: '3.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>Curated Pipeline</h1>
              <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 0', fontSize: '1.15rem', fontWeight: '500', maxWidth: '600px', lineHeight: 1.5 }}>
                {filtered.length} verified investment opportunities curated for institutional conviction.
              </p>
            </div>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', opacity: 0.6 }} />
              <input type="text" placeholder="Startup, sector or industry..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '1.125rem 1.125rem 1.125rem 3.5rem', background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '18px', color: 'var(--color-primary)', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '1rem', boxShadow: 'var(--shadow-premium)', fontWeight: '500' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(10px)', padding: '0.875rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', flex: 1 }}>
              {CATEGORIES.map(cat => {
                const clr = cat === 'All' ? null : categoryColors[cat];
                const isActive = activeCategory === cat;
                return (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className="cat-btn" style={{ background: isActive ? (clr ? clr.color : 'var(--color-primary)') : 'transparent', color: isActive ? 'white' : 'var(--color-text-muted)', border: isActive ? 'none' : '1px solid transparent' }}>
                    {cat}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingLeft: '1.25rem', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
              <select value={activeStage} onChange={e => setActiveStage(e.target.value)} className="filter-select">
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setShowBookmarksOnly(b => !b)} style={{ padding: '0.625rem 1.25rem', borderRadius: '14px', background: showBookmarksOnly ? 'var(--color-accent)' : 'white', border: '1px solid rgba(0,0,0,0.02)', color: showBookmarksOnly ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.625rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
                <BookmarkCheck size={18} /> {showBookmarksOnly ? 'Viewing Saves' : 'Saved Only'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        {filtered.length === 0 ? (
          <div className="glass" style={{ textAlign: 'center', padding: '8rem 2rem', borderRadius: '32px', border: '2px dashed rgba(0,0,0,0.05)' }}>
            <Filter size={64} style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', opacity: 0.2 }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>No Matching Dealflow</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: '500' }}>Broaden your filters or adjust your search to discover more opportunities.</p>
            <button className="btn btn-outline" style={{padding: '0.875rem 2rem'}} onClick={() => { setActiveCategory('All'); setActiveStage('All Stages'); setSearch(''); setShowBookmarksOnly(false); }}>Reset Workspace</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
            {filtered.map(deal => {
              const clr = categoryColors[deal.category] || { color: '#e17055', bg: 'rgba(250, 177, 160, 0.1)' };
              const isBookmarked = bookmarks.includes(deal.startup_id);
              return (
                <div key={deal.deal_id} className="deal-card" onClick={() => setSelectedDeal(deal)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'white', border: '1px solid rgba(0,0,0,0.02)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: clr.color, boxShadow: 'var(--shadow-sm)' }}>
                      {deal.startup_name.charAt(0)}
                    </div>
                    <button onClick={(e) => toggleBookmark(deal.startup_id, e)} style={{ border: 'none', background: 'none', padding: '8px', cursor: 'pointer', color: isBookmarked ? '#f39c12' : 'var(--color-text-muted)', opacity: isBookmarked ? 1 : 0.3, transition: 'all 0.2s' }}>
                      {isBookmarked ? <BookmarkCheck size={26} fill="#f39c12" /> : <Bookmark size={26} />}
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.75rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{deal.startup_name}</h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', background: clr.bg, color: clr.color, display: 'inline-block', marginBottom: '1.5rem', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${clr.border || 'transparent'}` }}>{deal.category}</div>
                  <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.75', marginBottom: '2rem', flex: 1, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: '500' }}>{deal.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.75rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '0.1em' }}>Target Ask</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>{deal.raise_amount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '0.1em', textAlign: 'right' }}>Venture Stage</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)', textAlign: 'right' }}>{deal.stage}</div>
                    </div>
                  </div>
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
