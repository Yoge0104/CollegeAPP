// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import {
//   Calendar,
//   BookOpen,
//   MessageCircle,
//   Bell,
//   TrendingUp,
//   Users,
//   FileText,
//   Award
// } from 'lucide-react';
// import { noticesAPI, doubtsAPI, notesAPI } from '../services/api';
// import './DashboardPage.css';
//
// const DashboardPage = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     notices: 0,
//     doubts: 0,
//     notes: 0,
//     resolved: 0
//   });
//   const [recentNotices, setRecentNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);
//
//   const fetchDashboardData = async () => {
//     try {
//       const [noticesRes, doubtsRes, notesRes] = await Promise.all([
//         noticesAPI.getAll(),
//         doubtsAPI.getAll(),
//         notesAPI.getAll()
//       ]);
//
//
//       // Only fetch attendance for students
//       if (user.role === 'STUDENT' && user.id) {
//         promises.push(attendanceAPI.getStudentStats(user.id));
//       }
//
//       const results = await Promise.all(promises);
//       const [noticesRes, doubtsRes, notesRes, attendanceRes] =
//             user.role === 'STUDENT' && user.id
//               ? results
//               : [...results, null];
//
//           setStats({
//             notices: noticesRes.data.length,
//             doubts: doubtsRes.data.filter(d => !d.resolved).length,
//             notes: notesRes.data.length,
//             resolved: doubtsRes.data.filter(d => d.resolved).length,
//             attendancePercentage: attendanceRes ? attendanceRes.data.percentage : 0
//           });
//
//       setRecentNotices(noticesRes.data.slice(0, 5));
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const quickActions = [
//     { icon: Calendar, label: 'View Timetable', path: '/timetable', color: '#3B82F6' },
//     { icon: ClipboardCheck, label: 'My Attendance', path: '/attendance', color: '#8B5CF6', show: user.role === 'STUDENT' },
//     { icon: BookOpen, label: 'Browse Notes', path: '/notes', color: '#10B981' },
//     { icon: MessageCircle, label: 'Ask Doubt', path: '/doubts', color: '#F59E0B' },
//     { icon: Bell, label: 'See Notices', path: '/notices', color: '#EF4444' },
//   ];
//
//   const statCards = user.role === 'STUDENT' ? [
//     { icon: ClipboardCheck, label: 'Attendance', value: `${stats.attendancePercentage}%`, color: '#8B5CF6' },
//     { icon: Bell, label: 'Total Notices', value: stats.notices, color: '#EF4444' },
//     { icon: MessageCircle, label: 'Active Doubts', value: stats.doubts, color: '#F59E0B' },
//     { icon: FileText, label: 'Study Materials', value: stats.notes, color: '#10B981' },
//   ] : [
//     { icon: Bell, label: 'Total Notices', value: stats.notices, color: '#EF4444' },
//     { icon: MessageCircle, label: 'Active Doubts', value: stats.doubts, color: '#F59E0B' },
//     { icon: FileText, label: 'Study Materials', value: stats.notes, color: '#10B981' },
//     { icon: Award, label: 'Resolved Doubts', value: stats.resolved, color: '#3B82F6' },
//   ];
//
//   return (
//     <div className="page-wrapper">
//       <Navbar />
//
//       <div className="page-container">
//         <div className="dashboard-header">
//           <div className="header-content">
//             <h1 className="dashboard-title">
//               Welcome back, <span className="highlight">{user?.name}</span>! 👋
//             </h1>
//             <p className="dashboard-subtitle">
//               {user?.branch} • Year {user?.year} • Section {user?.section}
//             </p>
//           </div>
//           <div className="header-badge">
//             <TrendingUp size={20} />
//             <span>Keep Learning</span>
//           </div>
//         </div>
//
//         {/* Stats Grid */}
//         <div className="stats-grid">
//           {statCards.map((stat, index) => (
//             <div key={index} className="stat-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
//               <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
//                 <stat.icon size={24} />
//               </div>
//               <div className="stat-details">
//                 <div className="stat-value">{loading ? '...' : stat.value}</div>
//                 <div className="stat-label">{stat.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//
//         {/* Quick Actions */}
//         <div className="section">
//           <h2 className="section-title">Quick Actions</h2>
//           <div className="quick-actions-grid">
//             {quickActions.map((action, index) => (
//               <Link
//                 key={index}
//                 to={action.path}
//                 className="quick-action-card"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="action-icon" style={{ background: `${action.color}15`, color: action.color }}>
//                   <action.icon size={28} />
//                 </div>
//                 <span className="action-label">{action.label}</span>
//               </Link>
//             ))}
//           </div>
//         </div>
//
//         {/* Recent Notices */}
//         <div className="section">
//           <div className="section-header">
//             <h2 className="section-title">Recent Notices</h2>
//             <Link to="/notices" className="view-all-link">View All →</Link>
//           </div>
//
//           {loading ? (
//             <div className="loading-state">Loading notices...</div>
//           ) : recentNotices.length > 0 ? (
//             <div className="notices-list">
//               {recentNotices.map((notice, index) => (
//                 <div key={notice.id} className="notice-item fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
//                   <div className="notice-header">
//                     <span className={`notice-badge badge-${notice.category.toLowerCase()}`}>
//                       {notice.category}
//                     </span>
//                     <span className="notice-date">
//                       {new Date(notice.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <h4 className="notice-title">{notice.title}</h4>
//                   <p className="notice-content">{notice.content.substring(0, 100)}...</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="empty-state">
//               <Bell size={48} />
//               <p>No notices yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default DashboardPage;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Calendar,
  BookOpen,
  MessageCircle,
  Bell,
  TrendingUp,
  Users,
  FileText,
  Award,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import { noticesAPI, doubtsAPI, notesAPI, attendanceAPI } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    notices: 0,
    doubts: 0,
    notes: 0,
    resolved: 0,
    attendancePercentage: 0
  });
  const [recentNotices, setRecentNotices] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    if (user?.role === 'STUDENT') {
      fetchActiveSessions();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const promises = [
        noticesAPI.getAll(),
        doubtsAPI.getAll(),
        notesAPI.getAll()
      ];

      // Only fetch attendance for students
      const includeAttendance = user?.role === 'STUDENT' && user?.id;
      if (includeAttendance) {
        promises.push(attendanceAPI.getStudentStats(user.id));
      }

      const results = await Promise.all(promises);

      // Destructure depending on whether attendance was requested
      const [noticesRes, doubtsRes, notesRes, attendanceRes] = includeAttendance
        ? results
        : [...results, null];

      setStats({
        notices: noticesRes.data.length,
        doubts: doubtsRes.data.filter(d => !d.resolved).length,
        notes: notesRes.data.length,
        resolved: doubtsRes.data.filter(d => d.resolved).length,
        attendancePercentage: attendanceRes ? attendanceRes.data.percentage : 0
      });

      setRecentNotices(noticesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const res = await attendanceAPI.getActiveSessions(user.branch, user.year, user.section);
      setActiveSessions(res.data);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const quickActions = [
    { icon: Calendar, label: 'View Timetable', path: '/timetable', color: '#3B82F6' },
    { icon: ClipboardCheck, label: 'My Attendance', path: '/attendance', color: '#8B5CF6', show: user?.role === 'STUDENT' },
    { icon: BookOpen, label: 'Browse Notes', path: '/notes', color: '#10B981' },
    { icon: MessageCircle, label: 'Ask Doubt', path: '/doubts', color: '#F59E0B' },
    { icon: Bell, label: 'See Notices', path: '/notices', color: '#EF4444' },
  ].filter(action => action.show === undefined || action.show);

  const statCards = user?.role === 'STUDENT' ? [
    { icon: ClipboardCheck, label: 'Attendance', value: `${stats.attendancePercentage}%`, color: '#8B5CF6' },
    { icon: Bell, label: 'Total Notices', value: stats.notices, color: '#EF4444' },
    { icon: MessageCircle, label: 'Active Doubts', value: stats.doubts, color: '#F59E0B' },
    { icon: FileText, label: 'Study Materials', value: stats.notes, color: '#10B981' },
  ] : [
    { icon: Bell, label: 'Total Notices', value: stats.notices, color: '#EF4444' },
    { icon: MessageCircle, label: 'Active Doubts', value: stats.doubts, color: '#F59E0B' },
    { icon: FileText, label: 'Study Materials', value: stats.notes, color: '#10B981' },
    { icon: Award, label: 'Resolved Doubts', value: stats.resolved, color: '#3B82F6' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-container">
        {user?.role === 'STUDENT' && activeSessions.length > 0 && (
          <div className="active-attendance-alert fade-in" style={{ marginTop: '0', marginBottom: '2rem' }}>
            <AlertCircle size={24} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block' }}>Attendance in Progress!</strong>
              <span>Attendance session for <b>{activeSessions[0].subject}</b> is live.</span>
            </div>
            <button onClick={() => navigate('/attendance')}>Mark Attendance</button>
          </div>
        )}

        {user?.role === 'STUDENT' && activeSessions.length === 0 && (
          <div className="no-active-attendance-alert fade-in" style={{ marginTop: '0', marginBottom: '2rem' }}>
            <ClipboardCheck size={24} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block' }}>No Active Attendance</strong>
              <span>Attendance sessions are started by your faculty during class.</span>
            </div>
          </div>
        )}

        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              Welcome back, <span className="highlight">{user?.name}</span>! 👋
            </h1>
            <p className="dashboard-subtitle">
              {user?.branch} • Year {user?.year} • Section {user?.section}
            </p>
          </div>
          <div className="header-badge">
            <TrendingUp size={20} />
            <span>Keep Learning</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-details">
                <div className="stat-value">{loading ? '...' : stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="quick-action-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="action-icon" style={{ background: `${action.color}15`, color: action.color }}>
                  <action.icon size={28} />
                </div>
                <span className="action-label">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Notices</h2>
            <Link to="/notices" className="view-all-link">View All →</Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading notices...</div>
          ) : recentNotices.length > 0 ? (
            <div className="notices-list">
              {recentNotices.map((notice, index) => (
                <div key={notice.id} className="notice-item fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="notice-header">
                    <span className={`notice-badge badge-${notice.category.toLowerCase()}`}>
                      {notice.category}
                    </span>
                    <span className="notice-date">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="notice-title">{notice.title}</h4>
                  <p className="notice-content">{notice.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bell size={48} />
              <p>No notices yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
