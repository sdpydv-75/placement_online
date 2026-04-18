import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Main aapka Career Guide Bot hoon. Aap mujhse placements, internships, ya job roles ke baare mein kuch bhi aasan bhasha (Hinglish) mein puch sakte hain!", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getBotResponse = (msg) => {
    const text = msg.toLowerCase();
    
    // Greeting
    if (/(hi|hello|hey|namaste|kem cho|kese ho|kaise ho|namaskar|aur|kya haal)/.test(text)) {
      return "Hello! Main aapka Career Guide Bot bhaiya hoon 😊 Main apki placement ya tech roles ke bare me pareshani door kar sakta hu. Boliye?";
    }
    // Salary/Package
    else if (/(salary|package|paisa|kitna milega|income|kamai|rupee|pay)/.test(text)) {
      return "Salary toh role pe depend karti hai bhai! Freshers ko Software Engineering me ₹5L-₹15L milta hai, Data Science me ₹8L-₹20L, aur Digital Marketing roles me ₹4L-₹10L average hota hai.";
    } 
    // Software Eng / Coding
    else if (/(software|engineer|developer|coding|programmer|web dev|app dev|coder|it job)/.test(text)) {
      return "Software Engineer banne ke liye aapko pehle ek bhasha pakadni padegi (jaise JavaScript, Java, C++ ya Python). Uske baad Data Structures aur Algorithms (DSA) par focus kijiye, aur kuch projects banaiye!";
    } 
    // Data Science / AI
    else if (/(data science|ai|artificial intelligence|machine learning|data analyst|ml)/.test(text)) {
      return "Data Science ya AI field me jaane ke liye aapko Maths (Statistics), Python aur Machine learning libraries aani chahiye. Data ke patterns nikalna iska core background hai.";
    } 
    // Internships
    else if (/(internship|intern|training|fresher|job kaise|apply)/.test(text)) {
      return "Internships hi aapka first step hain real-world experience ke liye! Aap hamaare website ke 'Jobs' section me 'Internship' filter use karke check kijiye aur directly apply karein.";
    } 
    // Resume
    else if (/(resume|cv|biodata|portfolio|profile kaise|ats)/.test(text)) {
      return "Ek dum jhakas Resume pehli demand hoti hai HR ki! Hamaare naye 'Resume Builder' menu par jao, apni details bharo aur instantly ek Professional ATS friendly PDF download kar lo.";
    } 
    // Interview Prep
    else if (/(interview|hr|tyari|prep|taiyari|question|mock|round)/.test(text)) {
      return "Interviews perfectly clear karne ke liye apni 'communication skills' par dhyan de. 'Ace Your Interviews' page par jao, wahan mock answers aur top technical questions readily aveliable hain!";
    }
    // Job/Placement
    else if (/(placement|job|naukri|vacancy|company|tcs|infosys|wipro|google|amazon|role)/.test(text)) {
      return "Placement todne ke liye apke pass 2 chize strong honi chaiye: 1. Core Technical Skills (Projects) 2. Communication! Companies regularly humare portal par visit karti hain, apna resume update rakho!";
    }
    // Thanks
    else if (/(thanks|thank you|shukriya|dhanyawad|ok|achha|thik|badhiya|cool|great|awesome)/.test(text)) {
      return "Welcome mere bhai! Aur kuch janna ho toh zaroor puchna. All the best apki journey ke liye! 🚀";
    }
    // Failure / Default
    else {
      return "Bhai aapka sawal main theek se samajh nahi paya. Thoda aur clearly puchiye na? Jaise 'internships ke bare me batao', 'salary kitni hai', ya 'resume kaise banaye'.";
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMsg = input.trim();
    setMessages(prev => [...prev, { text: newMsg, sender: 'user' }]);
    setInput('');

    // Simulate thinking and send bot response
    setTimeout(() => {
      const response = getBotResponse(newMsg);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 600);
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white',
            width: '60px', height: '60px', borderRadius: '50%', border: 'none',
            boxShadow: '0 10px 25px rgba(139,92,246,0.4)', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
          width: '350px', height: '500px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Career Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <div style={{
                  maxWidth: '80%', padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.5',
                  background: msg.sender === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: msg.sender === 'user' ? '#fff' : '#cbd5e1',
                  borderBottomRightRadius: msg.sender === 'user' ? '0' : '12px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '12px',
                  border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..." 
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
