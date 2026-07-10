import React, { useState, useRef, useEffect } from 'react';
import { apiCall } from '../../api';

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 140px)',
    maxHeight: '700px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '16px',
  },
  msg: {
    padding: '14px 18px',
    borderRadius: '16px',
    maxWidth: '75%',
    fontSize: '14px',
    lineHeight: '1.6',
    wordBreak: 'break-word',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  send: {
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    whiteSpace: 'nowrap',
  },
};

function ChatbotPanel() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm PaliGazer AI. Ask me anything about plagiarism detection, reports, or your submissions." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const data = await apiCall('POST', '/ai/chat', { message: msg });
      setMessages((prev) => [...prev, { role: 'ai', text: data.response || data.message || data.reply || 'No response.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        AI-powered assistant for plagiarism detection help
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '18px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={s.container}>
          <div style={s.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...s.msg,
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  color: msg.role === 'user' ? '#fff' : '#e0e0e0',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{
                ...s.msg,
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                borderBottomLeftRadius: '4px',
              }}>
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask the AI assistant..."
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              disabled={loading}
            />
            <button
              style={{ ...s.send, opacity: loading || !input.trim() ? 0.5 : 1 }}
              onClick={handleSend}
              disabled={loading || !input.trim()}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'none'; }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPanel;
