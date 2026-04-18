import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CompanyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/content/reviews');
        setReviews(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in-up">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1rem' }}>
          Company <span className="text-gradient">Reviews</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Genuine feedback and ratings from our alumni network. Know your future employer before accepting the offer!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        {reviews.map((rev, i) => (
          <div key={i} className="card animate-fade-in-up" style={{ padding: '2rem', animationDelay: `${i * 0.15}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#f1f5f9', fontWeight: '800' }}>{rev.company}</h3>
              <div style={{ background: '#eab308', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                ⭐ {rev.rating}
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{rev.review}"</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
              — {rev.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyReviews;
