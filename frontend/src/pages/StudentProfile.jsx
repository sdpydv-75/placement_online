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
      minHeight: 'calc(100vh - 78px)', 
      padding: '3rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'center',
      backgroundColor: '#005B96',
      position: 'relative'
    }}>
      
      {/* Container */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ flex: '1 1 300px', maxWidth: '350px' }}>
          <div style={{ 
            background: 'var(--bg-card)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-light)', 
            borderRadius: '24px', padding: '2.5rem 1.5rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'sticky', top: '100px'
          }}>
            <div style={{ 
              width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '4px',
              position: 'relative', cursor: 'pointer', overflow: 'hidden'
            }}>
              <input type="file" onChange={uploadPhotoHandler} accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} title="Upload new photo" />
              <img 
                src={profile.profilePhoto ? `${import.meta.env.VITE_SERVER_URL || 'https://placement-online.vercel.app'}${profile.profilePhoto}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}&backgroundColor=1e293b`} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#0f172a' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '0.2rem', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', textAlign: 'center', pointerEvents: 'none' }}>
                Change
              </div>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem', color: '#fff' }}>{user?.name || 'Student User'}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>B.Tech Computer Science • 4th Year</p>
            
            {/* Stats/Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>CGPA</p>
                <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '800' }}>8.5</p>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Applied</p>
                <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '800' }}>12 Jobs</p>
              </div>
            </div>

            {/* Progress */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Profile Completion</span>
                <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '700' }}>{completion}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ 
            background: 'var(--bg-card)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-light)', 
            borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' 
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>Build Your Professional Portfolio</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Update your details to increase your chances of getting shortlisted by top recruiters.</p>

            <form onSubmit={handleSubmit}>
              
              {/* Row 1: Skills & Resume */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Core Skills (comma separated)</label>
                  <input type="text" className="form-input" placeholder="e.g. React, Node.js, Python"
                    value={profile.skills} onChange={(e) => setProfile({...profile, skills: e.target.value})} 
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem', borderRadius: '12px' }}/>
                </div>
                
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Resume / CV Document</label>
                  <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.6)', border: '1px dashed rgba(139,92,246,0.5)', padding: '0.65rem 1rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }} 
                       onMouseOver={e => e.currentTarget.style.borderColor = '#8b5cf6'} 
                       onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}>
                    <input type="file" onChange={uploadFileHandler} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    <span style={{ fontSize: '1.2rem', marginRight: '0.8rem' }}>📄</span>
                    <span style={{ color: profile.resume ? '#10b981' : '#94a3b8', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {profile.resume ? 'Resume Uploaded Successfully' : 'Drag & Drop PDF or Choose File'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Links */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>LinkedIn Profile URL</label>
                  <input type="url" className="form-input" placeholder="https://linkedin.com/in/username"
                    value={profile.linkedin} onChange={(e) => setProfile({...profile, linkedin: e.target.value})} 
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem', borderRadius: '12px' }}/>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>GitHub Profile URL</label>
                  <input type="url" className="form-input" placeholder="https://github.com/username"
                    value={profile.github} onChange={(e) => setProfile({...profile, github: e.target.value})} 
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem', borderRadius: '12px' }}/>
                </div>
              </div>

              {/* Row 3: Textareas */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Major Projects Showcase</label>
                <textarea className="form-textarea" rows="4" placeholder="Describe 2-3 major technical projects you have built..."
                  value={profile.projects} onChange={(e) => setProfile({...profile, projects: e.target.value})} 
                  style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Certifications & Achievements</label>
                <textarea className="form-textarea" rows="3" placeholder="AWS Certified, HackerRank 5 Stars, etc."
                  value={profile.certifications} onChange={(e) => setProfile({...profile, certifications: e.target.value})} 
                  style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}></textarea>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" disabled={loading} style={{ 
                  flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', padding: '1rem', 
                  borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {loading ? 'Saving...' : '✨ Save Portfolio'}
                </button>
                
                <button type="button" style={{ 
                  flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1rem', 
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', fontSize: '1.05rem', cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                  👁️ Preview Portfolio
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
