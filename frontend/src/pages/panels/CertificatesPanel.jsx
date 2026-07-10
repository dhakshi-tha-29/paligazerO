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

const input = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#e0e0e0',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

const typeColors = {
  course: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa', icon: '🎓' },
  workshop: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa', icon: '🔧' },
  project: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)', text: '#4ade80', icon: '🚀' },
};

const statusColors = {
  issued: { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', label: 'Active' },
  revoked: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', label: 'Revoked' },
  expired: { bg: 'rgba(251,146,60,0.12)', text: '#fb923c', label: 'Expired' },
};

function CertificatesPanel() {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newCert, setNewCert] = useState({
    title: '', description: '', type: 'course', user_id: '',
    issued_by: '', issue_date: '', skills: '', credits: 0,
  });

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      const data = await apiCall('GET', '/certificates');
      setCertificates(data.certificates || []);
    } catch { setCertificates([]); }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifyResult(null);
    setVerifyError('');
    try {
      const data = await apiCall('GET', `/certificates/verify/${verifyCode.trim()}`);
      setVerifyResult(data.certificate);
    } catch {
      setVerifyError('Certificate not found or invalid verification code');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiCall('POST', '/certificates', {
        ...newCert,
        skills: newCert.skills ? newCert.skills.split(',').map(s => s.trim()) : [],
        credits: Number(newCert.credits),
      });
      setShowCreateForm(false);
      setNewCert({ title: '', description: '', type: 'course', user_id: '', issued_by: '', issue_date: '', skills: '', credits: 0 });
      fetchCertificates();
    } catch {}
  };

  const filtered = filter === 'all' ? certificates : certificates.filter(c => c.type === filter);

  const typeStats = {
    all: certificates.length,
    course: certificates.filter(c => c.type === 'course').length,
    workshop: certificates.filter(c => c.type === 'workshop').length,
    project: certificates.filter(c => c.type === 'project').length,
  };

  const totalCredits = certificates.reduce((sum, c) => sum + (c.credits || 0), 0);
  const allSkills = [...new Set(certificates.flatMap(c => c.skills || []))];

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
        View, verify, and manage your earned certificates
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={card}>
          <div style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {certificates.length}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Certificates</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {totalCredits}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Credits</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {allSkills.length}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills Earned</div>
        </div>
      </div>

      {/* Verify Certificate */}
      <div style={{ ...card, marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>Verify a Certificate</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <input
            placeholder="Enter verification code (e.g. A1B2C3D4E5F6)"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            style={{ ...input, maxWidth: '360px' }}
          />
          <button onClick={handleVerify} style={{
            padding: '10px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>Verify</button>
        </div>
        {verifyResult && (
          <div style={{
            marginTop: '12px', padding: '14px', borderRadius: '10px',
            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#4ade80', fontSize: '16px' }}>✓</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>Certificate Verified</span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              <strong>{verifyResult.title}</strong> — {verifyResult.description}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
              ID: {verifyResult.certificate_id} | Issued: {verifyResult.issue_date} | Type: {verifyResult.type} | Credits: {verifyResult.credits}
            </div>
          </div>
        )}
        {verifyError && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            fontSize: '13px', color: '#f87171',
          }}>{verifyError}</div>
        )}
      </div>

      {/* Faculty: Create Certificate */}
      {(role === 'faculty' || role === 'admin') && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
              background: showCreateForm ? '#f87171' : 'rgba(255,255,255,0.05)',
              color: '#fff', cursor: 'pointer',
            }}
          >{showCreateForm ? 'Cancel' : '+ Issue Certificate'}</button>

          {showCreateForm && (
            <div style={{ ...card, marginTop: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>Issue New Certificate</h3>
              <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <input placeholder="Student ID" value={newCert.user_id} onChange={e => setNewCert({...newCert, user_id: e.target.value})} required style={input} />
                <input placeholder="Certificate Title" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} required style={input} />
                <select value={newCert.type} onChange={e => setNewCert({...newCert, type: e.target.value})} style={input}>
                  <option value="course">Course Completion</option>
                  <option value="workshop">Workshop</option>
                  <option value="project">Project</option>
                </select>
                <input placeholder="Issued By" value={newCert.issued_by} onChange={e => setNewCert({...newCert, issued_by: e.target.value})} style={input} />
                <input type="date" value={newCert.issue_date} onChange={e => setNewCert({...newCert, issue_date: e.target.value})} style={input} />
                <input type="number" placeholder="Credits" value={newCert.credits} onChange={e => setNewCert({...newCert, credits: e.target.value})} style={input} />
                <input placeholder="Skills (comma separated)" value={newCert.skills} onChange={e => setNewCert({...newCert, skills: e.target.value})} style={input} />
                <textarea placeholder="Description" value={newCert.description} onChange={e => setNewCert({...newCert, description: e.target.value})} style={{ ...input, gridColumn: '1 / -1', minHeight: '60px', resize: 'vertical' }} />
                <button type="submit" style={{
                  gridColumn: '1 / -1', padding: '10px 24px', fontSize: '14px', fontWeight: '600', border: 'none',
                  borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff',
                  cursor: 'pointer', justifySelf: 'start',
                }}>Issue Certificate</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'course', 'workshop', 'project'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '8px',
            background: filter === f ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(255,255,255,0.05)',
            color: '#fff', cursor: 'pointer', textTransform: 'capitalize',
          }}>{f === 'all' ? `All (${typeStats.all})` : `${f} (${typeStats[f]})`}</button>
        ))}
      </div>

      {/* Certificate Cards */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>Loading certificates...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '48px' }}>
          No certificates found. Complete courses or participate in workshops to earn certificates.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map(cert => {
            const tc = typeColors[cert.type] || typeColors.course;
            const sc = statusColors[cert.status] || statusColors.issued;
            return (
              <div
                key={cert._id}
                onClick={() => setSelectedCert(cert)}
                style={{
                  ...card, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tc.border; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${tc.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Decorative corner */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '60px', height: '60px',
                  background: `linear-gradient(135deg, transparent 50%, ${tc.bg} 50%)`,
                  borderBottomLeftRadius: '16px',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', background: tc.bg, border: `1px solid ${tc.border}`, flexShrink: 0,
                  }}>{tc.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px', lineHeight: '1.3' }}>{cert.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '600',
                        background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`, textTransform: 'capitalize',
                      }}>{cert.type}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '600',
                        background: sc.bg, color: sc.text,
                      }}>{sc.label}</span>
                    </div>
                  </div>
                </div>

                {cert.description && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: '0 0 12px', lineHeight: '1.5' }}>
                    {cert.description.length > 100 ? cert.description.slice(0, 100) + '...' : cert.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {cert.issue_date && <span>Issued: {cert.issue_date}</span>}
                  {cert.credits > 0 && <span>{cert.credits} credits</span>}
                  {cert.issued_by && <span>by {cert.issued_by}</span>}
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {cert.skills.slice(0, 4).map((s, i) => (
                      <span key={i} style={{
                        padding: '3px 8px', borderRadius: '6px', fontSize: '10px',
                        background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                      }}>{s}</span>
                    ))}
                    {cert.skills.length > 4 && (
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        +{cert.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                  ID: {cert.certificate_id}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
        }} onClick={() => setSelectedCert(null)}>
          <div style={{
            ...card, maxWidth: '560px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
            background: 'rgba(15,12,41,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          }} onClick={e => e.stopPropagation()}>
            {/* Certificate Header */}
            <div style={{
              textAlign: 'center', padding: '32px 24px', marginBottom: '20px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))',
              borderRadius: '12px', border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {typeColors[selectedCert.type]?.icon || '🎓'}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                Certificate of {selectedCert.type === 'course' ? 'Completion' : selectedCert.type === 'workshop' ? 'Participation' : 'Achievement'}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>{selectedCert.title}</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.5' }}>{selectedCert.description}</p>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Certificate ID</div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#a78bfa' }}>{selectedCert.certificate_id}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Verification Code</div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#60a5fa' }}>{selectedCert.verification_code}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Issue Date</div>
                <div style={{ fontSize: '13px' }}>{selectedCert.issue_date || 'N/A'}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Credits</div>
                <div style={{ fontSize: '13px' }}>{selectedCert.credits || 0}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Issued By</div>
                <div style={{ fontSize: '13px' }}>{selectedCert.issued_by || 'N/A'}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '13px', color: statusColors[selectedCert.status]?.text || '#4ade80' }}>
                  {statusColors[selectedCert.status]?.label || selectedCert.status}
                </div>
              </div>
            </div>

            {selectedCert.skills && selectedCert.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Skills</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedCert.skills.map((s, i) => (
                    <span key={i} style={{
                      padding: '5px 12px', borderRadius: '8px', fontSize: '12px',
                      background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                const text = `Certificate: ${selectedCert.title}\nID: ${selectedCert.certificate_id}\nVerification: ${selectedCert.verification_code}\nIssued: ${selectedCert.issue_date}\nCredits: ${selectedCert.credits}\nSkills: ${(selectedCert.skills || []).join(', ')}`;
                navigator.clipboard.writeText(text);
              }} style={{
                padding: '8px 18px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#e0e0e0', cursor: 'pointer',
              }}>Copy Details</button>
              <button onClick={() => window.open(`http://localhost:5000/api/certificates/verify/${selectedCert.verification_code}`, '_blank')} style={{
                padding: '8px 18px', fontSize: '12px', fontWeight: '600', border: 'none',
                borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff', cursor: 'pointer',
              }}>Verify Online</button>
              <button onClick={() => setSelectedCert(null)} style={{
                padding: '8px 18px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', marginLeft: 'auto',
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificatesPanel;
