import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { noticesAPI } from '../services/api';
import { X, Bell } from 'lucide-react';
import './Modal.css';

const CreateNoticeModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await noticesAPI.create({
        ...formData,
        postedBy: user.id,
        posterName: user.name
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'GENERAL',
        priority: 'MEDIUM'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating notice:', error);
      alert('Failed to create notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Notice</h2>
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
              placeholder="e.g., Mid-Term Examination Schedule"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea
              name="content"
              className="form-control"
              placeholder="Write the notice content here..."
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="GENERAL">General</option>
                <option value="EXAM">Exam</option>
                <option value="ACADEMIC">Academic</option>
                <option value="PLACEMENT">Placement</option>
                <option value="EVENT">Event</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Bell size={18} />
              {loading ? 'Creating...' : 'Create Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoticeModal;
