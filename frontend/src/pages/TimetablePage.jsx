import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Calendar, Clock, MapPin, User as UserIcon, Plus, Trash2, Edit2, X, Filter, BookOpen, Layers, Hash, CheckCircle, AlertCircle } from 'lucide-react';
import { timetableAPI, attendanceAPI } from '../services/api';
import './CommonPages.css';

const TimetablePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [showClosedAlert, setShowClosedAlert] = useState(false);
  const [closedSessionInfo, setClosedSessionInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [filters, setFilters] = useState({
    branch: user?.branch || '',
    year: user?.year || '',
    section: user?.section || ''
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    subject: '',
    startTime: '',
    endTime: '',
    faculty: '',
    room: '',
    branch: '',
    year: '',
    section: ''
  });

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'];
  const years = [1, 2, 3, 4];
  const sections = ['A', 'B', 'C'];
  
  const isAdminOrFaculty = user?.role === 'ADMIN' || user?.role === 'FACULTY';

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    if (days.includes(today)) {
      setSelectedDay(today);
    } else {
      setSelectedDay('MONDAY');
    }
  }, []);

  useEffect(() => {
    if (user && selectedDay && filters.branch && filters.year && filters.section) {
      fetchTimetable();
      fetchActiveSessions();
    }
  }, [user, selectedDay, filters]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await timetableAPI.getForStudent(
        filters.branch,
        filters.year,
        filters.section,
        selectedDay
      );
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    if (!filters.branch || !filters.year || !filters.section) return;
    try {
      const res = await attendanceAPI.getActiveSessions(filters.branch, filters.year, filters.section);
      const newActiveSessions = res.data;

      // Check for closed session (student view only)
      if (!isAdminOrFaculty && activeSessions.length > 0 && newActiveSessions.length === 0) {
        setClosedSessionInfo(activeSessions[0]);
        setShowClosedAlert(true);
        setTimeout(() => setShowClosedAlert(false), 120000);
      }

      setActiveSessions(newActiveSessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const handleStartAttendance = (slot) => {
    const hasActive = isSessionActiveForSlot(slot);
    navigate('/attendance', { 
      state: { 
        startSession: !hasActive, 
        sessionData: slot 
      } 
    });
  };

  const isSessionActiveForSlot = (slot) => {
    // Session should only be considered active for the specific day it was created for
    // and if the subject/time matches the timetable slot
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    
    if (slot.dayOfWeek !== today) return false;

    return activeSessions.some(s => 
      s.subject === slot.subject && 
      s.sessionTime === `${slot.startTime} - ${slot.endTime}` &&
      s.branch === slot.branch &&
      s.year === slot.year &&
      s.section === slot.section
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({
      dayOfWeek: selectedDay,
      subject: '',
      startTime: '',
      endTime: '',
      faculty: '',
      room: '',
      branch: filters.branch || '',
      year: filters.year || '',
      section: filters.section || ''
    });
    setShowModal(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      dayOfWeek: entry.dayOfWeek,
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime,
      faculty: entry.faculty,
      room: entry.room,
      branch: entry.branch,
      year: entry.year,
      section: entry.section
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving timetable entry:', formData);
      if (editingEntry) {
        await timetableAPI.update(editingEntry.id, formData);
      } else {
        await timetableAPI.create(formData);
      }
      setShowModal(false);
      fetchTimetable();
    } catch (error) {
      console.error('Error saving timetable entry:', error);
      const errorMsg = error.response?.data?.message || error.response?.data || error.message;
      alert(`Failed to save timetable entry: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await timetableAPI.delete(id);
        fetchTimetable();
      } catch (error) {
        console.error('Error deleting timetable entry:', error);
        alert('Failed to delete timetable entry');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Calendar className="title-icon" />
              Class Timetable
            </h1>
            <p className="page-subtitle">Your weekly schedule at a glance</p>
          </div>
          {isAdminOrFaculty && (
            <button className="add-button" onClick={openAddModal}>
              <Plus size={20} />
              Add Entry
            </button>
          )}
        </div>

        {/* Global Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <BookOpen size={18} />
            <select name="branch" value={filters.branch} onChange={handleFilterChange}>
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <Layers size={18} />
            <select name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">Select Year</option>
              {years.map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <Hash size={18} />
            <select name="section" value={filters.section} onChange={handleFilterChange}>
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Sessions Notification for Students */}
        {!isAdminOrFaculty && showClosedAlert && closedSessionInfo && (
          <div className="attendance-closed-alert fade-in">
            <AlertCircle size={20} />
            <span>Attendance session for <b>{closedSessionInfo.subject}</b> has been closed now.</span>
          </div>
        )}

        {!isAdminOrFaculty && activeSessions.length > 0 && (
          <div className="active-attendance-alert fade-in">
            <AlertCircle size={20} />
            <span>Attendance is currently in progress for {activeSessions[0].subject}. 
              <button onClick={() => navigate('/attendance')}>Check Status</button>
            </span>
          </div>
        )}

        {!isAdminOrFaculty && activeSessions.length === 0 && (
          <div className="no-active-attendance-alert-timetable fade-in">
            <CheckCircle size={20} />
            <span>No active attendance sessions at the moment. Your faculty has not started any session.</span>
          </div>
        )}

        <div className="day-selector">
          {days.map((day) => (
            <button
              key={day}
              className={`day-button ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading timetable...</div>
        ) : (!filters.branch || !filters.year || !filters.section) ? (
          <div className="empty-state">
            <Filter size={64} />
            <p>Please select Branch, Year, and Section to view timetable</p>
          </div>
        ) : timetable.length > 0 ? (
          <div className="timetable-grid">
            {timetable.map((slot, index) => {
              const hasActiveSession = isSessionActiveForSlot(slot);
              return (
                <div key={slot.id} className={`timetable-card fade-in ${hasActiveSession ? 'session-active' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="card-top">
                    <div className="time-badge">
                      <Clock size={16} />
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="card-actions">
                      {isAdminOrFaculty ? (
                        <>
                          <button 
                            className={`action-icon-btn attendance ${hasActiveSession ? 'active' : ''}`} 
                            onClick={() => handleStartAttendance(slot)}
                            title={hasActiveSession ? "Continue Attendance" : "Start Attendance"}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button className="action-icon-btn edit" onClick={() => openEditModal(slot)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="action-icon-btn delete" onClick={() => handleDelete(slot.id)}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        hasActiveSession && (
                          <div className="active-badge">
                            <CheckCircle size={14} />
                            LIVE
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <h3 className="subject-name">{slot.subject}</h3>
                  <div className="slot-details">
                    {slot.faculty && (
                      <div className="detail-item">
                        <UserIcon size={16} />
                        <span>{slot.faculty}</span>
                      </div>
                    )}
                    {slot.room && (
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>Room {slot.room}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar size={64} />
            <p>No classes scheduled for {selectedDay}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Day of Week</label>
                <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} required>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Faculty</label>
                  <input type="text" name="faculty" value={formData.faculty} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Room</label>
                  <input type="text" name="room" value={formData.room} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select name="year" value={formData.year} onChange={handleInputChange} required>
                    <option value="">Select Year</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select name="section" value={formData.section} onChange={handleInputChange} required>
                    <option value="">Select Section</option>
                    {sections.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingEntry ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
