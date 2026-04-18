import React from 'react';
import { Link } from 'react-router-dom';

const ResumeBuilder = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div className="animate-fade-in-up">
        <div style={{ background: 'rgba(139,92,246,0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 30px rgba(139,92,246,0.2)' }}>
          📄
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1.2rem', lineHeight: '1.2' }}>
          Build a <span className="text-gradient">Winning</span> Resume
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          Stand out to recruiters with our AI-powered resume builder. Select from premium templates, get content suggestions, and download as PDF instantly.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/resume-editor" className="btn btn-glow" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '14px' }}>
            Start Building Now
          </Link>
        </div>

        <div style={{ marginTop: '4.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'ATS-Friendly Formats', icon: '🤖' },
            { label: 'Export to PDF', icon: '📥' },
            { label: 'Expert Templates', icon: '✨' }
          ].map(ft => (
            <div key={ft.label} style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{ft.icon}</span>
              <span style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '0.9rem' }}>{ft.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ResumeBuilder;
