import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ 
    skills: '', resume: '', linkedin: '', github: '', projects: '', certifications: '', profilePhoto: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        if (res.data.data) {
          setProfile({
            skills: res.data.data.skills ? res.data.data.skills.join(', ') : '',
            resume: res.data.data.resume || '',
            linkedin: res.data.data.linkedin || '',
            github: res.data.data.github || '',
            projects: res.data.data.projects || '',
            certifications: res.data.data.certifications || '',
            profilePhoto: res.data.data.profilePhoto || ''
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/profile', {
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s),
        resume: profile.resume,
        linkedin: profile.linkedin,
        github: profile.github,
        projects: profile.projects,
        certifications: profile.certifications,
        profilePhoto: profile.profilePhoto,
        education: []
      });
      alert('Portfolio updated successfully!');
    } catch(err) {
      alert('Error updating portfolio');
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await api.post('/upload/resume', formData, config);
      setProfile({ ...profile, resume: res.data.data });
      alert('Resume securely uploaded!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error uploading document');
    }
  };

  const uploadPhotoHandler = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await api.post('/upload/photo', formData, config);
      setProfile({ ...profile, profilePhoto: res.data.data });
      alert('Photo securely uploaded! Click "Save Portfolio" to apply permanently.');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error uploading photo');
    }
  };

  const calculateCompletion = () => {
    let score = 0;
    if(profile.skills) score += 20;
    if(profile.resume) score += 20;
    if(profile.linkedin) score += 20;
    if(profile.github) score += 10;
    if(profile.projects) score += 20;
    if(profile.certifications) score += 10;
    if(profile.profilePhoto) score += 10;
    return score > 100 ? 100 : score;
  };
  const completion = calculateCompletion();

  return (
    <div className="animate-fade-in-up" style={{ 
      minHeight: '100vh', 
      paddingBottom: '4rem', 
      background: '#0a0f1a', 
      color: '#f1f5f9' 
    }}>
      <style>{`
        .profile-wrapper {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }
        .profile-card {
          flex: 0 0 350px;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 2.5rem 1.5rem;
          height: fit-content;
          position: sticky;
          top: 100px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .form-section {
          flex: 1;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: clamp(1.5rem, 5vw, 3rem);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 992px) {
          .profile-wrapper { flex-direction: column; padding: 2rem 1rem; }
          .profile-card { flex: none; width: 100%; position: static; }
        }

        @media (max-width: 480px) {
          .profile-wrapper { padding: 1.5rem 1rem; gap: 1.5rem; }
          .profile-card { padding: 2rem 1.2rem; }
          .form-section { border-radius: 20px; }
        }
      `}</style>
      
      <div className="profile-wrapper">
        {/* Left Column: Profile Card */}
        <div className="profile-card">
          <div style={{ 
            width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '4px',
            position: 'relative', overflow: 'hidden'
          }}>
            <input type="file" onChange={uploadPhotoHandler} accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
            <img 
              src={profile.profilePhoto ? `${import.meta.env.VITE_SERVER_URL || 'https://placement-online.vercel.app'}${profile.profilePhoto}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}`} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#0f172a' }} 
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '0.4rem', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', textAlign: 'center' }}>
              CHANGE PHOTO
            </div>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '0.4rem', color: '#fff', textAlign: 'center' }}>{user?.name}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center', fontWeight: '600' }}>CAMPUS TALENT • {user?.role.toUpperCase()}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', marginBottom: '0.3rem' }}>GPA</p>
              <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '900' }}>8.5</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', marginBottom: '0.3rem' }}>APPS</p>
              <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '900' }}>12</p>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800' }}>STRENGTH SCORE</span>
              <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '900' }}>{completion}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Form section */}
        <div className="form-section">
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: '900', marginBottom: '0.5rem' }}>Professional Portfolio</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '3rem', fontWeight: '500' }}>Highlight your strengths to stand out to global recruiters.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.6rem' }}>SKILLS (TAGS)</label>
                <input type="text" value={profile.skills} onChange={(e) => setProfile({...profile, skills: e.target.value})} 
                  placeholder="React, AWS, Node.js" className="form-input"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}/>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.6rem' }}>RESUME / CV</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(59,130,246,0.3)', padding: '0.9rem 1rem', borderRadius: '12px', cursor: 'pointer' }}>
                  <input type="file" onChange={uploadFileHandler} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  <span style={{ fontSize: '1.2rem', marginRight: '0.8rem' }}>📄</span>
                  <span style={{ color: profile.resume ? '#10b981' : '#64748b', fontSize: '0.85rem', fontWeight: '700' }}>
                    {profile.resume ? 'VERIFIED ✓' : 'UPLOAD PDF'}
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.6rem' }}>LINKEDIN URL</label>
                <input type="url" value={profile.linkedin} onChange={(e) => setProfile({...profile, linkedin: e.target.value})} 
                  placeholder="https://..." style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.6rem' }}>GITHUB URL</label>
                <input type="url" value={profile.github} onChange={(e) => setProfile({...profile, github: e.target.value})} 
                  placeholder="https://..." style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}/>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.6rem' }}>PROJECT SHOWCASE</label>
              <textarea rows="4" value={profile.projects} onChange={(e) => setProfile({...profile, projects: e.target.value})} 
                placeholder="Briefly describe your best engineering work..."
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'vertical' }}></textarea>
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', padding: '1.2rem', 
              borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(59,130,246,0.3)', transition: 'all 0.3s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}>
              {loading ? 'SYNCING DATA...' : '🚀 PUBLISH CHANGES'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
  );
};

export default StudentProfile;
