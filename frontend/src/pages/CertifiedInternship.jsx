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
      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '5rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, transparent 60%)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }}></div>
        
        <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '30px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
            🔥 ITM PREMIUM HUB
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.2' }}>
             Accelerate with <span className="text-gradient">Certified</span> Internships
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Choose from 20+ specialized admin-managed training modules. Build enterprise-grade projects, receive direct mentorship, and unlock official placement certificates upon completion.
          </p>
        </div>

        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none', maskImage: 'linear-gradient(to bottom, black 40%, transparent)' }}></div>
      </div>

      {/* Courses Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {coursesLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading internship programs...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
            <p>No internship programs available yet. Please check back soon.</p>
          </div>
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {courses.map((course, idx) => {
            const enrollment = enrollments.find(e => e.courseName === course.name);
            const isEnrolled = !!enrollment;
            const isCompleted = enrollment?.status === 'Completed';
            const isLoading = loadingCourse === course.name;

            return (
              <div key={idx} className="card" style={{ 
                background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: `1px solid rgba(255,255,255,0.08)`, 
                borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                boxShadow: isEnrolled ? `0 0 20px ${course.color}22` : '0 10px 30px rgba(0,0,0,0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = `${course.color}55`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '100%', background: isEnrolled ? course.color : 'transparent' }}></div>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}>
                    {course.icon}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {course.isNew && <span style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)', color: '#fff', fontSize: '0.7rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '20px', letterSpacing: '1px' }}>NEW ⚡</span>}
                    <span style={{ background: course.level === 'Beginner' ? 'rgba(16,185,129,0.1)' : course.level === 'Intermediate' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', color: course.level === 'Beginner' ? '#10b981' : course.level === 'Intermediate' ? '#3b82f6' : '#8b5cf6', fontSize: '0.75rem', fontWeight: '700', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#f1f5f9', lineHeight: '1.3' }}>{course.name}</h3>

                {/* Features List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                     <span style={{ color: course.color }}>✦</span> Choose 4 Weeks or 8 Weeks
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                     <span style={{ color: course.color }}>✦</span> Includes Live Corporate Projects
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                     <span style={{ color: course.color }}>✦</span> 1-on-1 Mentor Support
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                     <span style={{ color: course.color }}>✦</span> Final Assessment Test
                  </div>
                </div>

                {/* Status & CTA */}
                {isEnrolled ? (
                   <div style={{ display: 'grid', gap: '0.8rem' }}>
                     <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Status</span>
                       <span style={{ color: isCompleted ? '#10b981' : '#eab308', fontWeight: '700', fontSize: '0.9rem' }}>
                         {enrollment.status === 'Pending' ? 'Waitlist ⏳' : enrollment.status === 'Approved' ? 'In Progress 🏗️' : 'Completed ✅'}
                       </span>
                     </div>
                     <button 
                       onClick={() => handleDownloadCertificate(enrollment)}
                       style={{ background: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', color: isCompleted ? '#10b981' : '#64748b', border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : 'transparent'}`, padding: '1rem', borderRadius: '12px', fontWeight: '800', cursor: isCompleted ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                       onMouseOver={(e) => {
                         if(isCompleted) { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }
                       }}
                       onMouseOut={(e) => {
                         if(isCompleted) { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.color = '#10b981'; }
                       }}
                     >
                       {isCompleted ? '🎓 Download Certificate' : '🔒 Certificate Locked'}
                     </button>
                   </div>
                ) : (
                   <div style={{ display: 'grid', gap: '0.8rem' }}>
                     <select id={`duration-${idx}`} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', outline: 'none' }}>
                       <option value="4 Weeks">4 Weeks Format</option>
                       <option value="8 Weeks">8 Weeks Format</option>
                     </select>
                     <button 
                       onClick={() => handleEnroll(course.name, document.getElementById(`duration-${idx}`).value)}
                       disabled={isLoading}
                       style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`, color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'box-shadow 0.3s', boxShadow: `0 4px 15px ${course.color}44` }}
                       onMouseOver={(e) => e.currentTarget.style.boxShadow = `0 8px 25px ${course.color}66`}
                       onMouseOut={(e) => e.currentTarget.style.boxShadow = `0 4px 15px ${course.color}44`}
                     >
                       {isLoading ? 'Enrolling...' : 'Enroll Now'}
                     </button>
                   </div>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Hidden Certificate for Printing */}
      {showCertificate && certificateData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 9999, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="print-certificate" style={{ border: '20px solid #1e293b', padding: '50px', outline: '5px solid #3b82f6', outlineOffset: '-10px', textAlign: 'center', background: '#fff', color: '#0f172a', width: '1000px', height: '700px', position: 'relative' }}>
            <button onClick={() => setShowCertificate(false)} className="no-print" style={{ position: 'absolute', top: 20, right: 20, background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px' }}>Close</button>
            <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', fontFamily: 'serif', letterSpacing: '2px', color: '#1e293b' }}>CERTIFICATE OF COMPLETION</h1>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>This is to proudly certify that</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0', color: '#3b82f6', textTransform: 'uppercase' }}>{user?.name || "Student Name"}</h2>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0', lineHeight: 1.6 }}>has successfully completed the <b>{certificateData.duration}</b> Virtual Internship Program in</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0', color: '#ea580c' }}>{certificateData.courseName}</h2>
            <p style={{ fontSize: '1rem', marginTop: '1rem' }}>administered by <b>ITM College of Management, GIDA, Gorakhpur</b></p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3rem', padding: '0 2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`${window.location.origin}/verify?name=${user?.name}&course=${certificateData.courseName}&date=${new Date().toLocaleDateString()}&id=${certificateData._id}`)}`} 
                  alt="Verification QR" 
                  style={{ width: '100px', height: '100px', border: '1px solid #e2e8f0', padding: '5px' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>Scan to verify authenticity</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '2px solid #0f172a', width: '200px', marginBottom: '0.5rem' }}></div>
                <div style={{ fontWeight: '700' }}>Program Director</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '2px solid #0f172a', width: '200px', marginBottom: '0.5rem' }}></div>
                <div style={{ fontWeight: '700' }}>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Custom Print CSS */}
            <style>{`
              @media print {
                body * { visibility: hidden; }
                .no-print { display: none !important; }
                .print-certificate, .print-certificate * { visibility: visible; }
                .print-certificate { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex !important; }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertifiedInternship;
