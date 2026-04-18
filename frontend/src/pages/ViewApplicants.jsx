import { useState, useEffect } from 'react';
import api from '../api/axios';

const ViewApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecruiterJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    try {
      setSelectedJob(jobId);
      const res = await api.get(`/applications/jobs/${jobId}`);
      setApplicants(res.data.data);
    } catch (err) {
      alert('Error fetching applicants');
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      fetchApplicants(selectedJob);
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="gradient-text" style={{ marginBottom: '2rem' }}>Candidate Tracking Platform</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3>Your Broadcasted Roles</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
            {jobs.map(job => (
              <li 
                key={job._id}
                onClick={() => fetchApplicants(job._id)}
                style={{
                  padding: '1rem',
                  background: selectedJob === job._id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s'
                }}
              >
                <strong>{job.title}</strong>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ flex: '2 1 400px' }}>
          {selectedJob ? (
            <div>
              <h3>Applicants ({applicants.length})</h3>
              {applicants.map(app => (
                <div key={app._id} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid var(--border-glass)' }}>
                  <p><strong>Candidate:</strong> {app.student.name}</p>
                  <p><strong>Email:</strong> {app.student.email}</p>
                  <p><strong>Status:</strong> <span style={{ color: app.status === 'Accepted' ? '#10b981' : 'var(--text-main)', fontWeight: '600' }}>{app.status}</span></p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleStatusUpdate(app._id, 'Reviewed')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Mark Reviewed</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'Accepted')} className="btn btn-primary" style={{ background: '#10b981', boxShadow: 'none', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Accept</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Reject</button>
                  </div>
                </div>
              ))}
              {applicants.length === 0 && <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No candidates have applied for this role yet.</p>}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Select a job from the sidebar to review incoming candidates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewApplicants;
