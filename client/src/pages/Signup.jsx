import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

/**
 * Signup Page
 * Registration form with charity selection at signup.
 */
export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', charityId: '' });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Fetch charities for selection
  useEffect(() => {
    api.get('/charities').then(r => setCharities(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      // If charity was selected, update profile
      if (form.charityId) {
        await api.put('/users/profile', { selectedCharity: form.charityId });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: 480, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
          }}>A</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Join AceImpact and make a difference</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', marginBottom: 20, borderRadius: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: '0.9rem',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label className="label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 18 }} />
              <input type="text" name="name" className="input-glass" placeholder="John Doe"
                value={form.name} onChange={handleChange} style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 18 }} />
              <input type="email" name="email" className="input-glass" placeholder="you@example.com"
                value={form.email} onChange={handleChange} style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineLockClosed style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 18 }} />
              <input type="password" name="password" className="input-glass" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} style={{ paddingLeft: 42 }} required minLength={6} />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="label">Select a Charity (optional)</label>
            <select name="charityId" className="input-glass"
              value={form.charityId} onChange={handleChange}>
              <option value="">Choose later...</option>
              {charities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-glow" disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#9ca3af', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
