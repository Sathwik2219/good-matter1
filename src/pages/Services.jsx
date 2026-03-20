import React, { useState } from 'react';
import { Check, Star, ArrowRight, Zap, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const tiers = [
    {
      id: 1,
      score: '80–100',
      tier: 'Tier 1 - Alpha Potential',
      description: 'Optimized for high-velocity startups with confirmed institutional signals.',
      monthly: 1499,
      quarterly: 2999,
      yearly: 13499,
      savings: { quarterly: 'Save ~1 month', yearly: 'Save ~3 months' },
      color: '#fab1a0', // Peach
      bg: 'rgba(250, 177, 160, 0.1)',
      border: 'rgba(250, 177, 160, 0.2)',
      features: ['Priority deal placement', 'Advanced AI Intelligence', 'Direct Investor Linkage', 'Success-fee weighting'],
      badge: 'Highest Conviction',
      icon: <Zap size={24} />
    },
    {
      id: 2,
      score: '60–80',
      tier: 'Tier 2 - Growth Catalyst',
      description: 'Balanced distribution and consistent engagement for maturing ventures.',
      monthly: 2499,
      quarterly: 4999,
      yearly: 22499,
      savings: { quarterly: 'Save ~1 month', yearly: 'Save ~3 months' },
      color: '#74b9ff', // Blue
      bg: 'rgba(116, 185, 255, 0.1)',
      border: 'rgba(116, 185, 255, 0.2)',
      features: ['Standard deal listing', 'Core AI Analysis', 'Real-time interest alerts', 'Community access'],
      badge: 'Founder Favorite',
      icon: <Target size={24} />
    },
    {
      id: 3,
      score: '40–60',
      tier: 'Tier 3 - Discovery',
      description: 'Foundational visibility for early-stage ventures refining their narrative.',
      monthly: 3499,
      quarterly: 6999,
      yearly: 31499,
      savings: { quarterly: 'Save ~1 month', yearly: 'Save ~3 months' },
      color: '#a29bfe', // Purple
      bg: 'rgba(162, 155, 254, 0.1)',
      border: 'rgba(162, 155, 254, 0.2)',
      features: ['Basic deal distribution', 'Standard AI Scoring', 'Market visibility', 'Strategic feedback'],
      badge: 'Early Traction',
      icon: <TrendingUp size={24} />
    }
  ];

  const getPrice = (tier) => {
    if (billingCycle === 'monthly') return tier.monthly;
    if (billingCycle === 'quarterly') return tier.quarterly;
    return tier.yearly;
  };

  const getSubLabel = () => {
    if (billingCycle === 'monthly') return '/mo';
    if (billingCycle === 'quarterly') return '/quarter';
    return '/year';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '100px', paddingBottom: '6rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '5rem', padding: '0 1.5rem' }}>
        <div className="hero-badge mx-auto" style={{ marginBottom: '1.5rem' }}> Programmatic Access </div>
        <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
          Intelligent, <span className="text-highlight">Score-Based</span> Subscriptions
        </h1>
        <p className="hero-subtitle mx-auto" style={{ maxWidth: '800px', marginBottom: '3.5rem' }}>
          GoodMatter utilizes a proprietary benchmark-driven scoring engine. Higher scores unlock more favorable listing success fees and increased institutional visibility.
        </p>

        {/* Billing Toggle (Modern Glass) */}
        <div style={{ 
          display: 'inline-flex', 
          background: 'rgba(255, 255, 255, 0.4)', 
          backdropFilter: 'blur(10px)',
          padding: '6px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: 'var(--shadow-premium)',
          marginBottom: '2rem'
        }}>
          {['monthly', 'quarterly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              style={{
                padding: '12px 28px',
                borderRadius: '16px',
                border: 'none',
                background: billingCycle === cycle ? 'var(--color-primary)' : 'transparent',
                color: billingCycle === cycle ? '#fff' : 'var(--color-text-muted)',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Tier Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '8rem' }}>
          {tiers.map(tier => (
            <div 
              key={tier.id} 
              className="glass"
              style={{ 
                borderRadius: '36px', 
                padding: '3.5rem 2.5rem', 
                border: '1px solid rgba(255,255,255,0.6)',
                position: 'relative', 
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s ease',
                boxShadow: 'var(--shadow-premium)',
                background: 'rgba(255,255,255,0.4)'
              }}
            >
              {billingCycle !== 'monthly' && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-14px', 
                  right: '32px', 
                  background: tier.color, 
                  color: 'white', 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {tier.savings[billingCycle]}
                </div>
              )}

              <div style={{ width: '56px', height: '56px', background: tier.bg, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tier.color, marginBottom: '2rem', border: `1px solid ${tier.border}` }}>
                {tier.icon}
              </div>
              
              <div style={{ display: 'inline-block', padding: '6px 14px', background: tier.bg, color: tier.color, borderRadius: '25px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', width: 'fit-content', border: `1px solid ${tier.border}` }}>
                AI SCORE: {tier.score}
              </div>
              
              <h3 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>{tier.tier}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: '500' }}>
                {tier.description}
              </p>
              
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>₹</span>
                  <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>{getPrice(tier).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{getSubLabel()}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: tier.color, fontWeight: '800', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {tier.badge}
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.875rem', color: 'var(--color-text-main)', fontSize: '1rem', fontWeight: '500' }}>
                    <CheckCircle size={20} style={{ color: '#00b894', flexShrink: 0 }} /> 
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to="/submit-deal" 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  textAlign: 'center', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  fontWeight: '800'
                }}
              >
                Access Portal <ArrowRight size={20} />
              </Link>
            </div>
          ))}
        </div>

        {/* Priority Access Section (Re-imagined Ultra Premium) */}
        <div className="glass" style={{ 
          background: 'white', 
          borderRadius: '40px', 
          padding: '4rem 5rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4rem', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-premium)',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(255, 234, 167, 0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={32} fill="#fdcb6e" style={{ color: '#fdcb6e' }} />
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>Priority Network</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: '500' }}>
              The definitive membership for elite startups. Fast-track your fundraise with direct institutional credits, curated events, and strategic advisory.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {['Guaranteed top-tier placement', 'Uncapped investor intro credits', 'Pitch narrative & deck orchestration', 'Assigned relationship operative', 'Financial nexus optimization', 'Quarterly board advisory sessions'].map(f => (
                <div key={f} style={{ display: 'flex', gap: '0.875rem', color: 'var(--color-text-main)', fontSize: '1rem', fontWeight: '600' }}>
                  <CheckCircle size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass" style={{ background: 'rgba(0,0,0,0.02)', padding: '4rem 3rem', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center', minWidth: '360px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800', marginBottom: '0.75rem' }}>Full Strategic Suite</div>
            <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '2rem', letterSpacing: '-0.03em' }}>₹25,000<span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-muted)', letterSpacing: '0' }}>/mo</span></div>
            <a href="mailto:hello@goodmatter.in?subject=Priority Access" className="btn btn-primary btn-lg" style={{ width: '100%', padding: '1.25rem' }}>
              Initiate Priority Status
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
