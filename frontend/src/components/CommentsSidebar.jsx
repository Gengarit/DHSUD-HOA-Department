import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Trash2 } from 'lucide-react';

const CommentsSidebar = ({ applicantId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (applicantId) {
      fetchComments();
    }
  }, [applicantId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/applicants/${applicantId}/comments`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/applicants/${applicantId}/comments`, {
        comment: newComment,
        userId: 1 // In a real app, this would be the logged-in user
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 max-w-sm">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text">Notes & Comments</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-text">
          <X size={20} />
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-background/40 rounded-lg p-3 text-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-text text-xs">{comment.username || 'System'}</span>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-danger text-xs"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-gray-400 text-xs mb-2">{comment.comment}</p>
              <p className="text-gray-600 text-xs">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a note..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          className="flex-1 bg-background text-text px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-accent"
        />
        <button
          onClick={handleAddComment}
          className="bg-accent hover:bg-accentHover text-white p-2 rounded-lg transition-colors"
          title="Add comment"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default CommentsSidebar;
