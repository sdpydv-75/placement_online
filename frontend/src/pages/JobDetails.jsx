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
    <>
      <style>{`
        .details-container {
          max-width: 850px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          gap: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          background: rgba(255,255,255,0.02);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.04);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .details-header { flex-direction: column; }
          .form-grid { grid-template-columns: 1fr; }
          .details-card { padding: 1.5rem !important; }
        }

        @media (max-width: 480px) {
          .details-container { padding: 1rem; }
          .info-grid { padding: 1rem; gap: 1rem; }
          .details-title { font-size: 1.6rem !important; }
        }
      `}</style>

      <div className="details-container">
        {/* Job Info Card */}
        <div className="details-card" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '3rem', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div className="details-header">
            <div>
              <h2 className="details-title" style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{job.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '600' }}>{job.company}</p>
            </div>
            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid rgba(16,185,129,0.2)', whiteSpace: 'nowrap' }}>
              ✅ Actively hiring
            </span>
          </div>
          
          <div className="info-grid">
            {[
              { icon: '📍', label: 'LOCATION', value: job.location },
              { icon: '💼', label: 'TYPE', value: job.type },
              { icon: '🕐', label: 'POSTED', value: new Date(job.createdAt).toLocaleDateString() }
            ].map(info => (
              <div key={info.label}>
                <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{info.icon} {info.label}</div>
                <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '1rem' }}>{info.value}</div>
              </div>
            ))}
          </div>
          
          <h4 style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '800' }}>Roles & Responsibilities</h4>
          <p style={{ lineHeight: '1.8', marginBottom: '2.5rem', color: '#94a3b8', fontSize: '1.05rem' }}>{job.description}</p>
          
          <h4 style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '800' }}>Desired Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {job.skills.map(skill => (
              <span key={skill} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Application Section */}
        {!user ? (
          <div className="details-card" style={{ background: 'rgba(15,23,42,0.7)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px', padding: '3.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔒</div>
            <h3 style={{ color: '#f1f5f9', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '900' }}>Ready to Apply?</h3>
            <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>Please login or create an account to submit your application.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none', background: '#3b82f6', color: '#fff', padding: '1rem 2.5rem', borderRadius: '15px', fontWeight: '800', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}>Join Now</Link>
              <Link to="/login" style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem 2.5rem', borderRadius: '15px', fontWeight: '800' }}>Login</Link>
            </div>
          </div>
        ) : applied ? (
          <div className="details-card" style={{ background: 'rgba(16,185,129,0.05)', border: '2px solid rgba(16,185,129,0.2)', borderRadius: '24px', padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🚀</div>
            <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '900' }}>Success!</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Application sent! Our team will get back to you soon.</p>
            <button onClick={() => navigate('/jobs')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '15px', fontWeight: '800', cursor: 'pointer' }}>Back to Jobs</button>
          </div>
        ) : (
          <div className="details-card" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '3rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', borderTop: '4px solid #3b82f6' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Quick Apply</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Experience the future of talent acquisition.</p>
            
            <form onSubmit={handleApply}>
              <div className="form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>CGPA / Percentage</label>
                  <input type="number" step="0.01" max="100" min="0" required style={inputStyle} placeholder="8.5 or 85%" onChange={e => setFormData({...formData, cgpa: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Branch / Degree</label>
                  <input type="text" required style={inputStyle} placeholder="B.Tech CSE" onChange={e => setFormData({...formData, branch: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Year of Graduation</label>
                  <input type="number" required style={inputStyle} placeholder="2025" onChange={e => setFormData({...formData, passingYear: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Phone Number</label>
                  <input type="tel" required style={inputStyle} placeholder="+91 00000 00000" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', marginTop: '2.5rem', background: '#3b82f6', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '15px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59,130,246,0.4)' }}>
                Confirm and Apply →
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetails;
