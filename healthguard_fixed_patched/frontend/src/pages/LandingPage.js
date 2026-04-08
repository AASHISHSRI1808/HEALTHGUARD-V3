import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Activity, Shield, FileText, Calendar, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCount(c => c < 95 ? c + 1 : c), 18);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: '64px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(45,90,61,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(27,107,122,0.05) 0%, transparent 55%)' }} />

        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '60px', alignItems: 'center' }}>

            {/* Left — text */}
            <div>
              <div className="animate-fadeInUp" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px', boxShadow: 'var(--shadow-sm)' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ML-powered disease prediction, free to use</span>
              </div>

              <h1 className="animate-fadeInUp stagger-1" style={{
                fontFamily: 'Fraunces, serif', fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400, lineHeight: 1.1, marginBottom: '20px',
                color: 'var(--text-primary)', letterSpacing: '-1px'
              }}>
                Know your health<br />
                <span className="gradient-text" style={{ fontStyle: 'italic' }}>before it's too late.</span>
              </h1>

              <p className="animate-fadeInUp stagger-2" style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '36px', lineHeight: 1.75, fontWeight: 400 }}>
                Advanced machine learning models detect risk for heart disease, liver conditions, and Parkinson's — in seconds. Get a full PDF report and connect with a specialist.
              </p>

              <div className="animate-fadeInUp stagger-3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start free analysis <ArrowRight size={16} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Join as a doctor
                </Link>
              </div>

              {/* Mini stats */}
              <div className="animate-fadeInUp stagger-4" style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                {[
                  { val: '3', label: 'ML Models' },
                  { val: `${count}%+`, label: 'Accuracy' },
                  { val: 'Instant', label: 'PDF reports' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image + floating card */}
            <div className="animate-fadeInUp stagger-2" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-raised)' }}>
                <img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhbHRoY2FyZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Doctor reviewing medical data"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Overlay gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,24,0.3) 0%, transparent 50%)' }} />
              </div>

            </div></div></div>

        {/* Responsive: stack on mobile */}
        <style>{`
          @media (max-width: 768px) {
            section:first-of-type > div > div { grid-template-columns: 1fr !important; }
            section:first-of-type > div > div > div:last-child { display: none; }
          }
        `}</style>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(16px, 4vw, 40px)', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div className="section-label">How it works</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Three steps to your health report
            </h2>
          </div>
          <div className="grid-3">
            {[
              {
                n: '01', icon: <FileText size={22} color="var(--blue-500)" />,
                title: 'Enter your clinical data',
                desc: 'Fill in your health parameters — blood pressure, cholesterol, liver enzymes, or vocal biomarkers. Guided prompts for each condition.',
                color: 'var(--blue-500)', bg: 'var(--blue-soft)'
              },
              {
                n: '02', icon: <Activity size={22} color="var(--accent)" />,
                title: 'AI analysis runs instantly',
                desc: 'Trained ML models — Random Forest, XGBoost, SVM — process your data and generate a precise disease risk score in real time.',
                color: 'var(--accent)', bg: 'var(--accent-soft)'
              },
              {
                n: '03', icon: <Calendar size={22} color="var(--violet-500)" />,
                title: 'Get your report and act',
                desc: 'Download a detailed PDF report with risk scores and recommendations. Book a specialist consultation directly from the platform.',
                color: 'var(--violet-500)', bg: 'var(--violet-soft)'
              },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                  borderRadius: '18px', padding: '28px', height: '100%',
                  transition: 'all 0.25s', cursor: 'default'
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.boxShadow = `0 12px 40px ${s.bg.replace(')', ', 0.3)').replace('rgba', 'rgba')}`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '52px', fontWeight: 300, color: s.bg, position: 'absolute', top: '12px', right: '20px', lineHeight: 1, userSelect: 'none' }}>{s.n}</div>
                  <div style={{ width: '48px', height: '48px', background: s.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disease models ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(16px, 4vw, 40px)', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '56px', alignItems: 'center' }}>
            <div>
              <div className="section-label">ML models</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.4px' }}>
                Three conditions. Three specialized models.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.75 }}>
                Each ML model is trained on clinical datasets and optimized independently for its disease type — giving you results you can trust.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'Heart Disease', model: 'Random Forest', params: 13, acc: '93%', color: 'var(--rose-500)', soft: 'var(--rose-soft)', desc: 'Blood pressure, cholesterol, ECG patterns, chest pain — cardiovascular risk profiling.' },
                { name: 'Liver Disease', model: 'XGBoost', params: 10, acc: '91%', color: 'var(--amber-500)', soft: 'var(--amber-soft)', desc: 'Bilirubin, ALT, AST and other hepatic biomarkers for liver function assessment.' },
                { name: "Parkinson's Disease", model: 'SVM', params: 22, acc: '95%', color: 'var(--violet-500)', soft: 'var(--violet-soft)', desc: '22 vocal biomarker measurements analyzed with high-precision support vector machines.' },
              ].map((d, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: d.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={20} color={d.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 400, color: 'var(--text-primary)' }}>{d.name}</span>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{d.model}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '100px', background: d.soft, color: d.color, fontSize: '11px', fontWeight: 700 }}>{d.acc}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { section:nth-of-type(3) > div > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(16px, 4vw, 40px)', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label">Platform features</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.4px' }}>
            Everything you need for proactive care
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '48px' }}>From AI predictions to doctor booking — one platform, end to end.</p>

          <div className="grid-3" style={{ textAlign: 'left' }}>
            {[
              { icon: <Activity size={20} color="var(--accent)" />, bg: 'var(--accent-soft)', title: 'AI disease prediction', desc: 'Three ML models covering heart, liver, and Parkinson\'s conditions.' },
              { icon: <FileText size={20} color="var(--blue-500)" />, bg: 'var(--blue-soft)', title: 'Instant PDF reports', desc: 'Download detailed health reports the moment your analysis is complete.' },
              { icon: <Users size={20} color="var(--teal-500)" />, bg: 'var(--teal-soft)', title: 'Doctor network', desc: 'Browse verified specialists and book consultations online.' },
              { icon: <Calendar size={20} color="var(--violet-500)" />, bg: 'var(--violet-soft)', title: 'Appointment booking', desc: 'Secure appointments with integrated mock payment flow.' },
              { icon: <Zap size={20} color="var(--amber-500)" />, bg: 'var(--amber-soft)', title: 'Email confirmations', desc: 'Automatic confirmation emails for every booking and report.' },
              { icon: <Shield size={20} color="var(--rose-500)" />, bg: 'var(--rose-soft)', title: 'Secure by design', desc: 'JWT authentication and encrypted data throughout.' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  {f.icon}
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '6px' }}>{f.title}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial / Image break ──────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(16px, 4vw, 40px)', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', aspectRatio: '21/7', background: 'var(--bg-raised)' }}>
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1400&auto=format&fit=crop&q=80"
              alt="Medical team working"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.parentElement.style.display = 'none'; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,24,0.75) 0%, rgba(26,26,24,0.2) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: 'clamp(24px, 5vw, 60px)' }}>
              <div style={{ maxWidth: '420px' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: '20px' }}>
                  "Early detection changes everything. Most diseases are treatable when caught in time."
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>HealthGuard AI Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(16px, 4vw, 40px)', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Shield size={24} color="white" />
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.4px' }}>
            Take control of your health today.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '36px', lineHeight: 1.7 }}>
            Free AI-powered risk analysis. Detailed PDF reports. Connect with doctors who care.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get started — it's free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px clamp(16px, 4vw, 40px)', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="24" height="24">
              <path d="M24 4 C24 4 8 10 8 22 L8 38 C8 38 15 44 24 46 C33 44 40 38 40 38 L40 22 C40 10 24 4 24 4Z" fill="var(--accent)" opacity="0.8"/>
              <rect x="21" y="17" width="6" height="16" rx="2" fill="white" opacity="0.9"/>
              <rect x="16" y="22" width="16" height="6" rx="2" fill="white" opacity="0.9"/>
            </svg>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 400, color: 'var(--text-primary)' }}>
              Health<span style={{ color: 'var(--accent)' }}>Guard</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-faint)', fontSize: '13px' }}>© 2026 HealthGuard-Built By Ashish Srivastava & Ashutosh Maurya· AI Disease Prediction</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseOver={e => e.target.style.color = 'var(--accent)'}
                onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
