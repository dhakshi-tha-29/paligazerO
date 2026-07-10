import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { apiCall } from '../../api';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  padding: '24px',
  backdropFilter: 'blur(8px)',
};

const statValue = {
  fontSize: '32px',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '4px',
};

const statLabel = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

function getScoreColor(score) {
  if (score < 20) return '#4ade80';
  if (score < 40) return '#facc15';
  return '#f87171';
}

function OverviewPanel({ onNavigate }) {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const endpoint = role === 'faculty' ? '/faculty/dashboard' : '/students/dashboard';
    apiCall('GET', endpoint)
      .then((data) => setStats(data))
      .catch(() => setStats({}));
  }, [role]);

  useEffect(() => {
    apiCall('GET', '/reports/history')
      .then((data) => setHistory((data.history || data.reports || data || []).slice(0, 5)))
      .catch(() => setHistory([]));
  }, []);

  const dashboardData = stats?.stats || stats || {};
  const totalSubmissions = dashboardData.total_submissions ?? dashboardData.total_submissions_count ?? 0;
  const totalAssignments = dashboardData.total_assignments ?? dashboardData.total_assignments_count ?? 0;
  const avgSimilarity = dashboardData.average_similarity ?? 0;
  const gradedCount = dashboardData.graded_count ?? dashboardData.total_graded ?? 0;

  const statCards = [
    { value: totalSubmissions, label: 'Total Submissions' },
    { value: totalAssignments, label: 'Total Assignments' },
    { value: `${avgSimilarity}%`, label: 'Avg Similarity' },
    { value: gradedCount, label: 'Graded Count' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Welcome back, {user?.first_name || 'User'}</h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>Here's your overview</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {statCards.map((s, i) => (
          <div key={i} style={card}>
            <div style={statValue}>{s.value}</div>
            <div style={statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate('upload')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 20px rgba(124,58,237,0.3)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
        >
          📄 Upload Document
        </button>
        <button
          onClick={() => onNavigate('scan-history')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            color: '#e0e0e0',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.borderColor = 'rgba(124,58,237,0.3)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          📜 View History
        </button>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Scans</h3>
      {history.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px' }}>
          No scan history yet. Upload a document to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((h, i) => {
            const sim = h.overall_similarity ?? 0;
            const assignment = h.submission_id?.assignment_id?.title || 'General Check';
            const date = h.generated_at ? new Date(h.generated_at).toLocaleDateString() : '—';
            return (
              <div key={h._id || i} style={{
                ...card,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{assignment}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{date}</div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: `${getScoreColor(sim)}15`,
                  border: `1px solid ${getScoreColor(sim)}30`,
                  color: getScoreColor(sim),
                }}>
                  {sim}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OverviewPanel;
