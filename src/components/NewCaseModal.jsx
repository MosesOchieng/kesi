import React, { useState } from 'react';
import Modal from './Modal';

export default function NewCaseModal({ onCreate, onClose }) {
  const [step, setStep] = useState(0);
  const [caseType, setCaseType] = useState('Manual');
  const [caseName, setCaseName] = useState('');
  const [area, setArea] = useState('Criminal');
  const [location, setLocation] = useState('');
  const [storyline, setStoryline] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [success, setSuccess] = useState(false);
  const [manualFiles, setManualFiles] = useState([]);
  const [selectedHistorical, setSelectedHistorical] = useState(null);

  const typeOptions = [
    { label: 'Manual', value: 'Manual' },
    { label: 'AI Generated', value: 'AI' },
    { label: 'Historical', value: 'Historical' },
  ];

  const areaOptions = [
    { label: 'Criminal', value: 'Criminal' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Family', value: 'Family' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Intellectual Property', value: 'IP' },
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const generateAICase = (area, difficulty) => {
    const randomNames = [
      'The Missing Brief',
      'State vs. Quantum',
      'AI v. Human',
      'The Stolen Algorithm',
      'People vs. Doe',
      'The Digital Contract',
      'The Virtual Estate',
      'The Cyber Crime',
      'The Smart Contract Dispute',
      'The AI Patent Case'
    ];
    const randomLocations = [
      'Nairobi',
      'London',
      'New York',
      'Berlin',
      'Tokyo',
      'Singapore',
      'Dubai',
      'Sydney',
      'Toronto',
      'Paris'
    ];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    const storyline = `In ${location}, a ${difficulty.toLowerCase()} ${area.toLowerCase()} case arises: "${name}". The AI will generate twists and legal challenges for you to solve.`;
    return { name, location, storyline };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (caseType === 'AI') {
      const aiCase = generateAICase(area, difficulty);
      onCreate(aiCase.name, caseType, area, aiCase.location, aiCase.storyline);
    } else if (caseType === 'Manual' && manualFiles.length > 0) {
      onCreate(
        manualFiles[0]?.name || 'Manual Case',
        caseType,
        area,
        'User Provided',
        'User uploaded case files and evidence.'
      );
    } else {
      onCreate(caseName, caseType, area, location, storyline);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Create New Case"
      type="info"
      wide={true}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {['Type', 'Details', 'Review'].map((stepName, index) => (
              <div
                key={stepName}
                className={`flex items-center ${
                  index < step ? 'text-blue-600' : index === step ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index < step
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : index === step
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2">{stepName}</span>
                {index < 2 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      index < step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {typeOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        caseType === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                      onClick={() => setCaseType(opt.value)}
                    >
                      <div className="text-2xl mb-2">
                        {opt.value === 'Manual' ? '📝' : opt.value === 'AI' ? '🤖' : '📚'}
                      </div>
                      <div className="font-medium">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {caseType === 'Manual' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Case Files & Evidence
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx,.txt,image/*,video/*"
                    onChange={e => setManualFiles(Array.from(e.target.files))}
                  />
                  {manualFiles.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">Selected Files:</div>
                      <ul className="text-sm text-gray-600">
                        {manualFiles.map(f => (
                          <li key={f.name} className="flex items-center gap-2">
                            <span>📄</span>
                            <span>{f.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Case Area
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                    >
                      {areaOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                    >
                      {difficultyOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-4">Review Case Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="ml-2 text-gray-900">{caseType}</span>
                  </div>
                  {caseType === 'Manual' ? (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Files:</span>
                        <ul className="mt-1 text-sm text-gray-900">
                          {manualFiles.map(f => (
                            <li key={f.name}>{f.name}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Area:</span>
                        <span className="ml-2 text-gray-900">{area}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                        <span className="ml-2 text-gray-900">{difficulty}</span>
                      </div>
                      {caseType === 'AI' && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Generated Storyline:</span>
                          <p className="mt-1 text-sm text-gray-900 italic">
                            {generateAICase(area, difficulty).storyline}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Case
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
} 