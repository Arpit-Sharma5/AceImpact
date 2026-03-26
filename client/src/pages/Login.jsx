import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

/**
 * Login Page
 * Clean glassmorphism login form with email/password authentication.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: 440, padding: 40 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
          }}>A</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Sign in to your AceImpact account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px', marginBottom: 20, borderRadius: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: '0.9rem',
          }}>{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineMail style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#6b7280', fontSize: 18,
              }} />
              <input type="email" className="input-glass" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineLockClosed style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#6b7280', fontSize: 18,
              }} />
              <input type="password" className="input-glass" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <button type="submit" className="btn-glow" disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#9ca3af', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
