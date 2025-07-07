'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';

export default function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages]);

  return (
    <div 
      ref={messagesContainerRef}
      className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          isUser={message.isUser}
        />
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-500">Mengetik...</span>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-medium mb-2">Belum ada pesan</h3>
          <p className="text-sm text-center">
            Mulai percakapan dengan mengetik pesan atau pilih aksi cepat di bawah.
          </p>
        </div>
      )}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
