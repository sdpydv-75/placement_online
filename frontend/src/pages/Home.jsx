import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <style>{`
        .home-wrapper {
          min-height: calc(100vh - 78px);
          width: 100%;
          background: radial-gradient(ellipse at bottom left, #0f1123 0%, #17153b 60%, #1e1b4b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 5%;
          position: relative;
          overflow: hidden;
        }

        .home-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
        }

        .home-left {
          flex: 1;
          max-width: 600px;
        }

        .home-title {
          font-size: clamp(2.5rem, 8vw, 4.8rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .home-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: #cbd5e1;
          margin-bottom: 2.5rem;
          line-height: 1.7;
          max-width: 500px;
        }

        .home-right {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .hero-img {
          width: 100%;
          max-width: 480px;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: 3rem;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);
          border: 4px solid rgba(255, 255, 255, 0.05);
          mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }

        @media (max-width: 1024px) {
          .home-container {
            flex-direction: column;
            text-align: center;
            gap: 3rem;
            padding-top: 2rem;
          }
          .home-left {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .home-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 480px) {
          .home-wrapper { padding: 3rem 1.5rem; }
          .hero-img { max-width: 100%; border-radius: 2rem; }
        }
      `}</style>

      <div className="home-wrapper">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: 0.08, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', right: '-10%', top: '-10%', width: '60vw', height: '120vh', background: 'linear-gradient(180deg, rgba(82, 92, 235, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)', borderTopLeftRadius: '50% 100%', borderBottomLeftRadius: '50% 100%', pointerEvents: 'none' }}></div>

        <div className="home-container">
          <div className="home-left">
            <h1 className="home-title animate-fade-in-up">
              Your Dream <br />
              <span style={{ background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Starts</span><br />
              Here
            </h1>

            <p className="home-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Most trusted placement platform connecting fresh talent with top companies. Find internships, jobs & campus drives.
            </p>

            <div className="animate-fade-in-up" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.2s' }}>
              <Link to="/jobs" style={{ padding: '0.9rem 2rem', fontWeight: '600', borderRadius: '12px', background: '#4f46e5', color: 'white', textDecoration: 'none', boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)' }}>
                Get Started →
              </Link>
              <Link to="/jobs" style={{ padding: '0.9rem 2rem', fontWeight: '500', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none' }}>
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="home-right animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <img
              src="/excited-businesswoman-showing-blank-placard-against-blue-background.jpg.jpeg"
              alt="Excited businesswoman"
              className="hero-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="animate-float" style={{ position: 'absolute', top: '5%', left: '5%', padding: '0.6rem 1.2rem', borderRadius: '100px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.85rem' }}>Trending</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
