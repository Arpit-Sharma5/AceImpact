import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { HiOutlineTrendingUp, HiOutlineCreditCard, HiOutlineHeart, HiOutlineStar, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi';

/**
 * User Dashboard
 * Central hub showing subscription, scores, charity, draws, and winnings.
 */
export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [scores, setScores] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Score form
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0]);

  // Charity form
  const [selectedCharity, setSelectedCharity] = useState('');
  const [charityPct, setCharityPct] = useState(10);

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [scoresRes, subRes, charitiesRes, drawsRes, winRes] = await Promise.all([
        api.get('/scores/my'),
        api.get('/subscriptions/my'),
        api.get('/charities'),
        api.get('/draws'),
        api.get('/winners/my'),
      ]);
      setScores(scoresRes.data);
      setSubscription(subRes.data);
      setCharities(charitiesRes.data);
      setDraws(drawsRes.data);
      setWinnings(winRes.data);
      if (user?.selectedCharity) setSelectedCharity(user.selectedCharity._id || user.selectedCharity);
      if (user?.charityPercentage) setCharityPct(user.charityPercentage);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }

  // Add a new score
  const handleAddScore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scores', { score: parseInt(newScore), date: scoreDate });
      showToast('Score added successfully!');
      setNewScore('');
      const res = await api.get('/scores/my');
      setScores(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add score', 'error');
    }
  };

  // Subscribe to a plan
  const handleSubscribe = async (plan) => {
    try {
      await api.post('/subscriptions', { plan });
      showToast(`Subscribed to ${plan} plan!`);
      const res = await api.get('/subscriptions/my');
      setSubscription(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Subscription failed', 'error');
    }
  };

  // Cancel subscription
  const handleCancelSub = async () => {
    if (!subscription?._id) return;
    try {
      await api.put(`/subscriptions/${subscription._id}/cancel`);
      showToast('Subscription cancelled');
      setSubscription({ status: 'none' });
    } catch (err) {
      showToast('Failed to cancel', 'error');
    }
  };

  // Update charity preference
  const handleUpdateCharity = async () => {
    try {
      await api.put('/users/profile', {
        selectedCharity: selectedCharity,
        charityPercentage: parseInt(charityPct),
      });
      showToast('Charity preference updated!');
      refreshUser();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    }
  };

  // Upload winner proof
  const handleProofUpload = async (winnerId, file) => {
    const formData = new FormData();
    formData.append('proof', file);
    try {
      await api.post(`/winners/${winnerId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Proof uploaded!');
      const res = await api.get('/winners/my');
      setWinnings(res.data);
    } catch (err) {
      showToast('Upload failed', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const totalWinnings = winnings.reduce((sum, w) => w.paymentStatus === 'paid' ? sum + w.prize : sum, 0);
  const publishedDraws = draws.filter(d => d.status === 'published');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* Welcome */}
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>
          Welcome back, <span style={{ color: '#10b981' }}>{user?.name || 'Player'}</span>
        </h1>
        <p style={{ color: '#9ca3af' }}>Your golf charity journey at a glance</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="stat-card green animate-in delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 4 }}>SUBSCRIPTION</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                {subscription?.status === 'active' ? subscription.plan?.toUpperCase() : 'INACTIVE'}
              </p>
            </div>
            <HiOutlineCreditCard style={{ fontSize: 28, color: '#10b981' }} />
          </div>
        </div>
        <div className="stat-card blue animate-in delay-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 4 }}>MY SCORES</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{scores.length} / 5</p>
            </div>
            <HiOutlineTrendingUp style={{ fontSize: 28, color: '#3b82f6' }} />
          </div>
        </div>
        <div className="stat-card purple animate-in delay-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 4 }}>DRAWS ENTERED</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{publishedDraws.length}</p>
            </div>
            <HiOutlineCalendar style={{ fontSize: 28, color: '#8b5cf6' }} />
          </div>
        </div>
        <div className="stat-card gold animate-in delay-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 4 }}>TOTAL WINNINGS</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>${totalWinnings.toFixed(2)}</p>
            </div>
            <HiOutlineStar style={{ fontSize: 28, color: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>

        {/* ── Subscription Card ─────────────────────── */}
        <div className="glass-card animate-in delay-1">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineCreditCard style={{ color: '#10b981' }} /> Subscription
          </h2>
          {subscription?.status === 'active' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#9ca3af' }}>Plan</span>
                <span className="badge green">{subscription.plan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#9ca3af' }}>Expires</span>
                <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ color: '#9ca3af' }}>Amount</span>
                <span>${subscription.amount}</span>
              </div>
              <button onClick={handleCancelSub} className="btn-danger" style={{ width: '100%' }}>
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: '#9ca3af', marginBottom: 20, fontSize: '0.9rem' }}>
                Subscribe to participate in draws and win rewards!
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => handleSubscribe('monthly')} className="btn-glow"
                  style={{ flex: 1, textAlign: 'center' }}>
                  Monthly · $9.99
                </button>
                <button onClick={() => handleSubscribe('yearly')} className="btn-glow blue"
                  style={{ flex: 1, textAlign: 'center' }}>
                  Yearly · $99.99
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Score Entry Card ─────────────────────── */}
        <div className="glass-card animate-in delay-2">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineTrendingUp style={{ color: '#3b82f6' }} /> My Scores
          </h2>
          <form onSubmit={handleAddScore} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input type="number" className="input-glass" placeholder="Score (1-45)"
              min="1" max="45" value={newScore} onChange={e => setNewScore(e.target.value)}
              style={{ flex: 1 }} required />
            <input type="date" className="input-glass" value={scoreDate}
              onChange={e => setScoreDate(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="btn-glow blue" style={{ whiteSpace: 'nowrap' }}>Add</button>
          </form>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: 12 }}>
            {scores.length >= 5 ? '⚠ Adding a new score will replace the oldest' : `${5 - scores.length} slots remaining`}
          </p>
          {scores.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {scores.map((s, i) => (
                <div key={s._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      fontWeight: 700, fontSize: '0.9rem',
                    }}>{s.score}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                  </div>
                  {i === 0 && <span className="badge blue" style={{ fontSize: '0.7rem' }}>Latest</span>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: 20 }}>
              No scores yet. Add your first golf score!
            </p>
          )}
        </div>

        {/* ── Charity Card ─────────────────────── */}
        <div className="glass-card animate-in delay-3">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineHeart style={{ color: '#ec4899' }} /> My Charity
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Select Charity</label>
            <select className="input-glass" value={selectedCharity}
              onChange={e => setSelectedCharity(e.target.value)}>
              <option value="">Choose a charity...</option>
              {charities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Contribution Percentage (min 10%)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="range" min="10" max="100" value={charityPct}
                onChange={e => setCharityPct(e.target.value)}
                style={{ flex: 1, accentColor: '#ec4899' }} />
              <span style={{
                minWidth: 48, textAlign: 'center', fontWeight: 700,
                color: '#ec4899', fontSize: '1.1rem',
              }}>{charityPct}%</span>
            </div>
          </div>
          <button onClick={handleUpdateCharity} className="btn-glow pink" style={{ width: '100%' }}>
            Update Charity
          </button>
        </div>

        {/* ── Winnings Card ─────────────────────── */}
        <div className="glass-card animate-in delay-4">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineStar style={{ color: '#f59e0b' }} /> My Winnings
          </h2>
          {winnings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {winnings.map(w => (
                <div key={w._id} style={{
                  padding: '14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>
                      {w.drawId ? `${w.drawId.month}/${w.drawId.year}` : 'Draw'} – {w.matchCount} matches
                    </span>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>${w.prize.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge ${w.adminApproved === 'approved' ? 'green' : w.adminApproved === 'rejected' ? 'red' : 'gold'}`}>
                      {w.adminApproved}
                    </span>
                    <span className={`badge ${w.paymentStatus === 'paid' ? 'green' : 'gray'}`}>
                      {w.paymentStatus}
                    </span>
                    {!w.proofUrl && w.adminApproved === 'pending' && (
                      <label style={{
                        cursor: 'pointer', padding: '4px 12px', borderRadius: 8,
                        background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                        fontSize: '0.75rem', fontWeight: 600,
                      }}>
                        Upload Proof
                        <input type="file" hidden accept="image/*,.pdf"
                          onChange={e => handleProofUpload(w._id, e.target.files[0])} />
                      </label>
                    )}
                    {w.proofUrl && <span className="badge blue">Proof ✓</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: 20 }}>
              No winnings yet. Keep playing and good luck! 🍀
            </p>
          )}
        </div>

        {/* ── Recent Draws Card ─────────────────────── */}
        <div className="glass-card animate-in delay-5" style={{ gridColumn: 'span 1' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineCalendar style={{ color: '#8b5cf6' }} /> Recent Draws
          </h2>
          {publishedDraws.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {publishedDraws.slice(0, 5).map(d => (
                <div key={d._id} style={{
                  padding: '14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>
                      {new Date(0, d.month - 1).toLocaleString('default', { month: 'long' })} {d.year}
                    </span>
                    <span className="badge purple">{d.mode}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {d.numbers?.map((n, i) => (
                      <span key={i} style={{
                        width: 36, height: 36, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: scores.some(s => s.score === n)
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(255,255,255,0.08)',
                        fontWeight: 700, fontSize: '0.85rem',
                        border: scores.some(s => s.score === n) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}>{n}</span>
                    ))}
                  </div>
                  {scores.some(s => d.numbers?.includes(s.score)) && (
                    <p style={{ marginTop: 8, color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✨ You matched {scores.filter(s => d.numbers?.includes(s.score)).length} number(s)!
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: 20 }}>
              No draws published yet. Stay tuned!
            </p>
          )}
        </div>
      </div>

      {ToastComponent}
    </div>
  );
}
