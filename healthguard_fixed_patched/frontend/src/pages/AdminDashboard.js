import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Users, Activity, Shield, Clock, Calendar, User } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, doctorsRes, usersRes, predsRes, apptsRes] = await Promise.all([
        api.get('/admin/dashboard'), api.get('/admin/doctors'),
        api.get('/admin/users'), api.get('/admin/predictions'),
        api.get('/appointments')
      ]);
      setStats(statsRes.data.stats || {});
      setDoctors(doctorsRes.data.doctors || []);
      setUsers(usersRes.data.users || []);
      setPredictions(predsRes.data.predictions || []);
      setAppointments(apptsRes.data.appointments || []);
    } catch (err) { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try { await api.put(`/admin/doctors/${id}/approve`); toast.success('Doctor approved. Approval email sent.'); fetchData(); }
    catch (err) { toast.error('Approval failed'); }
  };

  const handleReject = async (id) => {
    try { await api.put(`/admin/doctors/${id}/reject`, { reason: rejectReason }); toast.success('Doctor rejected.'); setRejectingId(null); setRejectReason(''); fetchData(); }
    catch (err) { toast.error('Rejection failed'); }
  };

  const pendingDoctors = doctors.filter(d => d.status === 'PENDING');
  const activeDoctors = doctors.filter(d => d.status === 'ACTIVE');
  const rejectedDoctors = doctors.filter(d => d.status === 'REJECTED');

  const TABS = [
    { key: 'pending', label: 'Pending Approval', count: pendingDoctors.length },
    { key: 'active', label: 'Active Doctors', count: activeDoctors.length },
    { key: 'rejected', label: 'Rejected', count: rejectedDoctors.length },
    { key: 'users', label: 'Patients', count: users.length },
    { key: 'predictions', label: 'Predictions', count: predictions.length },
    { key: 'appointments', label: 'Appointments', count: appointments.length },
  ];

  const currentDoctors = activeTab === 'pending' ? pendingDoctors : activeTab === 'active' ? activeDoctors : rejectedDoctors;
  const riskColors = { Low: 'var(--accent)', Moderate: 'var(--amber-500)', High: 'var(--rose-500)', 'Very High': 'var(--rose-500)' };
  const apptStatusCls = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger' };

  return (
    <div className="page-container bg-bio">
      <Navbar />
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="var(--violet-500)" />
            </div>
            <h1 className="page-title">Admin Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginLeft: '62px' }}>Manage doctors, patients, and platform data</p>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {[
            { icon: <Shield size={20} color="var(--violet-500)" />, label: 'Total Doctors', val: stats.totalDoctors || 0, bg: 'var(--violet-soft)' },
            { icon: <Users size={20} color="var(--blue-500)" />, label: 'Total Patients', val: stats.totalUsers || 0, bg: 'var(--blue-soft)' },
            { icon: <Activity size={20} color="var(--accent)" />, label: 'Predictions', val: stats.totalPredictions || 0, bg: 'var(--accent-soft)' },
            { icon: <Calendar size={20} color="var(--teal-500)" />, label: 'Appointments', val: stats.totalAppointments || 0, bg: 'var(--teal-soft)' },
            { icon: <Clock size={20} color="var(--amber-500)" />, label: 'Pending Review', val: pendingDoctors.length, bg: 'var(--amber-soft)' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-fadeInUp stagger-${i + 2}`}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="card">
          <div className="tabs" style={{ overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label} <span style={{ marginLeft: '4px', opacity: 0.7 }}>({t.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /></div>
          ) : (
            <>
              {/* Doctors tabs */}
              {['pending', 'active', 'rejected'].includes(activeTab) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentDoctors.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><Users size={24} color="var(--text-faint)" /></div>
                      <p className="empty-state-title">No doctors here</p>
                    </div>
                  ) : currentDoctors.map(doc => (
                    <div key={doc._id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: '18px', color: 'var(--teal-500)', flexShrink: 0 }}>
                            {doc.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>Dr. {doc.name}</span>
                              <span className={`badge ${doc.status === 'ACTIVE' ? 'badge-success' : doc.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '11px' }}>{doc.status}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{doc.specialization} · {doc.hospitalName}, {doc.city}, {doc.state}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{doc.email} · {doc.mobile} · {doc.experience} yrs exp · MCI: {doc.mciNumber}</div>
                            <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginTop: '4px' }}>₹{doc.consultationFee} consultation fee</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {activeTab === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(doc._id)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <CheckCircle size={13} /> Approve
                              </button>
                              {rejectingId === doc._id ? (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <input type="text" className="form-input" placeholder="Reason for rejection" value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ width: '200px', padding: '6px 10px', fontSize: '13px' }} />
                                  <button onClick={() => handleReject(doc._id)} className="btn btn-danger btn-sm">Confirm</button>
                                  <button onClick={() => setRejectingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                                </div>
                              ) : (
                                <button onClick={() => setRejectingId(doc._id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <XCircle size={13} /> Reject
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Patients */}
              {activeTab === 'users' && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th><th>Email</th><th>Mobile</th><th>Age</th><th>Gender</th><th>Blood Group</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No patients registered</td></tr>
                      ) : users.map(u => (
                        <tr key={u._id}>
                          <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span></td>
                          <td>{u.email}</td>
                          <td>{u.mobile || '—'}</td>
                          <td>{u.age || '—'}</td>
                          <td>{u.gender || '—'}</td>
                          <td><span className="badge badge-neutral" style={{ fontSize: '11px' }}>{u.bloodGroup || '—'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Predictions */}
              {activeTab === 'predictions' && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th><th>Disease</th><th>Prediction</th><th>Risk Level</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No predictions yet</td></tr>
                      ) : predictions.map(p => (
                        <tr key={p._id}>
                          <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.userId?.name || '—'}</span></td>
                          <td>{p.diseaseType}</td>
                          <td>
                            <span className={`badge ${p.result?.prediction === 'Positive' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '11px' }}>
                              {p.result?.prediction || '—'}
                            </span>
                          </td>
                          <td><span style={{ fontWeight: 600, fontSize: '13px', color: riskColors[p.result?.riskLevel] }}>{p.result?.riskLevel || '—'}</span></td>
                          <td>{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Appointments */}
              {activeTab === 'appointments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {appointments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><Calendar size={24} color="var(--text-faint)" /></div>
                      <p className="empty-state-title">No appointments booked yet</p>
                    </div>
                  ) : appointments.map(a => {
                    const sc = apptStatusCls[a.status] || 'badge-neutral';
                    return (
                      <div key={a._id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <User size={17} color="var(--accent)" />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{a.patientId?.name || '—'}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>→</span>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--teal-500)' }}>Dr. {a.doctorId?.name || '—'}</span>
                                <span className={`badge ${sc}`} style={{ fontSize: '11px' }}>{a.status}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                <span>{a.doctorId?.specialization || '—'}</span>
                                <span>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                                <span>{a.timeSlot}</span>
                                {a.amount && <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{a.amount}</span>}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                            <div>{a.patientId?.email || '—'}</div>
                            <div style={{ marginTop: '2px' }}>Payment: <span style={{ fontWeight: 600, color: a.paymentStatus === 'Paid' ? 'var(--accent)' : 'var(--amber-500)' }}>{a.paymentStatus}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
