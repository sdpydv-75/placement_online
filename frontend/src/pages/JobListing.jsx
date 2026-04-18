import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const locationHook = useLocation();

  // Parse current filters from URL
  const params = new URLSearchParams(locationHook.search);
  const currentKeyword = params.get('keyword') || '';
  const currentLocation = params.get('location') || '';
  const currentType = params.get('type') || '';

  // Local input state for search bar
  const [searchKeyword, setSearchKeyword] = useState(currentKeyword);
  const [searchLocation, setSearchLocation] = useState(currentLocation);
  const [searchType, setSearchType] = useState(currentType);

  // Sync local state when URL changes (e.g. from Navbar)
  useEffect(() => {
    setSearchKeyword(currentKeyword);
    setSearchLocation(currentLocation);
    setSearchType(currentType);
  }, [currentKeyword, currentLocation, currentType]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs${locationHook.search}`);
        setJobs(res.data.data);
      } catch (err) {
        console.error('Error fetching jobs', err);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [locationHook.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParts = [];
    if (searchKeyword.trim()) queryParts.push(`keyword=${encodeURIComponent(searchKeyword.trim())}`);
    if (searchLocation.trim()) queryParts.push(`location=${encodeURIComponent(searchLocation.trim())}`);
    if (searchType) queryParts.push(`type=${encodeURIComponent(searchType)}`);
    navigate(`/jobs${queryParts.length ? '?' + queryParts.join('&') : ''}`);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSearchLocation('');
    setSearchType('');
    navigate('/jobs');
  };

  const hasFilters = currentKeyword || currentLocation || currentType;

  return (
    <div style={{
      minHeight: 'calc(100vh - 78px)',
      backgroundColor: '#1f2937',
      paddingBottom: '4rem'
    }}>
      {/* Search Bar Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,15,26,0.95) 0%, rgba(15,23,42,0.98) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 1rem',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.6rem',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}>
            Find Your Perfect Job
          </h2>

          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '1rem'
          }}>
            {/* Keyword Input */}
            <div style={{ flex: '2 1 220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748b" style={{ position: 'absolute', left: '12px', flexShrink: 0 }}>
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="Job title, skills, company..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f1f5f9',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Location Input */}
            <div style={{ flex: '1 1 160px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b" style={{ position: 'absolute', left: '12px', flexShrink: 0 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <input
                type="text"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                placeholder="Location..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f1f5f9',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Job Type Dropdown */}
            <div style={{ flex: '1 1 140px' }}>
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: searchType ? '#f1f5f9' : '#64748b',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>All Types</option>
                <option value="Full-time" style={{ background: '#0f172a', color: '#f1f5f9' }}>Full-time</option>
                <option value="Internship" style={{ background: '#0f172a', color: '#f1f5f9' }}>Internship</option>
                <option value="Part-time" style={{ background: '#0f172a', color: '#f1f5f9' }}>Part-time</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              style={{
                flex: '0 0 auto',
                padding: '0.75rem 1.8rem',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              🔍 Search
            </button>

            {/* Clear Button */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  flex: '0 0 auto',
                  padding: '0.75rem 1.2rem',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  color: '#ef4444',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ✕ Clear
              </button>
            )}
          </form>

          {/* Active Filter Tags */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Active filters:</span>
              {currentKeyword && (
                <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(59,130,246,0.25)' }}>
                  🔍 {currentKeyword}
                </span>
              )}
              {currentLocation && (
                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(16,185,129,0.25)' }}>
                  📍 {currentLocation}
                </span>
              )}
              {currentType && (
                <span style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(139,92,246,0.25)' }}>
                  💼 {currentType}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        {/* Count Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#f1f5f9', fontWeight: '800' }}>
            {hasFilters ? 'Search Results' : 'All Jobs'} <span style={{ fontSize: '1.3rem' }}>📈</span>
          </h2>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {loading ? '...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>⚡</div>
            <div style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>Finding the best jobs for you...</div>
          </div>
        ) : (
          /* Job Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {jobs.map(job => (
              <div key={job._id} style={{
                background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                padding: '1.8rem', display: 'flex', flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(59,130,246,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '0.3rem', fontWeight: '700' }}>{job.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>{job.company}</p>
                  </div>
                  <span style={{
                    background: job.type === 'Full-time' ? 'rgba(16,185,129,0.1)' : job.type === 'Internship' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                    color: job.type === 'Full-time' ? '#10b981' : job.type === 'Internship' ? '#3b82f6' : '#8b5cf6',
                    padding: '0.25rem 0.7rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0,
                    border: `1px solid ${job.type === 'Full-time' ? 'rgba(16,185,129,0.2)' : job.type === 'Internship' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)'}`
                  }}>
                    {job.type}
                  </span>
                </div>

                <div style={{ color: '#64748b', marginBottom: '1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📍 {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>💼 {job.type}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', flex: 1 }}>
                  {job.skills.map(skill => (
                    <span key={skill} style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', padding: '0.25rem 0.7rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '500', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    Actively hiring
                  </span>
                  <button
                    onClick={() => navigate(`/job/${job._id}`)}
                    style={{
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                      color: '#3b82f6', padding: '0.45rem 1.2rem', borderRadius: '10px',
                      fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(59,130,246,0.2)'; }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(59,130,246,0.1)'; }}
                  >
                    View details →
                  </button>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ color: '#f1f5f9', marginBottom: '0.5rem' }}>No jobs found</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try a different keyword, location, or remove some filters.</p>
                <button onClick={clearFilters} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
                  View All Jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;
