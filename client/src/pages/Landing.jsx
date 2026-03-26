import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineStar, HiOutlineHeart, HiOutlineTrendingUp, HiOutlineShieldCheck } from 'react-icons/hi';

/**
 * Landing Page
 * Hero section with feature highlights and CTA.
 */
export default function Landing() {
  const { user } = useAuth();

  const features = [
    { icon: <HiOutlineTrendingUp />, title: 'Track Your Game', desc: 'Log your latest golf scores and track your performance over time.', color: '#3b82f6' },
    { icon: <HiOutlineStar />, title: 'Win Rewards', desc: 'Monthly draws match your scores to win exciting cash prizes.', color: '#f59e0b' },
    { icon: <HiOutlineHeart />, title: 'Support Charities', desc: 'A portion of every subscription goes directly to your chosen charity.', color: '#ec4899' },
    { icon: <HiOutlineShieldCheck />, title: 'Fair & Transparent', desc: 'Two draw modes plus verified winners ensure fairness for everyone.', color: '#10b981' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '60px 24px',
      }}>
        <div className="animate-in" style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', padding: '6px 16px', borderRadius: 999,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399', fontSize: '0.8rem', fontWeight: 600, marginBottom: 24,
          }}>
            🏌️ Golf × Charity × Rewards
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
            lineHeight: 1.15, marginBottom: 20,
          }}>
            Play Golf. <span style={{
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Win Rewards.</span><br />Make an Impact.
          </h1>
          <p style={{
            color: '#9ca3af', fontSize: '1.15rem', lineHeight: 1.7,
            maxWidth: 540, margin: '0 auto 36px',
          }}>
            Submit your golf scores, enter monthly draws, and win prizes — all while supporting the charities you care about.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/signup'} className="btn-glow"
              style={{ padding: '14px 36px', fontSize: '1.05rem', textDecoration: 'none' }}>
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
            <Link to="/charities" className="btn-outline"
              style={{ padding: '14px 36px', fontSize: '1.05rem', textDecoration: 'none' }}>
              Explore Charities
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: 48 }}>
          How It <span style={{ color: '#10b981' }}>Works</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card animate-in" style={{ animationDelay: `${i * 0.15}s`, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: `rgba(${f.color === '#3b82f6' ? '59,130,246' : f.color === '#f59e0b' ? '245,158,11' : f.color === '#ec4899' ? '236,72,153' : '16,185,129'}, 0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, color: f.color,
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: '1.05rem' }}>{f.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>
          Simple <span style={{ color: '#8b5cf6' }}>Pricing</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 48 }}>
          Choose a plan that works for you
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: 36 }}>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>MONTHLY</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 4 }}>$9.99<span style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280' }}>/mo</span></p>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Perfect to get started</p>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 28 }}>
              {['Enter monthly draws', 'Track 5 scores', 'Support a charity', 'Win cash prizes'].map((item, j) => (
                <li key={j} style={{ padding: '6px 0', color: '#d1d5db', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10b981' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-outline" style={{ display: 'block', textDecoration: 'none', padding: '12px' }}>
              Choose Monthly
            </Link>
          </div>
          <div className="glass-card" style={{
            textAlign: 'center', padding: 36,
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 30px rgba(139,92,246,0.1)',
          }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 999,
              background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
              fontSize: '0.75rem', fontWeight: 700, marginBottom: 12,
            }}>BEST VALUE</div>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>YEARLY</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 4 }}>$99.99<span style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280' }}>/yr</span></p>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Save over 15%</p>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 28 }}>
              {['Everything in Monthly', '2 months free', 'Priority support', 'Exclusive draws'].map((item, j) => (
                <li key={j} style={{ padding: '6px 0', color: '#d1d5db', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-glow purple" style={{ display: 'block', textDecoration: 'none', padding: '12px', textAlign: 'center' }}>
              Choose Yearly
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px',
        textAlign: 'center', color: '#6b7280', fontSize: '0.85rem',
      }}>
        <p>© {new Date().getFullYear()} AceImpact. All rights reserved. Built with ❤️ for charity.</p>
      </footer>
    </div>
  );
}
