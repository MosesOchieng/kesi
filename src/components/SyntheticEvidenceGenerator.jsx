import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function SyntheticEvidenceGenerator() {
  const { token, user } = useAuth();
  const [evidenceType, setEvidenceType] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEvidence, setGeneratedEvidence] = useState(null);
  const [caseType, setCaseType] = useState('');
  const [error, setError] = useState(null);

  const evidenceTypes = [
    {
      id: 'video',
      name: 'Video Evidence',
      icon: '🎥',
      description: 'Generate synthetic video evidence',
      options: ['Surveillance', 'Body Cam', 'Witness Testimony', 'Crime Scene']
    },
    {
      id: 'image',
      name: 'Image Evidence',
      icon: '📸',
      description: 'Generate synthetic image evidence',
      options: ['Crime Scene', 'Document', 'Forensic', 'Location']
    },
    {
      id: 'audio',
      name: 'Audio Evidence',
      icon: '🎙️',
      description: 'Generate synthetic audio evidence',
      options: ['Phone Call', 'Interview', 'Confession', 'Background Noise']
    }
  ];

  const caseTypes = [
    {
      id: 'criminal',
      name: 'Criminal Case',
      icon: '⚖️',
      description: 'Generate evidence for criminal cases',
      evidence: {
        video: ['Surveillance Footage', 'Body Cam Recording', 'Crime Scene Video'],
        image: ['Crime Scene Photos', 'Forensic Evidence', 'Weapon Photos'],
        audio: ['Witness Interview', '911 Call', 'Confession Recording']
      }
    },
    {
      id: 'civil',
      name: 'Civil Case',
      icon: '📄',
      description: 'Generate evidence for civil cases',
      evidence: {
        video: ['Contract Signing', 'Property Inspection', 'Meeting Recording'],
        image: ['Contract Documents', 'Property Photos', 'Financial Records'],
        audio: ['Business Meeting', 'Phone Call', 'Interview']
      }
    },
    {
      id: 'historical',
      name: 'Historical Case',
      icon: '📚',
      description: 'Generate evidence similar to historical cases',
      evidence: {
        video: ['Court Proceedings', 'Historical Footage', 'Documentary Clips'],
        image: ['Historical Documents', 'Court Records', 'Newspaper Clippings'],
        audio: ['Historical Speeches', 'Court Testimonies', 'Radio Broadcasts']
      }
    }
  ];

  const handleGenerate = async () => {
    if (!user) {
      setError('Please log in to generate evidence');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // First, create a case if it doesn't exist
      const caseData = {
        title: `${caseType} Case - ${new Date().toLocaleDateString()}`,
        description: `Case for ${evidenceType} evidence generation`,
        type: caseType,
        status: 'open',
        priority: 'medium'
      };

      const newCase = await api.cases.create(caseData, token);

      // Then create the evidence
      const evidenceData = {
        type: evidenceType,
        description,
        caseType,
        url: 'https://example.com/generated-evidence.mp4', // This would be your actual generated evidence URL
        metadata: {
          resolution: '1080p',
          duration: '00:01:30',
          format: 'mp4',
          caseType: caseTypes.find(ct => ct.id === caseType)?.name,
          evidenceType: evidenceTypes.find(et => et.id === evidenceType)?.name,
          authenticity: 'Synthetic',
          chainOfCustody: [
            { action: 'Generated', user: user.username, timestamp: new Date().toLocaleString() }
          ]
        },
        caseId: newCase.id
      };

      const evidence = await api.evidence.create(evidenceData, token);
      setGeneratedEvidence(evidence);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Synthetic Evidence Generator
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Case Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {caseTypes.map(type => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <button
                onClick={() => setCaseType(type.id)}
                className={`w-full text-left ${
                  caseType === type.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {type.name}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Evidence Type Selection */}
        {caseType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {evidenceTypes.map(type => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <button
                  onClick={() => setEvidenceType(type.id)}
                  className={`w-full text-left ${
                    evidenceType === type.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    {caseTypes.find(ct => ct.id === caseType)?.evidence[type.id].map(option => (
                      <div
                        key={option}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {evidenceType && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Evidence Details
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the evidence you want to generate..."
              className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {evidenceType && (
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!description || isGenerating || !user}
              className={`px-8 py-4 rounded-lg text-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                !description || isGenerating || !user
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Evidence...</span>
                </div>
              ) : !user ? (
                'Please Log In to Generate'
              ) : (
                'Generate Evidence'
              )}
            </button>
          </div>
        )}

        {generatedEvidence && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Generated Evidence
            </h2>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">
                  {evidenceType === 'video' ? '🎥' : evidenceType === 'image' ? '📸' : '🎙️'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Type</h3>
                <p className="text-gray-600">{generatedEvidence.metadata.evidenceType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Case Type</h3>
                <p className="text-gray-600">{generatedEvidence.metadata.caseType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Timestamp</h3>
                <p className="text-gray-600">
                  {new Date(generatedEvidence.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Authenticity</h3>
                <p className="text-gray-600">{generatedEvidence.metadata.authenticity}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Chain of Custody</h3>
              <ul className="text-sm text-gray-600">
                {generatedEvidence.metadata.chainOfCustody.map((log, idx) => (
                  <li key={idx}>{log.action} by {log.user} at {log.timestamp}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button className="px-4 py-2 text-purple-600 hover:text-purple-700">
                Download
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add to Case
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 