import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer-container {
          background: linear-gradient(180deg, rgba(10,15,26,0.95) 0%, rgba(5,8,15,1) 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 0;
          marginTop: auto;
          font-family: inherit;
        }
        
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            padding: 3rem 1.5rem 1.5rem;
            text-align: center;
          }
          .footer-grid > div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-grid h4 span {
            left: 50% !important;
            transform: translateX(-50%);
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      <footer className="footer-container">
        {/* Main Footer */}
        <div className="footer-grid">
  
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <img src="/image.png" alt="ITM Logo" style={{ height: '45px', borderRadius: '50%', boxShadow: '0 0 20px rgba(59,130,246,0.2)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '900', fontSize: '1.1rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ITM PLACEMENT CELL</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>INSTITUTE OF TECHNOLOGY & MANAGEMENT</div>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.7' }}>
              India's #1 platform for fresher jobs, internships, and campus placements. Connecting talent with top companies.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              {['LinkedIn', 'Twitter', 'Instagram'].map(social => (
                <a key={social} href="#" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.8rem',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}>
                  {social}
                </a>
              ))}
            </div>
          </div>
  
          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', position: 'relative', paddingBottom: '0.8rem' }}>
              Quick Links
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '2px' }}></span>
            </h4>
            {[
              { label: 'Browse Jobs', to: '/jobs?type=Full-time' },
              { label: 'Browse Internships', to: '/jobs?type=Internship' },
              { label: 'Campus Placements', to: '/campus-placements' },
              { label: 'Company Reviews', to: '/company-reviews' },
              { label: 'Success Stories', to: '/success-stories' }
            ].map(link => (
              <Link key={link.label} to={link.to} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.8rem', transition: 'all 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </div>
  
          {/* Resources */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', position: 'relative', paddingBottom: '0.8rem' }}>
              Resources
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'linear-gradient(90deg, #ea580c, #f97316)', borderRadius: '2px' }}></span>
            </h4>
            {[
              { label: 'Resume Builder', to: '/resume-builder' },
              { label: 'Interview Prep', to: '/interview-prep' },
              { label: 'Career Guide', to: '/career-guide' },
              { label: 'Certification Courses', to: '/online-degree' },
              { label: 'Skill Assessment', to: '/interview-prep' }
            ].map(link => (
              <Link key={link.label} to={link.to} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.8rem', transition: 'all 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </div>
  
          {/* Contact */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', position: 'relative', paddingBottom: '0.8rem' }}>
              Contact Us
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '2px' }}></span>
            </h4>
            <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '2' }}>
              <div>📧 placement@itm.edu</div>
              <div>📞 +91 9120592783</div>
              <div>📍 ITM Campus, GIDA Gorakhpur</div>
            </div>
            <div style={{ marginTop: '1.5rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '12px', padding: '1rem', width: '100%', maxWidth: '200px' }}>
              <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.8rem', marginBottom: '0.3rem' }}>🚀 10,000+</div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Students placed successfully</div>
            </div>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: '500' }}>
            © {new Date().getFullYear()} ITM Placement Cell. Built with ❤️ for students.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ color: '#475569', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
