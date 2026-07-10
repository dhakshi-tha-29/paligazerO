import React, { useState, useEffect } from 'react';
import { apiCall, apiBlob } from '../../api';

const s = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    backdropFilter: 'blur(8px)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  th: {
    textAlign: 'left',
    padding: '14px 18px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  td: {
    padding: '14px 18px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
  },
  actionBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    color: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginRight: '8px',
  },
  detailPanel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '22px',
    margin: '8px 18px 16px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '14px',
  },
  detailCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center',
  },
  detailValue: {
    fontSize: '18px',
    fontWeight: '700',
  },
  detailLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  highlightBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '16px',
    maxHeight: '260px',
    overflowY: 'auto',
    fontSize: '13px',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.7)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '12px',
  },
  sourceCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '8px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.5',
  },
  empty: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    padding: '50px 20px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px dashed rgba(255,255,255,0.1)',
  },
};

function getScoreColor(score) {
  if (score < 20) return '#4ade80';
  if (score < 40) return '#facc15';
  return '#f87171';
}

function ScanHistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    apiCall('GET', '/reports/history')
      .then((data) => setHistory(data.history || data.reports || data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const handleExpand = async (item) => {
    const subId = item.submission_id?._id || item.submission_id;
    const id = item._id || item.id;
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await apiCall('GET', `/plagiarism/submission/${subId}`);
      setDetail(data.report || data);
    } catch {
      setDetail({ error: 'Could not load details.' });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownload = async (item) => {
    const subId = item.submission_id?._id || item.submission_id;
    setDownloadLoading(true);
    try {
      const response = await apiBlob('GET', `/reports/plagiarism/${subId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plagiarism-report-${subId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadLoading(false);
    }
  };

  const filtered = history.filter((h) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const assignmentName = h.submission_id?.assignment_id?.title || h.assignment_name || '';
    return (
      assignmentName.toLowerCase().includes(q) ||
      String(h.overall_similarity ?? 0).includes(q) ||
      (h.generated_at || '').toString().toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        View all your past plagiarism scans and reports
      </p>

      <input
        style={s.searchInput}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by assignment, file name, date, or similarity..."
        onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>Loading scan history...</p>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          {search ? 'No scans match your search.' : 'No scan history yet. Upload a document to get started.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Date</th>
                <th style={s.th}>Assignment</th>
                <th style={s.th}>Similarity</th>
                <th style={s.th}>AI Score</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => {
                const reportId = h._id || h.id;
                const sim = h.overall_similarity ?? 0;
                const ai = h.ai_generated_score ?? 0;
                const simColor = getScoreColor(sim);
                const isExpanded = expandedId === reportId;
                const assignmentName = h.submission_id?.assignment_id?.title || 'General Check';

                return (
                  <React.Fragment key={reportId || i}>
                    <tr
                      style={{ transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={s.td}>
                        {h.generated_at ? new Date(h.generated_at).toLocaleDateString() : '—'}
                      </td>
                      <td style={s.td}>{assignmentName}</td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: `${simColor}15`, border: `1px solid ${simColor}30`, color: simColor }}>
                          {sim}%
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
                          {ai}%
                        </span>
                      </td>
                      <td style={s.td}>
                        <button
                          style={s.actionBtn}
                          onClick={() => handleExpand(h)}
                          onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.3)'; e.target.style.background = 'rgba(124,58,237,0.1)'; }}
                          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          {isExpanded ? 'Hide' : 'Details'}
                        </button>
                        <button
                          style={s.actionBtn}
                          onClick={() => handleDownload(h)}
                          onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.3)'; e.target.style.background = 'rgba(34,197,94,0.1)'; }}
                          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          {downloadLoading ? '...' : 'PDF'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} style={{ padding: '0', border: 'none' }}>
                          <div style={s.detailPanel}>
                            {detailLoading ? (
                              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '16px' }}>Loading details...</p>
                            ) : detail?.error ? (
                              <p style={{ color: '#f87171' }}>{detail.error}</p>
                            ) : detail ? (
                              <>
                                <div style={s.detailGrid}>
                                  <div style={s.detailCard}>
                                    <div style={{ ...s.detailValue, color: getScoreColor(detail.overall_similarity ?? sim) }}>
                                      {detail.overall_similarity ?? sim}%
                                    </div>
                                    <div style={s.detailLabel}>Similarity</div>
                                  </div>
                                  <div style={s.detailCard}>
                                    <div style={{ ...s.detailValue, color: '#f87171' }}>{detail.exact_match_percentage ?? 0}%</div>
                                    <div style={s.detailLabel}>Exact Match</div>
                                  </div>
                                  <div style={s.detailCard}>
                                    <div style={{ ...s.detailValue, color: '#facc15' }}>{detail.semantic_match_percentage ?? 0}%</div>
                                    <div style={s.detailLabel}>Semantic</div>
                                  </div>
                                  <div style={s.detailCard}>
                                    <div style={{ ...s.detailValue, color: '#fb923c' }}>{detail.paraphrase_percentage ?? 0}%</div>
                                    <div style={s.detailLabel}>Paraphrase</div>
                                  </div>
                                  <div style={s.detailCard}>
                                    <div style={{ ...s.detailValue, color: '#7c3aed' }}>{detail.ai_generated_score ?? 0}%</div>
                                    <div style={s.detailLabel}>AI Score</div>
                                  </div>
                                </div>

                                {detail.highlighted_content && (
                                  <>
                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Highlighted Content</div>
                                    <div
                                      style={s.highlightBox}
                                      dangerouslySetInnerHTML={{ __html: detail.highlighted_content.highlighted || detail.highlighted_content.original || detail.highlighted_content }}
                                    />
                                  </>
                                )}

                                {detail.matched_sources && detail.matched_sources.length > 0 && (
                                  <>
                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Matched Sources ({detail.matched_sources.length})</div>
                                    {detail.matched_sources.map((src, j) => (
                                      <div key={j} style={s.sourceCard}>
                                        <div>{src.matching_text || src.text || src.snippet || src.content}</div>
                                        <div style={{ marginTop: '6px', fontSize: '12px', color: '#f87171', fontWeight: '600' }}>
                                          Similarity: {typeof src.similarity === 'number' ? src.similarity.toFixed(1) : src.similarity ?? 0}%
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}

                                <button
                                  style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '13px', fontWeight: '500', padding: 0, marginTop: '4px' }}
                                  onClick={() => { setExpandedId(null); setDetail(null); }}
                                >
                                  Close details
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ScanHistoryPanel;
