import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({ cgpa: '', branch: '', passingYear: '', phone: '' });
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/applications/jobs/${id}`, formData);
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit application.');
    }
  };

  if (!job) return <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading placement details...</div>;

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', 
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '12px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Job Info Card */}
      <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{job.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>{job.company}</p>
          </div>
          <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(16,185,129,0.2)' }}>
            ✅ Actively hiring
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
          {[
            { icon: '📍', label: 'LOCATION', value: job.location },
            { icon: '💼', label: 'TYPE', value: job.type },
            { icon: '🕐', label: 'POSTED', value: new Date(job.createdAt).toLocaleDateString() }
          ].map(info => (
            <div key={info.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{info.icon} {info.label}</div>
              <div style={{ color: '#f1f5f9', fontWeight: '600' }}>{info.value}</div>
            </div>
          ))}
        </div>
        
        <h4 style={{ color: '#f1f5f9', marginBottom: '0.8rem', fontSize: '1.1rem' }}>About the Role</h4>
        <p style={{ lineHeight: '1.8', marginBottom: '2rem', color: '#94a3b8' }}>{job.description}</p>
        
        <h4 style={{ color: '#f1f5f9', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Required Skills</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {job.skills.map(skill => (
            <span key={skill} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(59,130,246,0.2)' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Application Section */}
      {!user ? (
        <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🔐</div>
          <h3 style={{ color: '#f1f5f9', fontSize: '1.6rem', marginBottom: '0.8rem', fontWeight: '800' }}>Want to Apply?</h3>
          <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Create your account or login to submit your application for this position.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>Register Now</Link>
            <Link to="/login" style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9', padding: '0.85rem 2.5rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', background: 'rgba(255,255,255,0.03)' }}>Login</Link>
          </div>
        </div>
      ) : applied ? (
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '2px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '3.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🎉</div>
          <h3 style={{ color: '#10b981', fontSize: '1.6rem', marginBottom: '0.8rem', fontWeight: '800' }}>Application Submitted!</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Your application has been sent successfully. The HR team will review it shortly.</p>
          <button onClick={() => navigate('/jobs')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>Browse More Jobs →</button>
        </div>
      ) : (
        <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', borderTop: '3px solid #ea580c' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#f1f5f9', fontSize: '1.4rem', fontWeight: '800' }}>📝 Apply Now</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill in your details to apply for <strong style={{ color: '#f1f5f9' }}>{job.title}</strong> at <strong style={{ color: '#f1f5f9' }}>{job.company}</strong></p>
          
          <form onSubmit={handleApply}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Current CGPA</label>
                <input type="number" step="0.01" max="10" min="0" required style={inputStyle} placeholder="e.g. 8.5" onChange={e => setFormData({...formData, cgpa: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Academic Branch</label>
                <input type="text" required style={inputStyle} placeholder="e.g. B.Tech CSE" onChange={e => setFormData({...formData, branch: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Passing Year</label>
                <input type="number" required style={inputStyle} placeholder="e.g. 2025" onChange={e => setFormData({...formData, passingYear: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Contact Number</label>
                <input type="tel" required style={inputStyle} placeholder="+91 XXXXX XXXXX" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <button type="submit" style={{ width: '100%', marginTop: '2rem', background: 'linear-gradient(135deg, #ea580c, #f97316)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,88,12,0.3)' }}>
              Submit Application →
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
