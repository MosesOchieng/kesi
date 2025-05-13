import React, { useState } from 'react';
import { judgesData, legalScenarios } from '../utils/judgesData.js';
import { findMatchingJudges, getRecommendedScenarios } from '../utils/judgeMatching';
import CaseLawDisplay from './CaseLawDisplay';

// Define roles array before the component
const roles = [
  {
    id: 'judge',
    name: 'Judge',
    icon: '⚖️',
    description: 'Preside over the case and make rulings'
  },
  {
    id: 'prosecutor',
    name: 'Prosecutor',
    icon: '👨‍⚖️',
    description: 'Present the case against the defendant'
  },
  {
    id: 'defense',
    name: 'Defense Attorney',
    icon: '👨‍💼',
    description: 'Defend the accused party'
  },
  {
    id: 'witness',
    name: 'Witness',
    icon: '👥',
    description: 'Provide testimony in the case'
  },
  {
    id: 'observer',
    name: 'Observer',
    icon: '👀',
    description: 'Observe and learn from the proceedings'
  }
];

// Define cases array
const cases = [
  {
    id: 'criminal',
    name: 'Criminal Case',
    icon: '🔍',
    description: 'Cases involving criminal offenses'
  },
  {
    id: 'civil',
    name: 'Civil Case',
    icon: '📄',
    description: 'Disputes between individuals or organizations'
  },
  {
    id: 'constitutional',
    name: 'Constitutional Case',
    icon: '📜',
    description: 'Cases involving constitutional interpretation'
  }
];

// Define scenarios array
const scenarios = [
  {
    id: 'trial',
    name: 'Full Trial',
    icon: '🎭',
    description: 'Complete trial simulation with all stages'
  },
  {
    id: 'hearing',
    name: 'Motion Hearing',
    icon: '📋',
    description: 'Focus on specific legal motions and arguments'
  },
  {
    id: 'appeal',
    name: 'Appeal',
    icon: '📚',
    description: 'Appellate court proceedings'
  }
];

const JudgeMatchingSystem = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [recommendedScenarios, setRecommendedScenarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [showCaseLaw, setShowCaseLaw] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate scenario
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Handle scenario generation logic here
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    const matches = findMatchingJudges(scenario);
    setMatchingResults(matches);
    setSelectedJudge(null);
    setRecommendedScenarios([]);
    setShowCaseLaw(false);
  };

  const handleJudgeSelect = (judge) => {
    setSelectedJudge(judge);
    const recommendations = getRecommendedScenarios(judge.id);
    setRecommendedScenarios(recommendations);
    setShowCaseLaw(true);
  };

  const filteredScenarios = legalScenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComplexity = complexityFilter === 'all' || scenario.complexity === complexityFilter;
    return matchesSearch && matchesComplexity;
  });

  const ScoreBreakdown = ({ scores }) => (
    <div className="mt-2 space-y-1">
      <div className="text-sm">
        <span className="font-medium">Expertise:</span> {(scores.expertise * 100).toFixed(1)}%
      </div>
      <div className="text-sm">
        <span className="font-medium">Past Rulings:</span> {(scores.rulings * 100).toFixed(1)}%
      </div>
      <div className="text-sm">
        <span className="font-medium">Stance Alignment:</span> {(scores.stances * 100).toFixed(1)}%
      </div>
      <div className="text-sm">
        <span className="font-medium">Experience:</span> {(scores.experience * 100).toFixed(1)}%
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">AI Roleplay System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Role</h2>
          <div className="space-y-4">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                </div>
                </button>
            ))}
          </div>
        </div>

          {/* Case Type Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Case Type</h2>
              <div className="space-y-4">
              {cases.map(caseType => (
                <button
                  key={caseType.id}
                  onClick={() => setSelectedCase(caseType.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                    selectedCase === caseType.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{caseType.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{caseType.name}</div>
                    <div className="text-sm text-gray-500">{caseType.description}</div>
                  </div>
                </button>
                ))}
              </div>
            </div>

          {/* Scenario Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Scenario</h2>
              <div className="space-y-4">
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                    selectedScenario === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{scenario.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{scenario.name}</div>
                    <div className="text-sm text-gray-500">{scenario.description}</div>
                  </div>
                </button>
                ))}
              </div>
            </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleStart}
            disabled={!selectedRole || !selectedCase || !selectedScenario || isGenerating}
            className={`px-8 py-4 rounded-lg text-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
              !selectedRole || !selectedCase || !selectedScenario || isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Scenario...</span>
          </div>
            ) : (
              'Start Roleplay'
        )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JudgeMatchingSystem; 