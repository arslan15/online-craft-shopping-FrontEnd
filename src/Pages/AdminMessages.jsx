import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaCheckCircle, FaClock, FaUser, FaTag } from 'react-icons/fa';
import './AdminMessages.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
 const API_URL = process.env.REACT_APP_VITE_APP_API_URL || 'http://localhost:5000';
  // Fetch messages from backend on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Adjust port/URL if your backend runs on a different port or has a base URL
    const response = await axios.get(`${API_URL}/api/admin/messages`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/api/admin/messages/${id}/read`);
      if (response.data.success) {
        // Update local state so UI updates instantly without refetching
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, isRead: true } : msg
          )
        );
        toast.success("Message marked as read");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Could not update message status.");
    }
  };

  // Filter messages based on tab selection
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'read') return msg.isRead;
    return true; // 'all'
  });

  if (loading) {
    return <div className="admin-messages-loading">Loading inquiries...</div>;
  }

  return (
    <div className="admin-messages-page">
      <div className="admin-messages-header">
        <h2>
          <FaEnvelope className="header-icon" /> Customer Contact Messages
        </h2>
        
        {/* Filter Tabs */}
        <div className="message-filter-tabs">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`} 
            onClick={() => setFilter('unread')}
          >
            Unread ({messages.filter(m => !m.isRead).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`} 
            onClick={() => setFilter('read')}
          >
            Read ({messages.filter(m => m.isRead).length})
          </button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="no-messages-box">
          <p>No messages found in this category.</p>
        </div>
      ) : (
        <div className="messages-grid">
          {filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className={`message-card ${msg.isRead ? 'read' : 'unread'}`}
            >
              <div className="message-card-header">
                <span className="message-subject">
                  <FaTag className="card-icon" /> {msg.subject || 'General Inquiry'}
                </span>
                <span className={`status-badge ${msg.isRead ? 'status-read' : 'status-unread'}`}>
                  {msg.isRead ? 'Read' : 'Unread'}
                </span>
              </div>

              <div className="message-sender-info">
                <p>
                  <FaUser className="card-icon" /> <strong>{msg.name}</strong> ({msg.email})
                </p>
                <p className="message-date">
                  <FaClock className="card-icon" /> {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="message-body">
                <p>{msg.message}</p>
              </div>

              <div className="message-card-footer">
                {!msg.isRead ? (
                  <button 
                    className="mark-read-btn"
                    onClick={() => handleMarkAsRead(msg._id)}
                  >
                    <FaCheckCircle /> Mark as Read
                  </button>
                ) : (
                  <span className="read-timestamp">
                    <FaCheckCircle className="read-icon" /> Handled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}