import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doubtsAPI } from '../services/api';
import { X, MessageCircle } from 'lucide-react';
import './Modal.css';

const PostDoubtModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    tags: ''
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
      await doubtsAPI.create({
        ...formData,
        postedBy: user.id,
        posterName: user.name,
        posterEmail: user.email,
        upvotes: 0,
        resolved: false
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        tags: ''
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error posting doubt:', error);
      alert('Failed to post doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Post a Doubt</h2>
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
              placeholder="e.g., How to implement binary search tree?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Explain your doubt in detail..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

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
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-control"
              placeholder="e.g., algorithms, trees, coding"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <MessageCircle size={18} />
              {loading ? 'Posting...' : 'Post Doubt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDoubtModal;
