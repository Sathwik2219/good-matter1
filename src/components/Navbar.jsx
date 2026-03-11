import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        // Check for logged in user info
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const publicLinks = [
        { name: 'Home', path: '/' },
        { name: 'Private Access for Investors', path: '/investors' },
        { name: 'Impact Studio for Founders', path: '/impact-studio' },
        { name: 'About', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
    ];

    const investorLinks = [
        { name: 'Dashboard', path: '/investor/dashboard' },
        { name: 'Browse Deals', path: '/investor/deals' },
        { name: 'Impact Studio', path: '/impact-studio' },
        { name: 'About', path: '/about' },
    ];

    const isInvestor = user && user.role === 'INVESTOR';
    const navLinks = isInvestor ? investorLinks : publicLinks;

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.jpg" alt="GoodMatter Logo" className="logo-image" />
                    GoodMatter
                </Link>

                <nav className="navbar-desktop">
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="navbar-actions">
                        {isInvestor ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                    <User size={18} />
                                    <span>{user.name.split(' ')[0]}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm" style={{ marginRight: '0.75rem' }}>Investor Login</Link>
                                <Link to="/apply" className="btn btn-primary btn-sm">Apply as Founder</Link>
                            </>
                        )}
                    </div>
                </nav>

                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <ul className="mobile-nav-links">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link to={link.path} className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    
                    {isInvestor ? (
                        <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-secondary-dark)' }}>
                             <button onClick={handleLogout} className="mobile-nav-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--color-accent)' }}>Logout</button>
                        </li>
                    ) : (
                        <>
                            <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-secondary-dark)' }}>
                                <Link to="/login" className="mobile-nav-link">Investor Login</Link>
                            </li>
                            <li>
                                <Link to="/apply" className="mobile-nav-link highlight">Apply as Founder</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
