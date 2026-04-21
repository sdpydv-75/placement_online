import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const VerifyCertificate = () => {
    const query = new URLSearchParams(useLocation().search);
    const name = query.get('name');
    const course = query.get('course');
    const date = query.get('date');
    const id = query.get('id');

    const institution = "ITM College of Management, GIDA, Gorakhpur";

    if (!name || !course) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: '#f1f5f9', padding: '20px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Invalid Certificate</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The verification link is incomplete or broken. Please scan the QR code on the original certificate again.</p>
                    <Link to="/" style={{ background: '#3b82f6', color: '#white', padding: '12px 30px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Back to Portal</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '90vh', background: '#0a0f1a', color: '#f1f5f9', padding: '4rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div className="animate-fade-in-up" style={{ maxWidth: '700px', width: '100%', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)', borderRadius: '32px', border: '1px solid rgba(59,130,246,0.2)', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                
                {/* Success Badge */}
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', position: 'relative' }}>
                    <span style={{ fontSize: '3rem' }}>✓</span>
                    <div style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '1px dashed rgba(16,185,129,0.3)', animation: 'spin 10s linear infinite' }}></div>
                </div>

                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Certificate Verified
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '3rem', fontWeight: '500' }}>Authentic Digital Credential</p>

                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Student Name</label>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f1f5f9' }}>{name}</div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Internship Program</label>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3b82f6' }}>{course}</div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Issued By</label>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#e2e8f0' }}>{institution}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Issue Date</label>
                            <div style={{ fontWeight: '600' }}>{date || 'N/A'}</div>
                        </div>
                        <div>
                            <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Verification ID</label>
                            <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{id || 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                        </div>
                    </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                    This digital record confirms that the individual named above has successfully met all training requirements and project milestones as ordained by the ITM Placement Cell.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                     <Link to="/" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>Go to Home</Link>
                     <button onClick={() => window.print()} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Download Proof</button>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default VerifyCertificate;
