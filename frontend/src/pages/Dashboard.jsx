import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Admin State
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState([]);
  
  // Student State
  const [applications, setApplications] = useState([]);

  // Recruiter State
  const [recruiterJobs, setRecruiterJobs] = useState([]);

  useEffect(() => {
    if (user.role === 'admin') {
      const fetchAdminData = async () => {
        try {
          const statsRes = await api.get('/admin/stats');
          setStats(statsRes.data.data);
          
          const usersRes = await api.get('/users');
          setUsers(usersRes.data.data);
        } catch (err) {
          console.error('Error fetching admin data', err);
        }
      };
      fetchAdminData();
    } else if (user.role === 'student') {
      const fetchApplications = async () => {
        try {
          const res = await api.get('/applications/me');
          setApplications(res.data.data);
        } catch (err) {
          console.error('Error fetching applications', err);
        }
      };
      fetchApplications();
    } else if (user.role === 'recruiter') {
      const fetchRecruiterJobs = async () => {
        try {
          const res = await api.get('/jobs');
          const myJobs = res.data.data.filter(job => job.recruiter && job.recruiter._id === user._id);
          setRecruiterJobs(myJobs);
        } catch (err) {
          console.error('Error fetching recruiter jobs', err);
        }
      };
      fetchRecruiterJobs();
    }
  }, [user.role, user._id]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you strictly sure you want to permanently delete this user document?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        setStats(prev => ({ ...prev, users: prev.users - 1 }));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Accepted') return '#10b981';
    if (status === 'Reviewed') return '#3b82f6';
    if (status === 'Rejected') return '#ef4444';
    return '#94a3b8';
  };

  if (user.role === 'admin') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        <h2 className="gradient-text" style={{ marginBottom: '2rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Administration Hub</h2>
        
        {/* Analytics Section */}
        <div className="responsive-grid" style={{ marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Users</h3>
            <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.users}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Jobs</h3>
            <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.jobs}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Applications</h3>
            <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.applications}</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>System Users</h3>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Name</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Role</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>{u.name}</td>
                    <td style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '0.5rem 0' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : u.role === 'recruiter' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: u.role === 'admin' ? '#ef4444' : u.role === 'recruiter' ? '#3b82f6' : '#10b981'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                      {u._id !== user._id && (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', color: '#ef4444', border: '1px solid #ef4444', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={
      user.role === 'student' ? {
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url("/abstract-digital-grid-black-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: 'clamp(2rem, 5vw, 4rem) 1.5rem',
        position: 'relative'
      } : { padding: 'clamp(2rem, 5vw, 4rem) 1.5rem', minHeight: '100vh' }
    }>
      {user.role === 'student' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10, 15, 30, 0.7)', backdropFilter: 'blur(8px)', zIndex: 0 }}></div>
      )}
      
      <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <h2 className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '0.5rem' }}>Welcome back, {user.name}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>View your activity and account status.</p>
        </div>
        
        {user.role === 'student' ? (
          <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 2rem)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Application History</h3>
            {applications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map(app => (
                  <div key={app._id} style={{ padding: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: '1' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{app.job.title}</h4>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{app.job.company}</p>
                      </div>
                      <span style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '10px', 
                        fontSize: '0.8rem', 
                        fontWeight: '700',
                        border: `1px solid ${getStatusColor(app.status)}`,
                        color: getStatusColor(app.status),
                        background: `${getStatusColor(app.status)}15`
                      }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No applications yet. Start your journey today!</p>
            )}
            <button onClick={() => navigate('/jobs')} style={{ 
              marginTop: '2rem', 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              color: '#fff', 
              fontWeight: '700', 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
            }}>
              Explore New Opportunities
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 2rem)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Job Postings</h3>
            {recruiterJobs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recruiterJobs.map(job => (
                  <div key={job._id} style={{ padding: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: '1' }}>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{job.title}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{job.type} • {job.location}</p>
                      </div>
                      <button onClick={() => navigate('/applicants')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600' }}>
                        Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>You haven't posted any jobs yet.</p>
            )}
            <button onClick={() => navigate('/post-job')} style={{ 
              marginTop: '1.5rem', 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '12px', 
              background: 'var(--primary)', 
              color: '#fff', 
              fontWeight: '700', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
              Post a New Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
