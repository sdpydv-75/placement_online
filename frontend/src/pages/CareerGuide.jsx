import React from 'react';
import { Link } from 'react-router-dom';

const CareerGuide = () => {
  const guides = [
    { title: "Software Engineering", jobs: "5,000+", salary: "₹8L - ₹25L", color: "#3b82f6" },
    { title: "Data Science & AI", jobs: "2,500+", salary: "₹10L - ₹30L", color: "#8b5cf6" },
    { title: "Product Management", jobs: "1,200+", salary: "₹12L - ₹28L", color: "#ea580c" },
    { title: "Digital Marketing", jobs: "3,000+", salary: "₹5L - ₹15L", color: "#10b981" }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="animate-fade-in-up">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1rem' }}>
            Discover Your <span className="text-gradient">Path</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Detailed roadmaps, salary expectations, and required skills for top roles in the industry.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {guides.map((guide, i) => (
          <div key={i} className="card animate-fade-in-up" style={{ borderTop: `4px solid ${guide.color}`, padding: '1.5rem', animationDelay: `${i * 0.1}s` }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '800' }}>{guide.title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Open Roles:</span>
              <span style={{ color: guide.color, fontWeight: '700', fontSize: '0.9rem' }}>{guide.jobs}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Avg Salary:</span>
              <span style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '0.9rem' }}>{guide.salary}</span>
            </div>
            <Link to={`/jobs?keyword=${encodeURIComponent(guide.title)}`} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: guide.color, width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}>
              Explore Roles →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CareerGuide;
