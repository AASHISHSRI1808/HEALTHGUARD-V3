import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle, Sun, Moon, User, Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState('patient');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { register, registerDoctor } = useAuth();
  const { toggleTheme, dark } = useTheme();
  const navigate = useNavigate();

  const [pf, setPf] = useState({ name: '', email: '', password: '', mobile: '', age: '', gender: '', bloodGroup: '' });
  const [df, setDf] = useState({ name: '', email: '', password: '', mobile: '', mciNumber: '', specialization: '', experience: '', hospitalName: '', city: '', state: '', consultationFee: '500', about: '' });

  const handlePatient = async (e) => {
    e.preventDefault();
    if (pf.password.length < 6) return toast.error('Password must be 6+ characters');
    setBusy(true);
    try { await register(pf); toast.success('Welcome to HealthGuard!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  const handleDoctor = async (e) => {
    e.preventDefault();
    if (df.password.length < 6) return toast.error('Password must be 6+ characters');
    setBusy(true);
    try { await registerDoctor(df); setDone(true); toast.success('Application submitted!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ width: '72px', height: '72px', background: 'var(--accent-soft)', border: '2px solid var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 32px var(--accent-glow)' }}>
          <CheckCircle size={36} color="var(--accent)" />
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '12px' }}>Application submitted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.7, fontSize: '15px' }}>Your doctor profile is under review. Our admin team will verify your credentials and notify you by email within 24–48 hours.</p>
        <Link to="/login" className="btn btn-primary btn-lg">Go to sign in</Link>
      </div>
    </div>
  );

  const pInp = (key, placeholder, type = 'text', extra = {}) => (
    <input type={type} className="form-input" placeholder={placeholder} value={pf[key]} onChange={e => setPf({ ...pf, [key]: e.target.value })} {...extra} />
  );

  const dInp = (key, placeholder, type = 'text', extra = {}) => (
    <input type={type} className="form-input" placeholder={placeholder} value={df[key]} onChange={e => setDf({ ...df, [key]: e.target.value })} {...extra} />
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: 'clamp(32px, 6vw, 56px) clamp(16px, 4vw, 40px)', position: 'relative' }}>
      <div style={{ maxWidth: role === 'doctor' ? '680px' : '460px', margin: '0 auto' }}>
        {/* Logo bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="28" height="28">
              <path d="M24 4 C24 4 8 10 8 22 L8 38 C8 38 15 44 24 46 C33 44 40 38 40 38 L40 22 C40 10 24 4 24 4Z" fill="var(--accent)" opacity="0.85"/>
              <rect x="21" y="17" width="6" height="16" rx="2" fill="white" opacity="0.95"/>
              <rect x="16" y="22" width="16" height="6" rx="2" fill="white" opacity="0.95"/>
            </svg>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 400, color: 'var(--text-primary)' }}>Health<span style={{ color: 'var(--accent)' }}>Guard</span></span>
          </Link>
          <button onClick={toggleTheme} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div className="card a-fadeup" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '6px' }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Select your role to get started</p>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            {[
              { k: 'patient', label: 'Patient', icon: <User size={20} color={role === 'patient' ? 'var(--accent)' : 'var(--text-muted)'} />, desc: 'Get AI health predictions', color: 'var(--accent)', faint: 'var(--accent-soft)' },
              { k: 'doctor', label: 'Doctor', icon: <Stethoscope size={20} color={role === 'doctor' ? 'var(--teal-500)' : 'var(--text-muted)'} />, desc: 'Join as a specialist', color: 'var(--teal-500)', faint: 'var(--teal-soft)' },
            ].map(r => (
              <button key={r.k} type="button" onClick={() => { setRole(r.k); setShow(false); }} style={{ padding: '16px 12px', borderRadius: '12px', border: '1.5px solid', borderColor: role === r.k ? r.color : 'var(--border)', background: role === r.k ? r.faint : 'var(--bg-raised)', cursor: 'pointer', textAlign: 'center', transition: 'all .18s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {r.icon}
                <div style={{ fontSize: '14px', fontWeight: 700, color: role === r.k ? r.color : 'var(--text-secondary)' }}>{r.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Patient form */}
          {role === 'patient' && (
            <form onSubmit={handlePatient}>
              <div className="form-group"><label className="form-label">Full name</label>{pInp('name', 'Your full name', 'text', { required: true })}</div>
              <div className="form-group"><label className="form-label">Email address</label>{pInp('email', 'you@example.com', 'email', { required: true })}</div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters" value={pf.password} style={{ paddingRight: '44px' }} onChange={e => setPf({ ...pf, password: e.target.value })} required />
                  <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Mobile</label>{pInp('mobile', '+91 9999999999', 'tel')}</div>
                <div className="form-group"><label className="form-label">Age</label>{pInp('age', '25', 'number', { min: 1, max: 120 })}</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={pf.gender} onChange={e => setPf({ ...pf, gender: e.target.value })}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood group</label>
                  <select className="form-select" value={pf.bloodGroup} onChange={e => setPf({ ...pf, bloodGroup: e.target.value })}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={busy} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }}>
                {busy ? <><div className="loading-spinner" style={{ width: '17px', height: '17px', borderWidth: '2px', borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> Creating account…</> : 'Create patient account'}
              </button>
            </form>
          )}

          {/* Doctor form */}
          {role === 'doctor' && (
            <form onSubmit={handleDoctor}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full name</label>{dInp('name', 'Dr. Your Name', 'text', { required: true })}</div>
                <div className="form-group"><label className="form-label">Email</label>{dInp('email', 'dr.name@hospital.com', 'email', { required: true })}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters" value={df.password} style={{ paddingRight: '44px' }} onChange={e => setDf({ ...df, password: e.target.value })} required />
                  <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Mobile</label>{dInp('mobile', '+91 9999999999', 'tel', { required: true })}</div>
                <div className="form-group"><label className="form-label">MCI Number</label>{dInp('mciNumber', 'MCI/State Reg No.', 'text', { required: true })}</div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Specialization</label>
                <select className="form-select" value={df.specialization} onChange={(e) => setDf({ ...df, specialization: e.target.value })} required>
                    <option value="">Select Specialization</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Hepatologist">Hepatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="General Physician">General Physician</option>
                   <option value="Other">Other</option>
                </select>
              </div>
                <div className="form-group"><label className="form-label">Experience (years)</label>{dInp('experience', '5', 'number', { required: true, min: 0 })}</div>
              </div>
              <div className="form-group"><label className="form-label">Hospital / Clinic</label>{dInp('hospitalName', 'Hospital or clinic name', 'text', { required: true })}</div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">City</label>{dInp('city', 'Mumbai', 'text', { required: true })}</div>
                <div className="form-group"><label className="form-label">State</label>{dInp('state', 'Maharashtra', 'text', { required: true })}</div>
              </div>
              <div className="form-group"><label className="form-label">Consultation Fee (Rs.)</label>{dInp('consultationFee', '500', 'number', { required: true, min: 0 })}</div>
              <div className="form-group"><label className="form-label">About (optional)</label><textarea className="form-input" placeholder="Brief professional bio..." value={df.about} onChange={e => setDf({ ...df, about: e.target.value })} style={{ minHeight: '80px', resize: 'vertical' }} /></div>
              <button type="submit" disabled={busy} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }}>
                {busy ? <><div className="loading-spinner" style={{ width: '17px', height: '17px', borderWidth: '2px', borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> Submitting…</> : 'Submit doctor application'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>Your application will be reviewed within 24–48 hours.</p>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '22px', color: 'var(--text-muted)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
