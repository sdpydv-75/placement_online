import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 78px)', 
      width: '100%',
      background: 'radial-gradient(ellipse at bottom left, #0f1123 0%, #17153b 60%, #1e1b4b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 5%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative stars / dots overlay */}
      <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0
      }}></div>

      {/* The curved swoosh shape behind the illustration */}
      <div style={{ 
          position: 'absolute', 
          right: '-5%', 
          top: '-10%', 
          width: '55vw', 
          height: '120vh', 
          background: 'linear-gradient(180deg, rgba(82, 92, 235, 0.4) 0%, rgba(139, 92, 246, 0.2) 100%)', 
          borderTopLeftRadius: '50% 100%',
          borderBottomLeftRadius: '50% 100%',
          boxShadow: 'inset 20px 0 60px rgba(255,255,255,0.05)',
          zIndex: 0, 
          pointerEvents: 'none' 
      }}></div>

      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: '350px', height: '350px', background: 'rgba(124, 58, 237, 0.25)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '15%', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 300px', maxWidth: '100%', marginTop: '-2rem' }}>
          <h1 className="animate-fade-in-up" style={{ 
            fontSize: 'Clamp(3.5rem, 5vw, 4.8rem)', 
            fontWeight: '900', 
            lineHeight: '1.15', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            Your Dream <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #c084fc)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              display: 'inline-block' 
            }}>Career Starts</span><br />
            Here
          </h1>

          <p className="animate-fade-in-up" style={{ 
            fontSize: '1.15rem', 
            color: '#cbd5e1', 
            marginBottom: '2.5rem', 
            maxWidth: '500px', 
            lineHeight: '1.7', 
            animationDelay: '0.1s',
            fontWeight: '400'
          }}>
            Most trusted placement platform connecting fresh talent with top companies. Find internships, jobs & campus drives.
          </p>

          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.2s' }}>
            <Link to="/jobs" style={{ 
              padding: '0.9rem 2rem', 
              fontSize: '1.05rem', 
              fontWeight: '600',
              borderRadius: '8px',
              background: '#4f46e5',
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(79, 70, 229, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(79, 70, 229, 0.6), inset 0 1px 1px rgba(255,255,255,0.2)'; e.currentTarget.style.background = '#6366f1'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)'; e.currentTarget.style.background = '#4f46e5'; }}
            >
              Get Started →
            </Link>
            
            <Link to="/jobs" style={{ 
              padding: '0.9rem 2rem', 
              fontSize: '1.05rem', 
              fontWeight: '500',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-white)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
            >
              Browse Jobs →
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="animate-fade-in-up" style={{ flex: '1 1 300px', maxWidth: '100%', display: 'flex', justifyContent: 'center', position: 'relative', animationDelay: '0.3s' }}>
          
          <img 
            src="/excited-businesswoman-showing-blank-placard-against-blue-background.jpg.jpeg" 
            alt="Excited businesswoman" 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              aspectRatio: '4/5',
              objectFit: 'cover',
              objectPosition: 'center top',
              zIndex: 2,
              borderRadius: '3rem',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 50px rgba(139, 92, 246, 0.3)',
              border: '4px solid rgba(255, 255, 255, 0.05)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          {/* Floating 'Trending' Badge */}
          <div className="animate-float" style={{ 
            position: 'absolute', 
            top: '8%', 
            left: '8%', 
            padding: '0.55rem 1.1rem', 
            borderRadius: '24px',
            background: 'rgba(30, 27, 75, 0.9)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            zIndex: 3
          }}>
            <span style={{ fontSize: '1.2rem' }}>🔥</span>
            <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.9rem', letterSpacing: '0.3px' }}>Trending</span>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          div[style*="flexDirection: 'row'"] {
            flex-direction: column !important;
            text-align: center;
            gap: 3rem !important;
          }
          div[style*="maxWidth: '600px'"] {
            margin: 0 auto !important;
          }
          div[style*="flexWrap: 'wrap'"] {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
