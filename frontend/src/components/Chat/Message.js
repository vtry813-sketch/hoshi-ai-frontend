import React from 'react';
import { FiUser, FiStar } from 'react-icons/fi';
import './Message.css';

function Message({ message }) {
  const isUser = message.role === 'user';
  const isImage = message.isImage;

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? <FiUser /> : <FiStar />}
      </div>
      <div className="message-content">
        {isImage ? (
          <div className="image-message">
            <p>Generated Image:</p>
            <img 
              src={message.content.replace('![Generated Image](', '').replace(')', '')} 
              alt="Generated" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/512x512/333/666?text=Image+Failed+to+Load';
              }}
            />
          </div>
        ) : (
          <div className="text-content">
            {message.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}

export default Message;
