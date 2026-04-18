import React, { useState } from 'react';

const ResumeEditor = () => {
  const [data, setData] = useState({
    personal: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      summary: 'Passionate software engineer with 2+ years of experience building scalable web applications. Proficient in React, Node.js, and MongoDB.'
    },
    education: [
      { id: 1, degree: 'B.Tech Computer Science', university: 'Institute of Technology', year: '2020 - 2024' }
    ],
    experience: [
      { id: 1, role: 'Frontend Developer Intern', company: 'Tech Innovators', duration: 'June 2023 - Present', desc: 'Developed responsive user interfaces using React and Tailwind CSS. Improved page load times by 20%.' }
    ],
    skills: 'JavaScript, React, Node.js, Express, MongoDB, Python, Git, HTML/CSS'
  });

  const handlePersonalChange = (e) => {
    setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
  };

  const addEducation = () => {
    setData({ ...data, education: [...data.education, { id: Date.now(), degree: '', university: '', year: '' }] });
  };

  const updateEducation = (id, field, value) => {
    setData({ ...data, education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) });
  };

  const addExperience = () => {
    setData({ ...data, experience: [...data.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }] });
  };

  const updateExperience = (id, field, value) => {
    setData({ ...data, experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) });
  };

  const printResume = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: 'calc(100vh - 78px)', padding: '2rem 1.5rem', color: '#fff' }}>
      
      {/* Dynamic Print CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: white !important;
            color: black !important;
          }
          nav, footer, .editor-panel, .no-print { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Left Column: Editor Panel */}
        <div className="editor-panel" style={{ flex: '1 1 500px', background: 'rgba(30,41,59,0.7)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Resume Details</h2>
            <button onClick={printResume} className="btn-glow" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Download PDF</button>
          </div>

          {/* Personal Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#94a3b8' }}>Personal Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input name="name" value={data.personal.name} onChange={handlePersonalChange} className="form-input" placeholder="Full Name" />
              <input name="title" value={data.personal.title} onChange={handlePersonalChange} className="form-input" placeholder="Professional Title" />
              <input name="email" value={data.personal.email} onChange={handlePersonalChange} className="form-input" placeholder="Email Address" />
              <input name="phone" value={data.personal.phone} onChange={handlePersonalChange} className="form-input" placeholder="Phone Number" />
              <input name="location" value={data.personal.location} onChange={handlePersonalChange} className="form-input" placeholder="Location" />
              <input name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} className="form-input" placeholder="LinkedIn URL" />
              <input name="github" value={data.personal.github} onChange={handlePersonalChange} className="form-input" placeholder="GitHub URL" />
            </div>
            <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} className="form-textarea" placeholder="Professional Summary" rows="3" style={{ marginTop: '1rem' }} />
          </div>

          {/* Education */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#94a3b8' }}>Education</h3>
              <button onClick={addEducation} style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>+ Add</button>
            </div>
            {data.education.map((edu, idx) => (
              <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="form-input" placeholder="Degree (e.g. B.Tech)" />
                <input value={edu.university} onChange={(e) => updateEducation(edu.id, 'university', e.target.value)} className="form-input" placeholder="University / College" />
                <input value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="form-input" placeholder="Year (e.g. 2020-2024)" />
              </div>
            ))}
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#94a3b8' }}>Experience</h3>
              <button onClick={addExperience} style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>+ Add</button>
            </div>
            {data.experience.map((exp, idx) => (
              <div key={exp.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="form-input" placeholder="Job Role" />
                  <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="form-input" placeholder="Company Name" />
                </div>
                <input value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} className="form-input" placeholder="Duration (e.g. June 2022 - Aug 2022)" />
                <textarea value={exp.desc} onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)} className="form-textarea" placeholder="Description of your work" rows="2" />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#94a3b8' }}>Skills</h3>
            <textarea value={data.skills} onChange={(e) => setData({...data, skills: e.target.value})} className="form-textarea" placeholder="Comma separated skills" rows="3" />
          </div>

        </div>

        {/* Right Column: Live Preview */}
        <div id="resume-preview" style={{ flex: '1 1 500px', background: 'white', color: '#1e293b', padding: '40px', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>{data.personal.name || 'Your Name'}</h1>
            <p style={{ fontSize: '1.1rem', color: '#3b82f6', fontWeight: '600', margin: '0 0 0.8rem 0' }}>{data.personal.title || 'Your Title'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
              {data.personal.email && <span>📧 {data.personal.email}</span>}
              {data.personal.phone && <span>📱 {data.personal.phone}</span>}
              {data.personal.location && <span>📍 {data.personal.location}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.4rem' }}>
              {data.personal.linkedin && <span>🔗 {data.personal.linkedin}</span>}
              {data.personal.github && <span>💻 {data.personal.github}</span>}
            </div>
          </div>

          {/* Summary */}
          {data.personal.summary && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#334155' }}>
                {data.personal.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && data.experience[0].role && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>Professional Experience</h3>
              {data.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', margin: '0' }}>{exp.role}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.4rem' }}>{exp.company}</div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0', lineHeight: '1.5' }}>{exp.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && data.education[0].degree && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', margin: '0' }}>{edu.degree}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{edu.year}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#475569', margin: '0' }}>{edu.university}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>Technical Skills</h3>
              <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0', lineHeight: '1.6' }}>
                {data.skills}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
