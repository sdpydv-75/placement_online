import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CampusPlacements = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await api.get('/content/placements');
        setDrives(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch drives', err);
      }
      setLoading(false);
    };
    fetchDrives();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in-up">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1rem' }}>
          Campus <span className="text-gradient">Placement Drives</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          Participate in exclusive on-campus and virtual hiring drives from our top industry partners. Register early to secure your interview slot!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
        {drives.map((drive, i) => (
          <div key={i} className="card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, padding: '1.8rem', borderLeft: drive.status === 'Open' ? '4px solid #10b981' : '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', fontWeight: '800' }}>{drive.company}</h3>
              <span style={{ background: drive.status === 'Open' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: drive.status === 'Open' ? '#10b981' : '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                {drive.status}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>📅</span> Date: <strong style={{ color: '#f1f5f9' }}>{drive.date}</strong></div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>💼</span> Roles: <strong style={{ color: '#f1f5f9' }}>{drive.roles}</strong></div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}><span>💰</span> Expected CTC: <strong style={{ color: '#f1f5f9' }}>{drive.ctc}</strong></div>
            <Link to="/jobs" className="btn btn-outline" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem' }}>View Details & Apply</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusPlacements;
