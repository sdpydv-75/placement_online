import React, { useState } from 'react';

const InterviewPrep = () => {
  const [activeModal, setActiveModal] = useState(null);

  const tips = [
    { title: "Mastering the HR Round", icon: "🤝", desc: "Common questions, behavioral patterns, and how to perfectly answer 'Tell me about yourself'." },
    { title: "Technical Screenings", icon: "💻", desc: "Brush up on Data Structures, Algorithms, and system design basics with these key concepts." },
    { title: "Mock Interviews", icon: "🎙️", desc: "Practice with our AI-driven scenarios. Get instant feedback on your confidence and clarity." },
    { title: "Aptitude & Reasoning", icon: "🧠", desc: "Sharpen your logical reasoning and quantitative aptitude skills for initial filtering rounds." }
  ];

  const practiceData = {
    "Mastering the HR Round": [
      { q: "Tell me about yourself.", a: "Keep it professional. Start with your present role, touch on your past experience, and finish with your future goals." },
      { q: "Why do you want to work here?", a: "Research the company beforehand. Align their mission and values with your own career objectives." },
      { q: "What is your greatest weakness?", a: "Share a real, minor flaw but emphasize the practical steps you are actively taking to improve it." }
    ],
    "Technical Screenings": [
      { q: "What is the difference between SQL and NoSQL?", a: "SQL databases are relational and table-based, while NoSQL databases are non-relational and document/key-value based." },
      { q: "Explain the concept of REST API.", a: "REST is an architectural style that uses standard HTTP methods (GET, POST, PUT, DELETE) to interact with resources statelessly." },
      { q: "What is the time complexity of Binary Search?", a: "O(log n). The algorithm divides the search interval in half with each step." }
    ],
    "Mock Interviews": [
      { q: "Can you describe a time you failed?", a: "Focus entirely on what you learned and how you corrected the mistake, demonstrating accountability and growth." },
      { q: "How do you handle tight deadlines?", a: "Explain your prioritizing strategies, like breaking down tasks, time-blocking, and communicating with stakeholders." }
    ],
    "Aptitude & Reasoning": [
      { q: "If A = 1, B = 2... what is the sum of letters in 'CAT'?", a: "C(3) + A(1) + T(20) = 24." },
      { q: "A train running at 72km/hr crosses a pole in 9 seconds. What is length of the train?", a: "Speed in m/s = 72 * (5/18) = 20m/s. Distance (Length) = Speed * Time = 20 * 9 = 180 meters." }
    ]
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="animate-fade-in-up">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f1f5f9', marginBottom: '1rem' }}>
            Ace Your <span className="text-gradient">Interviews</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive preparation materials, mock tests, and expert tips to help you conquer your next big interview.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {tips.map((tip, i) => (
          <div key={i} className="card animate-fade-in-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tip.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '0.8rem', fontWeight: '700' }}>{tip.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>{tip.desc}</p>
            <button 
              onClick={() => setActiveModal(tip.title)}
              className="btn btn-outline" 
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', width: '100%' }}>
              Start Practicing
            </button>
          </div>
        ))}
      </div>

      {/* Practice Interactive Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(10, 15, 30, 0.8)', backdropFilter: 'blur(8px)', 
          zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', 
            width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.3s ease-out'
          }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
              &times;
            </button>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem', fontWeight: '800' }}>{activeModal}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem' }}>Review these sample questions and optimal answers.</p>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {practiceData[activeModal]?.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(15,23,42,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#8b5cf6' }}>Q:</span> {item.q}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>A:</span> {item.a}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-glow" style={{ padding: '0.8rem 2rem', borderRadius: '10px' }}>
                Finish Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterviewPrep;
