import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CreateNoticeModal from '../components/CreateNoticeModal';
import { Bell, Filter, Plus } from 'lucide-react';
import { noticesAPI } from '../services/api';
import './CommonPages.css';

const NoticesPage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async () => {
    try {
      const response = filter
        ? await noticesAPI.getByCategory(filter)
        : await noticesAPI.getAll();
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['EXAM', 'ACADEMIC', 'PLACEMENT', 'EVENT', 'GENERAL'];
  const priorityColors = {
    URGENT: '#EF4444',
    HIGH: '#F59E0B',
    MEDIUM: '#3B82F6',
    LOW: '#10B981'
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Bell className="title-icon" />
              Notices & Announcements
            </h1>
            <p className="page-subtitle">Stay updated with latest announcements</p>
          </div>
          {user?.role !== 'STUDENT' && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Create Notice
            </button>
          )}
        </div>

        <div className="filter-tabs">
          <button
            className={`tab-button ${filter === '' ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`tab-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading notices...</div>
        ) : notices.length > 0 ? (
          <div className="notices-grid">
            {notices.map((notice, index) => (
              <div
                key={notice.id}
                className="notice-card fade-in"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  borderLeftColor: priorityColors[notice.priority] || '#6B7280'
                }}
              >
                <div className="notice-card-header">
                  <span className={`badge badge-${notice.category.toLowerCase()}`}>
                    {notice.category}
                  </span>
                  {notice.priority && (
                    <span
                      className="priority-badge"
                      style={{ background: `${priorityColors[notice.priority]}20`, color: priorityColors[notice.priority] }}
                    >
                      {notice.priority}
                    </span>
                  )}
                </div>
                
                <h3 className="notice-card-title">{notice.title}</h3>
                <p className="notice-card-content">{notice.content}</p>
                
                <div className="notice-card-footer">
                  <span className="notice-author">By {notice.posterName}</span>
                  <span className="notice-time">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bell size={64} />
            <p>No notices found</p>
          </div>
        )}
      </div>

      <CreateNoticeModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchNotices}
      />
    </div>
  );
};

export default NoticesPage;
