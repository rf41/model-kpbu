'use client';

import { useState } from 'react';

export default function RecommendationsTester() {
  const [preferences, setPreferences] = useState({
    preferredSectors: [],
    investmentRange: '',
    riskTolerance: 'medium',
    maxDuration: '',
    preferredLocations: [],
    expectedROI: '',
    governmentSupportLevel: '',
    marketDemandLevel: '',
    interests: [],
    keywords: [],
    preferredComplexity: '',
    sustainabilityFocus: false,
    technologyFocus: false
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sectors = ['Transportation', 'Healthcare', 'Logistics', 'Water Management', 'Energy', 'Education', 'Technology', 'Sports'];
  const levels = ['low', 'medium', 'high'];
  const locations = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Yogyakarta', 'Bali', 'Batam'];

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setPreferences(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/get_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data.recommendations);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    setError('');

    try {
      const quickPreferences = {
        preferredSectors: ['Transportation', 'Healthcare'],
        investmentRange: '1000-10000',
        riskTolerance: 'medium',
        maxDuration: 36,
        preferredLocations: ['Jakarta', 'Surabaya'],
        expectedROI: 10,
        interests: ['infrastructure', 'healthcare'],
        sustainabilityFocus: false,
        technologyFocus: false
      };

      const response = await fetch('/api/get_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quickPreferences)
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data.recommendations);
        setPreferences(quickPreferences);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🎯 Recommendations API Tester</h1>
          <button
            onClick={handleQuickTest}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Quick Test
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preferred Sectors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Sectors
              </label>
              <div className="space-y-1">
                {sectors.map(sector => (
                  <label key={sector} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.preferredSectors.includes(sector)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences(prev => ({
                            ...prev,
                            preferredSectors: [...prev.preferredSectors, sector]
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            preferredSectors: prev.preferredSectors.filter(s => s !== sector)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Investment Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Range (Million IDR)
              </label>
              <select
                value={preferences.investmentRange}
                onChange={(e) => setPreferences(prev => ({ ...prev, investmentRange: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select range...</option>
                <option value="500-1000">500-1000</option>
                <option value="1000-5000">1000-5000</option>
                <option value="5000-10000">5000-10000</option>
                <option value="10000-20000">10000-20000</option>
                <option value="15000-30000">15000-30000</option>
              </select>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Tolerance
              </label>
              <select
                value={preferences.riskTolerance}
                onChange={(e) => setPreferences(prev => ({ ...prev, riskTolerance: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Max Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Duration (months)
              </label>
              <input
                type="number"
                value={preferences.maxDuration}
                onChange={(e) => setPreferences(prev => ({ ...prev, maxDuration: parseInt(e.target.value) || '' }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 36"
              />
            </div>

            {/* Expected ROI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected ROI (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={preferences.expectedROI}
                onChange={(e) => setPreferences(prev => ({ ...prev, expectedROI: parseFloat(e.target.value) || '' }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12.5"
              />
            </div>

            {/* Government Support */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Government Support Level
              </label>
              <select
                value={preferences.governmentSupportLevel}
                onChange={(e) => setPreferences(prev => ({ ...prev, governmentSupportLevel: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any level</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Locations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {locations.map(location => (
                <label key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.preferredLocations.includes(location)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({
                          ...prev,
                          preferredLocations: [...prev.preferredLocations, location]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          preferredLocations: prev.preferredLocations.filter(l => l !== location)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              value={preferences.interests.join(', ')}
              onChange={(e) => handleArrayInput('interests', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., infrastructure, healthcare, technology"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={preferences.keywords.join(', ')}
              onChange={(e) => handleArrayInput('keywords', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., jalan, rumah sakit, teknologi"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.sustainabilityFocus}
                onChange={(e) => setPreferences(prev => ({ ...prev, sustainabilityFocus: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Sustainability Focus</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.technologyFocus}
                onChange={(e) => setPreferences(prev => ({ ...prev, technologyFocus: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Technology Focus</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Top 5 Recommended Projects</h2>
          <div className="space-y-4">
            {recommendations.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    #{index + 1}. {project.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Final Score</div>
                    <div className="text-lg font-bold text-blue-600">{project.scores.finalScore}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sector:</span> {project.sector}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Investment:</span> {project.investmentRange} Million IDR
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Risk Level:</span> {project.riskLevel}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {project.duration} months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {project.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ROI:</span> {project.estimatedROI}%
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Gov Support:</span> {project.governmentSupport}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Market Demand:</span> {project.marketDemand}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Tags: </span>
                  {project.tags.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Scores: </span>
                  <span className="text-sm text-gray-600">
                    Rule-Based: {project.scores.ruleBasedScore} | 
                    Content-Based: {project.scores.contentBasedScore} | 
                    Final: {project.scores.finalScore}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Match Reasons:</span>
                  <ul className="text-sm text-gray-600 mt-1">
                    {project.matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-1">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
