import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiHome, FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Sidebar.css';

function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await api.post('/chat/conversations', {
        title: 'New Conversation',
      });
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>HOSHI AI</h2>
      </div>

      <button className="new-chat-button" onClick={handleNewChat}>
        <FiPlus /> New Chat
      </button>

      <div className="conversations-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv._id}
              to={`/chat/${conv._id}`}
              className="conversation-item"
            >
              <FiMessageSquare />
              <span>{conv.title}</span>
            </Link>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <Link to="/" className="nav-item">
          <FiHome /> Home
        </Link>
        <Link to="/settings" className="nav-item">
          <FiSettings /> Settings
        </Link>
        <button onClick={handleLogout} className="nav-item logout-button">
          <FiLogOut /> Logout
        </button>
        <div className="user-info">
          <span>{user?.username}</span>
          {user?.isAdmin && <span className="admin-badge">Admin</span>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
