import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showInternships, setShowInternships] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [internshipTab, setInternshipTab] = useState('locations');
  const [jobsTab, setJobsTab] = useState('locations');
  const navigate = useNavigate();

  const handleLocationSearch = (loc) => {
    setShowInternships(false);
    setShowJobs(false);
    setShowCourses(false);

    if (loc.includes('View all')) {
      navigate('/jobs');
      return;
    }

    // Extract city from "Internship in X" or "Jobs in X"
    let city = loc;
    let isInternship = false;
    if (city.startsWith('Internship in ')) {
      city = city.replace('Internship in ', '');
      isInternship = true;
    }
    if (city.startsWith('Jobs in ')) {
      city = city.replace('Jobs in ', '');
    }

    if (loc === 'Work from home') {
      navigate('/jobs?location=Work from home');
    } else if (loc === 'International Internship') {
      navigate('/jobs?type=Internship');
    } else if (isInternship) {
      navigate(`/jobs?location=${encodeURIComponent(city)}&type=Internship`);
    } else {
      navigate(`/jobs?location=${encodeURIComponent(city)}`);
    }
  };

  const handleKeywordSearch = (keyword) => {
    setShowInternships(false);
    setShowJobs(false);
    setShowCourses(false);

    if (keyword.includes('View') || keyword.includes('Explore') || keyword.includes('Top Locations') || keyword === 'internship') {
      let url = '/jobs';
      if (keyword.includes('Internship') || keyword === 'internship') url += '?type=Internship';
      else if (keyword.includes('Jobs')) url += '?type=Full-time';
      navigate(url);
      return;
    }

    // Clean up keyword if it has emoji/badge text
    let cleanKw = keyword.replace('📈 Trending in AI', '').trim();
    let typeParam = '';

    if (cleanKw.endsWith(' Jobs')) {
      cleanKw = cleanKw.replace(' Jobs', '');
      typeParam = '&type=Full-time';
    } else if (cleanKw.endsWith(' Internship')) {
      cleanKw = cleanKw.replace(' Internship', '');
      typeParam = '&type=Internship';
    } else if (cleanKw === 'Fresher Jobs') {
      cleanKw = 'Fresher';
      typeParam = '&type=Full-time';
    }

    navigate(`/jobs?keyword=${encodeURIComponent(cleanKw)}${typeParam}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    if (query) {
      navigate(`/jobs?keyword=${query}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: 'rgba(10, 15, 26, 0.85)', backdropFilter: 'blur(20px)', padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100, height: '78px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 30px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Left Side: Logo & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/image.png" alt="ITM Logo" style={{ height: '48px', marginRight: '1rem', borderRadius: '50%', boxShadow: '0 0 20px rgba(59,130,246,0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                ITM PLACEMENT CELL
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.4px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Institute of Technology & Management</span>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem', height: '100%' }}>
            {/* Home Link */}
            <Link to="/" className="nav-item-active" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', color: '#f1f5f9', fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s', borderRadius: '10px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              Home
            </Link>

            {/* Internships Mega Menu Node */}
            <div
              onMouseEnter={() => setShowInternships(true)}
              onMouseLeave={() => setShowInternships(false)}
              style={{ position: 'relative', height: '72px', display: 'flex', alignItems: 'center', padding: '0 1rem', background: showInternships ? 'rgba(234,88,12,0.1)' : 'transparent', transition: 'background 0.2s', borderRadius: '8px' }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: showInternships ? '600' : '500', cursor: 'pointer', color: showInternships ? '#ea580c' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Internships
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: showInternships ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10l5 5 5-5z" /></svg>
              </span>

              {showInternships && (
                <div style={{ position: 'absolute', top: '72px', left: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '600px', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', display: 'flex', cursor: 'default', borderRadius: '0 0 12px 12px' }}>
                  <div style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0' }}>
                    <div className="nav-hover-orange" onMouseEnter={() => setInternshipTab('locations')} onClick={() => setInternshipTab('locations')} style={{ padding: '0.8rem 1.5rem', background: internshipTab === 'locations' ? 'rgba(234,88,12,0.1)' : 'transparent', color: internshipTab === 'locations' ? '#ea580c' : '#94a3b8', fontWeight: internshipTab === 'locations' ? '500' : 'normal', cursor: 'pointer' }}>Top Locations</div>
                    <div className="nav-hover-orange" onMouseEnter={() => setInternshipTab('profile')} onClick={() => setInternshipTab('profile')} style={{ padding: '0.8rem 1.5rem', background: internshipTab === 'profile' ? 'rgba(234,88,12,0.1)' : 'transparent', color: internshipTab === 'profile' ? '#ea580c' : '#94a3b8', fontWeight: internshipTab === 'profile' ? '500' : 'normal', cursor: 'pointer' }}>Profile</div>
                    <div className="nav-hover-orange" onMouseEnter={() => setInternshipTab('categories')} onClick={() => setInternshipTab('categories')} style={{ padding: '0.8rem 1.5rem', background: internshipTab === 'categories' ? 'rgba(234,88,12,0.1)' : 'transparent', color: internshipTab === 'categories' ? '#ea580c' : '#94a3b8', fontWeight: internshipTab === 'categories' ? '500' : 'normal', cursor: 'pointer' }}>Top Categories</div>
                    <div className="nav-hover-orange" onClick={() => handleKeywordSearch('All Internships')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer' }}>Explore More Internships</div>
                    <div className="nav-hover-orange" onClick={() => navigate('/online-degree')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      Online Placement Courses
                      <span style={{ background: '#ea580c', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700', marginLeft: '0.4rem' }}>NEW</span>
                    </div>
                    <div className="nav-hover-orange" onClick={() => navigate('/certified-internship')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                      ITM Certified Internship
                      <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700', marginLeft: '0.4rem' }}>PREMIUM</span>
                    </div>
                  </div>
                  <div style={{ width: '55%', padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'grid', gap: '1.1rem' }}>
                      {internshipTab === 'locations' && ['Work from home', 'Internship in Bangalore', 'Internship in Delhi', 'Internship in Hyderabad', 'Internship in Mumbai', 'Internship in Chennai', 'Internship in Pune', 'Internship in Kolkata', 'Internship in Jaipur', 'International Internship', 'View all internships'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleLocationSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                      {internshipTab === 'profile' && ['Computer Science Internship', 'Marketing Internship', 'Finance Internship', 'Graphic Design Internship', 'Data Science Internship', 'HR Internship', 'Law Internship', 'Electronics Internship', 'Civil Internship', 'View all profiles'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleKeywordSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                      {internshipTab === 'categories' && ['Engineering Internship', 'MBA Internship', 'Part-time Internship', 'NGO Internship', 'Design Internship', 'Science Internship', 'Media Internship', 'Humanities Internship', 'View all categories'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleKeywordSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Jobs Mega Menu Node */}
            <div
              onMouseEnter={() => setShowJobs(true)}
              onMouseLeave={() => setShowJobs(false)}
              style={{ position: 'relative', height: '72px', display: 'flex', alignItems: 'center', padding: '0 1rem', background: showJobs ? 'rgba(234,88,12,0.1)' : 'transparent', transition: 'background 0.2s', borderRadius: '8px' }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: showJobs ? '600' : '500', cursor: 'pointer', color: showJobs ? '#ea580c' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Jobs
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: showJobs ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10l5 5 5-5z" /></svg>
              </span>

              {showJobs && (
                <div style={{ position: 'absolute', top: '72px', left: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '600px', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', display: 'flex', cursor: 'default', borderRadius: '0 0 12px 12px' }}>
                  <div style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0' }}>
                    <div className="nav-hover-orange" onMouseEnter={() => setJobsTab('locations')} onClick={() => setJobsTab('locations')} style={{ padding: '0.8rem 1.5rem', background: jobsTab === 'locations' ? 'rgba(234,88,12,0.1)' : 'transparent', color: jobsTab === 'locations' ? '#ea580c' : '#94a3b8', fontWeight: jobsTab === 'locations' ? '500' : 'normal', cursor: 'pointer' }}>Top Locations</div>
                    <div className="nav-hover-orange" onMouseEnter={() => setJobsTab('categories')} onClick={() => setJobsTab('categories')} style={{ padding: '0.8rem 1.5rem', background: jobsTab === 'categories' ? 'rgba(234,88,12,0.1)' : 'transparent', color: jobsTab === 'categories' ? '#ea580c' : '#94a3b8', fontWeight: jobsTab === 'categories' ? '500' : 'normal', cursor: 'pointer' }}>Top Categories</div>
                    <div className="nav-hover-orange" onClick={() => handleKeywordSearch('Fresher Jobs')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer' }}>Fresher Jobs</div>
                    <div className="nav-hover-orange" onClick={() => handleKeywordSearch('Explore More Jobs')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer' }}>Explore More Jobs</div>
                    <div className="nav-hover-orange" onClick={() => navigate('/online-degree')} style={{ padding: '0.8rem 1.5rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      Online Placement Courses
                      <span style={{ background: '#ea580c', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700', marginLeft: '0.4rem' }}>NEW</span>
                    </div>
                  </div>
                  <div style={{ width: '55%', padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'grid', gap: '1.1rem' }}>
                      {jobsTab === 'locations' && ['Work from home', 'Jobs in Bangalore', 'Jobs in Delhi', 'Jobs in Hyderabad', 'Jobs in Gurgaon', 'Jobs in Kolkata', 'Jobs in Mumbai', 'Jobs in Pune', 'Jobs in Chennai', 'Jobs in Noida', 'Jobs in Jaipur'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleLocationSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                      {jobsTab === 'categories' && ['Engineering Jobs', 'MBA Jobs', 'Marketing Jobs', 'Finance Jobs', 'Design Jobs', 'HR Jobs', 'Sales Jobs', 'Operations Jobs', 'IT Jobs', 'View all categories'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleKeywordSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              onMouseEnter={() => setShowCourses(true)}
              onMouseLeave={() => setShowCourses(false)}
              style={{ position: 'relative', height: '72px', display: 'flex', alignItems: 'center', padding: '0 1rem', background: showCourses ? 'rgba(234,88,12,0.1)' : 'transparent', transition: 'background 0.2s', borderRadius: '8px' }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: showCourses ? '600' : '500', cursor: 'pointer', color: showCourses ? '#ea580c' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Courses
                <span style={{ background: '#ea580c', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700', marginLeft: '0.2rem' }}>OFFER</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: showCourses ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10l5 5 5-5z" /></svg>
              </span>

              {showCourses && (
                <div style={{ position: 'absolute', top: '72px', left: '-150px', background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '600px', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', display: 'flex', cursor: 'default', padding: '1.5rem 0', borderRadius: '0 0 12px 12px' }}>

                  {/* Column 1 - Online Placement Courses */}
                  <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' }}>
                    <h4 style={{ color: '#f1f5f9', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: '700' }}>Online Placement Courses</h4>
                    <div style={{ display: 'grid', gap: '1.1rem' }}>
                      {['Full Stack Development Course', 'Data Science Course', 'Human Resource Management Course', 'Digital Marketing Course', 'UI/UX Design Course', 'Product Management Course', 'Financial Modelling Course', 'Supply Chain Logistics Course'].map(item => (
                        <div key={item} className="nav-hover-orange" onClick={() => handleKeywordSearch(item)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2 - Online Degrees */}
                  <div style={{ flex: 0.8, padding: '0 1.5rem' }}>
                    <h4 style={{ color: '#f1f5f9', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: '700' }}>Online Degrees</h4>
                    <div style={{ display: 'grid', gap: '1.1rem' }}>
                      {[
                        { label: 'Online MBA', code: 'MBA' },
                        { label: 'Online BCA', code: 'BCA' },
                        { label: 'Online MCA', code: 'MCA' },
                        { label: 'Online BBA', code: 'BBA' },
                        { label: 'Online MA', code: 'MA' },
                        { label: 'Online MSc', code: 'MSc' }
                      ].map(item => (
                        <div key={item.code} className="nav-hover-orange" onClick={() => navigate(`/online-degree?program=${item.code}`)} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem' }}>{item.label}</div>
                      ))}
                      <div className="nav-hover-orange" onClick={() => navigate('/online-degree?program=MBA')} style={{ color: '#ea580c', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', marginTop: '0.5rem' }}>View all →</div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Integrated Search Box */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '0.55rem 1.2rem', width: '280px', background: 'rgba(255,255,255,0.04)', transition: 'all 0.3s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748b" style={{ marginRight: '0.6rem' }}>
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input name="searchQuery" type="text" placeholder="Search jobs..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#f1f5f9', fontWeight: '500' }} />
          </form>
        </div>

        {/* Right Side: Primary Auth Anchors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {user ? (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/jobs" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}>Dashboard</Link>
                  <Link to="/profile" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}>Portfolio</Link>
                </>
              )}
              {(user.role === 'recruiter' || user.role === 'admin') && (
                <>
                  <Link to="/post-job" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: '500', fontSize: '0.95rem' }}>Post Job</Link>
                  <Link to="/applicants" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: '500', fontSize: '0.95rem' }}>Candidates</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 2px 10px rgba(59,130,246,0.3)' }}>⚙️ Admin</Link>
              )}

              <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.4rem 1.2rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9', padding: '0.45rem 1.4rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', transition: 'all 0.3s', background: 'rgba(255,255,255,0.03)' }}>
                Login
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
                Register
              </Link>
              <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0.5rem' }}></div>
              <Link to="/register" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}>
                Employer sign up
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
