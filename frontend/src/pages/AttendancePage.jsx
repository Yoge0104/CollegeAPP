import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentUploadModal from '../components/StudentUploadModal';
import { ClipboardCheck, TrendingUp, Calendar, CheckCircle, XCircle, Plus, Users, Save, Lock, Upload, Download } from 'lucide-react';
import { attendanceAPI } from '../services/api';
import './AttendancePage.css';

const AttendancePage = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Faculty specific states
  const [activeSession, setActiveSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceMarks, setAttendanceMarks] = useState({}); // { studentId: 'PRESENT'/'ABSENT' }
  const [isSaving, setIsSaving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Student specific states
  const [showClosedAlert, setShowClosedAlert] = useState(false);
  const [closedSessionInfo, setClosedSessionInfo] = useState(null);
  const [activeSessionsForStudent, setActiveSessionsForStudent] = useState([]);

  const isFaculty = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  useEffect(() => {
    if (!authLoading && user && user.id) {
      if (isFaculty) {
        checkActiveSession();
      } else {
        fetchStudentData();
        checkActiveSessionsForStudent();
        // Poll for active sessions every 30 seconds for students
        const interval = setInterval(checkActiveSessionsForStudent, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [user, authLoading]);

  const checkActiveSessionsForStudent = async () => {
    if (!user?.branch || !user?.year || !user?.section) return;
    try {
      const res = await attendanceAPI.getActiveSessions(user.branch, user.year, user.section);
      const newActiveSessions = res.data;
      
      // Check if a session was just closed
      if (activeSessionsForStudent.length > 0 && newActiveSessions.length === 0) {
        setClosedSessionInfo(activeSessionsForStudent[0]);
        setShowClosedAlert(true);
        fetchStudentData(); // Refresh history when session closes
        
        // Hide alert after 2 minutes
        setTimeout(() => {
          setShowClosedAlert(false);
        }, 120000);
      }
      
      setActiveSessionsForStudent(newActiveSessions);
    } catch (error) {
      console.error('Error checking active sessions:', error);
    }
  };

  // Check if we were redirected from Timetable with session data
  useEffect(() => {
    if (!authLoading && user && isFaculty && location.state?.startSession) {
      handleCreateSessionFromTimetable(location.state.sessionData);
      // Clear navigation state to prevent re-creation on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, authLoading, user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [statsRes, historyRes] = await Promise.all([
        attendanceAPI.getStudentStats(user.id),
        attendanceAPI.getStudentAttendance(user.id)
      ]);
      
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveSession = async () => {
    try {
      setLoading(true);
      const res = await attendanceAPI.getFacultySessions(user.id);
      const active = res.data.find(s => s.isActive);
      if (active) {
        setActiveSession(active);
        fetchStudentsForSession(active);
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForSession = async (session) => {
    try {
      console.log('Fetching students for class:', session.branch, session.year, session.section);
      const [studentsRes, attendanceRes] = await Promise.all([
        attendanceAPI.getStudentsByClass(session.branch, session.year, session.section),
        attendanceAPI.getSessionAttendance(session.id)
      ]);
      
      console.log(`Found ${studentsRes.data.length} students in DB`);
      setStudents(studentsRes.data);
      
      // Map existing attendance
      const marks = {};
      // Initialize with PRESENT only for students returned from DB
      studentsRes.data.forEach(s => {
        marks[s.id] = 'PRESENT';
      });
      
      // Override with already marked status if any
      attendanceRes.data.forEach(a => {
        marks[a.studentId] = a.status;
      });
      setAttendanceMarks(marks);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch student list from database');
    }
  };

  const handleCreateSessionFromTimetable = async (data) => {
    try {
      setLoading(true);
      console.log('Starting attendance session for:', data);
      
      if (!user?.id) {
        throw new Error('User data not loaded. Please wait or log in again.');
      }

      const newSession = {
        subject: data.subject,
        sessionDate: new Date().toISOString().split('T')[0],
        sessionTime: `${data.startTime} - ${data.endTime}`,
        branch: data.branch,
        year: data.year,
        section: data.section,
        createdBy: user.id,
        facultyName: user.name
      };
      
      console.log('Creating session payload:', newSession);
      const res = await attendanceAPI.createSession(newSession);
      setActiveSession(res.data);
      fetchStudentsForSession(res.data);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start attendance session: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, status) => {
    setAttendanceMarks(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    try {
      setIsSaving(true);
      const attendanceList = students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        studentEmail: s.email,
        status: attendanceMarks[s.id] || 'PRESENT'
      }));

      console.log('Saving attendance for session:', activeSession.id);
      console.log('Attendance list:', attendanceList);

      const response = await attendanceAPI.markBulkAttendance({
        sessionId: activeSession.id,
        attendanceList,
        facultyId: user.id,
        facultyName: user.name
      });
      
      console.log('Save response:', response.data);
      alert('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      const errorMsg = error.response?.data || error.message;
      alert(`Failed to save attendance: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPresentList = () => {
    if (!students || students.length === 0) {
      alert('No students to download');
      return;
    }

    const presentStudents = students.filter(s => attendanceMarks[s.id] === 'PRESENT');
    if (presentStudents.length === 0) {
      alert('No students are marked as PRESENT');
      return;
    }

    const csvContent = [
      ['Student Name', 'Email', 'Status'],
      ...presentStudents.map(s => [s.name, s.email, 'PRESENT'])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `Present_Students_${activeSession.subject}_${activeSession.sessionDate}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeSession = async () => {
    if (window.confirm('Are you sure you want to close this session? No more attendance can be marked.')) {
      try {
        await attendanceAPI.closeSession(activeSession.id);
        setActiveSession(null);
        setStudents([]);
        setAttendanceMarks({});
        alert('Session closed successfully');
      } catch (error) {
        console.error('Error closing session:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'PRESENT' ? '#10B981' : '#EF4444';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const renderStudentView = () => {
    // Check if current user is marked present for any active session
    const isMarkedForActive = activeSessionsForStudent.some(session => 
      history.some(record => record.session?.id === session.id && record.status === 'PRESENT')
    );

    return (
      <>
        {/* Session Alerts */}
        {showClosedAlert && closedSessionInfo && (
          <div className="attendance-closed-alert fade-in">
            <Lock size={20} />
            <span>Attendance session for <b>{closedSessionInfo.subject}</b> has been closed now.</span>
          </div>
        )}

        {activeSessionsForStudent.length > 0 && (
          <div className={`active-attendance-alert fade-in ${isMarkedForActive ? 'success' : 'live'}`}>
            {isMarkedForActive ? (
              <>
                <CheckCircle size={20} />
                <span>Your attendance for <b>{activeSessionsForStudent[0].subject}</b> marked successfully!</span>
              </>
            ) : (
              <>
                <TrendingUp size={20} className="pulse" />
                <span>Attendance is LIVE for <b>{activeSessionsForStudent[0].subject}</b>. Make sure your attendance is marked.</span>
              </>
            )}
          </div>
        )}

        {activeSessionsForStudent.length === 0 && !showClosedAlert && (
          <div className="no-active-attendance-info fade-in">
            <ClipboardCheck size={20} />
            <span>No active attendance session at the moment.</span>
          </div>
        )}

        {/* Attendance Statistics */}
        {stats && (
          <div className="attendance-stats-grid">
          <div className="stat-card-large" style={{ 
            background: `linear-gradient(135deg, ${getPercentageColor(stats.percentage)}15, ${getPercentageColor(stats.percentage)}05)`,
            borderLeft: `4px solid ${getPercentageColor(stats.percentage)}`
          }}>
            <div className="stat-icon-large" style={{ 
              background: `${getPercentageColor(stats.percentage)}20`,
              color: getPercentageColor(stats.percentage)
            }}>
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value-large" style={{ color: getPercentageColor(stats.percentage) }}>
                {stats.percentage}%
              </div>
              <div className="stat-label-large">Overall Attendance</div>
              <div className="stat-sublabel">
                {stats.totalPresent} present out of {stats.totalSessions} sessions
              </div>
            </div>
          </div>

          <div className="stat-mini-grid">
            <div className="stat-mini-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div className="stat-mini-icon" style={{ background: '#10B98120', color: '#10B981' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-mini-content">
                <div className="stat-mini-value">{stats.totalPresent}</div>
                <div className="stat-mini-label">Present</div>
              </div>
            </div>

            <div className="stat-mini-card" style={{ borderLeft: '4px solid #EF4444' }}>
              <div className="stat-mini-icon" style={{ background: '#EF444420', color: '#EF4444' }}>
                <XCircle size={24} />
              </div>
              <div className="stat-mini-content">
                <div className="stat-mini-value">{stats.totalAbsent}</div>
                <div className="stat-mini-label">Absent</div>
              </div>
            </div>

            <div className="stat-mini-card" style={{ borderLeft: '4px solid #3B82F6' }}>
              <div className="stat-mini-icon" style={{ background: '#3B82F620', color: '#3B82F6' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-mini-content">
                <div className="stat-mini-value">{stats.totalSessions}</div>
                <div className="stat-mini-label">Total Sessions</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History */}
      <div className="section">
        <h2 className="section-title">Attendance History</h2>
        
        {history.length > 0 ? (
          <div className="attendance-history">
            {history.map((record, index) => (
              <div 
                key={record.id} 
                className="attendance-record fade-in"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  borderLeft: `4px solid ${getStatusColor(record.status)}`
                }}
              >
                <div className="record-header">
                  <div className="record-subject">
                    <h4>{record.session?.subject}</h4>
                    <span className="record-time">{record.session?.sessionTime}</span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ 
                      background: `${getStatusColor(record.status)}20`,
                      color: getStatusColor(record.status)
                    }}
                  >
                    {record.status === 'PRESENT' ? (
                      <><CheckCircle size={16} /> Present</>
                    ) : (
                      <><XCircle size={16} /> Absent</>
                    )}
                  </span>
                </div>
                
                <div className="record-details">
                  <div className="record-info">
                    <Calendar size={16} />
                    <span>{new Date(record.session?.sessionDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="record-faculty">
                    Marked by {record.markedByName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ClipboardCheck size={64} />
            <p>No attendance records yet</p>
          </div>
        )}
      </div>
    </>
    );
  };

  const renderFacultyView = () => (
    <div className="faculty-attendance-view">
      {!activeSession ? (
        <div className="empty-state">
          <Calendar size={64} />
          <h3>No Active Session</h3>
          <p>Go to the <b>Timetable</b> page and click <b>Start Attendance</b> on a current class slot.</p>
          <button className="btn-primary" style={{marginTop: '1rem'}} onClick={() => navigate('/timetable')}>
            Go to Timetable
          </button>
        </div>
      ) : (
        <div className="active-session-container">
          <div className="session-info-card">
            <div className="session-main">
              <h3>{activeSession.subject}</h3>
              <div className="session-meta">
                <span>{activeSession.branch} • Year {activeSession.year} • Section {activeSession.section}</span>
                <span>{activeSession.sessionTime}</span>
              </div>
            </div>
            <div className="session-actions">
              <button className="btn-download" onClick={downloadPresentList}>
                <Download size={18} />
                Download List
              </button>
              <button className="btn-upload-list" onClick={() => setShowUploadModal(true)}>
                <Upload size={18} />
                Upload Students
              </button>
              <button className="btn-save" onClick={saveAttendance} disabled={isSaving}>
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Attendance'}
              </button>
              <button className="btn-close" onClick={closeSession}>
                <Lock size={18} />
                Close Session
              </button>
            </div>
          </div>

          <div className="students-list-container">
            <div className="list-header">
              <div className="header-info">
                <Users size={20} />
                <h3>Students ({students.length})</h3>
              </div>
              <div className="bulk-actions">
                <button onClick={() => {
                  const allPresent = {};
                  students.forEach(s => allPresent[s.id] = 'PRESENT');
                  setAttendanceMarks(allPresent);
                }}>All Present</button>
                <button onClick={() => {
                  const allAbsent = {};
                  students.forEach(s => allAbsent[s.id] = 'ABSENT');
                  setAttendanceMarks(allAbsent);
                }}>All Absent</button>
              </div>
            </div>

            <div className="students-grid">
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id} className="student-mark-card">
                    <div className="student-info">
                      <span className="student-name">{student.name}</span>
                      <span className="student-email">{student.email}</span>
                    </div>
                    <div className="mark-actions">
                      <button 
                        className={`mark-btn present ${attendanceMarks[student.id] === 'PRESENT' ? 'active' : ''}`}
                        onClick={() => handleMarkChange(student.id, 'PRESENT')}
                      >
                        P
                      </button>
                      <button 
                        className={`mark-btn absent ${attendanceMarks[student.id] === 'ABSENT' ? 'active' : ''}`}
                        onClick={() => handleMarkChange(student.id, 'ABSENT')}
                      >
                        A
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-students-message">
                  <p>No students found for this class in the database.</p>
                  <button className="btn-upload-inline" onClick={() => setShowUploadModal(true)}>
                    <Plus size={16} /> Add Students Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <ClipboardCheck className="title-icon" />
              {isFaculty ? 'Attendance Management' : 'My Attendance'}
            </h1>
            <p className="page-subtitle">
              {isFaculty ? 'Mark and manage student attendance' : 'Track your class attendance'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading data...</div>
        ) : (
          isFaculty ? renderFacultyView() : renderStudentView()
        )}
      </div>

      {showUploadModal && (
        <StudentUploadModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={() => fetchStudentsForSession(activeSession)}
          initialData={{
            branch: activeSession?.branch,
            year: activeSession?.year,
            section: activeSession?.section
          }}
        />
      )}
    </div>
  );
};

export default AttendancePage;
