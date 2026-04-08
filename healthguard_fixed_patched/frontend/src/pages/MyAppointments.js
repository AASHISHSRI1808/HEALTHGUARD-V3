import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Phone, MapPin, XCircle } from 'lucide-react';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    api.get('/appointments').then(r => setAppointments(r.data.appointments || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try { await api.delete(`/appointments/${id}/cancel`); toast.success('Appointment cancelled'); setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a)); }
    catch (err) { toast.error('Failed to cancel'); }
  };

  const filtered = activeTab === 'all' ? appointments : appointments.filter(a => a.status === activeTab);
  const statusCls = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger' };

  return (
    <div className="page-container bg-bio">
      <Navbar />
      <div className="content-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">My Appointments</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage your doctor consultations</p>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={24} color="var(--text-faint)" /></div>
              <p className="empty-state-title">No appointments found</p>
              <p className="empty-state-desc">Book a consultation with a specialist doctor.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(a => (
                <div key={a._id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: '18px', color: 'var(--teal-500)', flexShrink: 0 }}>
                        {a.doctorId?.name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>Dr. {a.doctorId?.name || '—'}</span>
                          <span className={`badge ${statusCls[a.status] || 'badge-neutral'}`} style={{ fontSize: '11px' }}>{a.status}</span>
                        </div>
                        {a.doctorId?.specialization && <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>{a.doctorId.specialization}</div>}
                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} />{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{a.timeSlot}</span>
                          {a.doctorId?.city && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{a.doctorId.hospitalName}, {a.doctorId.city}</span>}
                        </div>
                        {a.amount && <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>Paid: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{a.amount}</span></div>}
                      </div>
                    </div>
                    {a.status === 'Pending' && (
                      <button onClick={() => handleCancel(a._id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <XCircle size={13} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
