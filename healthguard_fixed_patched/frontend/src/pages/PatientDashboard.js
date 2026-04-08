import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { ArrowRight, Activity, FileText, Calendar, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/predictions'), api.get('/appointments')])
      .then(([p, a]) => { setPredictions(p.data.predictions || []); setAppointments(a.data.appointments || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const riskBadge = (l) => ({
    Low: { bg: 'var(--accent-soft)', color: 'var(--accent)', cls: 'badge-success' },
    Moderate: { bg: 'var(--amber-soft)', color: 'var(--amber-500)', cls: 'badge-warning' },
    High: { bg: 'var(--rose-soft)', color: 'var(--rose-500)', cls: 'badge-danger' },
    'Very High': { bg: 'var(--rose-soft)', color: 'var(--rose-500)', cls: 'badge-danger' },
  }[l] || { bg: 'var(--bg-raised)', color: 'var(--text-muted)', cls: 'badge-neutral' });

  const tips = [
    'Aim for at least 8 glasses of water daily to support kidney function and circulation.',
    '30 minutes of moderate movement five days a week reduces cardiovascular risk significantly.',
    'A diet rich in leafy greens and legumes lowers liver disease risk over time.',
    'Sleep between 7 and 9 hours each night — cognitive health depends on it.',
    'If you smoke, quitting even now cuts heart disease risk by nearly half within a year.',
  ];
  const tip = tips[new Date().getDay() % tips.length];

  const diseaseIcon = (t) => t === 'Heart' ? '♥' : t === 'Liver' ? '◉' : '◆';
  const diseaseColor = (t) => t === 'Heart' ? 'var(--rose-500)' : t === 'Liver' ? 'var(--amber-500)' : 'var(--violet-500)';
  const diseaseBg = (t) => t === 'Heart' ? 'var(--rose-soft)' : t === 'Liver' ? 'var(--amber-soft)' : 'var(--violet-soft)';

  return (
    <div className="page-container bg-bio">
      <Navbar />
      <div className="content-wrapper">

        {/* Welcome */}
        <div className="animate-fadeInUp" style={{ background: 'var(--gradient-brand)', borderRadius: '20px', padding: 'clamp(20px, 4vw, 32px)', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 12px 40px var(--accent-glow)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: 'white', fontFamily: 'Fraunces, serif', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500, marginBottom: '3px', letterSpacing: '0.03em' }}>{greet}</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 400, color: 'white', marginBottom: '2px' }}>{user?.name?.split(' ')[0]}</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Here's your health overview</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', zIndex: 1, flexWrap: 'wrap' }}>
            <Link to="/symptom-predict" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
              Check symptoms
            </Link>
            <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', background: 'white', color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform = ''}>
              Find a doctor
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {[
            { icon: <Activity size={20} color="var(--blue-500)" />, label: 'Predictions', val: predictions.length, bg: 'var(--blue-soft)', color: 'var(--blue-500)' },
            { icon: <FileText size={20} color="var(--accent)" />, label: 'Reports', val: predictions.length, bg: 'var(--accent-soft)', color: 'var(--accent)' },
            { icon: <Calendar size={20} color="var(--violet-500)" />, label: 'Appointments', val: appointments.length, bg: 'var(--violet-soft)', color: 'var(--violet-500)' },
            { icon: <CheckCircle size={20} color="var(--teal-500)" />, label: 'Confirmed', val: appointments.filter(a => a.status === 'Confirmed').length, bg: 'var(--teal-soft)', color: 'var(--teal-500)' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-fadeInUp stagger-${i + 2}`}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Health tip */}
        <div className="animate-fadeInUp stagger-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 22px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
            <Activity size={16} color="var(--accent)" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Daily health tip</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{tip}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          {[
            { to: '/symptom-predict', icon: <Activity size={22} color="var(--blue-500)" />, title: 'Disease Risk Analysis', desc: 'Answer symptom questions for an AI-based risk assessment', bg: 'var(--blue-soft)', color: 'var(--blue-500)' },
            { to: '/doctors', icon: <Calendar size={22} color="var(--accent)" />, title: 'Find Specialists', desc: 'Browse doctors by specialty and book a consultation', bg: 'var(--accent-soft)', color: 'var(--accent)' },
            { to: '/reports', icon: <FileText size={22} color="var(--violet-500)" />, title: 'My Health Reports', desc: 'Download your AI-generated PDF reports anytime', bg: 'var(--violet-soft)', color: 'var(--violet-500)' },
          ].map((a, i) => (
            <Link key={i} to={a.to} style={{ textDecoration: 'none' }} className={`animate-fadeInUp stagger-${i + 4}`}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.25s', height: '100%' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                <div style={{ width: '50px', height: '50px', background: a.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '4px' }}>{a.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>{a.desc}</p>
                </div>
                <ArrowRight size={16} color="var(--text-faint)" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid-2">
          {/* Recent Predictions */}
          <div className="card animate-fadeInUp stagger-2">
            <div className="card-header">
              <h2 className="card-title">Recent predictions</h2>
              <Link to="/reports" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
            </div>
            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /></div>
            ) : predictions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Activity size={24} color="var(--text-faint)" /></div>
                <p className="empty-state-title">No predictions yet</p>
                <p className="empty-state-desc">Run your first ML analysis to see results here.</p>
                <Link to="/predict" className="btn btn-primary btn-sm">Run prediction</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {predictions.slice(0, 5).map(p => (
                  <Link key={p._id} to={`/prediction-result/${p._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-raised)', borderRadius: '12px', border: '1px solid var(--border-subtle)', transition: 'all 0.18s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: diseaseBg(p.diseaseType), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: diseaseColor(p.diseaseType), fontWeight: 700, flexShrink: 0 }}>
                        {diseaseIcon(p.diseaseType)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.diseaseType} Disease</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span className={`badge ${p.result?.prediction === 'Positive' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                          {p.result?.prediction}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: riskBadge(p.result?.riskLevel).color }}>
                          {p.result?.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="card animate-fadeInUp stagger-3">
            <div className="card-header">
              <h2 className="card-title">Upcoming appointments</h2>
              <Link to="/appointments" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
            </div>
            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /></div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Calendar size={24} color="var(--text-faint)" /></div>
                <p className="empty-state-title">No appointments yet</p>
                <p className="empty-state-desc">Book a consultation with a specialist doctor.</p>
                <Link to="/doctors" className="btn btn-primary btn-sm">Find a doctor</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {appointments.slice(0, 5).map(a => {
                  const statusCls = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger' }[a.status] || 'badge-neutral';
                  return (
                    <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-raised)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Calendar size={16} color="var(--accent)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Dr. {a.doctorId?.name || '—'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'} · {a.timeSlot}
                        </div>
                      </div>
                      <span className={`badge ${statusCls}`} style={{ fontSize: '11px', flexShrink: 0 }}>{a.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
