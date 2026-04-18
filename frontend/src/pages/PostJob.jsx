import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PostJob = () => {
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', skills: '', type: 'Full-time' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
      await api.post('/jobs', payload);
      alert('Job successfully broadcasted!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post job');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="glass-panel">
        <h2 className="gradient-text" style={{ marginBottom: '2rem' }}>Publish a New Role</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input type="text" className="form-input" required 
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-input" required 
                onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" required 
              onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" required placeholder="e.g. Remote, NYC"
                onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Desired Skills (comma separated)</label>
            <input type="text" className="form-input" required placeholder="React, Node.js, MongoDB"
              onChange={(e) => setFormData({...formData, skills: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Publish Job Link</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
