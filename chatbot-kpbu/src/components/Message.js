'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Message({ message, isUser }) {
  const [showMetadata, setShowMetadata] = useState(false);
  
  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : message.isError 
                ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-md'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
            }
          `}
        >
          <div className="text-sm break-words">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                  // Custom styling for markdown elements
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono border">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-100 p-3 rounded-md text-xs font-mono whitespace-pre-wrap overflow-x-auto border mb-2">
                        <code>{children}</code>
                      </pre>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-700 bg-blue-50 py-2 rounded-r-md mb-2">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-200 pb-1">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-semibold mb-1 text-gray-800">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-xs font-semibold mb-1 text-gray-800">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-xs font-semibold mb-1 text-gray-800">{children}</h6>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-2">
                      <table className="border-collapse border border-gray-300 text-xs min-w-full bg-white rounded">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-left text-gray-700">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-2 py-1 text-gray-600">
                      {children}
                    </td>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-3 border-gray-300" />,
                  del: ({ children }) => <del className="text-gray-500 line-through">{children}</del>,
                }}
              >
                {message.text}
              </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Metadata toggle for bot messages */}
          {!isUser && message.metadata && (
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showMetadata ? 'Sembunyikan detail' : 'Lihat detail'}
            </button>
          )}
        </div>

        {/* Message metadata */}
        {showMetadata && !isUser && message.metadata && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Detail Respons:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>
                <span className="font-medium">Dokumen ditemukan:</span> {message.metadata.chunks_found}
              </div>
              {message.metadata.project_ids && message.metadata.project_ids.length > 0 && (
                <div>
                  <span className="font-medium">ID Proyek:</span> {message.metadata.project_ids.join(', ')}
                </div>
              )}
              {message.metadata.sources && message.metadata.sources.length > 0 && (
                <div>
                  <span className="font-medium">Sumber:</span>
                  <div className="mt-1 space-y-1">
                    {message.metadata.sources.slice(0, 3).map((source, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate">{source.document}</span>
                        <span className="text-gray-500">({source.score})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>

      {/* Avatar */}
      <div className={`flex-shrink-0 ${isUser ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${isUser 
              ? 'bg-blue-500 text-white' 
              : message.isError 
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
            }
          `}
        >
          {isUser ? '👤' : '🤖'}
        </div>
      </div>
    </div>
  );
}
