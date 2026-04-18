import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/content/stories');
        setStories(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch stories', err);
      }
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in-up">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1rem' }}>
          Wall of <span style={{ color: '#eab308' }}>Fame</span> 🏆
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Meet our stars who cracked top tier companies. Your dream company could be next on this wall!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '2rem' }}>
        {stories.map((story, i) => (
          <div key={i} className="card animate-fade-in-up" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', animationDelay: `${i * 0.15}s`, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', background: 'rgba(234, 179, 8, 0.1)', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '0 auto 1.5rem', border: '2px solid rgba(234, 179, 8, 0.3)' }}>
              {story.img}
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#f1f5f9', fontWeight: '800', marginBottom: '0.3rem' }}>{story.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{story.role}</p>
            <div style={{ background: 'rgba(15,23,42,0.8)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Placed In</div>
              <div style={{ color: '#3b82f6', fontWeight: '900', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{story.company}</div>
              <div style={{ color: '#10b981', fontWeight: '800', fontSize: '1rem' }}>💰 {story.package}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem' }} className="animate-fade-in-up">
        <Link to="/register" className="btn btn-glow" style={{ padding: '1rem 3rem' }}>Be The Next Success Story</Link>
      </div>
    </div>
  );
};

export default SuccessStories;
