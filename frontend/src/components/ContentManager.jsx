import { useState, useEffect } from 'react';
import api from '../api/axios';

const ContentManager = () => {
  const [activeType, setActiveType] = useState('placements');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const types = {
    placements: { label: 'Campus Placements', fields: ['company', 'date', 'roles', 'ctc', 'status'] },
    reviews: { label: 'Company Reviews', fields: ['company', 'rating', 'author', 'review'] },
    stories: { label: 'Success Stories', fields: ['name', 'role', 'company', 'package', 'img'] }
  };

  useEffect(() => {
    fetchContent();
  }, [activeType]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content/${activeType}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/content/${activeType}/${id}`);
      fetchContent();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/content/${activeType}/${editingId}`, formData);
      } else {
        await api.post(`/content/${activeType}`, formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({});
      fetchContent();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(types).map(([key, val]) => (
          <button key={key} onClick={() => { setActiveType(key); setShowForm(false); }}
            style={{ background: activeType === key ? 'rgba(234,88,12,0.1)' : 'transparent', color: activeType === key ? '#ea580c' : '#94a3b8', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', transition: 'all 0.2s' }}>
            {val.label}
          </button>
        ))}
        <button onClick={() => { setFormData({}); setEditingId(null); setShowForm(true); }}
          style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' }}>
          ➕ Add New {types[activeType].label.split(' ')[1]}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '1rem', color: '#f1f5f9' }}>{editingId ? 'Edit' : 'Create'} {types[activeType].label}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {types[activeType].fields.map(field => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>{capitalize(field)}</label>
                <input required value={formData[field] || ''} onChange={e => setFormData({...formData, [field]: e.target.value})}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading data...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                {types[activeType].fields.map(field => (
                  <th key={field} style={{ padding: '0.8rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.8rem' }}>{capitalize(field)}</th>
                ))}
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {types[activeType].fields.map(field => (
                    <td key={field} style={{ padding: '0.8rem', fontSize: '0.9rem', color: '#f1f5f9' }}>{item[field]}</td>
                  ))}
                  <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(item)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(item._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={types[activeType].fields.length + 1} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
