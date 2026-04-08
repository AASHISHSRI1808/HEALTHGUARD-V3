import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield, Sun, Moon } from 'lucide-react';

const ROLES = [
  { k: 'patient', label: 'Patient',  color: 'var(--accent)',     faint: 'var(--accent-soft)',  glow: 'var(--accent-glow)',  desc: 'AI predictions & reports' },
  { k: 'doctor',  label: 'Doctor',   color: 'var(--teal-500)',   faint: 'var(--teal-soft)',    glow: 'var(--teal-glow)',    desc: 'Manage patients' },
  { k: 'admin',   label: 'Admin',    color: 'var(--violet-500)', faint: 'var(--violet-soft)',  glow: 'var(--violet-glow)',  desc: 'Platform admin' },
];

export default function LoginPage() {
  const [role,  setRole]  = useState('patient');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [show,  setShow]  = useState(false);
  const [busy,  setBusy]  = useState(false);
  const { login } = useAuth();
  const { toggleTheme, dark } = useTheme();
  const navigate = useNavigate();
  const active = ROLES.find(r => r.k === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, pass);
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === 'admin' ? '/admin' : u.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Left panel — image */}
      <div style={{ flex: '1 1 0', display: 'flex', minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-brand)', opacity: 0.95 }} />
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoY2FyZXxlbnwwfHwwfHx8MA%3D%3D?w=900&auto=format&fit=crop&q=80"
          alt="Medical professional"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', mixBlendMode: 'multiply' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
          <div>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: '12px' }}>
              "Prevention is better than cure. Know your risk before it becomes a crisis."
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>HealthGuard AI Platform</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: '0 0 460px', minHeight: '100vh', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px, 5vw, 56px)', overflowY: 'auto' }}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="30" height="30">
                <path d="M24 4 C24 4 8 10 8 22 L8 38 C8 38 15 44 24 46 C33 44 40 38 40 38 L40 22 C40 10 24 4 24 4Z" fill="var(--accent)" opacity="0.85"/>
                <rect x="21" y="17" width="6" height="16" rx="2" fill="white" opacity="0.95"/>
                <rect x="16" y="22" width="16" height="6" rx="2" fill="white" opacity="0.95"/>
              </svg>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 400, color: 'var(--text-primary)' }}>Health<span style={{ color: 'var(--accent)' }}>Guard</span></span>
            </Link>
            <button onClick={toggleTheme} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '6px' }}>Sign in</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Choose your role to continue</p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
            {ROLES.map(r => (
              <button key={r.k} onClick={() => { setRole(r.k); setEmail(''); setPass(''); }} type="button" style={{
                padding: '12px 8px', borderRadius: '10px', border: '1.5px solid',
                borderColor: role === r.k ? r.color : 'var(--border)',
                background: role === r.k ? r.faint : 'var(--bg-raised)',
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: role === r.k ? r.color : 'var(--text-secondary)', marginBottom: '3px' }}>{r.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.3 }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Status bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: active.faint, border: `1px solid ${active.color}30`, borderRadius: '10px', marginBottom: '24px' }}>
            <span className="pdot" style={{ background: active.color }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Signing in as <strong style={{ color: active.color }}>{active.label}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input type="email" className="form-input" placeholder={role === 'admin' ? 'admin@healthguard.com' : role === 'doctor' ? 'dr.name@hospital.com' : 'you@example.com'} required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} className="form-input" placeholder="Enter your password" required value={pass} style={{ paddingRight: '44px' }} onChange={e => setPass(e.target.value)} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }}>
              {busy ? (
                <><div className="loading-spinner" style={{ width: '17px', height: '17px', borderWidth: '2px', borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> Signing in…</>
              ) : (
                <><Shield size={15} /> Sign in as {active.label}</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .login-left { display: none !important; } .login-right { flex: 1 !important; } }`}</style>
    </div>
  );
}
