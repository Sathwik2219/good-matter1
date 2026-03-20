import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, ChevronRight, Send } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]             = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch { setUser(null); }
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  const logout = (redirectTo) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate(redirectTo);
  };

  // Smart Submit Deal: store intended route, redirect to login if not FOUNDER
  const handleSubmitDeal = (e) => {
    e.preventDefault();
    const u = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
    if (u?.role === 'FOUNDER') {
      navigate('/submit-deal');
    } else {
      localStorage.setItem('gm_redirect_after_login', '/submit-deal');
      navigate('/founder/login');
    }
  };

  const isInvestor = user?.role === 'INVESTOR';
  const isAdmin    = user?.role === 'ADMIN';
  const isFounder  = user?.role === 'FOUNDER';

  // ── Nav links per role ──────────────────────────────────────────────────────
  const navLinks = isAdmin
    ? [{ name: 'Admin Panel', path: '/admin' }]
    : isInvestor
    ? [
        { name: 'Dashboard', path: '/investor/dashboard' },
        { name: 'Deals',     path: '/investor/deals' },
        { name: 'Profile',   path: '/investor/profile' },
      ]
    : isFounder
    ? [
        { name: 'Dashboard', path: '/founder/dashboard' },
        { name: 'Studio',    path: '/studio' },
      ]
    : [
        { name: 'Home',    path: '/' },
        { name: 'Studio',  path: '/studio' },
        { name: 'About',   path: '/about' },
        { name: 'Contact', path: '/contact' },
      ];

  const activeClass = (path) => location.pathname === path ? 'active' : '';

  return (
    <header ref={menuRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <img src="/logo.jpg" alt="GoodMatter" className="logo-image" />
          GoodMatter
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="navbar-desktop">
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.path + link.name}>
                <Link to={link.path} className={`nav-link ${activeClass(link.path)}`}>{link.name}</Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {isAdmin ? (
              <>
                <span className="admin-badge"><Shield size={13} /> ADMIN</span>
                <button onClick={() => logout('/admin/login')} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : isInvestor ? (
              <>
                <span className="user-badge"><User size={14} /> {user?.name?.split(' ')[0] || 'Investor'}</span>
                <button onClick={() => logout('/login')} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : isFounder ? (
              <>
                <span className="user-badge"><User size={14} /> {user?.name?.split(' ')[0] || 'Founder'}</span>
                <button onClick={handleSubmitDeal} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Send size={13} /> Submit Deal
                </button>
                <button onClick={() => logout('/founder/login')} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              /* Guest */
              <>
                <button onClick={handleSubmitDeal} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Send size={13} /> Submit Deal
                </button>
                <Link to="/login" className="btn btn-outline btn-sm">Investor Login</Link>
                <Link to="/founder/login" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Founder Login <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ── Mobile hamburger ── */}
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <ul className="mobile-nav-links">
            {navLinks.map(link => (
              <li key={link.path + link.name}>
                <Link to={link.path} className={`mobile-nav-link ${activeClass(link.path)}`}>{link.name}</Link>
              </li>
            ))}
            {/* Submit Deal always in mobile for founder/guest */}
            {(isFounder || (!isInvestor && !isAdmin)) && (
              <li>
                <button onClick={handleSubmitDeal} className="mobile-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontWeight: '700' }}>
                  <Send size={14} /> Submit Deal
                </button>
              </li>
            )}
          </ul>
          <div className="mobile-menu-divider" />
          <div className="mobile-menu-actions">
            {isAdmin ? (
              <button onClick={() => logout('/admin/login')} className="mobile-nav-link" style={{ color: '#6366f1', fontWeight: '700' }}>
                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Logout Admin
              </button>
            ) : isInvestor ? (
              <button onClick={() => logout('/login')} className="mobile-nav-link" style={{ color: 'var(--color-accent)' }}>
                <LogOut size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Logout
              </button>
            ) : isFounder ? (
              <button onClick={() => logout('/founder/login')} className="mobile-nav-link" style={{ color: 'var(--color-accent)' }}>
                <LogOut size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link">Investor Login</Link>
                <Link to="/founder/login" className="mobile-nav-link highlight" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Founder Login <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
