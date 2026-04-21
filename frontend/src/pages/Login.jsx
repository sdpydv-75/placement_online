import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Ensure backend is running.');
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        .login-page-wrap {
          min-height: calc(100vh - 78px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b111e;
          padding: 2rem 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 540px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }

        /* ── Left Panel (Form) ── */
        .login-left {
          flex: 1;
          background: #1a2740;
          padding: 3rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          width: 280px;
          height: 280px;
          background: rgba(52, 211, 153, 0.06);
          border-radius: 50%;
          top: -80px;
          left: -80px;
          pointer-events: none;
        }

        .login-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d6a4f, #52b788);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.4rem;
          box-shadow: 0 8px 24px rgba(52,211,153,0.3);
        }

        .login-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #f8fafc;
          margin: 0 0 0.4rem;
          line-height: 1.1;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 0.92rem;
          color: #7a9bb5;
          margin: 0 0 2rem;
        }

        .login-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #c8daea;
          margin-bottom: 0.45rem;
          letter-spacing: 0.3px;
        }

        .login-input-wrap {
          position: relative;
          margin-bottom: 1.4rem;
        }

        .login-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.18);
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .login-input::placeholder { color: rgba(255,255,255,0.3); }
        .login-input:focus { border-bottom-color: #34d399; }

        .show-pass-btn {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #7a9bb5;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: 'Poppins', sans-serif;
          padding: 0.3rem 0.5rem;
        }
        .show-pass-btn:hover { color: #34d399; }

        .login-forgot {
          display: block;
          text-align: right;
          font-size: 0.8rem;
          color: #7a9bb5;
          text-decoration: none;
          margin-top: -0.8rem;
          margin-bottom: 1.6rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-forgot:hover { color: #34d399; }

        .login-btn {
          width: 100%;
          padding: 0.95rem;
          background: linear-gradient(135deg, #f4c430 0%, #e9a20a 100%);
          border: none;
          border-radius: 10px;
          color: #1a1a1a;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 8px 24px rgba(244,196,48,0.35);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .login-btn:hover::after { opacity: 1; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(244,196,48,0.45); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .login-register-link {
          text-align: center;
          margin-top: 1.8rem;
          font-size: 0.88rem;
          color: #7a9bb5;
        }
        .login-register-link a {
          color: #34d399;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-register-link a:hover { color: #6ee7b7; }

        .login-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.2rem;
          text-align: center;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%,100% { transform:translateX(0); }
          25% { transform:translateX(-6px); }
          75% { transform:translateX(6px); }
        }

        /* ── Right Panel (Illustration) ── */
        .login-right {
          width: 380px;
          background: #1d6a3a;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Big yellow wave at bottom-right */
        .login-right-wave {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 75%;
          height: 80%;
          background: #f4c430;
          border-radius: 60% 0 0 0;
          z-index: 0;
        }

        /* Hanging lamp SVG */
        .lamp-left {
          position: absolute;
          top: 0;
          left: 25%;
          z-index: 2;
        }

        .lamp-right {
          position: absolute;
          top: 0;
          right: 22%;
          z-index: 2;
        }

        .login-character {
          position: relative;
          z-index: 3;
          width: 260px;
          object-fit: contain;
          margin-bottom: -4px;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.25));
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .login-card { max-width: 500px; flex-direction: column; }
          .login-right { width: 100%; min-height: 200px; padding: 2rem 1rem; }
          .login-character { width: 140px; }
          .login-right-wave { border-radius: 0; height: 100%; width: 100%; }
        }

        @media (max-width: 480px) {
          .login-page-wrap { padding: 1rem 0.5rem; }
          .login-left { padding: 2rem 1.2rem; }
          .login-title { font-size: 1.8rem; }
          .login-avatar { width: 60px; height: 60px; font-size: 1.5rem; }
          .login-right { display: none; } /* Hide illustration on very small screens for focus */
          .login-card { border-radius: 20px; box-shadow: none; background: #1a2740; }
        }
      `}</style>

      <div className="login-page-wrap">
        <div className="login-card">

          {/* ── Left: Form ── */}
          <div className="login-left">
            <div className="login-avatar">👤</div>
            <h1 className="login-title">WELCOME</h1>
            <p className="login-subtitle">Sign in to your placement account</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="login-input-wrap">
                <label className="login-label">Email Address</label>
                <input
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="login-input-wrap">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>

              <span className="login-forgot">Forgot Password?</span>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'LOGIN'}
              </button>
            </form>

            <div className="login-register-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="login-right">
            {/* Yellow wave */}
            <div className="login-right-wave"></div>

            {/* Lamp Left */}
            <svg className="lamp-left" width="60" height="120" viewBox="0 0 60 120" fill="none">
              <line x1="30" y1="0" x2="30" y2="45" stroke="#b0bec5" strokeWidth="3"/>
              <ellipse cx="30" cy="50" rx="18" ry="6" fill="#78909c"/>
              <path d="M14 50 Q10 82 30 90 Q50 82 46 50 Z" fill="#546e7a"/>
              <ellipse cx="30" cy="90" rx="8" ry="3" fill="#90a4ae" opacity="0.5"/>
            </svg>

            {/* Lamp Right */}
            <svg className="lamp-right" width="50" height="100" viewBox="0 0 50 100" fill="none">
              <line x1="25" y1="0" x2="25" y2="38" stroke="#b0bec5" strokeWidth="3"/>
              <ellipse cx="25" cy="42" rx="14" ry="5" fill="#78909c"/>
              <path d="M12 42 Q9 68 25 75 Q41 68 38 42 Z" fill="#546e7a"/>
              <ellipse cx="25" cy="75" rx="6" ry="2.5" fill="#90a4ae" opacity="0.5"/>
            </svg>

            {/* Right Panel Content */}
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0, left: 0, right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 3,
              padding: '0 1.5rem'
            }}>
              <img
                src="/image.png"
                alt="ITM Logo"
                style={{
                  width: '65px',
                  height: '65px',
                  objectFit: 'contain',
                  marginBottom: '0.8rem',
                  borderRadius: '50%',
                  background: 'white',
                  padding: '5px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  animation: 'float 4s ease-in-out infinite'
                }}
              />
              <h2 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.4rem',
                fontWeight: '900',
                color: '#ffffff',
                margin: '0 0 0.5rem'
              }}>ITM Placement Cell</h2>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: '500',
                lineHeight: '1.5',
                margin: '0 auto',
                maxWidth: '200px'
              }}>Your gateway to top companies & dream career opportunities</p>
            </div>


          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
