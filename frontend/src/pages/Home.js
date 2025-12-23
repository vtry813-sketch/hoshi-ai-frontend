import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to HOSHI AI</h1>
        <p>Your intelligent assistant</p>
        <button 
          className="cta-button"
          onClick={() => navigate('/chat')}
        >
          Start Chatting
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Smart Conversations</h3>
          <p>Engage in meaningful conversations with advanced AI</p>
        </div>
        <div className="feature-card">
          <h3>Image Generation</h3>
          <p>Create images from text descriptions with fallback support</p>
        </div>
        <div className="feature-card">
          <h3>Secure & Private</h3>
          <p>Your conversations are encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
