import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showInternships, setShowInternships] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [internshipTab, setInternshipTab] = useState('locations');
  const [jobsTab, setJobsTab] = useState('locations');
  const navigate = useNavigate();

  const handleLocationSearch = (loc) => {
    setShowInternships(false);
    setShowJobs(false);
    setShowCourses(false);
    setIsMobileMenuOpen(false);

    if (loc.includes('View all')) {
      navigate('/jobs');
      return;
    }

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
    setIsMobileMenuOpen(false);

    if (keyword.includes('View') || keyword.includes('Explore') || keyword.includes('Top Locations') || keyword === 'internship') {
      let url = '/jobs';
      if (keyword.includes('Internship') || keyword === 'internship') url += '?type=Internship';
      else if (keyword.includes('Jobs')) url += '?type=Full-time';
      navigate(url);
      return;
    }

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
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-container {
          background: rgba(10, 15, 26, 0.95);
          backdrop-filter: blur(20px);
          padding: 0 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 78px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
        }

        .nav-links-desktop {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-search-desktop {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 2rem;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 10px;
          z-index: 1001;
        }

        .hamburger span {
          width: 25px;
          height: 2px;
          background: #f1f5f9;
          transition: 0.3s;
          border-radius: 2px;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: #0f172a;
          padding: 80px 2rem 2rem;
          transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: 0.3s;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        @media (max-width: 1100px) {
          .nav-links-desktop { display: none; }
          .nav-search-desktop { display: none; }
          .hamburger { display: flex; }
          .nav-auth-desktop { display: none; }
        }

        @media (max-width: 480px) {
          .logo-text-full { display: none; }
          .logo-text-short { display: block !important; }
        }
      `}</style>

      <nav className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/image.png" alt="ITM Logo" style={{ height: '42px', marginRight: '0.8rem', borderRadius: '50%', boxShadow: '0 0 15px rgba(59,130,246,0.2)' }} />
            <div className="logo-text-full" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>ITM PLACEMENT</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700' }}>Institute of Technology & Management</span>
            </div>
            <span className="logo-text-short" style={{ display: 'none', fontSize: '1.2rem', fontWeight: '900', color: '#3b82f6' }}>ITM</span>
          </Link>

          {/* Desktop Search */}
          <div className="nav-search-desktop">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '0.55rem 1.2rem', width: '320px', background: 'rgba(255,255,255,0.04)' }}>
              <input name="searchQuery" type="text" placeholder="Search internships/jobs..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: '#f1f5f9' }} />
            </form>
          </div>

          {/* Desktop Links (Hidden on <1100px) */}
          <div className="nav-links-desktop">
             <Link to="/" style={{ color: '#f1f5f9', fontWeight: '600', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}>Home</Link>
             <Link to="/jobs?type=Internship" style={{ color: '#94a3b8', fontWeight: '500', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}>Internships</Link>
             <Link to="/jobs?type=Full-time" style={{ color: '#94a3b8', fontWeight: '500', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}>Jobs</Link>
             <Link to="/online-degree" style={{ color: '#ea580c', fontWeight: '600', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}>Courses</Link>
          </div>

          {/* Desktop Auth */}
          <div className="nav-auth-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {user ? (
               <>
                 <Link to="/dashboard" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>Dashboard</Link>
                 <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>Logout</button>
               </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: '600' }}>Login</Link>
                <Link to="/register" style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700' }}>Join</Link>
              </>
            )}
          </div>

          {/* Hamburger Icon */}
          <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: '600' }}>Home</Link>
        <Link to="/jobs?type=Internship" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: '600' }}>Internships</Link>
        <Link to="/jobs?type=Full-time" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: '600' }}>Jobs</Link>
        <Link to="/online-degree" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#ea580c', fontSize: '1.1rem', fontWeight: '700' }}>Courses</Link>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#94a3b8', fontSize: '1rem' }}>Dashboard</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#94a3b8', fontSize: '1rem' }}>Portfolio</Link>
            {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#3b82f6', fontWeight: '700' }}>⚙️ Admin Panel</Link>}
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: '700', marginTop: 'auto' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f1f5f9', fontSize: '1rem' }}>Login</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} style={{ background: '#3b82f6', color: '#fff', padding: '0.8rem', textAlign: 'center', borderRadius: '8px', fontWeight: '700' }}>Register</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;

export default Navbar;
