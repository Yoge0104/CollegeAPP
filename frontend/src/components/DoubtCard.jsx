import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { doubtsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoubtCard = ({ doubt, onUpdate, animationDelay }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    try {
      await doubtsAPI.upvote(doubt.id);
      onUpdate();
    } catch (error) {
      console.error('Error upvoting doubt:', error);
    }
  };

  const handleResolve = async (e) => {
    e.stopPropagation();
    try {
      await doubtsAPI.resolve(doubt.id);
      onUpdate();
    } catch (error) {
      console.error('Error resolving doubt:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await doubtsAPI.addReply(doubt.id, {
        content: replyText,
        repliedBy: user.id || 0,
        replierName: user.name,
        replierRole: user.role
      });
      setReplyText('');
      onUpdate();
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const isFacultyOrAdmin = user?.role === 'FACULTY' || user?.role === 'ADMIN';
  const isPoster = user?.email === doubt.posterEmail || user?.name === doubt.posterName;
  const canResolve = !doubt.resolved && (isFacultyOrAdmin || isPoster);

  return (
    <div 
      className={`doubt-card fade-in ${isExpanded ? 'expanded' : ''}`} 
      style={{ animationDelay }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="doubt-header">
        <div className="doubt-meta">
          <span className="badge badge-primary">{doubt.subject}</span>
          {doubt.resolved && <span className="badge badge-success">Resolved</span>}
        </div>
        <button
          className="upvote-button"
          onClick={handleUpvote}
        >
          <ThumbsUp size={18} />
          <span>{doubt.upvotes}</span>
        </button>
      </div>
      
      <h3 className="doubt-title">{doubt.title}</h3>
      <p className="doubt-description">{doubt.description}</p>
      
      <div className="doubt-footer">
        <div className="doubt-author">
          <span>Posted by {doubt.posterName}</span>
          <span className="doubt-date">
            {new Date(doubt.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="doubt-actions">
          <button className="action-btn">
            <MessageSquare size={18} />
            <span>{doubt.replies?.length || 0} replies</span>
          </button>
          {canResolve && (
            <button className="action-btn" onClick={handleResolve}>
              <CheckCircle size={18} />
              <span>Mark Resolved</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="replies-section" onClick={(e) => e.stopPropagation()}>
          {doubt.replies && doubt.replies.length > 0 ? (
            doubt.replies.map((reply) => (
              <div 
                key={reply.id} 
                className={`reply-item ${reply.replierName.includes('Faculty') || reply.replierRole === 'FACULTY' ? 'faculty-reply' : ''} ${reply.replierName === user.name ? 'own-reply' : ''}`}
              >
                <div className="reply-header">
                  <span className="reply-author">{reply.replierName}</span>
                  <span className="doubt-date">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="reply-content">{reply.content}</div>
              </div>
            ))
          ) : (
            <p className="empty-replies">No replies yet. Be the first to help!</p>
          )}

          {!doubt.resolved && (
            <form className="reply-input-wrapper" onSubmit={handleReply}>
              <input
                type="text"
                className="reply-input"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={submitting}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting || !replyText.trim()}>
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default DoubtCard;
