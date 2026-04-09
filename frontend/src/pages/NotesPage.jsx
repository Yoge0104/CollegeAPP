import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UploadNoteModal from '../components/UploadNoteModal';
import { BookOpen, Download, Upload, Search, Filter } from 'lucide-react';
import { notesAPI } from '../services/api';
import './CommonPages.css';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    let filtered = notes;
    
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSubject) {
      filtered = filtered.filter(note => note.subject === filterSubject);
    }
    
    setFilteredNotes(filtered);
  }, [searchTerm, filterSubject, notes]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [...new Set(notes.map(note => note.subject))];

  const handleDownload = async (fileName, originalName) => {
    try {
      const response = await notesAPI.download(fileName);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName || fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file.');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <BookOpen className="title-icon" />
              Study Materials
            </h1>
            <p className="page-subtitle">Access notes and resources</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={20} />
            Upload Note
          </button>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <Filter size={20} />
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading notes...</div>
        ) : filteredNotes.length > 0 ? (
          <div className="content-grid">
            {filteredNotes.map((note, index) => (
              <div key={note.id} className="content-card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="card-header">
                  <span className="badge badge-primary">{note.subject}</span>
                  {note.semester && <span className="badge badge-info">{note.semester}</span>}
                </div>
                <h3 className="card-title">{note.title}</h3>
                {note.description && <p className="card-description">{note.description}</p>}
                {note.topic && <div className="card-meta">Topic: {note.topic}</div>}
                <div className="card-footer">
                  <span className="uploader">By {note.uploaderName}</span>
                  <button className="btn-icon" onClick={() => handleDownload(note.fileUrl, note.fileName)}>
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={64} />
            <p>No notes found</p>
          </div>
        )}
      </div>

      <UploadNoteModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSuccess={fetchNotes}
      />
    </div>
  );
};

export default NotesPage;
