'use client';

import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import PredefinedActions from './PredefinedActions';

export default function ChatWindow({ 
  messages: propMessages, 
  onSendMessage: propOnSendMessage, 
  onActionClick: propOnActionClick,
  onClearChat: propOnClearChat 
}) {
  // Use props if provided, otherwise use internal state (for backward compatibility)
  const [internalMessages, setInternalMessages] = useState([
    {
      id: 1,
      text: "Selamat datang di KPBU Chatbot! Saya siap membantu Anda dengan pertanyaan tentang proyek KPBU. Apa yang ingin Anda ketahui?",
      isUser: false,
      timestamp: ''
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial timestamp on client side to avoid hydration mismatch
  useEffect(() => {
    setInternalMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === 1 && msg.timestamp === '' 
          ? { ...msg, timestamp: new Date().toISOString() }
          : msg
      )
    );
  }, []);

  // Use props if provided, otherwise use internal state
  const messages = propMessages || internalMessages;
  const setMessages = propMessages ? null : setInternalMessages;

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // If external handler is provided, use it
    if (propOnSendMessage) {
      setIsLoading(true);
      try {
        await propOnSendMessage(messageText);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Otherwise use internal logic (backward compatibility)
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pertanyaan_user: messageText,
          konteks_sesi: [] // TODO: Add project context management
        })
      });

      const data = await response.json();

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: data.success ? data.jawaban : data.error || 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.',
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || null
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan jaringan. Silakan coba lagi.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionText) => {
    // If external handler is provided, use it
    if (propOnActionClick) {
      propOnActionClick(actionText);
    } else {
      // Otherwise use default behavior (send as message)
      handleSendMessage(actionText);
    }
  };

  const clearChat = () => {
    if (propOnClearChat) {
      propOnClearChat();
    } else {
      setMessages([
        {
          id: 1,
          text: "Chat telah dibersihkan. Silakan mulai percakapan baru!",
          isUser: false,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🤖</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">KPBU Assistant</h1>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Mengetik...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Bersihkan Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Predefined Actions */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <PredefinedActions onActionClick={handleActionClick} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
