'use client';

import { useState, useEffect } from 'react';
import ChatWindow from "@/components/ChatWindow";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  metadata?: Record<string, unknown>;
  isError?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Selamat datang di KPBU Chatbot! Saya siap membantu Anda dengan pertanyaan tentang proyek KPBU. Apa yang ingin Anda ketahui?",
      isUser: false,
      timestamp: ''
    }
  ]);

  // Set initial timestamp on client side to avoid hydration mismatch
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === 1 && msg.timestamp === '' 
          ? { ...msg, timestamp: new Date().toISOString() }
          : msg
      )
    );
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message immediately to UI
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Make API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pertanyaan_user: messageText,
          konteks_sesi: [] // Can be extended to include project context
        })
      });

      const data = await response.json();

      // Add bot response to messages
      const botMessage = {
        id: Date.now() + 1,
        text: data.success 
          ? data.jawaban 
          : (data.error || 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.'),
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || null,
        isError: !data.success
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan jaringan. Silakan coba lagi.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleActionClick = (actionName: string) => {
    // Simple action handler - just send the action as a message
    handleSendMessage(actionName);
  };

  return (
    <div className="h-screen">
      <ChatWindow 
        messages={messages}
        onSendMessage={handleSendMessage}
        onActionClick={handleActionClick}
        onClearChat={() => setMessages([{
          id: 1,
          text: "Chat telah dibersihkan. Silakan mulai percakapan baru!",
          isUser: false,
          timestamp: new Date().toISOString()
        }])}
      />
    </div>
  );
}
