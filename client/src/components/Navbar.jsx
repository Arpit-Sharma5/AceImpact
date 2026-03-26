import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

/**
 * Navbar Component
 * Responsive navigation bar with glassmorphism styling.
 * Shows different links based on auth state and user role.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10, 14, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
          }}>A</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f9fafb' }}>
            Ace<span style={{ color: '#10b981' }}>Impact</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          className="desktop-nav">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/charities">Charities</NavLink>
              <NavLink to="/draws">Draws</NavLink>
              {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginLeft: 12,
                padding: '6px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  {user.name || user.email}
                </span>
                <button onClick={handleLogout}
                  style={{
                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    border: 'none', padding: '5px 12px', borderRadius: 8,
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.target.style.background = 'rgba(239,68,68,0.3)'}
                  onMouseOut={e => e.target.style.background = 'rgba(239,68,68,0.15)'}
                >Logout</button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/signup" className="btn-glow" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none', background: 'none', border: 'none',
            color: '#f9fafb', fontSize: 24, cursor: 'pointer',
          }}>
          {menuOpen ? <HiX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-nav" style={{
          padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {user ? (
            <>
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/charities" onClick={() => setMenuOpen(false)}>Charities</MobileLink>
              <MobileLink to="/draws" onClick={() => setMenuOpen(false)}>Draws</MobileLink>
              {user.role === 'admin' && <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>}
              <button onClick={handleLogout} style={{
                padding: '10px 16px', background: 'rgba(239,68,68,0.15)',
                color: '#f87171', border: 'none', borderRadius: 8,
                fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', marginTop: 8,
              }}>Logout</button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
              <MobileLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</MobileLink>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{
      color: '#9ca3af', textDecoration: 'none', padding: '6px 14px',
      borderRadius: 8, fontSize: '0.9rem', fontWeight: 500,
      transition: 'all 0.2s',
    }}
      onMouseOver={e => { e.target.style.color = '#f9fafb'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseOut={e => { e.target.style.color = '#9ca3af'; e.target.style.background = 'transparent'; }}
    >{children}</Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      color: '#d1d5db', textDecoration: 'none', padding: '10px 16px',
      borderRadius: 8, fontSize: '0.95rem', display: 'block',
    }}>{children}</Link>
  );
}
