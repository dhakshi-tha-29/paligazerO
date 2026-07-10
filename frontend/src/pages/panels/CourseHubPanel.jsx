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

const levelColors = { beginner: '#4ade80', intermediate: '#facc15', advanced: '#f87171' };
const statusColors = { active: '#4ade80', upcoming: '#60a5fa', completed: 'rgba(255,255,255,0.3)', archived: 'rgba(255,255,255,0.2)' };

function CourseHubPanel() {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', course_code: '', credits: 3, duration_weeks: 12, level: 'beginner', category: 'Computer Science', max_students: 50, tags: '' });
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchCourses();
    if (role === 'student') fetchMyCourses();
    else setLoading(false);
  }, []);

  const fetchCourses = async () => {
    try {
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (filterCategory) params.push(`category=${encodeURIComponent(filterCategory)}`);
      if (filterLevel) params.push(`level=${filterLevel}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const data = await apiCall('GET', `/courses${query}`);
      setCourses(data.courses || []);
    } catch { setCourses([]); }
    setLoading(false);
  };

  const fetchMyCourses = async () => {
    try {
      const data = await apiCall('GET', '/courses/my');
      setMyEnrollments(data.enrollments || []);
    } catch { setMyEnrollments([]); }
  };

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await apiCall('POST', `/courses/${courseId}/enroll`);
      fetchMyCourses();
      fetchCourses();
    } catch {}
    setEnrolling(null);
  };

  const handleUnenroll = async (courseId) => {
    try {
      await apiCall('POST', `/courses/${courseId}/unenroll`);
      fetchMyCourses();
      fetchCourses();
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiCall('POST', '/courses', {
        ...newCourse,
        tags: newCourse.tags ? newCourse.tags.split(',').map(t => t.trim()) : [],
      });
      setShowCreateForm(false);
      setNewCourse({ title: '', description: '', course_code: '', credits: 3, duration_weeks: 12, level: 'beginner', category: 'Computer Science', max_students: 50, tags: '' });
      fetchCourses();
    } catch {}
  };

  const enrolledIds = myEnrollments.map(e => e.course_id?._id || e.course_id);
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];

  const enrolledMap = {};
  myEnrollments.forEach(e => { enrolledMap[e.course_id?._id || e.course_id] = e; });

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
        Browse, enroll, and manage your courses
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {role === 'student' && (
          <button
            onClick={() => setActiveTab('my-courses')}
            style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
              background: activeTab === 'my-courses' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(255,255,255,0.05)',
              color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            My Courses ({myEnrollments.length})
          </button>
        )}
        <button
          onClick={() => setActiveTab('browse')}
          style={{
            padding: '8px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
            background: activeTab === 'browse' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(255,255,255,0.05)',
            color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          Browse Courses ({courses.length})
        </button>
        {(role === 'faculty' || role === 'admin') && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
              background: showCreateForm ? '#f87171' : 'rgba(255,255,255,0.05)',
              color: '#fff', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto',
            }}
          >
            {showCreateForm ? 'Cancel' : '+ Create Course'}
          </button>
        )}
      </div>

      {/* Create Course Form */}
      {showCreateForm && (
        <div style={{ ...card, marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Create New Course</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <input placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required style={input} />
            <input placeholder="Course Code (e.g. CS301)" value={newCourse.course_code} onChange={e => setNewCourse({...newCourse, course_code: e.target.value})} required style={input} />
            <input placeholder="Category" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} style={input} />
            <select value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value})} style={input}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input type="number" placeholder="Credits" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: Number(e.target.value)})} style={input} />
            <input type="number" placeholder="Duration (weeks)" value={newCourse.duration_weeks} onChange={e => setNewCourse({...newCourse, duration_weeks: Number(e.target.value)})} style={input} />
            <input type="number" placeholder="Max Students" value={newCourse.max_students} onChange={e => setNewCourse({...newCourse, max_students: Number(e.target.value)})} style={input} />
            <input placeholder="Tags (comma separated)" value={newCourse.tags} onChange={e => setNewCourse({...newCourse, tags: e.target.value})} style={input} />
            <textarea placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} style={{ ...input, gridColumn: '1 / -1', minHeight: '80px', resize: 'vertical' }} />
            <button type="submit" style={{
              gridColumn: '1 / -1', padding: '10px 24px', fontSize: '14px', fontWeight: '600', border: 'none',
              borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff', cursor: 'pointer',
              justifySelf: 'start',
            }}>Create Course</button>
          </form>
        </div>
      )}

      {/* My Courses Tab */}
      {activeTab === 'my-courses' && role === 'student' && (
        <div>
          {myEnrollments.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '48px' }}>
              You haven't enrolled in any courses yet. Browse courses to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {myEnrollments.map((enr) => {
                const c = enr.course_id;
                if (!c) return null;
                return (
                  <div key={enr._id} style={{ ...card, cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    onClick={() => setSelectedCourse(c)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#a78bfa', marginBottom: '4px' }}>{c.course_code}</div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{c.title}</h3>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: enr.status === 'completed' ? 'rgba(74,222,128,0.15)' : 'rgba(124,58,237,0.15)',
                        color: enr.status === 'completed' ? '#4ade80' : '#a78bfa',
                      }}>
                        {enr.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>{c.credits} credits</span>
                      <span>·</span>
                      <span>{c.duration_weeks} weeks</span>
                      {enr.grade && <><span>·</span><span style={{ color: '#4ade80', fontWeight: '600' }}>Grade: {enr.grade}</span></>}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                        <span>Progress</span>
                        <span>{enr.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{
                          width: `${enr.progress}%`, height: '100%', borderRadius: '3px',
                          background: enr.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #7c3aed, #3b82f6)',
                          transition: 'width 0.5s',
                        }} />
                      </div>
                    </div>

                    {enr.status === 'enrolled' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnenroll(c._id); }}
                        style={{
                          marginTop: '8px', padding: '6px 16px', fontSize: '12px', fontWeight: '500',
                          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
                          background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer',
                        }}
                      >Unenroll</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Browse Courses Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchCourses()}
              style={{ ...input, maxWidth: '300px' }}
            />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...input, maxWidth: '180px' }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...input, maxWidth: '160px' }}>
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <button onClick={fetchCourses} style={{
              padding: '10px 20px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff', cursor: 'pointer',
            }}>Search</button>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>Loading courses...</p>
          ) : courses.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '48px' }}>No courses found</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {courses.map(c => {
                const isEnrolled = enrolledIds.includes(c._id);
                const enrollment = enrolledMap[c._id];
                const spotsLeft = c.max_students - c.enrolled_count;
                return (
                  <div key={c._id} style={{ ...card, cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    onClick={() => setSelectedCourse(c)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: '#a78bfa' }}>{c.course_code}</span>
                          <span style={{
                            padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600',
                            background: `${levelColors[c.level]}15`, color: levelColors[c.level], border: `1px solid ${levelColors[c.level]}30`,
                          }}>{c.level}</span>
                          <span style={{
                            padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600',
                            background: `${statusColors[c.status]}15`, color: statusColors[c.status], border: `1px solid ${statusColors[c.status]}30`,
                          }}>{c.status}</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '4px 0' }}>{c.title}</h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: '4px 0 8px', lineHeight: '1.5' }}>
                          {c.description?.length > 120 ? c.description.slice(0, 120) + '...' : c.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span>{c.credits} credits</span>
                      <span>{c.duration_weeks} weeks</span>
                      <span>{c.enrolled_count}/{c.max_students} enrolled</span>
                      {c.instructor && <span>by {c.instructor.first_name} {c.instructor.last_name}</span>}
                    </div>

                    {c.tags && c.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {c.tags.slice(0, 4).map((t, i) => (
                          <span key={i} style={{
                            padding: '3px 10px', borderRadius: '10px', fontSize: '11px',
                            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                          }}>{t}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {isEnrolled ? (
                        <>
                          <span style={{
                            padding: '6px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '8px',
                            background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)',
                          }}>Enrolled</span>
                          {enrollment?.progress !== undefined && (
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{enrollment.progress}% done</span>
                          )}
                        </>
                      ) : (
                        <button
                          disabled={enrolling === c._id || spotsLeft <= 0}
                          onClick={(e) => { e.stopPropagation(); handleEnroll(c._id); }}
                          style={{
                            padding: '6px 20px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '8px',
                            background: spotsLeft <= 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                            color: spotsLeft <= 0 ? 'rgba(255,255,255,0.3)' : '#fff',
                            cursor: spotsLeft <= 0 ? 'not-allowed' : 'pointer',
                            opacity: enrolling === c._id ? 0.6 : 1,
                          }}
                        >
                          {enrolling === c._id ? 'Enrolling...' : spotsLeft <= 0 ? 'Full' : 'Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
        }} onClick={() => setSelectedCourse(null)}>
          <div style={{
            ...card, maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
            background: 'rgba(15,12,41,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#a78bfa', marginBottom: '4px' }}>{selectedCourse.course_code}</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>{selectedCourse.title}</h2>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '6px 10px', color: '#e0e0e0', cursor: 'pointer', fontSize: '14px',
              }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedCourse.credits} credits</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedCourse.duration_weeks} weeks</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedCourse.enrolled_count}/{selectedCourse.max_students} enrolled</span>
              {selectedCourse.instructor && <span style={{ color: 'rgba(255,255,255,0.5)' }}>by {selectedCourse.instructor.first_name} {selectedCourse.instructor.last_name}</span>}
            </div>

            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '16px' }}>{selectedCourse.description}</p>

            {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Syllabus</h4>
                {selectedCourse.syllabus.map((s, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', marginBottom: '4px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)', fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                  }}>{s}</div>
                ))}
              </div>
            )}

            {selectedCourse.tags && selectedCourse.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {selectedCourse.tags.map((t, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '10px', fontSize: '12px',
                    background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)',
                  }}>{t}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {role === 'student' && !enrolledIds.includes(selectedCourse._id) && (
                <button
                  onClick={() => { handleEnroll(selectedCourse._id); setSelectedCourse(null); }}
                  style={{
                    padding: '10px 24px', fontSize: '14px', fontWeight: '600', border: 'none', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#fff', cursor: 'pointer',
                  }}
                >Enroll Now</button>
              )}
              {role === 'student' && enrolledIds.includes(selectedCourse._id) && (
                <button
                  onClick={() => { handleUnenroll(selectedCourse._id); setSelectedCourse(null); }}
                  style={{
                    padding: '10px 24px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer',
                  }}
                >Unenroll</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseHubPanel;
