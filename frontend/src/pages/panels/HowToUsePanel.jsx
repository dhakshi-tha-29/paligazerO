import React from 'react';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  padding: '24px',
  backdropFilter: 'blur(8px)',
};

const steps = [
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'Register an account and choose your role — Student or Faculty. Students can submit documents and view their own scans. Faculty can create assignments, view all submissions, and manage the system.',
  },
  {
    icon: '📄',
    title: 'Upload Documents',
    desc: 'Navigate to the Upload Document panel from the sidebar. You can drag and drop PDF, DOCX, or TXT files into the upload zone, or simply paste your text directly into the text area.',
  },
  {
    icon: '🔍',
    title: 'Run Plagiarism Scan',
    desc: 'After uploading files or pasting text, click the "Scan for Plagiarism" button. The AI engine will analyze your content against its database and academic sources to detect similarities.',
  },
  {
    icon: '📊',
    title: 'View Results',
    desc: 'Your scan results show the overall similarity percentage, exact match, semantic match, paraphrase detection, and AI-generated scores. Matched content is highlighted directly in the text with colored markers.',
  },
  {
    icon: '📥',
    title: 'Download Reports',
    desc: 'After scanning, click "Download PDF Report" to export a detailed plagiarism report for offline viewing. Reports include all analysis metrics, highlighted content, and matched sources.',
  },
  {
    icon: '📜',
    title: 'Track History',
    desc: 'Visit the Scan History panel to view all your past plagiarism scans. You can search, filter, expand details, and download PDF reports for any previous scan.',
  },
  {
    icon: '📋',
    title: 'Manage Assignments',
    desc: 'Faculty can create new assignments with titles, descriptions, course codes, and due dates. Students can view available assignments and link their submissions directly to them.',
  },
  {
    icon: '📈',
    title: 'View Analytics',
    desc: 'The Analytics panel provides visual charts showing similarity distribution, AI detection rates, submission trends over time, and grade distributions (for faculty). All charts are built with pure CSS — no external libraries.',
  },
  {
    icon: '💬',
    title: 'AI Assistant',
    desc: 'Use the AI Chatbot panel to ask questions about plagiarism detection, understand your reports, or get help with the system. The AI assistant is available 24/7.',
  },
];

const tips = [
  {
    title: 'Supported File Formats',
    items: [
      'PDF (.pdf) — Most common academic format',
      'Microsoft Word (.docx) — Standard for assignments',
      'Plain Text (.txt) — Simple text documents',
      'Direct text paste — Paste content without uploading',
    ],
  },
  {
    title: 'How Plagiarism Detection Works',
    items: [
      'Exact matching: Finds verbatim copied text',
      'Semantic analysis: Detects meaning-based similarities',
      'Paraphrase detection: Identifies reworded content',
      'AI generation scoring: Detects AI-written text patterns',
    ],
  },
  {
    title: 'What Similarity Percentages Mean',
    items: [
      '0–20%: Low similarity — likely original work',
      '20–40%: Moderate — may need review for common phrases',
      '40–60%: Elevated — significant matching detected',
      '60–80%: High — likely contains substantial borrowed content',
      '80–100%: Very high — strong plagiarism indicators',
    ],
  },
  {
    title: 'Tips for Avoiding Plagiarism',
    items: [
      'Always cite your sources and reference borrowed ideas',
      'Use quotes for direct text from other authors',
      'Paraphrase ideas in your own words, then cite the source',
      'Run your draft through PaliGazer before final submission',
      'Develop your own arguments based on research understanding',
    ],
  },
];

function HowToUsePanel() {
  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
        A comprehensive guide to using PaliGazer effectively
      </p>

      {/* Steps Timeline */}
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div style={{
          position: 'absolute',
          left: '27px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(180deg, #7c3aed, #3b82f6, rgba(255,255,255,0.06))',
        }} />
        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '28px',
            position: 'relative',
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              minWidth: '54px',
              borderRadius: '16px',
              background: 'rgba(124,58,237,0.15)',
              border: '2px solid rgba(124,58,237,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              zIndex: 1,
            }}>
              {step.icon}
            </div>
            <div style={{
              ...card,
              flex: 1,
              marginLeft: '4px',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#7c3aed',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}>
                Step {i + 1}
              </div>
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e0e0e0',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <h2 style={{
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '20px',
      }}>
        Tips & Information
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '18px',
      }}>
        {tips.map((tip, i) => (
          <div key={i} style={card}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '14px',
              color: '#e0e0e0',
            }}>
              {tip.title}
            </h3>
            <ul style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {tip.items.map((item, j) => (
                <li key={j} style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: '1.5',
                  paddingLeft: '16px',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: '#7c3aed',
                  }}>
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowToUsePanel;
