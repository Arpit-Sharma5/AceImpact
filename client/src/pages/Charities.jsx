import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HiOutlineHeart, HiOutlineExternalLink } from 'react-icons/hi';

/**
 * Charities Page
 * Lists all active charities with search/filter functionality.
 */
export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/charities')
      .then(r => setCharities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
          <HiOutlineHeart style={{ color: '#ec4899', verticalAlign: 'middle' }} /> Our Charities
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: 24 }}>
          Choose a cause close to your heart. Every stroke makes a difference.
        </p>
        <input type="text" className="input-glass" placeholder="Search charities..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {filtered.map((c, i) => (
          <Link key={c._id} to={`/charities/${c._id}`}
            className="glass-card animate-in"
            style={{ textDecoration: 'none', color: 'inherit', animationDelay: `${i * 0.1}s` }}>
            <div style={{
              height: 180, borderRadius: 12, marginBottom: 16, overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))',
            }}>
              {c.imageUrl && (
                <img src={c.imageUrl} alt={c.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => e.target.style.display = 'none'} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{c.name}</h3>
              <span className="badge purple">{c.category}</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 12 }}>
              {c.description?.slice(0, 120)}...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                ${c.totalRaised?.toFixed(2) || '0.00'} raised
              </span>
              <HiOutlineExternalLink style={{ color: '#6b7280' }} />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>No charities found.</p>
      )}
    </div>
  );
}
