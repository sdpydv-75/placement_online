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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.3rem' }}>
            <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Control Panel</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Welcome back, {user?.name || 'Admin'}. Administrative management mode active.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Users', value: stats.users, icon: '👥', color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
          { label: 'Active Jobs', value: stats.jobs, icon: '💼', color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
          { label: 'Applications', value: stats.applications, icon: '📋', color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2rem', boxShadow: `0 0 30px ${stat.glow}`, transition: 'transform 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>{stat.label}</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: stat.color, margin: 0 }}>{stat.value}</h2>
              </div>
              <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('jobs')} style={tabStyle('jobs')}>💼 Manage Jobs</button>
        <button onClick={() => setActiveTab('users')} style={tabStyle('users')}>👥 Manage Users</button>
        <button onClick={() => setActiveTab('internships')} style={tabStyle('internships')}>🎓 Manage Internships</button>
        <button onClick={() => setActiveTab('content')} style={tabStyle('content')}>📝 Site Content</button>
        <button onClick={() => setActiveTab('certified')} style={tabStyle('certified')}>📋 Student Enrollments</button>
      </div>

      {/* Add/Edit Job Modal */}
      {showAddJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{editingJob ? '✏️ Edit Job' : '➕ Add New Job'}</h3>
              <button onClick={() => { setShowAddJob(false); setEditingJob(null); }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '10px', padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: '700' }}>✕ Close</button>
            </div>
            <form onSubmit={handleAddJob}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Job Title</label>
                  <input value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}
                    placeholder="e.g. Full Stack Developer" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Company</label>
                  <input value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}
                    placeholder="e.g. TCS" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Location</label>
                  <input value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}
                    placeholder="e.g. Bangalore" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Job Type</label>
                  <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Skills (comma-separated)</label>
                <input value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}
                  placeholder="e.g. React, Node.js, MongoDB" />
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Job Description</label>
                <textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required rows="4"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                  placeholder="Describe the job role and requirements..." />
              </div>
              <button type="submit"
                style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
                {editingJob ? '💾 Update Job' : '🚀 Publish Job'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Title', 'Company', 'Location', 'Type', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#f1f5f9', fontWeight: '600' }}>{job.title}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8' }}>{job.company}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8' }}>{job.location}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: job.type === 'Full-time' ? 'rgba(16,185,129,0.15)' : job.type === 'Internship' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', color: job.type === 'Full-time' ? '#10b981' : job.type === 'Internship' ? '#3b82f6' : '#8b5cf6', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {job.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditJob(job)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', padding: '0.35rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>✏️ Edit</button>
                      <button onClick={() => handleDeleteJob(job._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.35rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No jobs found. Click "Add New Job" to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Manager Tab */}
      {activeTab === 'content' && <ContentManager />}

      {/* Manage Internships Tab */}
      {activeTab === 'internships' && (
        <div>
          {/* Add Internship Modal */}
          {showAddInternship && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '2.5rem', width: '550px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', background: 'linear-gradient(90deg,#10b981,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>➕ Add New Internship</h3>
                  <button onClick={() => setShowAddInternship(false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '10px', padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: '700' }}>✕ Close</button>
                </div>
                <form onSubmit={handleAddInternship}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Internship Name *</label>
                      <input value={internshipForm.name} onChange={e => setInternshipForm({...internshipForm, name: e.target.value})} required
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                        placeholder="e.g. Python Programming Internship" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Level</label>
                      <select value={internshipForm.level} onChange={e => setInternshipForm({...internshipForm, level: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Icon (Emoji)</label>
                      <input value={internshipForm.icon} onChange={e => setInternshipForm({...internshipForm, icon: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box' }}
                        placeholder="e.g. 🐍" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Card Color</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={internshipForm.color} onChange={e => setInternshipForm({...internshipForm, color: e.target.value})}
                          style={{ width: '50px', height: '42px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px' }} />
                        <input value={internshipForm.color} onChange={e => setInternshipForm({...internshipForm, color: e.target.value})}
                          style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}
                          placeholder="#3b82f6" />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Mark as NEW?</label>
                      <select value={internshipForm.isNew} onChange={e => setInternshipForm({...internshipForm, isNew: e.target.value === 'true'})}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}>
                        <option value="false">No</option>
                        <option value="true">Yes ⚡</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Short Description (Optional)</label>
                    <textarea value={internshipForm.description} onChange={e => setInternshipForm({...internshipForm, description: e.target.value})} rows="3"
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                      placeholder="Brief description of the internship program..." />
                  </div>
                  <button type="submit"
                    style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                    🚀 Add Internship
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#f1f5f9' }}>🎓 ITM Internship Programs</h2>
              <p style={{ margin: '0.3rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Manage internship courses shown on the Certified Internship page</p>
            </div>
          </div>

          {/* Internships Table */}
          <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Icon', 'Internship Name', 'Level', 'Badge', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {internships.map(internship => (
                  <tr key={internship._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${internship.color}22`, border: `1px solid ${internship.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                        {internship.icon}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#f1f5f9', fontWeight: '700', fontSize: '0.95rem' }}>{internship.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ background: internship.level === 'Beginner' ? 'rgba(16,185,129,0.15)' : internship.level === 'Intermediate' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', color: internship.level === 'Beginner' ? '#10b981' : internship.level === 'Intermediate' ? '#3b82f6' : '#8b5cf6', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {internship.level}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {internship.isNew ? (
                        <span style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))', color: '#f97316', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(249,115,22,0.3)' }}>NEW ⚡</span>
                      ) : (
                        <span style={{ color: '#475569', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button onClick={() => handleDeleteInternship(internship._id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {internships.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
                    No internships found. Click "Add Internship" to create one.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#f1f5f9', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.85rem' }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8' }}>{u.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: u.role === 'admin' ? 'rgba(239,68,68,0.15)' : u.role === 'recruiter' ? 'rgba(234,88,12,0.15)' : 'rgba(16,185,129,0.15)', color: u.role === 'admin' ? '#ef4444' : u.role === 'recruiter' ? '#ea580c' : '#10b981', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {u.role === 'student' ? (
                      <button 
                        onClick={() => handleToggleApproval(u._id)}
                        style={{ background: u.isApproved ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: u.isApproved ? '#10b981' : '#ef4444', border: `1px solid ${u.isApproved ? '#10b98144' : '#ef444444'}`, padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}
                      >
                        {u.isApproved ? '✅ Approved' : '⏳ Pending'}
                      </button>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {u.role !== 'admin' ? (
                      <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.35rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>🗑 Delete</button>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Premium Internships Tab */}
      {activeTab === 'certified' && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Student', 'Email', 'Course', 'Duration', 'Applied On', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certifieds.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#f1f5f9', fontWeight: '600' }}>{c.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8' }}>{c.user?.email || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#f97316', fontWeight: '600', fontSize: '0.9rem' }}>{c.courseName}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#f1f5f9' }}>{c.duration}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(c.enrolledAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      background: c.status === 'Completed' ? 'rgba(16,185,129,0.15)' : c.status === 'Approved' ? 'rgba(59,130,246,0.15)' : 'rgba(234,88,12,0.15)', 
                      color: c.status === 'Completed' ? '#10b981' : c.status === 'Approved' ? '#3b82f6' : '#ea580c', 
                      padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' 
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <select 
                      value={c.status} 
                      onChange={(e) => handleUpdateCertifiedStatus(c._id, e.target.value)}
                      style={{ background: 'rgba(15,23,42,0.6)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {certifieds.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No certified internship enrollments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
