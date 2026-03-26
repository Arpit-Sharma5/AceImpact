import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineCalendar } from 'react-icons/hi';

/**
 * Draw Results Page
 * Displays all published draws and their winning numbers.
 */
export default function DrawResults() {
  const [draws, setDraws] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/draws'), api.get('/scores/my')])
      .then(([drawsRes, scoresRes]) => {
        setDraws(drawsRes.data);
        setScores(scoresRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;
  }

  const userScoreValues = scores.map(s => s.score);
  const published = draws.filter(d => d.status === 'published');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
          <HiOutlineCalendar style={{ color: '#8b5cf6', verticalAlign: 'middle' }} /> Draw Results
        </h1>
        <p style={{ color: '#9ca3af' }}>Check past draw results and see if your numbers matched!</p>
      </div>

      {published.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {published.map((d, i) => {
            const matched = d.numbers?.filter(n => userScoreValues.includes(n)) || [];
            return (
              <div key={d._id} className="glass-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                      {new Date(0, d.month - 1).toLocaleString('default', { month: 'long' })} {d.year}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      {new Date(d.createdAt).toLocaleDateString()} · Pool: ${d.totalPool}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge purple">{d.mode}</span>
                    {d.jackpotRollover > 0 && (
                      <span className="badge gold">+${d.jackpotRollover} rollover</span>
                    )}
                  </div>
                </div>

                {/* Winning Numbers */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 10, fontWeight: 600 }}>WINNING NUMBERS</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {d.numbers?.map((n, j) => (
                      <div key={j} style={{
                        width: 52, height: 52, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: userScoreValues.includes(n)
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(255,255,255,0.08)',
                        fontWeight: 700, fontSize: '1.1rem',
                        border: userScoreValues.includes(n)
                          ? '2px solid #34d399'
                          : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: userScoreValues.includes(n)
                          ? '0 0 15px rgba(16,185,129,0.3)'
                          : 'none',
                      }}>{n}</div>
                    ))}
                  </div>
                </div>

                {/* Match Info */}
                {matched.length > 0 ? (
                  <div style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}>
                    <p style={{ color: '#34d399', fontWeight: 600 }}>
                      🎉 You matched {matched.length} number{matched.length > 1 ? 's' : ''}: {matched.join(', ')}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    No matches this draw. Better luck next time!
                  </p>
                )}

                {/* Prize breakdown */}
                <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    🏆 5 match = 40% (${(d.totalPool * 0.4).toFixed(0)})
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    4 match = 35% (${(d.totalPool * 0.35).toFixed(0)})
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    3 match = 25% (${(d.totalPool * 0.25).toFixed(0)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No draws have been published yet.</p>
          <p style={{ color: '#4b5563', marginTop: 8 }}>Draws are run monthly by the admin.</p>
        </div>
      )}
    </div>
  );
}
