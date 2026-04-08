import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Download, Eye, Activity, FileText } from 'lucide-react';

export default function MyReports() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/predictions').then(r => setPredictions(r.data.predictions || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/predictions/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = `HealthGuard_Report_${id}.pdf`; a.click();
      toast.success('Report downloaded');
    } catch (err) { toast.error('Download failed'); }
  };

  const diseaseColor = (t) => t === 'Heart' ? 'var(--rose-500)' : t === 'Liver' ? 'var(--amber-500)' : 'var(--violet-500)';
  const diseaseBg = (t) => t === 'Heart' ? 'var(--rose-soft)' : t === 'Liver' ? 'var(--amber-soft)' : 'var(--violet-soft)';
  const riskCls = (l) => ({ Low: 'badge-success', Moderate: 'badge-warning', High: 'badge-danger', 'Very High': 'badge-danger' }[l] || 'badge-neutral');

  return (
    <div className="page-container bg-bio">
      <Navbar />
      <div className="content-wrapper">
        <div style={{ marginBottom: '28px' }}>
          <h1 className="page-title">My Health Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Download your AI-generated disease prediction reports</p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : predictions.length === 0 ? (
          <div className="empty-state" style={{ border: '1px solid var(--border-subtle)', borderRadius: '16px', background: 'var(--bg-surface)' }}>
            <div className="empty-state-icon"><FileText size={24} color="var(--text-faint)" /></div>
            <p className="empty-state-title">No reports yet</p>
            <p className="empty-state-desc">Run a disease prediction to generate your first health report.</p>
            <Link to="/predict" className="btn btn-primary">Run prediction</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {predictions.map(p => (
              <div key={p._id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: diseaseBg(p.diseaseType), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={20} color={diseaseColor(p.diseaseType)} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '4px' }}>{p.diseaseType} Disease</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span className={`badge ${p.result?.prediction === 'Positive' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '11px' }}>{p.result?.prediction}</span>
                  <span className={`badge ${riskCls(p.result?.riskLevel)}`} style={{ fontSize: '11px' }}>{p.result?.riskLevel} risk</span>
                  {p.result?.confidence && <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{p.result.confidence}% confidence</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/prediction-result/${p._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Eye size={13} /> View
                  </Link>
                  <button onClick={() => handleDownload(p._id)} className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Download size={13} /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
