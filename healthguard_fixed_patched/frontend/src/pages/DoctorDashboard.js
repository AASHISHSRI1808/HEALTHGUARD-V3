import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Download, Calendar, Clock, User, Phone, Activity, CheckCircle, Brain, Stethoscope, FileText, Upload } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, statsRes] = await Promise.all([
        api.get('/doctors/dashboard/appointments'),
        api.get('/doctors/dashboard/stats')
      ]);
      setAppointments(apptRes.data.appointments || []);
      setDoctorProfile(apptRes.data.doctorProfile);
      setStats(statsRes.data.stats || {});
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/doctors/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchData();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleDownloadPDF = async (predictionId, reportId) => {
    try {
      const res = await api.get(`/predictions/${predictionId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `HealthGuard_${reportId || 'Report'}.pdf`; a.click();
      toast.success('Report downloaded');
    } catch (err) { toast.error('Download failed'); }
  };

  const filtered = activeTab === 'all' ? appointments : appointments.filter(a => a.status === activeTab);

  const statusConfig = {
    Pending:   { cls: 'badge-warning' },
    Confirmed: { cls: 'badge-success' },
    Completed: { cls: 'badge-info' },
    Cancelled: { cls: 'badge-danger' },
  };

  const riskColors = { Low: 'var(--accent)', Moderate: 'var(--amber-500)', High: 'var(--rose-500)', 'Very High': 'var(--rose-500)' };

  const tabs = [
    { key: 'all',       label: 'All', },
    { key: 'Pending',   label: 'Pending',},
    { key: 'Confirmed', label: 'Confirmed', },
    { key: 'Completed', label: 'Completed', },
    { key: 'Cancelled', label: 'Cancelled', },
  ];

  return (
    <div className="page-container bg-bio">
      <Navbar />
      <div className="content-wrapper">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--teal-soft)', border: '1px solid rgba(27,107,122,0.2)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 400, color: 'var(--teal-500)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: '4px' }}>Dr. {user?.name?.toUpperCase()}</h1>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {doctorProfile && (
                  <>
                    <span className="badge badge-info">{doctorProfile.specialization}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{doctorProfile.hospitalName}, {doctorProfile.city}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/doctor-predict')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px' }}>
            <Brain size={16} /> New Patient Prediction
          </button>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {[
            { icon: <Calendar size={20} color="var(--blue-500)" />,   label: 'Total Appointments', val: stats.total     || 0, bg: 'var(--blue-soft)' },
            { icon: <CheckCircle size={20} color="var(--accent)" />,  label: 'Confirmed',           val: stats.confirmed || 0, bg: 'var(--accent-soft)' },
            { icon: <Clock size={20} color="var(--amber-500)" />,     label: 'Pending',             val: stats.pending   || 0, bg: 'var(--amber-soft)' },
            { icon: <Activity size={20} color="var(--violet-500)" />, label: 'Completed',           val: stats.completed || 0, bg: 'var(--violet-soft)' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-fadeInUp stagger-${i + 1}`}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Prediction Action Cards */}
        <div className="grid-2" style={{ marginBottom: '16px' }}>
          <div
            onClick={() => navigate('/symptom-predict')}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--teal-soft)', border: '1px solid rgba(27,107,122,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Stethoscope size={24} color="var(--teal-500)" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Disease Risk Analysis</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Symptoms → Recommended Tests → Upload Reports → AI Risk Assessment with charts</div>
            </div>
          </div>

          <div
            onClick={() => navigate('/doctor-predict')}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--blue-soft)', border: '1px solid rgba(37,99,168,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Brain size={24} color="var(--blue-500)" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Clinical ML Prediction</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Enter patient lab values → Instant ML diagnosis (Heart, Liver, Parkinson's)</div>
            </div>
          </div>
        </div>

        {/* Patient Report Upload Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(27,107,122,0.10) 0%, rgba(45,90,61,0.08) 100%)', border: '1px solid rgba(27,107,122,0.22)', borderRadius: '16px', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal-500) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={24} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Patient Report Upload &amp; AI Analysis</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Upload patient lab reports for AI-powered analysis, personalised risk assessment, and recommendations.</div>
            </div>
          </div>
          <button onClick={() => navigate('/symptom-predict')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', flexShrink: 0 }}>
            <Upload size={15} /> Upload Patient Report
          </button>
        </div>

        {/* Appointments */}
        <div className="card">
          <div className="tabs">
            {tabs.map(t => {
              const count = t.key === 'all' ? appointments.length : appointments.filter(a => a.status === t.key).length;
              return (
                <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                  {t.emoji && <span style={{ marginRight: '5px' }}>{t.emoji}</span>}
                  {t.label} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={24} color="var(--text-faint)" /></div>
              <p className="empty-state-title">No appointments found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(appt => {
                const sc = statusConfig[appt.status] || { cls: 'badge-neutral' };
                return (
                  <div key={appt._id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px', transition: 'all 0.18s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={18} color="var(--text-muted)" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{appt.patientId?.name || '—'}</span>
                            <span className={`badge ${sc.cls}`} style={{ fontSize: '11px' }}>{appt.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} />
                              {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> {appt.timeSlot}
                            </span>
                            {appt.patientId?.mobile && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={12} /> {appt.patientId.mobile}
                              </span>
                            )}
                          </div>
                          {appt.predictionId && (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{appt.predictionId.diseaseType} · {appt.predictionId.result?.prediction}</span>
                              {appt.predictionId.result?.riskLevel && (
                                <span style={{ fontSize: '11px', fontWeight: 600, color: riskColors[appt.predictionId.result.riskLevel] }}>
                                  {appt.predictionId.result.riskLevel} risk
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {appt.predictionId && (
                          <button onClick={() => handleDownloadPDF(appt.predictionId._id, appt._id)} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Download size={13} /> Report
                          </button>
                        )}
                        {appt.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(appt._id, 'Confirmed')} className="btn btn-primary btn-sm">Confirm</button>
                            <button onClick={() => handleStatusUpdate(appt._id, 'Cancelled')} className="btn btn-danger btn-sm">Cancel</button>
                          </>
                        )}
                        {appt.status === 'Confirmed' && (
                          <>
                            <button onClick={() => handleStatusUpdate(appt._id, 'Completed')} className="btn btn-secondary btn-sm">Mark complete</button>
                            <button onClick={() => handleStatusUpdate(appt._id, 'Cancelled')} className="btn btn-danger btn-sm">Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
