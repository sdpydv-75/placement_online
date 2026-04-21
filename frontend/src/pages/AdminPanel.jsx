import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import ContentManager from '../components/ContentManager';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [certifieds, setCertifieds] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', description: '', company: '', location: '', skills: '', type: 'Full-time' });
  const [editingJob, setEditingJob] = useState(null);
  const [showAddInternship, setShowAddInternship] = useState(false);
  const [internshipForm, setInternshipForm] = useState({ name: '', level: 'Beginner', icon: '💼', color: '#3b82f6', isNew: false, description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, usersRes, statsRes, certifiedRes, internshipsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/users'),
        api.get('/admin/stats'),
        api.get('/certified'),
        api.get('/internships')
      ]);
      setJobs(jobsRes.data.data);
      setUsers(usersRes.data.data);
      setStats(statsRes.data.data);
      setCertifieds(certifiedRes.data.data);
      setInternships(internshipsRes.data.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
    setLoading(false);
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...jobForm, skills: jobForm.skills.split(',').map(s => s.trim()) };
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      setShowAddJob(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', company: '', location: '', skills: '', type: 'Full-time' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      skills: job.skills.join(', '),
      type: job.type
    });
    setShowAddJob(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleUpdateCertifiedStatus = async (id, status) => {
    try {
      await api.put(`/certified/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    try {
      await api.post('/internships', internshipForm);
      setShowAddInternship(false);
      setInternshipForm({ name: '', level: 'Beginner', icon: '💼', color: '#3b82f6', isNew: false, description: '' });
      fetchData();
      alert('✅ Internship added successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add internship');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await api.delete(`/internships/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete internship');
    }
  };

  const handleToggleApproval = async (userId) => {
    try {
      await api.put(`/users/${userId}/approve`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update approval status');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️</div>
      <div style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Loading Admin Panel...</div>
    </div>
  );

  const tabStyle = (tab) => ({
    padding: '0.8rem 1.8rem',
    background: activeTab === tab ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.03)',
    color: activeTab === tab ? '#fff' : '#94a3b8',
    border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif'
  });

  return (
    <>
      <style>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          gap: 1rem;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          -webkit-overflow-scrolling: touch;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .admin-modal-content {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2.5rem;
          width: min(90vw, 600px);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
        }

        @media (max-width: 768px) {
          .admin-header { flex-direction: column; align-items: stretch; text-align: center; }
          .admin-header h1 { font-size: 1.8rem !important; }
          .form-grid { grid-template-columns: 1fr; }
          .admin-modal-content { padding: 1.5rem; }
        }

        @media (max-width: 480px) {
          .admin-container { padding: 1.5rem 1rem; }
        }
      `}</style>

      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.3rem' }}>
              <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Control Panel</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Welcome, {user?.name || 'Admin'}. Quick insights & actions.</p>
          </div>
          <button onClick={() => { setEditingJob(null); setJobForm({ title: '', description: '', company: '', location: '', skills: '', type: 'Full-time' }); setShowAddJob(true); }}
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: '#fff', border: 'none', padding: '0.9rem 2rem', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(234,88,12,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            ➕ Post Job
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Base', value: stats.users, icon: '👥', color: '#3b82f6', glow: 'rgba(59,130,246,0.1)' },
            { label: 'Active Openings', value: stats.jobs, icon: '💼', color: '#10b981', glow: 'rgba(16,185,129,0.1)' },
            { label: 'Total Inbound', value: stats.applications, icon: '📋', color: '#8b5cf6', glow: 'rgba(139,92,246,0.1)' }
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', boxShadow: `0 10px 30px ${stat.glow}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>{stat.label.toUpperCase()}</p>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: stat.color, margin: 0 }}>{stat.value}</h2>
                </div>
                <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('jobs')} style={tabStyle('jobs')}>💼 Jobs</button>
          <button onClick={() => setActiveTab('users')} style={tabStyle('users')}>👥 Users</button>
          <button onClick={() => setActiveTab('internships')} style={tabStyle('internships')}>🎓 Internships</button>
          <button onClick={() => setActiveTab('content')} style={tabStyle('content')}>📝 CMS</button>
          <button onClick={() => setActiveTab('certified')} style={tabStyle('certified')}>📋 Enrollments</button>
        </div>

        {/* Add/Edit Job Modal */}
        {showAddJob && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div className="admin-modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{editingJob ? 'Update Listing' : 'Post New Opening'}</h3>
                <button onClick={() => { setShowAddJob(false); setEditingJob(null); }} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>✕</button>
              </div>
              <form onSubmit={handleAddJob}>
                <div className="form-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Job Title</label>
                    <input className="input-field" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Company</label>
                    <input className="input-field" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Location</label>
                    <input className="input-field" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem' }}>Role Type</label>
                    <select className="input-field" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', marginTop: '2rem', background: '#3b82f6', color: '#fff', border: 'none', padding: '1rem', borderRadius: '15px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}>
                  {editingJob ? '💾 Update Placement' : '🚀 Publish Now'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content Wrappers */}
        <div className="table-responsive">
          {activeTab === 'jobs' && (
            <table className="admin-table">
              <thead>
                <tr>
                  {['Title', 'Company', 'Location', 'Type', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: '700' }}>{job.title}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#94a3b8' }}>{job.company}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#94a3b8' }}>{job.location}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}><span style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>{job.type}</span></td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditJob(job)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Edit</button>
                        <button onClick={() => handleDeleteJob(job._id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'users' && (
            <table className="admin-table">
              <thead>
                <tr>{['Name', 'Email', 'Role', 'Actions'].map(h => <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: '800' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: '700' }}>{u.name}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#94a3b8' }}>{u.email}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}><span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{u.role}</span></td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800' }}>Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'internships' && (
             <table className="admin-table">
               <thead>
                 <tr>{['Icon', 'Name', 'Level', 'Actions'].map(h => <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: '800' }}>{h}</th>)}</tr>
               </thead>
               <tbody>
                 {internships.map(i => (
                   <tr key={i._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                     <td style={{ padding: '1.2rem 1.5rem', fontSize: '1.5rem' }}>{i.icon}</td>
                     <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: '700' }}>{i.name}</td>
                     <td style={{ padding: '1.2rem 1.5rem', color: '#94a3b8' }}>{i.level}</td>
                     <td style={{ padding: '1.2rem 1.5rem' }}>
                       <button onClick={() => handleDeleteInternship(i._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800' }}>Remove</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}

          {activeTab === 'certified' && (
            <table className="admin-table">
              <thead>
                <tr>{['Student', 'Course', 'Status', 'Update'].map(h => <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: '800' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {certifieds.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#fff' }}>{c.user?.name}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#f97316', fontWeight: '700' }}>{c.courseName}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}><span style={{ color: '#3b82f6', fontWeight: '800' }}>{c.status}</span></td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <select value={c.status} onChange={(e) => handleUpdateCertifiedStatus(c._id, e.target.value)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '0.3rem' }}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {activeTab === 'content' && <ContentManager />}
      </div>
    </>
  );
};

export default AdminPanel;
