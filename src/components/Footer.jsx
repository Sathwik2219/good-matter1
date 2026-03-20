import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
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
                        <p className="footer-email">
                            <a href="mailto:goodmatter05@gmail.com">goodmatter05@gmail.com</a>
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
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/studio">Impact Studio</Link></li>
                            <li><Link to="/investor/deals">Curated Deals</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-heading">Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/login">Investor Login</Link></li>
                            <li><Link to="/founder/login">Founder Login</Link></li>
                            <li><Link to="/submit-deal">Submit Startup</Link></li>
                        </ul>
                    </div>

                    <div className="footer-cta">
                        <h4 className="footer-heading">Join the Network</h4>
                        <p>Ready to see high-signal dealflow?</p>
                        <Link to="/login" className="btn btn-outline btn-sm footer-btn">
                            Investor Login <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} GoodMatter. All rights reserved.</p>
                    <p className="footer-disclaimer">
                        Content is informational only and does not constitute investment advice. Access is limited to accredited or qualified investors.
                    </p>
                    <p className="footer-motto">We Fuel The Journey.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
