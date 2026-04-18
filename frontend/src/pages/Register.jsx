import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Ensure backend is running.');
      } else {
        setError(err.response?.data?.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        .reg-page-wrap {
          min-height: calc(100vh - 78px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b111e;
          padding: 2rem 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .reg-card {
          display: flex;
          width: 100%;
          max-width: 920px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }

        /* ── Left Panel (Form) ── */
        .reg-left {
          flex: 1;
          background: #1a2740;
          padding: 2.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .reg-left::before {
          content: '';
          position: absolute;
          width: 250px; height: 250px;
          background: rgba(52,211,153,0.06);
          border-radius: 50%;
          top: -70px; left: -70px;
          pointer-events: none;
        }

        .reg-avatar {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d6a4f, #52b788);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.7rem;
          margin-bottom: 1.2rem;
          box-shadow: 0 8px 24px rgba(52,211,153,0.3);
        }

        .reg-title {
          font-size: 1.9rem;
          font-weight: 900;
          color: #f8fafc;
          margin: 0 0 0.3rem;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
        }

        .reg-subtitle {
          font-size: 0.88rem;
          color: #7a9bb5;
          margin: 0 0 1.6rem;
        }

        .reg-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #c8daea;
          margin-bottom: 0.4rem;
          letter-spacing: 0.3px;
        }

        .reg-input-wrap {
          position: relative;
          margin-bottom: 1.2rem;
        }

        .reg-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.18);
          color: #f1f5f9;
          font-size: 0.92rem;
          outline: none;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.28); }
        .reg-input:focus { border-bottom-color: #34d399; }

        .reg-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(15,23,42,0.4);
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.18);
          color: #f1f5f9;
          font-size: 0.92rem;
          outline: none;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s;
          box-sizing: border-box;
          cursor: pointer;
        }
        .reg-select:focus { border-bottom-color: #34d399; }
        .reg-select option { background: #1a2740; }

        .reg-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #f4c430 0%, #e9a20a 100%);
          border: none;
          border-radius: 10px;
          color: #1a1a1a;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 8px 24px rgba(244,196,48,0.35);
          transition: all 0.3s;
          margin-top: 0.5rem;
        }
        .reg-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(244,196,48,0.45); }
        .reg-btn:active { transform: translateY(0); }
        .reg-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .reg-login-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #7a9bb5;
        }
        .reg-login-link a {
          color: #34d399;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .reg-login-link a:hover { color: #6ee7b7; }

        .reg-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: 1rem;
          text-align: center;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          25% { transform:translateX(-6px); }
          75% { transform:translateX(6px); }
        }

        /* ── Right Panel ── */
        .reg-right {
          width: 360px;
          background: #1d6a3a;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reg-right-wave {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 75%;
          height: 78%;
          background: #f4c430;
          border-radius: 60% 0 0 0;
          z-index: 0;
        }

        .reg-lamp-left {
          position: absolute;
          top: 0; left: 22%;
          z-index: 2;
        }
        .reg-lamp-right {
          position: absolute;
          top: 0; right: 20%;
          z-index: 2;
        }

        /* Floating text / branding in right panel */
        .reg-right-content {
          position: relative;
          z-index: 3;
          text-align: center;
          padding-bottom: 3rem;
        }
        .reg-right-icon {
          font-size: 4.5rem;
          margin-bottom: 1.2rem;
          display: block;
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.25));
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .reg-right-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 0.6rem;
        }
        .reg-right-sub {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          line-height: 1.5;
          max-width: 200px;
          margin: 0 auto;
        }

        .reg-right-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 3;
        }
        .reg-right-dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(29,106,58,0.4);
        }
        .reg-right-dots span.active { background: #1d6a3a; }

        /* Responsive */
        @media (max-width: 720px) {
          .reg-card { flex-direction: column; max-width: 420px; }
          .reg-right { width: 100%; min-height: 200px; }
          .reg-left { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="reg-page-wrap">
        <div className="reg-card">

          {/* ── Left: Form ── */}
          <div className="reg-left">
            <div className="reg-avatar">🚀</div>
            <h1 className="reg-title">Create Account</h1>
            <p className="reg-subtitle">Start your placement journey today</p>

            {error && <div className="reg-error">{error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="reg-input-wrap">
                <label className="reg-label">Full Name</label>
                <input className="reg-input" type="text" required placeholder="John Doe"
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="reg-input-wrap">
                <label className="reg-label">Email Address</label>
                <input className="reg-input" type="email" required placeholder="you@example.com"
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="reg-input-wrap">
                <label className="reg-label">Password</label>
                <input className="reg-input" type="password" required minLength="6" placeholder="Min 6 characters"
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div className="reg-input-wrap">
                <label className="reg-label">I am a...</label>
                <select className="reg-select" onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="student">Student looking for jobs</option>
                  <option value="recruiter">Employer / Recruiter</option>
                  <option value="admin">Administrator / Admin</option>
                </select>
              </div>

              {formData.role === 'recruiter' && (
                <div className="reg-input-wrap" style={{ animation: 'fadeIn 0.3s ease' }}>
                  <label className="reg-label">Company Name</label>
                  <input className="reg-input" type="text" required placeholder="Your Company Name"
                    onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
              )}

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? 'Creating...' : formData.role === 'recruiter' ? 'CREATE EMPLOYER ACCOUNT' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="reg-login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="reg-right">
            <div className="reg-right-wave"></div>

            {/* Lamp Left */}
            <svg className="reg-lamp-left" width="58" height="115" viewBox="0 0 60 120" fill="none">
              <line x1="30" y1="0" x2="30" y2="45" stroke="#b0bec5" strokeWidth="3"/>
              <ellipse cx="30" cy="50" rx="18" ry="6" fill="#78909c"/>
              <path d="M14 50 Q10 82 30 90 Q50 82 46 50 Z" fill="#546e7a"/>
              <ellipse cx="30" cy="90" rx="8" ry="3" fill="#90a4ae" opacity="0.5"/>
            </svg>

            {/* Lamp Right */}
            <svg className="reg-lamp-right" width="48" height="96" viewBox="0 0 50 100" fill="none">
              <line x1="25" y1="0" x2="25" y2="38" stroke="#b0bec5" strokeWidth="3"/>
              <ellipse cx="25" cy="42" rx="14" ry="5" fill="#78909c"/>
              <path d="M12 42 Q9 68 25 75 Q41 68 38 42 Z" fill="#546e7a"/>
              <ellipse cx="25" cy="75" rx="6" ry="2.5" fill="#90a4ae" opacity="0.5"/>
            </svg>

            {/* Right Panel Content */}
            <div className="reg-right-content">
              <span className="reg-right-icon">🎓</span>
              <h2 className="reg-right-heading">Join ITM Portal</h2>
              <p className="reg-right-sub">Connect with top recruiters & launch your career today</p>
            </div>

            <div className="reg-right-dots">
              <span className="active"></span>
              <span></span>
              <span></span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;
