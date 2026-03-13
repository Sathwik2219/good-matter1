import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, ChevronRight } from 'lucide-react';
import './Navbar.css';

// ─── Nav link definitions ───────────────────────────────────────────────────
const PUBLIC_LINKS = [
  { name: 'Home',         path: '/' },
  { name: 'Investors',    path: '/investors' },
  { name: 'Founders',     path: '/impact-studio' },
  { name: 'Submit Deal',  path: '/submit-deal' },
  { name: 'About',        path: '/about' },
  { name: 'Contact',      path: '/contact' },
  { name: 'Admin',        path: '/admin/login' },
];

const INVESTOR_LINKS = [
  { name: 'Dashboard',    path: '/investor/dashboard' },
  { name: 'Deals',        path: '/investor/deals' },
  { name: 'My Profile',   path: '/investor/profile' },
  { name: 'About',        path: '/about' },
];

const ADMIN_LINKS = [
  { name: 'Admin Panel',  path: '/admin' },
  { name: 'Deal Reviews', path: '/admin' },
  { name: 'Create Admin', path: '/admin/register' },
];

// ─── Component ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [user, setUser]                 = useState(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const menuRef   = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu + re-read user on route change
  useEffect(() => {
    setMobileOpen(false);
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch { setUser(null); }
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleAdminLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/admin/login');
  };

  const isInvestor = user?.role === 'INVESTOR';
  const isAdmin    = user?.role === 'ADMIN';
  const navLinks   = isAdmin ? ADMIN_LINKS : isInvestor ? INVESTOR_LINKS : PUBLIC_LINKS;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header ref={menuRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.jpg" alt="GoodMatter" className="logo-image" />
          GoodMatter
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-desktop">

          {/* Center: nav links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.path + link.name}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: actions */}
          <div className="navbar-actions">
            {isAdmin ? (
              <>
                <span className="admin-badge">
                  <Shield size={13} /> ADMIN
                </span>
                <button onClick={handleAdminLogout} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : isInvestor ? (
              <>
                <span className="user-badge">
                  <User size={14} /> {user?.name?.split(' ')[0] || 'Member'}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Investor Login
                </Link>
                <Link to="/apply" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Apply as Founder <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile: hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <ul className="mobile-nav-links">
            {navLinks.map(link => (
              <li key={link.path + link.name}>
                <Link
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-actions">
            {isAdmin ? (
              <button onClick={handleAdminLogout} className="mobile-nav-link" style={{ color: '#6366f1', fontWeight: '700' }}>
                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Logout Admin
              </button>
            ) : isInvestor ? (
              <button onClick={handleLogout} className="mobile-nav-link" style={{ color: 'var(--color-accent)' }}>
                <LogOut size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link">
                  Investor Login
                </Link>
                <Link to="/apply" className="mobile-nav-link highlight" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Apply as Founder <ChevronRight size={14} />
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
