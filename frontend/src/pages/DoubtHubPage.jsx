import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostDoubtModal from '../components/PostDoubtModal';
import DoubtCard from '../components/DoubtCard';
import { MessageCircle, Plus } from 'lucide-react';
import { doubtsAPI } from '../services/api';
import './CommonPages.css';

const DoubtHubPage = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, [filter]);

  const fetchDoubts = async () => {
    try {
      let response;
      if (filter === 'resolved') {
        response = await doubtsAPI.getByResolved(true);
      } else if (filter === 'unresolved') {
        response = await doubtsAPI.getByResolved(false);
      } else {
        response = await doubtsAPI.getAll();
      }
      setDoubts(response.data);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <MessageCircle className="title-icon" />
              Doubt Hub
            </h1>
            <p className="page-subtitle">Ask questions, share knowledge</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
            <Plus size={20} />
            Post Doubt
          </button>
        </div>

        <div className="filter-tabs">
          <button
            className={`tab-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Doubts
          </button>
          <button
            className={`tab-button ${filter === 'unresolved' ? 'active' : ''}`}
            onClick={() => setFilter('unresolved')}
          >
            Unresolved
          </button>
          <button
            className={`tab-button ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading doubts...</div>
        ) : doubts.length > 0 ? (
          <div className="doubts-list">
            {doubts.map((doubt, index) => (
              <DoubtCard 
                key={doubt.id} 
                doubt={doubt} 
                onUpdate={fetchDoubts}
                animationDelay={`${index * 0.05}s`}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <MessageCircle size={64} />
            <p>No doubts found</p>
          </div>
        )}
      </div>

      <PostDoubtModal 
        isOpen={showPostModal} 
        onClose={() => setShowPostModal(false)}
        onSuccess={fetchDoubts}
      />
    </div>
  );
};

export default DoubtHubPage;
