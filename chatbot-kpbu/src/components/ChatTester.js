'use client';

import { useState } from 'react';

export default function ChatTester() {
  const [question, setQuestion] = useState('');
  const [projectIds, setProjectIds] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const konteks_sesi = projectIds 
        ? projectIds.split(',').map(id => id.trim()).filter(Boolean)
        : [];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pertanyaan_user: question,
          konteks_sesi: konteks_sesi
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'GET'
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🤖 KPBU Chat API Tester
      </h1>

      {/* Health Check */}
      <div className="mb-6">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Health Check'}
        </button>
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Pertanyaan:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Masukkan pertanyaan Anda tentang KPBU..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="projectIds" className="block text-sm font-medium text-gray-700 mb-2">
            ID Proyek (opsional, pisahkan dengan koma):
          </label>
          <input
            type="text"
            id="projectIds"
            value={projectIds}
            onChange={(e) => setProjectIds(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="KPBU-001, KPBU-002"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Memproses...' : 'Kirim Pertanyaan'}
        </button>
      </form>

      {/* Quick Test Buttons */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Quick Tests:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setQuestion('Apa itu KPBU?');
              setProjectIds('');
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Test: Apa itu KPBU?
          </button>
          <button
            onClick={() => {
              setQuestion('Berapa nilai investasi proyek jalan tol?');
              setProjectIds('KPBU-001');
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Test: Nilai Investasi
          </button>
          <button
            onClick={() => {
              setQuestion('Apa saja risiko dalam proyek ini?');
              setProjectIds('KPBU-001');
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Test: Risiko Proyek
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">Response:</h3>
          
          {response.jawaban && (
            <div className="mb-4">
              <h4 className="font-medium text-green-600 mb-2">Jawaban:</h4>
              <div className="bg-white p-3 rounded border whitespace-pre-wrap">
                {response.jawaban}
              </div>
            </div>
          )}

          {response.metadata && (
            <div className="mb-4">
              <h4 className="font-medium text-blue-600 mb-2">Metadata:</h4>
              <div className="bg-white p-3 rounded border">
                <pre className="text-sm text-gray-600">
                  {JSON.stringify(response.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {response.status && (
            <div className="mb-4">
              <h4 className="font-medium text-purple-600 mb-2">Status:</h4>
              <div className="bg-white p-3 rounded border">
                <pre className="text-sm text-gray-600">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
