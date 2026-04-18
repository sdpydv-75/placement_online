import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const OnlineDegree = () => {
  const [searchParams] = useSearchParams();
  const degreeParam = searchParams.get('program') || 'MBA';
  
  const [formData, setFormData] = useState({
    name: '', fatherName: '', dob: '', aadhar: '', ugNumber: '', phone: '', email: '', university: 'Dr. A.P.J. Abdul Kalam Technical University'
  });
  const [showCert, setShowCert] = useState(false);
  const [certNumber] = useState(`ITM/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`);
  const certRef = useRef(null);

  const degreePrograms = {
    'MBA': { full: 'Master of Business Administration', duration: '2 Years', type: 'Post Graduate' },
    'BCA': { full: 'Bachelor of Computer Application', duration: '3 Years', type: 'Under Graduate' },
    'MCA': { full: 'Master of Computer Application', duration: '2 Years', type: 'Post Graduate' },
    'BBA': { full: 'Bachelor of Business Administration', duration: '3 Years', type: 'Under Graduate' },
    'MA': { full: 'Master of Arts', duration: '2 Years', type: 'Post Graduate' },
    'MSc': { full: 'Master of Science', duration: '2 Years', type: 'Post Graduate' }
  };

  const currentProgram = degreePrograms[degreeParam] || degreePrograms['MBA'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.aadhar.length !== 12) {
      alert('Aadhaar number must be 12 digits');
      return;
    }
    setShowCert(true);
  };

  const handleDownload = () => {
    const cert = certRef.current;
    if (!cert) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ITM Degree Certificate - ${formData.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
            @media print { body { background: white; } .cert-wrapper { box-shadow: none !important; } }
            .cert-wrapper {
              width: 900px; height: 640px; background: white; position: relative;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;
            }
            .cert-border {
              position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px;
              border: 3px solid #1a365d; border-radius: 4px;
            }
            .cert-border-inner {
              position: absolute; top: 18px; left: 18px; right: 18px; bottom: 18px;
              border: 1px solid #c9a94e;
            }
            .cert-corner { position: absolute; width: 60px; height: 60px; }
            .cert-corner.tl { top: 22px; left: 22px; border-top: 3px solid #c9a94e; border-left: 3px solid #c9a94e; }
            .cert-corner.tr { top: 22px; right: 22px; border-top: 3px solid #c9a94e; border-right: 3px solid #c9a94e; }
            .cert-corner.bl { bottom: 22px; left: 22px; border-bottom: 3px solid #c9a94e; border-left: 3px solid #c9a94e; }
            .cert-corner.br { bottom: 22px; right: 22px; border-bottom: 3px solid #c9a94e; border-right: 3px solid #c9a94e; }
            .cert-content { position: relative; z-index: 10; padding: 40px 60px; text-align: center; height: 100%; display: flex; flex-direction: column; }
            .cert-header { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 8px; }
            .cert-logo { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #1a365d; }
            .college-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: #1a365d; letter-spacing: 1px; }
            .college-sub { font-family: 'Inter', sans-serif; font-size: 10px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
            .college-addr { font-family: 'Inter', sans-serif; font-size: 9px; color: #94a3b8; margin-top: 2px; }
            .cert-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #c9a94e; margin: 12px 0 4px; letter-spacing: 3px; }
            .cert-subtitle { font-family: 'Inter', sans-serif; font-size: 11px; color: #64748b; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 14px; }
            .cert-text { font-family: 'Inter', sans-serif; font-size: 13px; color: #475569; line-height: 1.9; flex: 1; display: flex; flex-direction: column; justify-content: center; }
            .student-name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #1a365d; border-bottom: 2px solid #c9a94e; padding-bottom: 4px; display: inline-block; margin: 4px 0; }
            .degree-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: #1a365d; margin: 2px 0; }
            .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 16px; }
            .footer-col { text-align: center; }
            .signature-line { width: 140px; border-top: 1px solid #1a365d; margin: 0 auto 4px; }
            .footer-label { font-family: 'Inter', sans-serif; font-size: 9px; color: #64748b; font-weight: 600; }
            .cert-no { font-family: 'Inter', sans-serif; font-size: 9px; color: #94a3b8; }
            .cert-seal { width: 60px; height: 60px; border: 2px solid #c9a94e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 10px; color: #c9a94e; font-weight: 700; }
            .detail-row { display: flex; justify-content: center; gap: 30px; font-size: 10px; color: #64748b; margin-top: 6px; font-family: 'Inter', sans-serif; }
            .no-print { text-align: center; margin: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="cert-wrapper">
            <div class="cert-border"></div>
            <div class="cert-border-inner"></div>
            <div class="cert-corner tl"></div>
            <div class="cert-corner tr"></div>
            <div class="cert-corner bl"></div>
            <div class="cert-corner br"></div>
            <div class="cert-content">
              <div class="cert-header">
                <img src="/image.png" class="cert-logo" alt="ITM Logo" />
                <div>
                  <div class="college-name">${formData.university.toUpperCase()}</div>
                  <div class="college-sub">ITM INSTITUTE OF TECHNOLOGY & MANAGEMENT, GIDA, GORAKHPUR</div>
                </div>
              </div>
              <div class="cert-title">CERTIFICATE</div>
              <div class="cert-subtitle">of ${currentProgram.type} Degree</div>
              <div class="cert-text">
                <p>This is to certify that</p>
                <div class="student-name">${formData.name.toUpperCase()}</div>
                <p>S/o / D/o <strong>${formData.fatherName}</strong></p>
                <p>has successfully completed the program of</p>
                <div class="degree-name">Online ${degreeParam} — ${currentProgram.full}</div>
                <p>Duration: ${currentProgram.duration} | Program Type: ${currentProgram.type}</p>
                <div class="detail-row">
                  <span>DOB: ${formData.dob}</span>
                  <span>Aadhaar: ${formData.aadhar.replace(/(\d{4})/g, '$1 ').trim()}</span>
                  <span>Enroll No: ${formData.ugNumber}</span>
                  <span>Phone: ${formData.phone}</span>
                </div>
              </div>
              <div class="cert-footer">
                <div class="footer-col">
                  <div class="signature-line"></div>
                  <div class="footer-label">Registrar</div>
                </div>
                <div class="footer-col">
                  <div class="cert-no">${certNumber}</div>
                  <div class="cert-no">Date: ${new Date().toLocaleDateString('en-IN')}</div>
                </div>
                <div class="footer-col">
                  <div class="cert-seal">ITM<br/>SEAL</div>
                </div>
                <div class="footer-col">
                  <div class="signature-line"></div>
                  <div class="footer-label">Director</div>
                </div>
              </div>
            </div>
          </div>
          <div class="no-print">
            <button onclick="window.print()" style="background: linear-gradient(135deg,#3b82f6,#8b5cf6); color:white; padding:12px 40px; border:none; border-radius:10px; font-size:16px; font-weight:700; cursor:pointer; margin-top:10px;">🖨️ Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.3s'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {!showCert ? (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '30px', padding: '0.4rem 1.2rem', marginBottom: '1rem' }}>
              <span style={{ color: '#8b5cf6', fontSize: '0.85rem', fontWeight: '600' }}>🎓 Online Degree Program</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Online {degreeParam} — {currentProgram.full}</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              {currentProgram.type} • {currentProgram.duration} Duration • ITM Institute of Technology & Management
            </p>
          </div>

          {/* College Info Card */}
          <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img src="/image.png" alt="ITM Logo" style={{ width: '65px', height: '65px', borderRadius: '50%', border: '2px solid rgba(59,130,246,0.3)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }} />
            <div>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.2rem' }}>ITM Institute of Technology & Management</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>📍 GIDA, Gorakhpur, Uttar Pradesh — 273209</p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>📞 +91 123 456 7890 &nbsp; | &nbsp; 📧 admission@itm.edu</p>
            </div>
          </div>

          {/* Degree Options */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
            {Object.entries(degreePrograms).map(([key, val]) => (
              <a key={key} href={`/online-degree?program=${key}`} style={{ 
                textDecoration: 'none', padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700',
                background: key === degreeParam ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                color: key === degreeParam ? '#fff' : '#94a3b8',
                border: key === degreeParam ? 'none' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s'
              }}>
                Online {key}
              </a>
            ))}
          </div>

          {/* Application Form */}
          <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', borderTop: '3px solid #8b5cf6' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>📝 Degree Application Form</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill all details carefully. Your certificate will be generated with these details.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Full Name (as per Aadhaar) *</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. Rahul Kumar Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Father's Name *</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. Suresh Kumar Sharma" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Date of Birth *</label>
                  <input type="date" required style={inputStyle} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Aadhaar Number (12 digits) *</label>
                  <input type="text" required maxLength="12" pattern="[0-9]{12}" style={inputStyle} placeholder="XXXX XXXX XXXX" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value.replace(/\D/g, '').slice(0, 12)})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>UG Enrollment / Roll Number *</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. ITM2024001234" value={formData.ugNumber} onChange={e => setFormData({...formData, ugNumber: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Phone Number *</label>
                  <input type="tel" required style={inputStyle} placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Email Address *</label>
                <input type="email" required style={inputStyle} placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>Affiliated University *</label>
                <select required style={inputStyle} value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})}>
                  <option value="Dr. A.P.J. Abdul Kalam Technical University">Dr. A.P.J. Abdul Kalam Technical University</option>
                  <option value="Deen Dayal Upadhyay Gorakhpur University">Deen Dayal Upadhyay Gorakhpur University</option>
                </select>
              </div>
              
              {/* Program summary */}
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '14px', padding: '1.2rem 1.5rem', marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program</div>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '0.95rem' }}>Online {degreeParam}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</div>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '0.95rem' }}>{currentProgram.duration}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>College</div>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '0.95rem' }}>ITM Gorakhpur</div>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', marginTop: '2rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                🎓 Generate Certificate
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          {/* Success + Preview */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🎉</div>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>Certificate Generated!</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Your Online {degreeParam} certificate is ready for download.</p>
          </div>

          {/* Certificate Preview */}
          <div ref={certRef} style={{ background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', padding: '15px' }}>
            <div style={{ border: '3px solid #1a365d', borderRadius: '4px', position: 'relative', padding: '5px' }}>
              <div style={{ border: '1px solid #c9a94e', padding: '35px 50px', textAlign: 'center' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
                  <img src="/image.png" alt="ITM Logo" style={{ width: '65px', height: '65px', borderRadius: '50%', border: '2px solid #1a365d' }} />
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '800', color: '#1a365d', letterSpacing: '1px' }}>{formData.university.toUpperCase()}</div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>ITM INSTITUTE OF TECHNOLOGY & MANAGEMENT, GIDA, GORAKHPUR</div>
                  </div>
                </div>

                <div style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: '700', color: '#c9a94e', margin: '12px 0 4px', letterSpacing: '3px' }}>CERTIFICATE</div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#64748b', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>of {currentProgram.type} Degree</div>

                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#475569', lineHeight: '2' }}>This is to certify that</p>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '700', color: '#1a365d', borderBottom: '2px solid #c9a94e', display: 'inline-block', padding: '0 20px 4px', margin: '4px 0 8px' }}>{formData.name.toUpperCase()}</div>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#475569', lineHeight: '2' }}>S/o / D/o <strong>{formData.fatherName}</strong></p>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#475569', lineHeight: '2' }}>has successfully completed the program of</p>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', color: '#1a365d', margin: '4px 0' }}>Online {degreeParam} — {currentProgram.full}</div>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#64748b', lineHeight: '2' }}>Duration: {currentProgram.duration} &nbsp;|&nbsp; Program Type: {currentProgram.type}</p>
                
                {/* Student Details Row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', fontSize: '10px', color: '#64748b', fontFamily: 'Arial, sans-serif', marginTop: '8px', padding: '6px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span>DOB: {formData.dob}</span>
                  <span>Aadhaar: {formData.aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}</span>
                  <span>Enroll No: {formData.ugNumber}</span>
                  <span>Phone: {formData.phone}</span>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '25px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '130px', borderTop: '1px solid #1a365d', margin: '0 auto 4px' }}></div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#64748b', fontWeight: '600' }}>Registrar</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#94a3b8' }}>Cert No: {certNumber}</div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#94a3b8' }}>Date: {new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                  <div style={{ width: '55px', height: '55px', border: '2px solid #c9a94e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: '9px', color: '#c9a94e', fontWeight: '700', textAlign: 'center' }}>ITM<br/>SEAL</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '130px', borderTop: '1px solid #1a365d', margin: '0 auto 4px' }}></div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#64748b', fontWeight: '600' }}>Director</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={handleDownload} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', border: 'none', padding: '1rem 3rem', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📥 Download Certificate (PDF)
            </button>
            <button onClick={() => setShowCert(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
              ← Edit Details
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineDegree;
