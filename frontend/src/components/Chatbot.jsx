import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://placement-online.vercel.app/api/v1'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry bhai, abhi network me kuch issue lag raha hai. Thodi der baad try karoge?", sender: 'bot' }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "Oops! Backend se connect nahi ho pa raha. Check karo ki server chal raha hai ya nahi.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-window {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          zIndex: 1000;
          width: min(calc(100vw - 2rem), 380px);
          height: min(calc(100vh - 4rem), 550px);
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.6);
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 480px) {
          .chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
          .chat-trigger {
            bottom: 1.5rem !important;
            right: 1.5rem !important;
            width: 55px !important;
            height: 55px !important;
          }
        }
      `}</style>

      {!isOpen && (
        <button 
          className="chat-trigger"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white',
            width: '64px', height: '64px', borderRadius: '50%', border: 'none',
            boxShadow: '0 10px 30px rgba(59,130,246,0.4)', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤖</div>
              <div>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px' }}>Career Assistant</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.7rem', fontWeight: '600' }}>ONLINE NOW</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(0,0,0,0.1)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
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
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
                  padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.8rem',
                  borderBottomLeftRadius: '0', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  Thinking... 🤖
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Bot is thinking..." : "Type your question..."}
              disabled={isLoading}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px', outline: 'none', opacity: isLoading ? 0.6 : 1 }}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
