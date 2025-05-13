import React, { useState, useEffect } from 'react';
import { scrapeCases, scrapeJudgment, processJudgment, searchCasesByJudge, getRecentCases } from '../utils/caseScraper';

const CaseLawDisplay = ({ selectedJudge }) => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [judgmentDetails, setJudgmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('recent'); // 'recent' or 'historical'
  const [courtFilter, setCourtFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // 'all', 'year', 'decade'
  const [legalAnalysis, setLegalAnalysis] = useState(null);

  useEffect(() => {
    if (selectedJudge) {
      loadJudgeCases(selectedJudge.name);
    }
  }, [selectedJudge, viewMode, courtFilter, dateRange]);

  const loadJudgeCases = async (judgeName) => {
    setLoading(true);
    setError(null);
    try {
      let judgeCases;
      if (viewMode === 'recent') {
        judgeCases = await getRecentCases('Supreme Court', 10);
      } else {
        judgeCases = await searchCasesByJudge(judgeName);
      }
      
      // Apply filters
      judgeCases = judgeCases.filter(caseItem => {
        const matchesCourt = courtFilter === 'all' || caseItem.court === courtFilter;
        const matchesDate = filterByDate(caseItem.date, dateRange);
        return matchesCourt && matchesDate;
      });
      
      setCases(judgeCases);
    } catch (err) {
      setError('Failed to load cases. Please try again later.');
      console.error('Error loading cases:', err);
    }
    setLoading(false);
  };

  const filterByDate = (dateStr, range) => {
    if (range === 'all') return true;
    const date = new Date(dateStr);
    const now = new Date();
    if (range === 'year') {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return date >= oneYearAgo;
    }
    if (range === 'decade') {
      const tenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 10));
      return date >= tenYearsAgo;
    }
    return true;
  };

  const handleCaseSelect = async (caseUrl) => {
    setLoading(true);
    setError(null);
    try {
      const judgment = await scrapeJudgment(caseUrl);
      if (judgment) {
        const processedJudgment = processJudgment(judgment.judgmentText);
        setJudgmentDetails({
          ...judgment,
          ...processedJudgment
        });
        analyzeLegalContext(processedJudgment);
      }
    } catch (err) {
      setError('Failed to load judgment details. Please try again later.');
      console.error('Error loading judgment:', err);
    }
    setLoading(false);
  };

  const analyzeLegalContext = (judgment) => {
    // Analyze legal principles and precedents
    const analysis = {
      keyPrinciples: extractKeyPrinciples(judgment),
      precedents: analyzePrecedents(judgment),
      legalImpact: assessLegalImpact(judgment)
    };
    setLegalAnalysis(analysis);
  };

  const extractKeyPrinciples = (judgment) => {
    // Extract key legal principles from the judgment
    const principles = [];
    if (judgment.ratio) {
      principles.push({
        principle: judgment.ratio,
        source: 'Ratio Decidendi',
        importance: 'High'
      });
    }
    if (judgment.holding) {
      principles.push({
        principle: judgment.holding,
        source: 'Holding',
        importance: 'Critical'
      });
    }
    return principles;
  };

  const analyzePrecedents = (judgment) => {
    // Analyze cited cases and their relevance
    return judgment.citedCases.map(caseName => ({
      name: caseName,
      relevance: 'Cited as Precedent',
      impact: 'Supporting Authority'
    }));
  };

  const assessLegalImpact = (judgment) => {
    // Assess the potential impact of the judgment
    return {
      scope: judgment.complexity === 'High' ? 'Broad' : 'Specific',
      significance: judgment.length > 5000 ? 'Landmark' : 'Standard',
      areas: extractLegalAreas(judgment)
    };
  };

  const extractLegalAreas = (judgment) => {
    // Extract relevant legal areas from the judgment
    const areas = new Set();
    const text = judgment.judgmentText.toLowerCase();
    
    if (text.includes('constitutional')) areas.add('Constitutional Law');
    if (text.includes('criminal')) areas.add('Criminal Law');
    if (text.includes('civil')) areas.add('Civil Law');
    if (text.includes('administrative')) areas.add('Administrative Law');
    if (text.includes('commercial')) areas.add('Commercial Law');
    
    return Array.from(areas);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            className="p-2 border rounded-lg"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="recent">Recent Cases</option>
            <option value="historical">Historical Cases</option>
          </select>
          
          <select
            className="p-2 border rounded-lg"
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
          >
            <option value="all">All Courts</option>
            <option value="Supreme Court">Supreme Court</option>
            <option value="Court of Appeal">Court of Appeal</option>
            <option value="High Court">High Court</option>
          </select>
          
          <select
            className="p-2 border rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">Last Year</option>
            <option value="decade">Last Decade</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {viewMode === 'recent' ? 'Recent Cases' : 'Historical Cases'} by {selectedJudge?.name}
        </h2>
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.url}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedCase?.url === caseItem.url
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => {
                setSelectedCase(caseItem);
                handleCaseSelect(caseItem.url);
              }}
            >
              <h3 className="font-semibold">{caseItem.title}</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Case Number: {caseItem.caseNumber}</p>
                <p>Date: {caseItem.date}</p>
                <p>Court: {caseItem.court}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Judgment Details and Analysis */}
      {judgmentDetails && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Judgment Analysis</h2>
          
          {/* Key Legal Principles */}
          {legalAnalysis?.keyPrinciples.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Key Legal Principles</h3>
              <div className="space-y-4">
                {legalAnalysis.keyPrinciples.map((principle, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700">{principle.principle}</p>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        principle.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {principle.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Source: {principle.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precedents */}
          {legalAnalysis?.precedents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Cited Precedents</h3>
              <div className="flex flex-wrap gap-2">
                {legalAnalysis.precedents.map((precedent, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{precedent.name}</p>
                    <p className="text-sm text-gray-600">{precedent.relevance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Impact */}
          {legalAnalysis?.legalImpact && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Legal Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Scope</p>
                  <p className="text-gray-600">{legalAnalysis.legalImpact.scope}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Significance</p>
                  <p className="text-gray-600">{legalAnalysis.legalImpact.significance}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Legal Areas</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {legalAnalysis.legalImpact.areas.map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Original Judgment Text */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Judgment Details</h3>
            <div className="space-y-4">
              {judgmentDetails.holding && (
                <div>
                  <h4 className="font-semibold">Holding</h4>
                  <p className="text-gray-600">{judgmentDetails.holding}</p>
                </div>
              )}
              {judgmentDetails.ratio && (
                <div>
                  <h4 className="font-semibold">Ratio Decidendi</h4>
                  <p className="text-gray-600">{judgmentDetails.ratio}</p>
                </div>
              )}
              {judgmentDetails.obiter && (
                <div>
                  <h4 className="font-semibold">Obiter Dicta</h4>
                  <p className="text-gray-600">{judgmentDetails.obiter}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseLawDisplay; 