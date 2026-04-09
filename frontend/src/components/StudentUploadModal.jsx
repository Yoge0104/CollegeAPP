import React, { useState } from 'react';
import { X, Upload, UserPlus, Info } from 'lucide-react';
import { attendanceAPI } from '../services/api';

const StudentUploadModal = ({ isOpen, onClose, onUploadSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    branch: initialData?.branch || '',
    year: initialData?.year || '',
    section: initialData?.section || '',
    studentText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'];
  const years = [1, 2, 3, 4];
  const sections = ['A', 'B', 'C'];

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Parse student list (assuming format: Name, Email per line)
    const lines = formData.studentText.split('\n').filter(line => line.trim());
    const studentList = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) return null;
      return { name: parts[0], email: parts[1] };
    }).filter(s => s !== null);

    if (studentList.length === 0) {
      setError('Please provide at least one student in "Name, Email" format.');
      return;
    }

    try {
      setLoading(true);
      await attendanceAPI.uploadStudents({
        branch: formData.branch,
        year: formData.year,
        section: formData.section,
        studentList
      });
      
      alert(`Successfully processed ${studentList.length} students.`);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload students. Please check your data format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus size={24} className="title-icon" />
            <h2>Upload Student List</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
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

          <div className="form-group">
            <label>Student List (Format: Name, Email)</label>
            <div className="info-box" style={{ 
              background: 'var(--bg-hover)', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <span>Enter one student per line. Example: <br/><b>John Doe, john@example.com</b></span>
            </div>
            <textarea
              name="studentText"
              value={formData.studentText}
              onChange={handleInputChange}
              placeholder="Full Name, email@college.com"
              rows={10}
              required
              style={{ fontFamily: 'monospace' }}
            ></textarea>
          </div>

          {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Upload size={18} />
              {loading ? 'Uploading...' : 'Upload Students'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentUploadModal;