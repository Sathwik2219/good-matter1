import React, { useState } from 'react';
import { Star, Check, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const tiers = [
    {
      id: 1,
      score: '80–100',
      tier: 'Tier 1 - High Potential',
      description: 'Ideal for high-growth startups with proven traction. Maximize success fee, minimize listing cost.',
      monthly: 1499,
      quarterly: 2999,
      yearly: 13499,
      savings: { quarterly: 'save ~ 1 month fee', yearly: 'save ~ 3 month fee' },
      color: '#fbbf24', // Gold
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.3)',
      features: ['Priority deal listing', 'Premium AI Scoring', 'Direct Investor Access', 'Success-fee priority'],
      badge: 'Highest Closure Rate',
      icon: <Zap size={24} />
    },
    {
      id: 2,
      score: '60–80',
      tier: 'Tier 2 - Growth Ready',
      description: 'Steady visibility and balanced investor engagement for maturing startups.',
      monthly: 2499,
      quarterly: 4999,
      yearly: 22499,
      savings: { quarterly: 'save ~ 1 month fee', yearly: 'save ~ 3 month fee' },
      color: '#38bdf8', // Blue
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.3)',
      features: ['Standard deal listing', 'Advanced AI Scoring', 'Investor interest alerts', 'Community support'],
      badge: 'Most Popular',
      icon: <Target size={24} />
    },
    {
      id: 3,
      score: '40–60',
      tier: 'Tier 3 - Discovery',
      description: 'Perfect for early visibility while you refine your value proposition for investors.',
      monthly: 3499,
      quarterly: 6999,
      yearly: 31499,
      savings: { quarterly: 'save ~ 1 month fee', yearly: 'save ~ 3 month fee' },
      color: '#a855f7', // Purple
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
      features: ['Basic deal listing', 'Standard AI Scoring', 'Investor visibility', 'Pitch deck feedback'],
      badge: 'Early Stage Choice',
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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', paddingTop: '100px', paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Predictable, <span style={{ color: 'var(--color-accent)' }}>ROI-Focused</span> Pricing
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 3rem' }}>
          At GoodMatter, our pricing reflects your startup's potential. Higher AI scores lead to lower subscription costs and higher investor interest.
        </p>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'inline-flex', 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '4px', 
          borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem'
        }}>
          {['monthly', 'quarterly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                background: billingCycle === cycle ? 'var(--color-accent)' : 'transparent',
                color: billingCycle === cycle ? '#fff' : 'var(--color-text-muted)',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textTransform: 'capitalize'
              }}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Tier Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {tiers.map(tier => (
            <div 
              key={tier.id} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '32px', 
                padding: '3rem 2.5rem', 
                border: billingCycle !== 'monthly' ? `1px solid ${tier.color}` : `1px solid ${tier.border}`,
                position: 'relative', 
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="pricing-card"
            >
              {billingCycle !== 'monthly' && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  right: '24px', 
                  background: tier.color, 
                  color: '#000', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700' 
                }}>
                  {tier.savings[billingCycle]}
                </div>
              )}

              <div style={{ color: tier.color, marginBottom: '1.5rem' }}>
                {tier.icon}
              </div>
              
              <div style={{ display: 'inline-block', padding: '4px 12px', background: tier.bg, color: tier.color, borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', width: 'fit-content' }}>
                Score: {tier.score}
              </div>
              
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-main)', margin: '0 0 0.5rem' }}>{tier.tier}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
                {tier.description}
              </p>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-main)' }}>₹</span>
                  <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{getPrice(tier).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>{getSubLabel()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: tier.color, fontWeight: '600', minHeight: '20px', marginTop: '4px' }}>
                  {tier.badge}
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                    <Check size={20} style={{ color: '#10b981', flexShrink: 0 }} /> 
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
                  gap: '0.5rem',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: billingCycle !== 'monthly' ? tier.color : 'var(--color-accent)',
                  color: billingCycle !== 'monthly' ? '#000' : '#fff',
                  border: 'none',
                  fontWeight: '700'
                }}
              >
                Get Scored Today <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {/* Success Fee Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '32px', 
          padding: '4rem', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
            Alignment of <span style={{ color: 'var(--color-accent)' }}>Interests</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', lineHeight: 1.6, marginBottom: '3rem' }}>
            We only win when you win. In addition to the subscription, GoodMatter charges a standard 1% success fee on funds raised through our platform for all tiers. <strong>Tier 1 startups</strong> often see faster closures due to their high score status.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            <div style={{ background: 'var(--color-bg-surface)', padding: '1.5rem 2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Success Fee</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-accent)' }}>1.0%</div>
            </div>
            <div style={{ background: 'var(--color-bg-surface)', padding: '1.5rem 2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Intro Credits</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-accent)' }}>Unlimited</div>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          background: rgba(255, 255, 255, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default Pricing;
