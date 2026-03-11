import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer section-dark">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.jpg" alt="GoodMatter Logo" className="footer-logo-img" />
                            GoodMatter
                        </Link>
                        <p className="footer-desc">
                            Selective. Private. Curated. Connecting exceptional founders with aligned investors for highly curated private market opportunities.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
                            <a href="mailto:goodmatter05@gmail.com" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>goodmatter05@gmail.com</a>
                        </p>
                        <div className="footer-socials">
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="mailto:goodmatter05@gmail.com" className="social-link" aria-label="Email"><Mail size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/investors">Investors</Link></li>
                            <li><Link to="/impact-studio">Impact Studio</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-heading">Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/login">Investor Login</Link></li>
                            <li><Link to="/apply">Apply as Founder</Link></li>
                            <li><Link to="/impact-studio">Impact Studio for Founders</Link></li>
                        </ul>
                    </div>

                    <div className="footer-cta">
                        <h4 className="footer-heading">Join the Network</h4>
                        <p>Ready to see high-signal dealflow?</p>
                        <Link to="/login" className="btn btn-outline-light btn-sm footer-btn">
                            Apply as Investor <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p style={{ marginBottom: '0.25rem' }}>&copy; {new Date().getFullYear()} GoodMatter. All rights reserved.</p>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
                        Content is informational only and does not constitute investment advice. Access is limited to accredited or qualified investors.
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>We Fuel The Journey.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
