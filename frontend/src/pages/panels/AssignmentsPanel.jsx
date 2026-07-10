import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { apiCall } from '../../api';

const s = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '24px',
    backdropFilter: 'blur(8px)',
  },
  field: {
    marginBottom: '14px',
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '6px',
  },
  input: {
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
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '70px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  btn: {
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
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
  },
  assignmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  assignmentCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '22px',
    backdropFilter: 'blur(8px)',
    transition: 'border-color 0.2s, transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: '1.5',
    marginBottom: '10px',
    flex: 1,
  },
  cardMeta: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '12px',
  },
  courseBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '12px',
    background: 'rgba(59,130,246,0.15)',
    border: '1px solid rgba(59,130,246,0.25)',
    color: '#60a5fa',
    marginRight: '8px',
    marginBottom: '8px',
  },
  submitBtn: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '10px',
    background: 'rgba(124,58,237,0.1)',
    color: '#a78bfa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
  },
  empty: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    padding: '50px 20px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '18px',
    border: '1px dashed rgba(255,255,255,0.1)',
  },
  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#f87171',
    fontSize: '14px',
    marginBottom: '14px',
  },
  success: {
    background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#4ade80',
    fontSize: '14px',
    marginBottom: '14px',
  },
};

function AssignmentsPanel() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    apiCall('GET', '/assignments')
      .then((data) => setAssignments(data.assignments || data || []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setCreating(true);
    try {
      const data = await apiCall('POST', '/assignments', {
        title,
        description,
        course_code: courseCode || undefined,
        course_name: courseName || undefined,
        due_date: dueDate || undefined,
      });
      setAssignments((prev) => [...prev, data.assignment || data]);
      setTitle('');
      setDescription('');
      setCourseCode('');
      setCourseName('');
      setDueDate('');
      setCreateSuccess('Assignment created successfully!');
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch (err) {
      setCreateError(err.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const filtered = assignments.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (a.title || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.course_code || '').toLowerCase().includes(q) ||
      (a.course_name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        Manage and view plagiarism detection assignments
      </p>

      {role === 'faculty' && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '10px',
              background: 'rgba(124,58,237,0.1)',
              color: '#a78bfa',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: showCreate ? '16px' : '0',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(124,58,237,0.2)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(124,58,237,0.1)'; }}
          >
            {showCreate ? 'Cancel' : '+ Create New Assignment'}
          </button>
          {showCreate && (
            <div style={s.card}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Create New Assignment</h3>
              {createError && <div style={s.error}>{createError}</div>}
              {createSuccess && <div style={s.success}>{createSuccess}</div>}
              <form onSubmit={handleCreate}>
                <div style={s.field}>
                  <label style={s.label}>Title</label>
                  <input
                    style={s.input}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Assignment title"
                    required
                    onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Description</label>
                  <textarea
                    style={s.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the assignment requirements"
                    onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={s.field}>
                    <label style={s.label}>Course Code</label>
                    <input
                      style={s.input}
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. CS101"
                      onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Course Name</label>
                    <input
                      style={s.input}
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="e.g. Intro to CS"
                      onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Due Date</label>
                  <input
                    style={s.input}
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <button
                  type="submit"
                  style={s.btn}
                  disabled={creating}
                  onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 25px rgba(124,58,237,0.35)'; }}
                  onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                >
                  {creating ? 'Creating...' : 'Create Assignment'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <input
        style={{ ...s.searchInput, marginBottom: '24px' }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search assignments by title, description, course..."
        onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading assignments...</p>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          {search ? 'No assignments match your search.' : 'No assignments yet.'}
        </div>
      ) : (
        <div style={s.assignmentGrid}>
          {filtered.map((a, i) => (
            <div
              key={a.id || a._id || i}
              style={s.assignmentCard}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={s.cardTitle}>{a.title || a.name}</div>
              {(a.course_code || a.course_name) && (
                <div style={{ marginBottom: '6px' }}>
                  {a.course_code && <span style={s.courseBadge}>{a.course_code}</span>}
                  {a.course_name && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{a.course_name}</span>}
                </div>
              )}
              <div style={s.cardDesc}>{a.description}</div>
              <div style={s.cardMeta}>
                {a.due_date && (
                  <span>Due: {new Date(a.due_date).toLocaleDateString()} {new Date(a.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
              {role === 'student' && (
                <div
                  style={{ ...s.submitBtn, alignSelf: 'flex-start' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.transform = 'none'; }}
                >
                  View & Submit
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignmentsPanel;
