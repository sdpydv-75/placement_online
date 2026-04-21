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
    <>
      <style>{`
        .search-section {
          background: linear-gradient(135deg, rgba(10,15,26,0.95) 0%, rgba(15,23,42,0.98) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2.5rem 1.5rem;
          backdrop-filter: blur(20px);
        }

        .search-form {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          borderRadius: 20px;
          padding: 1.2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .search-group {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 200px;
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          borderRadius: 12px;
          color: #fff;
          fontSize: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-select {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          borderRadius: 12px;
          color: #fff;
          fontSize: 0.95rem;
          outline: none;
          cursor: pointer;
          appearance: none;
        }

        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
          gap: 1.5rem;
        }

        .job-card {
          background: rgba(15,23,42,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          borderRadius: 20px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
        }

        @media (max-width: 768px) {
          .search-form {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .search-group { width: 100%; }
          .search-btn { width: 100%; justify-content: center; }
          .job-card { padding: 1.2rem; }
        }

        @media (max-width: 480px) {
          .search-section { padding: 1.5rem 1rem; }
          .search-form h2 { font-size: 1.4rem !important; }
        }
      `}</style>

      <div style={{ minHeight: 'calc(100vh - 78px)', backgroundColor: '#0f172a', paddingBottom: '4rem' }}>
        <div className="search-section">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>Explore Opportunities</h2>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748b" style={{ position: 'absolute', left: '12px' }}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input type="text" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="Skills, Titles..." className="search-input" />
              </div>

              <div className="search-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b" style={{ position: 'absolute', left: '12px' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} placeholder="Location..." className="search-input" />
              </div>

              <div className="search-group">
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className="search-select">
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <button type="submit" className="search-btn" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔍 Search
              </button>

              {hasFilters && (
                <button type="button" onClick={clearFilters} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.85rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Clear</button>
              )}
            </form>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900' }}>{hasFilters ? 'Filtered Results' : 'Explore All Jobs'}</h2>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1.25rem', borderRadius: '30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              {loading ? '...' : `${jobs.length} roles found`}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}><div className="animate-spin" style={{ fontSize: '3rem' }}>⌛</div></div>
          ) : (
            <div className="job-grid">
              {jobs.map(job => (
                <div key={job._id} className="job-card" onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem' }}>{job.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600' }}>{job.company}</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid rgba(59,130,246,0.2)' }}>{job.type}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <span>📍 {job.location}</span>
                    <span>💰 Competitive</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', flex: 1 }}>
                    {job.skills.map(s => (
                      <span key={s} style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>{s}</span>
                    ))}
                  </div>

                  <button onClick={() => navigate(`/job/${job._id}`)} style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => e.target.style.background = '#3b82f6'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>View Details →</button>
                </div>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>No Matches Found</h3>
              <button onClick={clearFilters} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Show All Jobs</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobListing;
