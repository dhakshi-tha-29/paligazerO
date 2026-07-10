import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import OverviewPanel from './panels/OverviewPanel.jsx';
import UploadPanel from './panels/UploadPanel.jsx';
import ScanHistoryPanel from './panels/ScanHistoryPanel.jsx';
import AssignmentsPanel from './panels/AssignmentsPanel.jsx';
import AnalyticsPanel from './panels/AnalyticsPanel.jsx';
import ChatbotPanel from './panels/ChatbotPanel.jsx';
import HowToUsePanel from './panels/HowToUsePanel.jsx';
import CourseHubPanel from './panels/CourseHubPanel.jsx';
import CertificatesPanel from './panels/CertificatesPanel.jsx';

const navItems = [
  { key: 'overview', icon: '📊', label: 'Overview' },
  { key: 'upload', icon: '📄', label: 'Upload Document' },
  { key: 'scan-history', icon: '📜', label: 'Scan History' },
  { key: 'assignments', icon: '📋', label: 'Assignments' },
  { key: 'course-hub', icon: '📚', label: 'Course Hub' },
  { key: 'certificates', icon: '🎓', label: 'Certificates' },
  { key: 'analytics', icon: '📈', label: 'Analytics' },
  { key: 'chatbot', icon: '💬', label: 'AI Chatbot' },
  { key: 'how-to-use', icon: '❓', label: 'How to Use' },
];

const panelTitles = {
  'overview': 'Overview',
  'upload': 'Upload Document',
  'scan-history': 'Scan History',
  'assignments': 'Assignments',
  'course-hub': 'Course Hub',
  'certificates': 'Certificates',
  'analytics': 'Analytics',
  'chatbot': 'AI Chatbot',
  'how-to-use': 'How to Use',
};

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const name = user?.first_name || user?.name || 'User';
  const role = user?.role || 'student';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const panels = {
    'overview': <OverviewPanel onNavigate={setActivePanel} />,
    'upload': <UploadPanel />,
    'scan-history': <ScanHistoryPanel />,
    'assignments': <AssignmentsPanel />,
    'course-hub': <CourseHubPanel />,
    'certificates': <CertificatesPanel />,
    'analytics': <AnalyticsPanel />,
    'chatbot': <ChatbotPanel />,
    'how-to-use': <HowToUsePanel />,
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #1a1a4e, #16213e, #0f3460)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#e0e0e0',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '0px',
        minWidth: sidebarOpen ? '240px' : '0px',
        background: 'rgba(10,8,30,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s, min-width 0.3s',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: '22px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            PaliGazer
          </div>
        </div>

        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#e0e0e0',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            padding: '3px 10px',
            borderRadius: '20px',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#a78bfa',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
          }}>
            {role}
          </span>
        </div>

        <nav style={{
          flex: 1,
          padding: '12px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {navItems.map((item) => {
            const isActive = activePanel === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePanel(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  width: '100%',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              fontSize: '14px',
              fontWeight: '400',
              color: 'rgba(255,255,255,0.55)',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        {/* Top bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,8,30,0.5)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              color: '#e0e0e0',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ☰
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#e0e0e0',
            margin: 0,
          }}>
            {panelTitles[activePanel] || 'Dashboard'}
          </h1>
        </header>

        {/* Panel content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
        }}>
          {panels[activePanel]}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
