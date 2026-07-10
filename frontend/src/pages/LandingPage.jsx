import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '📄', title: 'Document Upload', desc: 'PDF, DOCX & TXT support' },
  { icon: '🔍', title: 'Plagiarism Detection', desc: 'AI-powered analysis' },
  { icon: '📊', title: 'Similarity Percentage', desc: 'Detailed match scores' },
  { icon: '📑', title: 'Similar Content Highlighting', desc: 'Marked matches in text' },
  { icon: '📜', title: 'Scan History', desc: 'Track all submissions' },
  { icon: '📥', title: 'Download Report', desc: 'Export PDF reports' },
  { icon: '👤', title: 'User Authentication', desc: 'Secure JWT login' },
  { icon: '☁️', title: 'Cloud Storage', desc: 'Files stored securely' },
  { icon: '📱', title: 'Responsive Interface', desc: 'Works on any device' },
  { icon: '🔎', title: 'Keyword Search', desc: 'Search past scans' },
  { icon: '📂', title: 'Multiple File Upload', desc: 'Batch processing' },
  { icon: '⚡', title: 'Fast Scan Results', desc: 'Quick analysis time' },
];

const stats = [
  { value: '14+', label: 'Features' },
  { value: 'AI', label: 'Powered' },
  { value: 'Real-time', label: 'Analysis' },
  { value: 'JWT', label: 'Security' },
];

const s = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #1a1a4e, #16213e, #0f3460)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#e0e0e0',
    overflow: 'hidden',
    position: 'relative',
  },
  stars: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  hero: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '80px 20px 40px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: 'clamp(16px, 3vw, 22px)',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '36px',
    lineHeight: '1.6',
  },
  btnRow: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '60px',
  },
  btnPrimary: {
    padding: '16px 44px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnSecondary: {
    padding: '16px 44px',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.05)',
    color: '#e0e0e0',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    marginBottom: '60px',
    padding: '0 20px',
  },
  statItem: {
    textAlign: 'center',
    minWidth: '100px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  featuresSection: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px 80px',
  },
  featuresTitle: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#e0e0e0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '28px 20px',
    textAlign: 'center',
    backdropFilter: 'blur(8px)',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  featureIcon: {
    fontSize: '36px',
    marginBottom: '14px',
    display: 'block',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#e0e0e0',
  },
  featureDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: '1.5',
  },
};

function LandingPage() {
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: `${2 + Math.random() * 4}s`,
        delay: `${Math.random() * 3}s`,
      }))
    );
  }, []);

  return (
    <div style={s.wrapper}>
      <style>{`
        @keyframes twinkle { 0%,100% { opacity:0.2; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>
      <div style={s.stars}>
        {stars.map((st) => (
          <div
            key={st.id}
            style={{
              position: 'absolute',
              width: `${st.size}px`,
              height: `${st.size}px`,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              top: st.top,
              left: st.left,
              animation: `twinkle ${st.duration} infinite ${st.delay}`,
            }}
          />
        ))}
      </div>

      <div style={s.hero}>
        <h1 style={s.title}>PaliGazer</h1>
        <p style={s.subtitle}>AI-Powered Plagiarism Detection System</p>
        <div style={s.btnRow}>
          <button
            style={s.btnPrimary}
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 30px rgba(124,58,237,0.4)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
          >
            Get Started
          </button>
          <button
            style={s.btnSecondary}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 30px rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
          >
            Sign In
          </button>
        </div>
      </div>

      <div style={s.statsBar}>
        {stats.map((st, i) => (
          <div key={i} style={s.statItem}>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={s.featuresSection}>
        <h2 style={s.featuresTitle}>Everything You Need</h2>
        <div style={s.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={s.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={s.featureIcon}>{f.icon}</span>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
