import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import { X, Upload } from 'lucide-react';
import './Modal.css';

const UploadNoteModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    semester: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append('note', new Blob([JSON.stringify({
        ...formData,
        uploadedBy: user.id,
        uploaderName: user.name
      })], { type: 'application/json' }));
      data.append('file', file);

      await notesAPI.create(data);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        topic: '',
        semester: ''
      });
      setFile(null);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading note:', error);
      alert('Failed to upload note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Study Material</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g., Data Structures Notes - Chapter 5"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Brief description of the content"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="e.g., Data Structures"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Topic</label>
              <input
                type="text"
                name="topic"
                className="form-control"
                placeholder="e.g., Trees, Graphs"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Semester</label>
            <select
              name="semester"
              className="form-control"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              <option value="Sem 1">Semester 1</option>
              <option value="Sem 2">Semester 2</option>
              <option value="Sem 3">Semester 3</option>
              <option value="Sem 4">Semester 4</option>
              <option value="Sem 5">Semester 5</option>
              <option value="Sem 6">Semester 6</option>
              <option value="Sem 7">Semester 7</option>
              <option value="Sem 8">Semester 8</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Note File *</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Upload size={18} />
              {loading ? 'Uploading...' : 'Upload Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNoteModal;
