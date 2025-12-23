import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatInterface from '../components/Chat/ChatInterface';
import api from '../services/api';
import './ChatPage.css';

function ChatPage() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      const response = await api.get('/chat/conversations');
      const conv = response.data.find(c => c._id === conversationId);
      setConversation(conv);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!conversationId) return;

    const userMessage = {
      conversationId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.post('/chat/messages', {
        conversationId,
        content,
      });

      const aiMessage = response.data.message;
      setMessages(prev => [...prev, aiMessage]);

      // If image generation is requested
      if (response.data.requiresImageGeneration) {
        await generateImage(content);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        conversationId,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateImage = async (prompt) => {
    try {
      const response = await api.post('/image/generate', { prompt });
      const imageMessage = {
        conversationId,
        role: 'assistant',
        content: `![Generated Image](${response.data.imageUrl})`,
        isImage: true,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, imageMessage]);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading conversation...</div>;
  }

  return (
    <div className="chat-page">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        conversation={conversation}
      />
    </div>
  );
}

export default ChatPage;
