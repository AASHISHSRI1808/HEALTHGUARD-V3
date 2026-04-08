import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';

function HGLogo({ size = 32 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width={size} height={size}>
      <rect x="4" y="4" width="40" height="40" rx="10" fill="var(--accent)" opacity="0.12"/>
      <path d="M24 8 C24 8 10 13 10 24 L10 36 C10 36 16 42 24 44 C32 42 38 36 38 36 L38 24 C38 13 24 8 24 8Z" fill="var(--accent)" opacity="0.85"/>
      <rect x="21" y="18" width="6" height="16" rx="2" fill="white" opacity="0.95"/>
      <rect x="16" y="23" width="16" height="6" rx="2" fill="white" opacity="0.95"/>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';
  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); setMobileOpen(false); };
  const getDash = () => user?.role === 'admin' ? '/admin' : user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard';
  const isActive = (p) => location.pathname === p;

  const roleConfig = {
    admin:   { color: 'var(--violet-500)', bg: 'var(--violet-soft)', label: 'Admin'   },
    doctor:  { color: 'var(--teal-500)',   bg: 'var(--teal-soft)',   label: 'Doctor'  },
    patient: { color: 'var(--accent)',     bg: 'var(--accent-soft)', label: 'Patient' },
  };
  const rc = roleConfig[user?.role] || roleConfig.patient;

  const patientLinks = [
    { to: getDash(),          label: 'Dashboard'   },
    { to: '/symptom-predict', label: 'AI Diagnosis' },
    { to: '/predict',         label: 'ML Predict'  },
    { to: '/doctors',         label: 'Doctors'     },
    { to: '/appointments',    label: 'Appointments'},
    { to: '/reports',         label: 'Reports'     },
  ];

  const doctorLinks = [
    { to: getDash(),          label: 'Dashboard'    },
    { to: '/symptom-predict', label: 'AI Diagnosis' },
    { to: '/doctor-predict',  label: 'ML Predict'   },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
  ];

  const activeLinks = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <HGLogo size={30} />
          <span className="nav-logo-text">Health<span>Guard</span></span>
        </Link>

        {user ? (
          <>
            <ul className="nav-links">
              {activeLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className={isActive(l.to) ? 'active' : ''}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <button onClick={toggleTheme} className={`theme-toggle ${isDark ? 'dark' : ''}`} title="Toggle theme">
                <div className="theme-toggle-knob" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDark ? <Moon size={10} /> : <Sun size={10} />}
                </div>
              </button>

              <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: rc.bg, color: rc.color, border: `1px solid ${rc.color}30`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {rc.label}
              </span>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-surface)', border: '1.5px solid var(--border)',
                  borderRadius: '10px', padding: '6px 12px', cursor: 'pointer',
                  color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500,
                  boxShadow: 'var(--shadow-xs)', transition: 'all 0.2s'
                }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', fontFamily: 'Fraunces, serif' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: '48px', right: 0,
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: '16px', padding: '8px', minWidth: '200px',
                    boxShadow: 'var(--shadow-xl)', zIndex: 200,
                    animation: 'scaleIn 0.18s cubic-bezier(0.4,0,0.2,1)'
                  }}>
                    <div style={{ padding: '12px 14px 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white', fontFamily: 'Fraunces, serif' }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => { toggleTheme(); setMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '9px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isDark ? <Sun size={14} color="var(--amber-500)" /> : <Moon size={14} color="var(--violet-500)" />}
                        {isDark ? 'Light mode' : 'Dark mode'}
                      </span>
                    </button>

                    <button onClick={() => { navigate(getDash()); setMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '9px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <LayoutDashboard size={14} color="var(--accent)" /> Dashboard
                    </button>

                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--rose-500)', cursor: 'pointer', borderRadius: '9px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, transition: 'all 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--rose-soft)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>

              <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}>
                {mobileOpen ? <X size={20} color="var(--text-primary)" /> : <Menu size={20} color="var(--text-primary)" />}
              </button>
            </div>
          </>
        ) : (
          <>
            <ul className="nav-links">
              <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
              <li><Link to="/register">For Doctors</Link></li>
            </ul>
            <div className="nav-actions">
              <button onClick={toggleTheme} className={`theme-toggle ${isDark ? 'dark' : ''}`} title="Toggle theme">
                <div className="theme-toggle-knob" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDark ? <Moon size={10} /> : <Sun size={10} />}
                </div>
              </button>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}>
                {mobileOpen ? <X size={20} color="var(--text-primary)" /> : <Menu size={20} color="var(--text-primary)" />}
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {user ? (
          <>
            {activeLinks.map(l => (
              <Link key={l.to} to={l.to} className={isActive(l.to) ? 'active' : ''} onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 0' }} />
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'none', border: 'none', color: 'var(--rose-500)', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, width: '100%', textAlign: 'left' }}>
              <LogOut size={14} /> Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>For Doctors</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Get started</Link>
          </>
        )}
      </div>
    </>
  );
}
