import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import {
  HiOutlineUsers, HiOutlineTrendingUp, HiOutlineCreditCard,
  HiOutlineCalendar, HiOutlineHeart, HiOutlineStar, HiOutlineChartBar,
  HiOutlineTrash, HiOutlineCheck, HiOutlineX, HiOutlineCash
} from 'react-icons/hi';

/**
 * Admin Dashboard
 * Tabbed interface with full management capabilities:
 * Users, Scores, Subscriptions, Draws, Charities, Winners, Analytics
 */
export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  const { showToast, ToastComponent } = useToast();

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
    { id: 'users', label: 'Users', icon: <HiOutlineUsers /> },
    { id: 'scores', label: 'Scores', icon: <HiOutlineTrendingUp /> },
    { id: 'subscriptions', label: 'Subs', icon: <HiOutlineCreditCard /> },
    { id: 'draws', label: 'Draws', icon: <HiOutlineCalendar /> },
    { id: 'charities', label: 'Charities', icon: <HiOutlineHeart /> },
    { id: 'winners', label: 'Winners', icon: <HiOutlineStar /> },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <div className="animate-in" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>
          Admin <span style={{ color: '#10b981' }}>Dashboard</span>
        </h1>
        <p style={{ color: '#9ca3af' }}>Manage your AceImpact platform</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto',
        borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'analytics' && <AnalyticsTab />}
      {tab === 'users' && <UsersTab showToast={showToast} />}
      {tab === 'scores' && <ScoresTab showToast={showToast} />}
      {tab === 'subscriptions' && <SubscriptionsTab showToast={showToast} />}
      {tab === 'draws' && <DrawsTab showToast={showToast} />}
      {tab === 'charities' && <CharitiesTab showToast={showToast} />}
      {tab === 'winners' && <WinnersTab showToast={showToast} />}

      {ToastComponent}
    </div>
  );
}

/* ─── Analytics Tab ────────────────────────────────────────── */
function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/subscriptions'),
      api.get('/draws'),
      api.get('/winners'),
      api.get('/charities/admin/all'),
    ]).then(([users, subs, draws, winners, charities]) => {
      const activeSubs = subs.data.filter(s => s.status === 'active');
      const totalRevenue = subs.data.reduce((sum, s) => sum + (s.amount || 0), 0);
      const totalPrizes = winners.data.reduce((sum, w) => sum + (w.prize || 0), 0);
      setStats({
        totalUsers: users.data.length,
        activeSubs: activeSubs.length,
        totalRevenue,
        totalDraws: draws.data.length,
        publishedDraws: draws.data.filter(d => d.status === 'published').length,
        totalWinners: winners.data.length,
        totalPrizes,
        totalCharities: charities.data.length,
        charityRaised: charities.data.reduce((sum, c) => sum + (c.totalRaised || 0), 0),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatBox label="Total Users" value={stats.totalUsers} color="green" icon={<HiOutlineUsers />} />
        <StatBox label="Active Subscriptions" value={stats.activeSubs} color="blue" icon={<HiOutlineCreditCard />} />
        <StatBox label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="gold" icon={<HiOutlineCash />} />
        <StatBox label="Published Draws" value={stats.publishedDraws} color="purple" icon={<HiOutlineCalendar />} />
        <StatBox label="Total Winners" value={stats.totalWinners} color="pink" icon={<HiOutlineStar />} />
        <StatBox label="Prizes Awarded" value={`$${stats.totalPrizes.toFixed(2)}`} color="gold" icon={<HiOutlineTrendingUp />} />
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{label}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
        </div>
        <span style={{ fontSize: 24, opacity: 0.5 }}>{icon}</span>
      </div>
    </div>
  );
}

/* ─── Users Tab ────────────────────────────────────────────── */
function UsersTab({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user and all their data?')) return;
    try {
      await api.delete(`/users/${id}`);
      showToast('User deleted');
      loadUsers();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${user._id}`, { role: newRole });
      showToast(`Role updated to ${newRole}`);
      loadUsers();
    } catch { showToast('Failed to update', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Subscription</th>
              <th>Scores</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td style={{ color: '#9ca3af' }}>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'purple' : 'blue'}`}>{u.role}</span></td>
                <td><span className={`badge ${u.subscriptionStatus === 'active' ? 'green' : 'gray'}`}>{u.subscriptionStatus || 'none'}</span></td>
                <td>{u.scoreCount || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleRoleToggle(u)} className="btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button onClick={() => handleDelete(u._id)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem' }}>
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Scores Tab ───────────────────────────────────────────── */
function ScoresTab({ showToast }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const loadScores = () => {
    api.get('/scores/all').then(r => setScores(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadScores(); }, []);

  const handleEdit = async (id) => {
    try {
      await api.put(`/scores/${id}`, { score: parseInt(editVal) });
      showToast('Score updated');
      setEditId(null);
      loadScores();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      showToast('Score deleted');
      loadScores();
    } catch { showToast('Failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Score</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 500 }}>{s.userId?.name || 'Unknown'}</td>
                <td>
                  {editId === s._id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input type="number" min="1" max="45" value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        className="input-glass" style={{ width: 80, padding: '4px 8px' }} />
                      <button onClick={() => handleEdit(s._id)} className="btn-glow"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Save</button>
                      <button onClick={() => setEditId(null)} className="btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Cancel</button>
                    </div>
                  ) : (
                    <span style={{
                      display: 'inline-flex', width: 32, height: 32, borderRadius: 8,
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}>{s.score}</span>
                  )}
                </td>
                <td style={{ color: '#9ca3af' }}>{new Date(s.date).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {editId !== s._id && (
                      <button onClick={() => { setEditId(s._id); setEditVal(s.score); }}
                        className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(s._id)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '4px 10px', borderRadius: 8, cursor: 'pointer' }}>
                      <HiOutlineTrash style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Subscriptions Tab ────────────────────────────────────── */
function SubscriptionsTab({ showToast }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/subscriptions').then(r => setSubs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.put(`/subscriptions/${id}/cancel`);
      showToast('Subscription cancelled');
      const r = await api.get('/subscriptions');
      setSubs(r.data);
    } catch { showToast('Failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 500 }}>{s.userId?.name || 'Unknown'}</td>
                <td><span className="badge blue">{s.plan}</span></td>
                <td><span className={`badge ${s.status === 'active' ? 'green' : s.status === 'cancelled' ? 'red' : 'gray'}`}>{s.status}</span></td>
                <td>${s.amount}</td>
                <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{new Date(s.startDate).toLocaleDateString()}</td>
                <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{new Date(s.endDate).toLocaleDateString()}</td>
                <td>
                  {s.status === 'active' && (
                    <button onClick={() => handleCancel(s._id)} className="btn-danger"
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Draws Tab ────────────────────────────────────────────── */
function DrawsTab({ showToast }) {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    mode: 'random',
    totalPool: 1000,
  });

  const loadDraws = () => {
    api.get('/draws').then(r => setDraws(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadDraws(); }, []);

  const handleRun = async (e) => {
    e.preventDefault();
    try {
      await api.post('/draws/run', form);
      showToast('Draw created!');
      loadDraws();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handlePublish = async (id) => {
    try {
      const res = await api.put(`/draws/${id}/publish`);
      showToast(`Published! ${res.data.winnersFound} winner(s) found.`);
      loadDraws();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      {/* Run Draw Form */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Run New Draw</h3>
        <form onSubmit={handleRun} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="label">Month</label>
            <select className="input-glass" value={form.month}
              onChange={e => setForm({ ...form, month: parseInt(e.target.value) })}
              style={{ width: 120 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" className="input-glass" value={form.year}
              onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
              style={{ width: 100 }} />
          </div>
          <div>
            <label className="label">Mode</label>
            <select className="input-glass" value={form.mode}
              onChange={e => setForm({ ...form, mode: e.target.value })}
              style={{ width: 140 }}>
              <option value="random">Random</option>
              <option value="algorithm">Algorithm</option>
            </select>
          </div>
          <div>
            <label className="label">Prize Pool ($)</label>
            <input type="number" className="input-glass" value={form.totalPool}
              onChange={e => setForm({ ...form, totalPool: parseInt(e.target.value) })}
              style={{ width: 120 }} />
          </div>
          <button type="submit" className="btn-glow purple">Run Draw</button>
        </form>
      </div>

      {/* Draws List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {draws.map(d => (
          <div key={d._id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h4 style={{ fontWeight: 600 }}>
                  {new Date(0, d.month - 1).toLocaleString('default', { month: 'long' })} {d.year}
                </h4>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {d.numbers?.map((n, i) => (
                    <span key={i} style={{
                      width: 38, height: 38, borderRadius: '50%',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      fontWeight: 700, fontSize: '0.9rem',
                    }}>{n}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${d.mode === 'random' ? 'blue' : 'purple'}`}>{d.mode}</span>
                <span className={`badge ${d.status === 'published' ? 'green' : 'gold'}`}>{d.status}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Pool: ${d.totalPool}</span>
                {d.status === 'pending' && (
                  <button onClick={() => handlePublish(d._id)} className="btn-glow"
                    style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Publish</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Charities Tab ────────────────────────────────────────── */
function CharitiesTab({ showToast }) {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', website: '', category: '' });

  const loadCharities = () => {
    api.get('/charities/admin/all').then(r => setCharities(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadCharities(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/charities', form);
      showToast('Charity created!');
      setShowForm(false);
      setForm({ name: '', description: '', imageUrl: '', website: '', category: '' });
      loadCharities();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/charities/${id}`);
      showToast('Charity deactivated');
      loadCharities();
    } catch { showToast('Failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 600 }}>{charities.length} Charities</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-glow pink"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          {showForm ? 'Cancel' : '+ Add Charity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="label">Name</label>
              <input className="input-glass" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input-glass" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input className="input-glass" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input-glass" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Description</label>
            <textarea className="input-glass" rows="3" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }} required />
          </div>
          <button type="submit" className="btn-glow pink">Create Charity</button>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Raised</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charities.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td><span className="badge purple">{c.category}</span></td>
                <td style={{ color: '#10b981', fontWeight: 600 }}>${c.totalRaised?.toFixed(2)}</td>
                <td><span className={`badge ${c.isActive ? 'green' : 'red'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  {c.isActive && (
                    <button onClick={() => handleDelete(c._id)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '4px 10px', borderRadius: 8, cursor: 'pointer' }}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Winners Tab ──────────────────────────────────────────── */
function WinnersTab({ showToast }) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWinners = () => {
    api.get('/winners').then(r => setWinners(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadWinners(); }, []);

  const handleApprove = async (id) => {
    try { await api.put(`/winners/${id}/approve`); showToast('Winner approved'); loadWinners(); }
    catch { showToast('Failed', 'error'); }
  };

  const handleReject = async (id) => {
    try { await api.put(`/winners/${id}/reject`); showToast('Winner rejected'); loadWinners(); }
    catch { showToast('Failed', 'error'); }
  };

  const handlePay = async (id) => {
    try { await api.put(`/winners/${id}/pay`); showToast('Marked as paid'); loadWinners(); }
    catch { showToast('Failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <div className="animate-fade">
      {winners.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#6b7280' }}>No winners yet. Run and publish a draw first.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Draw</th>
                <th>Matches</th>
                <th>Prize</th>
                <th>Proof</th>
                <th>Approval</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(w => (
                <tr key={w._id}>
                  <td style={{ fontWeight: 500 }}>{w.userId?.name || 'Unknown'}</td>
                  <td>
                    {w.drawId ? `${w.drawId.month}/${w.drawId.year}` : 'N/A'}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', padding: '4px 10px', borderRadius: 8,
                      background: w.matchCount === 5 ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.15)',
                      color: w.matchCount === 5 ? '#fbbf24' : '#a78bfa',
                      fontWeight: 700,
                    }}>{w.matchCount}/5</span>
                  </td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>${w.prize?.toFixed(2)}</td>
                  <td>
                    {w.proofUrl ? (
                      <a href={w.proofUrl} target="_blank" rel="noopener noreferrer"
                        className="badge blue" style={{ textDecoration: 'none' }}>View</a>
                    ) : <span className="badge gray">None</span>}
                  </td>
                  <td>
                    <span className={`badge ${w.adminApproved === 'approved' ? 'green' : w.adminApproved === 'rejected' ? 'red' : 'gold'}`}>
                      {w.adminApproved}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${w.paymentStatus === 'paid' ? 'green' : 'gray'}`}>
                      {w.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {w.adminApproved === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(w._id)} title="Approve"
                            style={{ background: 'rgba(16,185,129,0.15)', border: 'none', color: '#34d399', padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}>
                            <HiOutlineCheck />
                          </button>
                          <button onClick={() => handleReject(w._id)} title="Reject"
                            style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}>
                            <HiOutlineX />
                          </button>
                        </>
                      )}
                      {w.adminApproved === 'approved' && w.paymentStatus === 'pending' && (
                        <button onClick={() => handlePay(w._id)} className="btn-glow gold"
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Pay</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
