import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './SettingsPage.css';

function SettingsPage() {
  const { user } = useAuth();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdminInfo = async () => {
    if (!user?.isAdmin) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/image/admin-info', {
        headers: {
          'X-Admin-Secret': process.env.REACT_APP_ADMIN_SECRET,
        },
      });
      setAdminInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Account Information</h2>
        <div className="info-card">
          <div className="info-row">
            <span>Username:</span>
            <strong>{user?.username}</strong>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <span>{user?.email}</span>
          </div>
          <div className="info-row">
            <span>Role:</span>
            <span>{user?.isAdmin ? 'Administrator' : 'User'}</span>
          </div>
        </div>
      </div>

      {user?.isAdmin && (
        <div className="settings-section">
          <h2>Admin Panel</h2>
          <div className="admin-panel">
            <button 
              onClick={fetchAdminInfo}
              className="admin-button"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Admin Information'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
            
            {adminInfo && (
              <div className="admin-info">
                <h3>System Information</h3>
                <div className="info-card">
                  <div className="info-row">
                    <span>Message:</span>
                    <span>{adminInfo.message}</span>
                  </div>
                  <div className="info-row">
                    <span>System Status:</span>
                    <span className="status-active">
                      {adminInfo.adminInfo.systemStatus}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Secret Key:</span>
                    <code>{adminInfo.adminInfo.secretKey}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="settings-section">
        <h2>About HOSHI AI</h2>
        <div className="about-card">
          <p>HOSHI AI is an intelligent assistant powered by Google's Gemini AI.</p>
          <p className="creator-info">
            <strong>Creator:</strong> inconnu boy
          </p>
          <p className="version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
