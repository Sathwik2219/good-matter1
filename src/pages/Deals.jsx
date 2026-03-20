import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../pages/Home.css'; // Reusing deals-grid styles

const Deals = () => {
    useScrollAnimation();
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('Unauthorized: Please log in to view active deals.');
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5001/api/investor/deals', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    setError('Access Denied. Only approved investors can view current active deals.');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch deals');
                }

                const data = await response.json();
                setDeals(data);
                setLoading(false);

            } catch (err) {
                console.error(err);
                setError('Could not connect to the secure dealflow server.');
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleIntroRequest = async (startupId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/investor/request-intro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ startup_id: startupId })
            });

            if (response.ok) {
                alert('Introduction requested successfully! Our team will be in touch.');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            alert('Failed to send request.');
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper pt-20" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: 'var(--color-bg-main)' }}>
                <p style={{ color: 'var(--color-text-main)' }}>Loading secure dealflow...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper pt-20 text-center" style={{ background: 'var(--color-bg-main)' }}>
                <section className="section" style={{ paddingBottom: '3rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="container animate-slide-up">
                        <div className="hero-badge" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Access Restricted</div>
                        <h1 className="hero-title" style={{ color: 'var(--color-text-main)' }}>Secure Deal Room</h1>
                        <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
                            {error}
                        </p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary">
                            Log In to Continue
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper pt-20" style={{ background: 'var(--color-bg-main)' }}>
            <section className="section text-center" style={{ paddingBottom: '3rem' }}>
                <div className="container animate-slide-up">
                    <div className="hero-badge" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>Live Pipeline</div>
                    <h1 className="hero-title" style={{ color: 'var(--color-text-main)' }}>Active Deals</h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
                        You are viewing the private, curated dealflow matching your current investment thesis.
                    </p>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--color-bg-deep)' }}>
                <div className="container">
                    {deals.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl" style={{ color: 'var(--color-text-muted)' }}>There are currently no active deals on the platform.</p>
                        </div>
                    ) : (
                        <div className="deals-grid">
                            {deals.map((deal, index) => (
                                <div key={deal.deal_id} className={`deal-card scroll-animate delay-${(index % 4 + 1) * 100}`}>
                                    <div className="deal-header">
                                        <div className="deal-logo">{deal.startup_name.charAt(0)}</div>
                                        <div className="deal-tags">
                                            <span className="tag">{deal.industry}</span>
                                            <span className="tag stage-tag">{deal.stage}</span>
                                        </div>
                                    </div>
                                    <h3 className="deal-name">{deal.startup_name}</h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-highlight)', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase' }}>{deal.deal_status}</div>
                                    <p className="deal-desc">{deal.description}</p>
                                    <div className="deal-footer">
                                        <div className="deal-metric">
                                            <span className="metric-label">Stage</span>
                                            <span className="metric-value">{deal.stage}</span>
                                        </div>
                                        <div className="deal-metric" style={{ textAlign: 'right' }}>
                                            <span className="metric-label">Raising</span>
                                            <span className="metric-value">${deal.raise_amount}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-outline w-100" style={{ flex: 1 }}>Data Room</button>
                                        <button 
                                            className="btn btn-primary w-100" 
                                            style={{ flex: 1 }}
                                            onClick={() => handleIntroRequest(deal.startup_id)}
                                        >
                                            Request Intro
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Deals;
