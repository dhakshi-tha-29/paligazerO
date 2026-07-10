import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, apiBlob, getToken } from '../../api';

const s = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '24px',
    backdropFilter: 'blur(8px)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  dropzone: {
    border: '2px dashed rgba(255,255,255,0.15)',
    borderRadius: '14px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'rgba(255,255,255,0.01)',
    marginBottom: '12px',
  },
  dropzoneActive: {
    borderColor: '#7c3aed',
    background: 'rgba(124,58,237,0.05)',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  orSep: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '20px 0',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '13px',
    fontWeight: '500',
  },
  orLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    transition: 'border-color 0.2s',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  btn: {
    padding: '14px 36px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '4px',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#f87171',
    fontSize: '14px',
    marginBottom: '16px',
  },
  resultsCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '24px',
    backdropFilter: 'blur(8px)',
  },
  scoreCircle: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: '800',
    lineHeight: '1',
  },
  scoreLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '4px',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  breakdownCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  breakdownValue: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  breakdownLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  highlightBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    maxHeight: '350px',
    overflowY: 'auto',
    fontSize: '13px',
    lineHeight: '1.8',
    color: 'rgba(255,255,255,0.75)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  sourceCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
  },
  sourceText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.5',
    marginBottom: '6px',
  },
  sourceSim: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#f87171',
  },
  downloadBtn: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '10px',
    background: 'rgba(34,197,94,0.1)',
    color: '#4ade80',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loadingOverlay: {
    textAlign: 'center',
    padding: '50px 20px',
    color: 'rgba(255,255,255,0.5)',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #7c3aed',
    borderRadius: '50%',
    margin: '0 auto 14px',
    animation: 'spin 1s linear infinite',
  },
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function getScoreColor(score) {
  if (score < 20) return '#4ade80';
  if (score < 40) return '#facc15';
  return '#f87171';
}

function UploadPanel() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [files, setFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    apiCall('GET', '/assignments')
      .then((data) => setAssignments(data.assignments || data || []))
      .catch(() => {});
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const valid = newFiles.filter((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx', 'doc', 'txt'].includes(ext);
    });
    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScan = async () => {
    setError('');
    setResults(null);

    const hasFiles = files.length > 0;
    const hasText = textContent.trim().length > 0;

    if (!hasFiles && !hasText) {
      setError('Please upload files or paste text content.');
      return;
    }

    setScanning(true);
    try {
      let submissionId = null;

      if (hasFiles) {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        if (selectedAssignment) {
          formData.append('assignment_id', selectedAssignment);
        }

        const token = getToken();
        const uploadRes = await fetch('/api/submissions/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');
        submissionId = uploadData.submission_id || uploadData.id || uploadData.submission?.id;
      } else {
        const subData = await apiCall('POST', '/submissions/text', {
          content: textContent.trim(),
          assignment_id: selectedAssignment || undefined,
        });
        submissionId = subData.submission_id || subData.id || subData.submission?.id;
      }

      if (!submissionId) throw new Error('Could not create submission.');

      const resultData = await apiCall('POST', `/plagiarism/check/${submissionId}`);
      const report = resultData.report || resultData;
      setResults({
        overall_similarity: report.overall_similarity,
        exact_match_percentage: report.exact_match_percentage,
        semantic_match_percentage: report.semantic_match_percentage,
        paraphrase_percentage: report.paraphrase_percentage,
        ai_generated_score: report.ai_generated_score,
        is_ai_generated: report.is_ai_generated,
        highlighted_content: report.highlighted_content,
        matched_sources: report.matched_sources || [],
        originality_score: report.originality_score,
        submission_id: submissionId,
      });
    } catch (err) {
      setError(err.message || 'Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleDownload = async () => {
    if (!results?.submission_id) return;
    setDownloadLoading(true);
    try {
      const response = await apiBlob('GET', `/reports/plagiarism/${results.submission_id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plagiarism-report-${results.submission_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Download failed.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const overallScore = results?.overall_similarity ?? 0;

  return (
    <div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
        Submit files or paste text for plagiarism analysis
      </p>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.card}>
        <h3 style={s.sectionTitle}>Upload Files</h3>
        <div
          style={{ ...s.dropzone, ...(dragActive ? s.dropzoneActive : {}) }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('panel-file-input').click()}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>☁️</div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
            {dragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>PDF, DOCX, TXT — Multiple files supported</div>
          <input
            id="panel-file-input"
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>

        {files.length > 0 && (
          <div>
            {files.map((f, i) => (
              <div key={i} style={s.fileItem}>
                <div>
                  <span style={{ color: '#e0e0e0', fontWeight: '500' }}>{f.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '10px' }}>{formatSize(f.size)}</span>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px' }} onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={s.orSep}>
          <div style={s.orLine} />
          <span>OR</span>
          <div style={s.orLine} />
        </div>

        <h3 style={s.sectionTitle}>Paste Text</h3>
        <textarea
          style={s.textarea}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste your text content here for plagiarism checking..."
          onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {assignments.length > 0 && (
        <div style={{ ...s.card, marginBottom: '20px' }}>
          <h3 style={s.sectionTitle}>Link to Assignment (optional)</h3>
          <select
            style={s.select}
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="">General check (no assignment)</option>
            {assignments.map((a) => (
              <option key={a.id || a._id} value={a.id || a._id} style={{ background: '#1a1a4e' }}>
                {a.title}{a.course_code ? ` (${a.course_code})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        style={{ ...s.btn, ...(scanning ? s.btnDisabled : {}) }}
        onClick={handleScan}
        disabled={scanning}
        onMouseEnter={(e) => { if (!scanning) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 30px rgba(124,58,237,0.4)'; } }}
        onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
      >
        {scanning ? 'Scanning...' : 'Scan for Plagiarism'}
      </button>

      {scanning && (
        <div style={s.loadingOverlay}>
          <div style={s.spinner} />
          <p>Analyzing content for plagiarism...</p>
        </div>
      )}

      {results && !scanning && (
        <>
          <div style={s.resultsCard}>
            <h3 style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: '20px' }}>Scan Results</h3>
            <div style={{ ...s.scoreCircle, background: `${getScoreColor(overallScore)}15`, border: `3px solid ${getScoreColor(overallScore)}` }}>
              <div style={{ ...s.scoreValue, color: getScoreColor(overallScore) }}>{overallScore}%</div>
              <div style={s.scoreLabel}>Similarity</div>
            </div>
            <div style={s.breakdownGrid}>
              <div style={s.breakdownCard}>
                <div style={{ ...s.breakdownValue, color: '#f87171' }}>{results.exact_match_percentage ?? 0}%</div>
                <div style={s.breakdownLabel}>Exact Match</div>
              </div>
              <div style={s.breakdownCard}>
                <div style={{ ...s.breakdownValue, color: '#facc15' }}>{results.semantic_match_percentage ?? 0}%</div>
                <div style={s.breakdownLabel}>Semantic Match</div>
              </div>
              <div style={s.breakdownCard}>
                <div style={{ ...s.breakdownValue, color: '#fb923c' }}>{results.paraphrase_percentage ?? 0}%</div>
                <div style={s.breakdownLabel}>Paraphrase</div>
              </div>
              <div style={s.breakdownCard}>
                <div style={{ ...s.breakdownValue, color: '#7c3aed' }}>{results.ai_generated_score ?? 0}%</div>
                <div style={s.breakdownLabel}>AI Score</div>
              </div>
            </div>
          </div>

          {results.highlighted_content && (
            <div style={s.resultsCard}>
              <h3 style={s.sectionTitle}>Highlighted Content</h3>
              <div
                style={s.highlightBox}
                dangerouslySetInnerHTML={{ __html: results.highlighted_content.highlighted || results.highlighted_content.original || results.highlighted_content }}
              />
            </div>
          )}

          {results.matched_sources && results.matched_sources.length > 0 && (
            <div style={s.resultsCard}>
              <h3 style={s.sectionTitle}>Matched Sources ({results.matched_sources.length})</h3>
              {results.matched_sources.map((src, i) => (
                <div key={i} style={s.sourceCard}>
                  <div style={s.sourceText}>{src.matching_text || src.text || src.snippet || src.content || 'No text available'}</div>
                  <div style={s.sourceSim}>
                    Similarity: {typeof src.similarity === 'number' ? src.similarity.toFixed(1) : src.similarity ?? 0}%
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              style={s.downloadBtn}
              onClick={handleDownload}
              disabled={downloadLoading}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(34,197,94,0.2)'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(34,197,94,0.1)'; e.target.style.transform = 'none'; }}
            >
              {downloadLoading ? 'Downloading...' : 'Download PDF Report'}
            </button>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Results are saved to your scan history.</span>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadPanel;
