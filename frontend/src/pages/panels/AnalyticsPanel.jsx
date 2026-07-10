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

const bigNum = {
  fontSize: '36px',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '4px',
};

const bigLabel = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

function AnalyticsPanel() {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [history, setHistory] = useState([]);
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [gradeDist, setGradeDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches = [
      apiCall('GET', '/reports/history').then((d) => setHistory(d.history || d.reports || d || [])).catch(() => {}),
      apiCall('GET', '/analytics/overview').then((d) => setOverview(d)).catch(() => {}),
      apiCall('GET', '/analytics/plagiarism-trends').then((d) => setTrends(d.trends || d.data || d || [])).catch(() => {}),
    ];
    if (role === 'faculty') {
      fetches.push(
        apiCall('GET', '/analytics/grade-distribution').then((d) => setGradeDist(d.distribution || d.data || d || [])).catch(() => {})
      );
    }
    Promise.all(fetches).finally(() => setLoading(false));
  }, [role]);

  const totalSubmissions = overview?.total_submissions ?? overview?.stats?.total_submissions ?? history.length;
  const avgSimilarity = overview?.average_similarity ?? overview?.stats?.average_similarity ?? 0;
  const totalAssignments = overview?.total_assignments ?? overview?.stats?.total_assignments ?? 0;

  const aiGenerated = history.filter((h) => h.is_ai_generated || (h.ai_generated_score ?? 0) > 60).length;
  const humanWritten = history.length - aiGenerated;
  const detectionRate = history.length > 0 ? Math.round((aiGenerated / history.length) * 100) : 0;

  const simBuckets = [
    { label: '0-20%', color: '#4ade80', min: 0, max: 20 },
    { label: '20-40%', color: '#facc15', min: 20, max: 40 },
    { label: '40-60%', color: '#fb923c', min: 40, max: 60 },
    { label: '60-80%', color: '#f87171', min: 60, max: 80 },
    { label: '80-100%', color: '#dc2626', min: 80, max: 101 },
  ];

  const simData = simBuckets.map((b) => ({
    ...b,
    count: history.filter((h) => {
      const s = h.overall_similarity ?? 0;
      return s >= b.min && s < b.max;
    }).length,
  }));

  const maxSimCount = Math.max(...simData.map((d) => d.count), 1);

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const count = history.filter((h) => {
      const hd = h.generated_at ? new Date(h.generated_at).toISOString().split('T')[0] : null;
      return hd === key;
    }).length;
    last7Days.push({ label, count });
  }
  const maxDayCount = Math.max(...last7Days.map((d) => d.count), 1);

  const donutGradient = history.length > 0
    ? `conic-gradient(#7c3aed 0% ${detectionRate}%, rgba(255,255,255,0.08) ${detectionRate}% 100%)`
    : 'conic-gradient(rgba(255,255,255,0.08) 0% 100%)';

  const grades = ['A', 'B', 'C', 'D', 'F'];
  const gradeColors = ['#4ade80', '#60a5fa', '#facc15', '#fb923c', '#f87171'];
  const gradeData = grades.map((g, i) => {
    const count = gradeDist.find((gd) => (gd.grade || gd._id || '').toUpperCase() === g)?.count || gradeDist.find((gd) => (gd.grade || gd._id || '').toUpperCase() === g)?.total || 0;
    return { grade: g, count, color: gradeColors[i] };
  });
  const maxGradeCount = Math.max(...gradeData.map((d) => d.count), 1);

  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>Loading analytics...</p>;
  }

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>
        Analysis and insights from your plagiarism scans
      </p>

      {/* Overall stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div style={card}>
          <div style={bigNum}>{totalSubmissions}</div>
          <div style={bigLabel}>Total Submissions</div>
        </div>
        <div style={card}>
          <div style={bigNum}>{avgSimilarity}%</div>
          <div style={bigLabel}>Avg Similarity</div>
        </div>
        <div style={card}>
          <div style={bigNum}>{detectionRate}%</div>
          <div style={bigLabel}>AI Detection Rate</div>
        </div>
        <div style={card}>
          <div style={bigNum}>{totalAssignments}</div>
          <div style={bigLabel}>Total Assignments</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {/* Similarity Distribution Bar Chart */}
        <div style={card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Similarity Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
            {simData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.6)' }}>{d.count}</div>
                <div style={{
                  width: '100%',
                  height: `${(d.count / maxSimCount) * 140}px`,
                  background: d.color,
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s',
                  minHeight: '4px',
                }} />
                <div style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Detection Donut */}
        <div style={card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>AI Detection</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: donutGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'rgba(10,8,30,0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#e0e0e0' }}>{detectionRate}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>AI Score</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7c3aed' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>AI Generated ({aiGenerated})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Human Written ({humanWritten})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Over Time */}
      <div style={{ ...card, marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Submissions Over Time (Last 7 Days)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '160px' }}>
          {last7Days.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.6)' }}>{d.count}</div>
              <div style={{
                width: '100%',
                height: `${(d.count / maxDayCount) * 120}px`,
                background: 'linear-gradient(180deg, #7c3aed, #3b82f6)',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.5s',
                minHeight: '4px',
              }} />
              <div style={{ fontSize: '10px', marginTop: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: '1.2' }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Distribution - Faculty only */}
      {role === 'faculty' && (
        <div style={card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Grade Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px' }}>
            {gradeData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.6)' }}>{d.count}</div>
                <div style={{
                  width: '100%',
                  height: `${(d.count / maxGradeCount) * 140}px`,
                  background: d.color,
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s',
                  minHeight: '4px',
                }} />
                <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '8px', color: 'rgba(255,255,255,0.6)' }}>{d.grade}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPanel;
