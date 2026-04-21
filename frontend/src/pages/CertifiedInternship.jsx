import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';


const CertifiedInternship = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/internships');
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
    }
    setCoursesLoading(false);
  };

  const fetchEnrollments = async () => {
    if (user && user.role === 'student') {
      try {
        const res = await api.get('/certified/me');
        if (res.data.data) {
          setEnrollments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching enrollments:', err);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [user]);

  const handleEnroll = async (courseName, duration) => {
    if (!user) {
      alert("Please login first to enroll in the premium internship.");
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      alert("Only students can enroll in the certified internship.");
      return;
    }

    setLoadingCourse(courseName);
    try {
      await api.post('/certified/enroll', { courseName, duration });
      alert(`Registration Successful for ${courseName}! Admin will review your profile shortly.`);
      fetchEnrollments();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to enroll. Please try again.");
    }
    setLoadingCourse(null);
  };

  const handleDownloadCertificate = (enrollment) => {
    if (enrollment.status !== 'Completed') {
      alert(`⏳ You must complete the internship before unlocking your official certificate. Current Status: ${enrollment.status}`);
      return;
    }
    setCertificateData(enrollment);
    setShowCertificate(true);
    setTimeout(() => window.print(), 500);
  };

  return (
    <div style={{ background: '#0a0f1a', minHeight: '100vh', color: '#f1f5f9', paddingBottom: '4rem' }}>
      <style>{`
        .text-gradient { background: linear-gradient(90deg, #3b82f6, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .intern-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr)); gap: 2rem; padding: 0 2rem; max-width: 1400px; margin: 0 auto; }
        .hero-section { position: relative; overflow: hidden; padding: 6rem 1.5rem 4rem; text-align: center; background: radial-gradient(circle at top, rgba(59, 130, 246, 0.1) 0%, transparent 70%); }
        .hero-title { font-size: clamp(2rem, 8vw, 3.5rem); fontWeight: 900; marginBottom: 1.5rem; lineHeight: 1.1; letterSpacing: -1px; }
        .hero-sub { font-size: clamp(1rem, 3vw, 1.15rem); color: #94a3b8; max-width: 800px; margin: 0 auto 3rem; line-height: 1.6; }

        @media (max-width: 768px) {
          .hero-section { padding-top: 4rem; }
          .intern-grid { padding: 0 1rem; gap: 1.5rem; }
          .intern-card { padding: 1.5rem !important; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 2.2rem; }
          .hero-section { padding-bottom: 2rem; }
        }

        /* Certificate Print Layout Fixes */
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }}></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '30px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: '800', fontSize: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.2)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ITM PREMIUM HUB
          </span>
          <h1 className="hero-title">
            Accelerate with <span className="text-gradient">Certified</span> Internships
          </h1>
          <p className="hero-sub">
            Choose from 20+ specialized training modules. Build enterprise-grade projects, receive direct mentorship, and unlock official placement certificates upon completion.
          </p>
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 1, pointerEvents: 'none', maskImage: 'linear-gradient(to bottom, black 40%, transparent)' }}></div>
      </div>

      {/* Courses Grid */}
      {coursesLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading internship programs...</p>
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
          <p>No programs available at the moment.</p>
        </div>
      ) : (
        <div className="intern-grid">
          {courses.map((course, idx) => {
            const enrollment = enrollments.find(e => e.courseName === course.name);
            const isEnrolled = !!enrollment;
            const isCompleted = enrollment?.status === 'Completed';
            const isLoading = loadingCourse === course.name;

            return (
              <div key={idx} className="intern-card" style={{ 
                background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.08)`, 
                borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                boxShadow: isEnrolled ? `0 0 40px ${course.color}11` : '0 10px 40px rgba(0,0,0,0.4)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = `${course.color}44`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '100%', background: isEnrolled ? course.color : 'transparent' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.2rem' }}>
                    {course.icon}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {course.isNew && <span style={{ background: '#f97316', color: '#fff', fontSize: '0.65rem', fontWeight: '900', padding: '0.25rem 0.7rem', borderRadius: '20px', letterSpacing: '0.5px' }}>NEW</span>}
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', padding: '0.3rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {course.level.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem', color: '#fff', lineHeight: '1.2' }}>{course.name}</h3>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
                  {[
                    `Flexible duration (${course.duration || '4-8 weeks'})`,
                    'Industry recognized projects',
                    'Direct mentor guidance',
                    'Final certification'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                       <span style={{ color: course.color, fontSize: '1.1rem' }}>•</span> {feat}
                    </div>
                  ))}
                </div>

                {isEnrolled ? (
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '800' }}>STATUS</span>
                      <span style={{ color: isCompleted ? '#10b981' : '#eab308', fontWeight: '900', fontSize: '0.85rem' }}>
                        {enrollment.status.toUpperCase()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDownloadCertificate(enrollment)}
                      className={!isCompleted ? 'no-print' : ''}
                      style={{ background: isCompleted ? course.color : 'rgba(255,255,255,0.03)', color: isCompleted ? '#fff' : '#475569', border: 'none', padding: '1.1rem', borderRadius: '14px', fontWeight: '900', cursor: isCompleted ? 'pointer' : 'not-allowed', fontSize: '0.9rem', boxShadow: isCompleted ? `0 10px 20px ${course.color}33` : 'none' }}>
                      {isCompleted ? '🎓 Get your Certificate' : '🔒 Content Locked'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <select id={`duration-${idx}`} style={{ width: '100%', padding: '0.9rem', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', outline: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                      <option value="4 Weeks">4 Weeks Program</option>
                      <option value="8 Weeks">8 Weeks Program</option>
                    </select>
                    <button 
                      onClick={() => handleEnroll(course.name, document.getElementById(`duration-${idx}`).value)}
                      disabled={isLoading}
                      style={{ background: course.color, color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '0.95rem', boxShadow: `0 10px 20px ${course.color}33` }}>
                      {isLoading ? 'Processing...' : 'Enroll Today'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && certificateData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
           <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
              <button 
                onClick={() => setShowCertificate(false)} 
                className="no-print" 
                style={{ position: 'sticky', top: 0, float: 'right', background: '#ef4444', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', zIndex: 11 }}>
                ✕ Close Preview
              </button>
              
              {/* Actual Certificate Area */}
              <div className="print-certificate" style={{ border: '15px solid #0f172a', padding: '40px', background: '#fff', color: '#0f172a', textAlign: 'center', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#3b82f6', letterSpacing: '4px', fontWeight: '900', marginBottom: '1rem' }}>OFFICIAL RECOGNITION</h4>
                <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', fontFamily: 'serif', color: '#1e293b' }}>CERTIFICATE</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>OF INTERNSHIP COMPLETION</p>
                
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#64748b' }}>presented to</p>
                <h2 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '1rem 0', color: '#0f172a', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', display: 'inline-block', padding: '0 2rem' }}>{user?.name}</h2>
                
                <p style={{ fontSize: '1.1rem', marginTop: '2rem', lineHeight: '1.6' }}>
                  for successfully mastering the <b>{certificateData.duration}</b> virtual internship program in<br/>
                  <span style={{ fontSize: '1.8rem', color: '#3b82f6', fontWeight: '900', display: 'block', marginTop: '0.5rem' }}>{certificateData.courseName}</span>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4rem', padding: '0 3rem' }}>
                  <div style={{ textAlign: 'left' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VERIFY-${certificateData._id}`} 
                      alt="QR" style={{ width: '80px', height: '80px', opacity: 0.8 }} 
                    />
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>ID: {certificateData._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #0f172a', width: '180px', marginBottom: '0.5rem' }}></div>
                    <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>Academic Director</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #0f172a', width: '180px', marginBottom: '0.5rem' }}></div>
                    <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CertifiedInternship;
