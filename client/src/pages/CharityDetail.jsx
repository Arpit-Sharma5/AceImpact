import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { HiOutlineArrowLeft, HiOutlineExternalLink, HiOutlineHeart } from 'react-icons/hi';

/**
 * Charity Detail Page
 * Shows full information about a single charity.
 */
export default function CharityDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/charities/${id}`)
      .then(r => setCharity(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = async () => {
    try {
      await api.put('/users/profile', { selectedCharity: charity._id });
      showToast(`${charity.name} is now your selected charity!`);
      refreshUser();
    } catch (err) {
      showToast('Failed to update', 'error');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;
  }

  if (!charity) {
    return <p style={{ textAlign: 'center', padding: 80, color: '#6b7280' }}>Charity not found.</p>;
  }

  const isSelected = user?.selectedCharity === charity._id ||
    user?.selectedCharity?._id === charity._id;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/charities" style={{
        color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 24, fontSize: '0.9rem',
      }}>
        <HiOutlineArrowLeft /> Back to Charities
      </Link>

      <div className="glass-card animate-in">
        <div style={{
          height: 280, borderRadius: 12, marginBottom: 24, overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))',
        }}>
          {charity.imageUrl && (
            <img src={charity.imageUrl} alt={charity.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => e.target.style.display = 'none'} />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>{charity.name}</h1>
            <span className="badge purple">{charity.category}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#10b981', fontWeight: 700, fontSize: '1.3rem' }}>
              ${charity.totalRaised?.toFixed(2) || '0.00'}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Total Raised</p>
          </div>
        </div>

        <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: 24 }}>{charity.description}</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {user && (
            <button onClick={handleSelect}
              className={`btn-glow pink`}
              disabled={isSelected}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineHeart />
              {isSelected ? 'Currently Selected' : 'Select This Charity'}
            </button>
          )}
          {charity.website && (
            <a href={charity.website} target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <HiOutlineExternalLink /> Visit Website
            </a>
          )}
        </div>
      </div>

      {ToastComponent}
    </div>
  );
}
